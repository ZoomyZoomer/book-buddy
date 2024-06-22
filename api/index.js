const express = require('express');
const User = require('./models/User');
const Quest = require('./models/Quests');
const Bookshelf = require('./models/Bookshelf');
const Inventory = require('./models/Inventory');
const cors = require('cors');
const app = express();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const OpenAI = require('openai');
require('dotenv').config();

app.use(express.json());
app.use(cors({credentials:true, origin:'http://localhost:3000'}));
app.use(cookieParser());


mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://kcw90:oJQDQrLG9h466RKf@cluster0.ajxucqi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(() => {
    console.log('mongodb connected');
})
.catch(() => {
    console.log('failed');
})

const salt = bcrypt.genSaltSync(10);
const secret = 'asdjaisd1203810';

app.get('/', (req, res) => {
    res.send("success");
});


app.post('/register', async(req, res) => {

    const {username, password, email} = req.body;
    colors_collection = ["#FFA9A9", "#A9D1FF", "#A8FFBB", "#F3A9FF", "#FFE7A9", "#A9FFE0"];

    try {

        // User info data
        const userDoc = await User.create({
            username,
            email,
            password:bcrypt.hashSync(password, salt),
        });

        // Quest data
        await Quest.create({
            username,
            daily1: [{ finished: false, id: "1" }],
            daily2: [{ finished: false, id: "2" }],
            daily3: [{ finished: false, id: "3" }]
        })

        await Bookshelf.create({
            username: username,
            tabs: [],
            genre_colors: [],
            color_collection: colors_collection,
            default_color: 'red'
        })

        await Inventory.create({
            username: username,
            items: []
        })

        res.json(userDoc);

    } catch(e) {
        console.log(e);
        res.status(400).json(e);
    }

})

app.post('/signin', async(req, res) => {

    const {username, password} = req.body;

    try {

        let userDoc = await User.findOne({username: username});

        if (!userDoc){

            userDoc = await User.findOne({email: username});

        }

        const validPassword = bcrypt.compareSync(password, userDoc.password);

        if (validPassword){

            jwt.sign({username, id:userDoc._id}, secret, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json({
                    id:userDoc._id,
                    username,
                });
            })

        } else {
            res.status(400).json('wrong credentials');
        }

    } catch(e) {
        console.log(e);
        res.status(400).json(e);
    }

})

app.get('/profile', (req, res) => {

    const { token } = req.cookies;

    if (!token) {

        // No token means not logged in
        return res.status(401).json({ message: 'Not logged in '});

    }

    jwt.verify(token, secret, {}, (err, info) => {

        if (err){
            // If there is an error, user isn't logged in
            return res.status(401).json({ message: 'Not logged in, invalid token'});
        }

        // Verification successful
        res.status(200).json({ message: 'Logged in', user: info});

    })

})

app.post('/logout', (req, res) => {

    // Clear the 'token' cookie by setting it to null and expiring it immediately
    res.cookie('token', null, { expires: new Date(0), httpOnly: true });
    res.json('Logged out successfully');
    
  })

app.post('/addBook', async (req, res) => {
    
    const {volumeId, title, author, cover, genre, pages, tabName, username} = req.body;

    try{

        const shelf = await Bookshelf.findOne({username: username});
        const tab = shelf.tabs.find(tab => tab.tab_name === tabName);

        const genreExists = shelf.genre_colors.some(gc => gc.genre === genre[0]);

        // Check if the genre exists already

        if (!genreExists){
            const firstColor = shelf.color_collection.shift();

            if (firstColor === undefined){
                shelf.genre_colors.push({genre: genre[0], color: shelf.default_color});
            } else{
                shelf.genre_colors.push({genre: genre[0], color: firstColor});
            }

            

            
        } 

        // If the tab doesn't exist, create a new tab
        if (!tab){


            shelf.tabs.push({tab_name: tabName, books: [{volume_id: volumeId, title: title, author: author, cover: cover, genre: genre[0], rating: 0, pages_read: 0, total_pages: pages, banner_items: null, reward_tiers_claimed: [false, false, false, false]}]});
            await shelf.save();

            res.status(201).json({message: "Tab created and book successfully added"});

        } else { // If the tab already exists, append to the book array

            tab.books.push({volume_id: volumeId, title: title, author: author, cover: cover, genre: genre[0], rating: 0, pages_read: 0, total_pages: pages, banner_items: null, reward_tiers_claimed: [false, false, false, false]});
            await shelf.save();

            res.status(201).json({message: "Book successfully added"});

        }

    } catch (e) {
        res.status(500).json({error: e});
    } 

})

app.get('/getCollection', async (req, res) => {

    const { tabName, username } = req.query;


    try {

        const shelf = await Bookshelf.findOne({username: username});
        const tab = shelf.tabs.find(tab => tab.tab_name === tabName);

        // Handle if tab doesn't exist
        if (!tab){
            res.status(200).json([]);
        } else {
            res.status(200).json(tab.books);
        }

    } catch (e){
        res.status(500).json({error: e});
    }

})

app.post('/deleteBook', async (req, res) => {

    const {volume_id, tab_name, username} = req.body;

    try {
        await Bookshelf.updateOne(
          { username: username, 'tabs.tab_name': tab_name },
          { $pull: { 'tabs.$.books': { volume_id: volume_id } } }
        );
        
        res.status(204).json({message: "Book successfully deleted"});
      } catch (err) {
        res.status(500).json({message: "Could not delete book"});
      }

    

})

app.post('/updateRating', async (req, res) => {

    const {tab_name, rating, volume_id, username} = req.body;
    
    try {

        const shelf = await Bookshelf.findOne({ username: username });
        const tab = shelf.tabs.find(tab => tab.tab_name === tab_name);

        if (!tab) {
            res.status(500).json({message: "Requested tab not found"});
        }

        // Find the book within the books array
        const book = tab.books.find(book => book.volume_id === volume_id);

        if (!book) {
            res.status(500).json({message: "Requested book not found"});
        }

        // Update the rating of the found book
        book.rating = rating;

        // Save the updated bookshelf document
        await shelf.save();

        res.status(201).json({message: "Rating successfully updated"});

    } catch (e) {
        res.status(500).json({error: e});
    }
})

app.get('/getRating', async (req, res) => {

    const {tab_name, volume_id, username} = req.query;

    try {

        const shelf = await Bookshelf.findOne({ username: username });
        const tab = shelf.tabs.find(tab => tab.tab_name === tab_name);

        if (!tab) {
            res.status(500).json({message: "Requested tab not found"});
        }

        // Find the book within the books array
        const book = tab.books.find(book => book.volume_id === volume_id);

        if (!book) {
            res.status(500).json({message: "Requested book not found"});
        }

        const rating_res = book.rating;

        res.status(200).json(rating_res);

    } catch(e) {
        res.status(500).json({error: e});
    }

})

app.get('/getPages', async (req, res) => {

    const {volume_id, tab_name, username} = req.query;

    try {

        const shelf = await Bookshelf.findOne({ username: username });
        const tab = shelf.tabs.find(tab => tab.tab_name === tab_name);

        if (!tab) {
            res.status(500).json({message: "Requested tab not found"});
        }

        const book = tab.books.find(book => book.volume_id === volume_id);

        if (!book) {
            res.status(500).json({message: "Requested book not found"});
        }

        res.status(200).json([book.pages_read, book.total_pages]);

    } catch(e) {
        res.status(500).json({error: e});
    }

})

app.post('/setPages', async (req, res) => {

    const {volume_id, tab_name, pages_read, username} = req.body;

    try {
        const shelf = await Bookshelf.findOne({ username: username });
        if (!shelf) {
            return res.status(404).json({ message: "Shelf not found" });
        }
    
        const tab = shelf.tabs.find(tab => tab.tab_name === tab_name);
    
        if (!tab) {
            return res.status(500).json({ message: "Requested tab not found" });
        }
    
        const book = tab.books.find(book => book.volume_id === volume_id);
    
        if (!book) {
            return res.status(500).json({ message: "Requested book not found" });
        }
    
        book.pages_read = pages_read;
    
        await shelf.save();
    
        res.status(201).json({ message: "Page count successfully updated" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }

})

app.get('/getBooksBySearch', async(req, res) => {

    const {search_query, tab_name, username} = req.query;

    try {
        const shelf = await Bookshelf.findOne({ username: username });
        const tab = shelf.tabs.find(tab => tab.tab_name === tab_name);

        if (!tab){
            // Create a new tab if it doesn't exist
            shelf.tabs.push({tab_name: tab_name, books: []});
            await shelf.save();
        }
        const matchingBooks = tab.books.filter(book => book.title.toLowerCase().includes(search_query.toLowerCase()));
        res.status(200).json(matchingBooks);

      } catch (e) {
        res.status(500).json({error: e});
      }

})

app.get('/getGenreColor', async(req, res) => {

    const {username, genre} = req.query;

    try {

        const shelf = await Bookshelf.findOne({ username: username });

        const genreObject = shelf.genre_colors.find(gc => gc.genre === genre);

        return res.status(200).json({ color: genreObject.color });
    
    } catch(e) {
        res.status(500).json({error: e});
    }

})

app.get('/getBanners', async(req, res) => {

    const {username, tab_name, volume_id} = req.query;

    try {

        const shelf = await Bookshelf.findOne({ username: username });
        const tab = shelf.tabs.find(tab => tab.tab_name === tab_name);
        const book = tab.books.find(book => book.volume_id === volume_id);

        res.status(200).json(book.banner_items);

    } catch(e) {
        res.status(500).json({error: e});
    }

})

app.post('/openai-request', async(req, res) => {

    const { question, title } = req.body;

  
    try {

        const openai = new OpenAI();

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: `You are an expert on the book ${title} and talk in a semi-casual way` },
                { role: "user", content: question }
            ],
            model: "gpt-3.5-turbo",
          });

       res.status(200).json(completion.choices[0].message.content);
    
    } catch (error) {
      res.status(500).json({ error: error.response ? error.response.data : error.message });
    }
  });

app.get('/fetch-tiers', async(req,res) => {

    const {username, tab_name, volume_id} = req.query;

    try {

        const shelf = await Bookshelf.findOne({ username: username });
        const tab = shelf.tabs.find(tab => tab.tab_name === tab_name);
        const book = tab.books.find(book => book.volume_id === volume_id);

        res.status(200).json(book.reward_tiers_claimed);

    } catch(e) {
        res.status(500).json({error: e});
    }

})

app.post('/process-claim', async(req,res) => {

    const {username, tab_name, volume_id, tier} = req.body;

    try {

        const shelf = await Bookshelf.findOne({ username: username });
        const tab = shelf.tabs.find(tab => tab.tab_name === tab_name);
        const book = tab.books.find(book => book.volume_id === volume_id);

        book.reward_tiers_claimed[tier - 1] = true;

        await shelf.save();

        res.status(201).json({message: "Tier successfully updated"});

    } catch(e) {
        res.status(500).json({error: e});
    }

})

app.post("/send-entry", async(req,res) => {

    const {username, tab_name, volume_id, pages_added, total_pages_read} = req.body;

    try{

        const shelf = await Bookshelf.findOne({ username: username });
        const tab = shelf.tabs.find(tab => tab.tab_name === tab_name);
        const book = tab.books.find(book => book.volume_id === volume_id);

        const now = new Date();
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const month = monthNames[now.getMonth()]; // getMonth() returns 0-11, so this is correct
        const day = String(now.getDate()).padStart(2, '0');
        const year = now.getFullYear();

        book.page_entries.push({pages_added: pages_added, new_page_total: total_pages_read, date: {month: month, day: day, year: year}});

        shelf.save();

        res.status(201).json({message: "Entry successfully recorded"});

    } catch(e) {
        res.status(500).json({error: e});
    }

})

app.get('/get-entry', async(req,res) => {

    const {username, tab_name, volume_id, index} = req.query;

    try{

        const shelf = await Bookshelf.findOne({ username: username });
        const tab = shelf.tabs.find(tab => tab.tab_name === tab_name);
        const book = tab.books.find(book => book.volume_id === volume_id);

        const entriesLength = book.page_entries.length;
        const newIndex = entriesLength - 1 - index;

        const pagesFrom0 = book.page_entries[newIndex].new_page_total - book.page_entries[newIndex].pages_added;
        const pagesTo0 = book.page_entries[newIndex].new_page_total
        const date0 = book.page_entries[newIndex].date.month + " " + book.page_entries[newIndex].date.day + ", " + book.page_entries[newIndex].date.year;
        const percent0 = Math.floor(((pagesTo0 - pagesFrom0) / book.total_pages) * 100);

        const pagesFrom1 = book.page_entries[newIndex - 1].new_page_total - book.page_entries[newIndex - 1].pages_added;
        const pagesTo1 = book.page_entries[newIndex - 1].new_page_total;
        const date1 = book.page_entries[newIndex - 1].date.month + " " + book.page_entries[newIndex - 1].date.day + ", " + book.page_entries[newIndex - 1].date.year;
        const percent1 = Math.floor(((pagesTo1 - pagesFrom1) / book.total_pages) * 100);

        res.status(200).json([{pages: `Pages ${pagesFrom0} - ${pagesTo0}`, date: date0, percent: percent0}, {pages: `Pages ${pagesFrom1} - ${pagesTo1}`, date: date1, percent: percent1}])


    } catch(e){
        res.status(500).json({error: e});
    }

})

  

app.listen(4000, () => {
    console.log("port connected");
})
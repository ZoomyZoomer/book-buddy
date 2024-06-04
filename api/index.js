const express = require('express');
const User = require('./models/User');
const Quest = require('./models/Quests');
const Bookshelf = require('./models/Bookshelf');
const cors = require('cors');
const app = express();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const QuestsModel = require('./models/Quests');
const cookieParser = require('cookie-parser');


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

    try {

        // User info data
        const userDoc = await User.create({
            username,
            email,
            password:bcrypt.hashSync(password, salt),
        });

        // Quest data
        const questDoc = await Quest.create({
            username,
            daily1: [{ finished: false, id: "1" }],
            daily2: [{ finished: false, id: "2" }],
            daily3: [{ finished: false, id: "3" }]
        })

        const bookshelfDoc = await Bookshelf.create({
            username: username,
            books: []
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
    
    const {volumeId, pages, tabName, username} = req.body;

    try{

        const shelf = await Bookshelf.findOne({username: username});
        const tab = shelf.tabs.find(tab => tab.tab_name === tabName);

        // If the tab doesn't exist, create a new tab
        if (!tab){

            shelf.tabs.push({tab_name: tabName, books: [{volume_id: volumeId, rating: 0, pages_read: 0, total_pages: pages}]});
            await shelf.save();

            res.status(201).json({message: "Tab created and book successfully added"});

        } else { // If the tab already exists, append to the book array

            tab.books.push({volume_id: volumeId, rating: 0, pages_read: 0, total_pages: pages});
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

        const shelf = await Bookshelf.findOne({ username: username });
        const tab = shelf.tabs.find(tab => tab.tab_name === tab_name);

        if (!tab){
            res.status(500).json({message: "Tab not found"});
        }

        const result = await BookshelfModel.findOneAndUpdate(
            {
              username: username,
              'tabs.tab_name': tab_name
            },
            {
              $pull: {
                'tabs.$.books': { volume_id: volume_id }
              }
            },
            {
              new: true // Return the updated document
            }
          );

        if (result){
            res.status(201).json({message: "Book successfully deleted"});
        } else {
            res.status(500).json({message: "Error deleting book"});
        }

    } catch (e) {
        res.status(500).json({error: e});
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
        const tab = shelf.tabs.find(tab => tab.tab_name === tab_name);

        if (!tab) {
            res.status(500).json({message: "Requested tab not found"});
        }

        const book = tab.books.find(book => book.volume_id === volume_id);

        if (!book) {
            res.status(500).json({message: "Requested book not found"});
        }

        book.pages_read = pages_read;

        await shelf.save();

        res.status(201).json({message: "Page count successfully updated"});

    } catch(e) {
        res.status(500).json({error: e});
    }

})

  

app.listen(4000, () => {
    console.log("port connected");
})
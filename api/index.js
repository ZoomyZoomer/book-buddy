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

app.post('/addISBN', async (req, res) => {

    const { tabName, isbn } = req.body;

  try {
    // Use 'identifier' field in the query
    let book = await Bookshelf.findOne({ identifier: tabName });

    if (book) {
      // Add the ISBN number to the data array if it doesn't already exist
      if (!book.data.includes(isbn)) {
        book.data.push(isbn);
        await book.save();
        res.status(200).json({ message: 'ISBN added successfully', book });
      } else {
        res.status(400).json({ message: 'ISBN already exists' });
      }
    } else {
      // If the book with the given identifier doesn't exist, create a new document
      const newBook = new Bookshelf({ identifier: tabName, data: [isbn] });
      await newBook.save();
      res.status(201).json({ message: 'Book created and ISBN added successfully', book: newBook });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }

 
  
})




app.get('/getBooks', async (req,res) => {

    try {
        const bookshelves = await Bookshelf.find({ identifier: "Favorites" });
        
        const books = bookshelves.reduce((acc, bookshelf) => {
          return acc.concat(bookshelf.data.map(isbn => ({ isbn })));
        }, []);

    
        res.json(books);

      } catch (error) {
        res.status(500).json({ error: error.message });
      }



});

app.listen(4000, () => {
    console.log("port connected");
})
const express = require('express');
const User = require('./models/User');
const cors = require('cors');
const app = express();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(cors({credentials:true, origin:'http://localhost:3000'}));

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

        const userDoc = await User.create({
            username,
            email,
            password:bcrypt.hashSync(password, salt),
        });

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

app.listen(4000, () => {
    console.log("port connected");
})
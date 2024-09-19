const express = require('express');
const mongoose = require("mongoose")
const cors = require('cors')
const cookieParser = require('cookie-parser')

const auth_route = require('./routes/auth_route')
const messageRoute = require('./routes/message_route')

require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cookieParser())

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['X-Requested-With', 'Content-Type'],
    credentials: true
}));
app.use(auth_route)
app.use(messageRoute)

mongoose.connect('mongodb://localhost:27017/indiana-fever')

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(process.env.PORT || 5000);
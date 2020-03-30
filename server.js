//server.js
var express = require('express');
var bodyParser = require('body-parser');
var data = require('./routes/api-routes'); // Imports routes for the products
var app = express();
var cookieParser = require('cookie-parser');
var env = require('dotenv').config();
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);

//Using mongodb to store express-session
const store = new MongoDBStore({
    uri: process.env.DB_URI,
    collection: 'sessions'
});

//Parsing cookies 
app.use(cookieParser());

//Set up session
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    unset: 'destroy',
    store: store,
    name: 'session cookie name',
}));

// Set up mongoose connection for entering data		
var mongoose = require('mongoose');
var mongoDB = process.env.DB_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

//connect to database
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//parse body from requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//routing
app.use('/', data);

// Send message for default URL uses view folder
app.use(express.static('view'));

var port = process.env.API_PORT;

app.listen(port, () => {
    console.log('Server is running on port ' + port);
});



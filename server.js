//server.js

var express = require('express');
var bodyParser = require('body-parser');
var data = require('./routes/api-routes'); // Imports routes for the products
var app = express();
var env = require('dotenv').config();

// Set up mongoose connection		
var mongoose = require('mongoose');
var mongoDB = process.env.DB_URI;

mongoose.connect(mongoDB);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/data', data);

// Send message for default URL
app.use(express.static('view'));

var port = process.env.API_PORT;

app.listen(port, () => {
    console.log('Server is running on port ' + port);
});



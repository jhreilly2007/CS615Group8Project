//This is the Model in the MVC

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// Setup mongoDB Schema
var DataSchema = new Schema({
    name: {type: String, required: true, max: 100},	
    email: {type: String, required: true},
    gender: {type: String, required: true},
    phone: {type: String, required: true}
});

module.exports = mongoose.model('Data', DataSchema);



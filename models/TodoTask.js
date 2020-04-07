//This is the Model in the MVC
//ToDO Schema
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// Setup mongoDB Schema
var todoTaskSchema = new Schema({
	content: { type: String, required: true },
	date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TodoTask',todoTaskSchema);
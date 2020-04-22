//This is the Model in the MVC
//Task Schema
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// Setup mongoDB Schema
var taskSchema = new Schema({
    email: {type: String, required: true, max: 100},	
    name: {type: String, required: true, max: 100},	
    description: {type: String, required: true},
    resource: {type: String, required: false},
    priority: {type: String, required: false},
    privacy: {type: String, required: true}
});

module.exports = mongoose.model('Task', taskSchema);
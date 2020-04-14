//This is the Model in the MVC
//Task Schema
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// Setup mongoDB Schema
var taskSchema = new Schema({
    name: {type: String, required: true, max: 100},	
    description: {type: String, required: true},
    resource: {type: String, required: false},
    priority: {type: String, required: false}
});

module.exports = mongoose.model('Task', taskSchema);
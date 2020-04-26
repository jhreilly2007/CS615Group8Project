//This is the Model in the MVC
//Data Model for Tasks
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// Setup mongoDB Schema
var GroupSchema = new Schema({
    name: { type: String, required: true, max: 100 },
    members:  [{type: String}],
    admin: { type: String }
});

module.exports = mongoose.model('Group', GroupSchema, 'groups');



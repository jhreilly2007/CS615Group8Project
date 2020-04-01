//General routes
const path = require("path");
//Using express-sessions to determin if user is logged in 
var session = require('express-session'); 

exports.index = function(req, res) {
    res.sendFile(path.resolve('view/index.html')) 
};

exports.about = function(req, res) {
    res.sendFile(path.resolve('view/html/about.html'))   
};
/**
exports.todo = function(req, res) {
    res.sendFile(path.resolve('view/html/todo.ejs'))   
};*/

exports.welcome = function(req, res) {
	if(req.session.user) {
    res.sendFile(path.resolve('view/html/welcome.html')) 
    } else {
    	console.log('You must be logged in to view this page');//for testing
    	res.redirect('/')//need more meaningful user responses
    }
};

//only allow access to a logged in user
exports.tasks = function(req, res) {
	if(req.session.user) {
    res.sendFile(path.resolve('view/html/tasks.html')) 
    } else {
    	console.log('You must be logged in to view tasks');//for testing
    	res.redirect('/')//need more meaningful user responses
    }
};


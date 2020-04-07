//General routes
const path = require("path");
//Using express-sessions to determin if user is logged in 
var session = require('express-session'); 

exports.index = function(req, res) {
    res.render(path.resolve('view/index.ejs'));
};

exports.about = function(req, res) {
    res.render(path.resolve('view/ejs/about.ejs'))   
};

exports.welcome = function(req, res) {
	if(req.session.user) {
    res.render(path.resolve('view/ejs/welcome.ejs')) 
    } else {
    	console.log('You must be logged in to view this page');//for testing
    	res.redirect('/')//need more meaningful user responses
    }
};

//only allow access to a logged in user
exports.tasks = function(req, res) {
	if(req.session.user) {
    res.render(path.resolve('view/ejs/tasks.ejs')) 
    } else {
    	console.log('You must be logged in to view tasks');//for testing
    	res.redirect('/')//need more meaningful user responses
    }
};


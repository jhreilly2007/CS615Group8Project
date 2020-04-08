//General routes
const path = require("path");
//Using express-sessions to determin if user is logged in 
var session = require('express-session'); 

exports.index = function(request, response) {
    response.render(path.resolve('view/index.ejs'));
};

exports.about = function(request, response) {
    response.render(path.resolve('view/ejs/about.ejs'))   
};

exports.welcome = function(request, response) {
	if(request.session.user) {
    response.render(path.resolve('view/ejs/welcome.ejs')) 
    } else {
        var accessDenied =request.session.accessDenied = {
                accessDenied: 'You must be logged in to view this page!'
            };
            request.session.save();
            return response.render('index.ejs', accessDenied);
        }
};

//only allow access to a logged in user
exports.groups = function(request, response) {
	if(request.session.user) {
    response.render(path.resolve('view/ejs/groups.ejs')) 
    } else {
        var accessDeniedGroup =request.session.accessDeniedGroup = {
                accessDenied: 'You must be logged in to view Groups!'
            };
            request.session.save();
            return response.render('index.ejs', accessDeniedGroup);
        }
};


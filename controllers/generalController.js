//General routes
const path = require("path");

exports.index = function(req, res) {
    res.sendFile(path.resolve('view/index.html')) 
};

exports.about = function(req, res) {
    res.sendFile(path.resolve('view/html/about.html'))   
};

exports.tasks = function(req, res) {
    res.sendFile(path.resolve('view/html/tasks.html'))   
};


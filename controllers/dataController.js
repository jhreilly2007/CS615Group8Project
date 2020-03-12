//This is the Controller in the MVC

var Data = require('../models/dataModel');
var User = require('../models/userModel');

exports.test = function (request, response) {
    response.send('Controller is working! <a href=\"http://localhost:3000\">Back to Home<\/a>');
};

//Create Database Entry
exports.data_create = function (request, response) {
    var data = new Data(
        {
            name: request.body.name,
            gender: request.body.gender,
            phone: request.body.phone,
            email: request.body.email
        }
    );
    data.save(function (err) {
        if (err) {
            response.status(400).send(err + '<a href=\"http://localhost:3000\">Back to Home<\/a>');
        }
        response.send('Data Entered Successfully <a href=\"http://localhost:3000\">Back to Home<\/a>')
    })
};


//Find by id
exports.data_details = function (request, response) {
 
    Data.findById(request.params.id, function (err, data) {
        if (err) response.status(400).send(err + ' <a href=\"http://localhost:3000\">Back to Home<\/a>');
        response.send(data + ' <a href=\"http://localhost:3000\">Back to Home<\/a>');
    })
};


//Update database function
exports.data_update = function (request, response) {

    Data.findByIdAndUpdate(request.params.id, {$set: request.body}, function (err, data) {
        if (err) response.status(400).send(err + ' <a href=\"http://localhost:3000\">Back to Home<\/a>');
        response.send('Data Successfully Updated <a href=\"http://localhost:3000\">Back to Home<\/a>');
    });
};


//Delete Entry
exports.data_delete = function (request, response) {

    Data.findByIdAndRemove(request.params.id, function (err) {
        if (err) response.status(400).send(err +' <a href=\"http://localhost:3000\">Back to Home<\/a>');
        response.send('Deleted successfully! <a href=\"http://localhost:3000\">Back to Home<\/a>');
    })
};




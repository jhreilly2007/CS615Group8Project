//This is the Controller in the MVC

var Group = require('../models/groupModel');
const path = require("path");

//This section relates to Groups only!
//test if controller is working
exports.test = function (request, response) {
    response.send('Controller is working! <a href=\"http://localhost:3000\">Back to Home<\/a>');
};

//Create Database Entry
exports.group_create = function (request, response) {
    var group = new Group(
        {
            name: request.body.name,
            gender: request.body.gender,
            phone: request.body.phone,
            email: request.body.email
        }
    );
    group.save(function (err) {
        if (err) {
            var dataEntryError =request.session.dataEntryError = {
            dataEntryError: 'An Error Occurred! Data was not entered'
            };
            request.session.save();
            return response.render('ejs/groups.ejs', dataEntryError);

       }else{
            var dataEntrySuccess =request.session.dataEntrySuccess = {
            dataEntrySuccess: 'Data Successfully Added'
            };
            request.session.save();
            console.log(request.session.dataEntrySuccess);
            return response.render('ejs/groups.ejs', dataEntrySuccess);
        }
    })
};

//This functionality is not being used in the application...yet!
//Find by id //responses are temporary for testing
exports.group_details = function (request, response) {
    Group.findById(request.params.id, function (err, data) {
        //temporary response
        if (err) response.status(400).send(err + ' <a href=\"http://localhost:3000\">Back to Home<\/a>');
        response.send(data + ' <a href=\"http://localhost:3000\">Back to Home<\/a>');
    })
};

//This functionality is not being used in the application...yet!
//Update database function //responses are temporary for testing
exports.group_update = function (request, response) {
    Group.findByIdAndUpdate(request.params.id, 
        {$set: request.body}, 
        function (err, data) {
        //temporary response
        if (err) response.status(400).send(err + ' <a href=\"http://localhost:3000\">Back to Home<\/a>');
        response.send('Group Successfully Updated <a href=\"http://localhost:3000\">Back to Home<\/a>');
    });
};

//This functionality is not being used in the application...yet!
//Delete Entry //responses are temporary for testing
exports.group_delete = function (request, response) {

    Group.findByIdAndRemove(request.params.id, function (err) {
        //temporary response
        if (err) response.status(400).send(err +' <a href=\"http://localhost:3000\">Back to Home<\/a>');
        response.send('Deleted successfully! <a href=\"http://localhost:3000\">Back to Home<\/a>');
    })
};
//This is the Controller in the MVC

var Group = require('../models/groupModel');
var user_controller = require('../controllers/userController');
const path = require("path");

//This section relates to Groups only!
//test if controller is working
exports.test = function (request, response) {
    response.send('Controller is working! <a href=\"http://localhost:3000\">Back to Home<\/a>');
};

//Create Database Entry
exports.group_create = function (request, response) {
    console.log(request.body);
    var group = new Group({
        name: request.body.name,
        members: request.body["members[]"],
        admin: request.body.admin
    });
    group.save(function (err) {
        if (err) {
            var dataEntryError = request.session.dataEntryError = {
                dataEntryError: 'An Error Occurred! Data was not entered'
            };
            request.session.save();
            //response.render('ejs/groups.ejs', { userDetails: undefined }, dataEntryError);
            response.status(500).send();
        } else {
            console.log("added");
            var dataEntrySuccess = request.session.dataEntrySuccess = {
                dataEntrySuccess: 'Data Successfully Added'
            };
            request.session.save();
            //response.render('ejs/groups.ejs', { userDetails: undefined }, dataEntrySuccess);
            response.status(201).send();
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

//Function returning all group which are created by user.
exports.group_admin_details_func = function (currentuser) {
    var result = Group.find({ admin: currentuser.email });
    return result;
};

//Code returning all group name which user is a member.
exports.group_member_details_func = function (currentuser) {
    var result = Group.find({ members: currentuser.email });
    return result;
};

// Code for displaying group name in tasks dropdown menu
exports.group_name_func = function (request, response) {
    var result = Group.find({ groupname: request.body.name });
    return result;
};


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

//Function executed to delete the group
exports.group_delete = function (request, response) {
    var id = request.params.id;
    console.log(request.params.id);
    console.log(request);
    Group.findByIdAndRemove(id, err => {
        if (err) {
            return response.send(500, err);
        }
        response.redirect("/groups");
    });
};


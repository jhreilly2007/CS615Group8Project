//General routes
const path = require("path");
var User = require('../models/userModel');
var Group = require('../models/groupModel');

//Using express-sessions to determin if user is logged in 
var session = require('express-session');
var user_controller = require('../controllers/userController');

//Determine which group user belongs to
var group_controller = require('../controllers/groupController');

//sends the correct file when endpoint is used
exports.index = function (request, response) {
    response.render(path.resolve('view/index.ejs'));
};

exports.about = function (request, response) {
    response.render(path.resolve('view/ejs/about.ejs'))
};

exports.welcome = function (request, response) {
    if (request.session.user) {
        response.render(path.resolve('view/ejs/welcome.ejs'))
    } else {
        var accessDenied = request.session.accessDenied = {
            accessDenied: 'You must be logged in to view this page!'
        };
        request.session.save();
        return response.render('index.ejs', accessDenied);
    }
};

//only allow access of all other Users to a logged in user for group creation purpose.
exports.groups = async function (request, response) {
    if (request.session.user) {
        var groupAdminData = await group_controller.group_admin_details_func(request.session.user).exec();
        var groupMemberData = await group_controller.group_member_details_func(request.session.user).exec();
        var userData = await user_controller.user_all_details_func().exec();
        response.render('ejs/groups.ejs', { adminDetails: groupAdminData, userDetails: userData, memberDetails: groupMemberData });

    } else {
        //check user is logged in
        var accessDeniedGroup = request.session.accessDeniedGroup = {
            accessDenied: 'You must be logged in to view Groups!'
        };
        request.session.save();
        return response.render('index.ejs', accessDeniedGroup);
    }
};

// functionality handling group-tasks
exports.group_task = async function(request,response){
    var group_name = await group_controller.group_name_func(request).exec();
    // console.log(group_name);
    response.render('ejs/tasks.ejs', { groupName: group_name });
}


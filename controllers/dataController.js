//This is the Controller in the MVC

var Data = require('../models/dataModel');
var User = require('../models/userModel');
var TodoTask = require('../models/TodoTask');
const path = require("path");

//This section relates to tasks only!
//test if controller is working
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
            var dataEntryError =request.session.dataEntryError = {
            dataEntryError: 'An Error Occurred! Data was not entered'
            };
            request.session.save();
            return response.render('ejs/tasks.ejs', dataEntryError);

       }else{
            var dataEntrySuccess =request.session.dataEntrySuccess = {
            dataEntrySuccess: 'Data Successfully Added'
            };
            request.session.save();
            console.log(request.session.dataEntrySuccess);
            return response.render('ejs/tasks.ejs', dataEntrySuccess);
        }
    })
};

//This functionality is not being used in the application...yet!
//Find by id //responses are temporary for testing
exports.data_details = function (request, response) {
    Data.findById(request.params.id, function (err, data) {
        //temporary response
        if (err) response.status(400).send(err + ' <a href=\"http://localhost:3000\">Back to Home<\/a>');
        response.send(data + ' <a href=\"http://localhost:3000\">Back to Home<\/a>');
    })
};

//This functionality is not being used in the application...yet!
//Update database function //responses are temporary for testing
exports.data_update = function (request, response) {
    Data.findByIdAndUpdate(request.params.id, 
        {$set: request.body}, 
        function (err, data) {
        //temporary response
        if (err) response.status(400).send(err + ' <a href=\"http://localhost:3000\">Back to Home<\/a>');
        response.send('Data Successfully Updated <a href=\"http://localhost:3000\">Back to Home<\/a>');
    });
};

//This functionality is not being used in the application...yet!
//Delete Entry //responses are temporary for testing
exports.data_delete = function (request, response) {

    Data.findByIdAndRemove(request.params.id, function (err) {
        //temporary response
        if (err) response.status(400).send(err +' <a href=\"http://localhost:3000\">Back to Home<\/a>');
        response.send('Deleted successfully! <a href=\"http://localhost:3000\">Back to Home<\/a>');
    })
};

/****TO DO LIST SECTION****/
//Create Task Database Entry
exports.data_addtask = async function (request, response){
    var todoTask = new TodoTask({
        content: request.body.content
    });
    try {
        await todoTask.save();
        return response.redirect("/todo");
    } catch (err) {
        //It just won't appear in list
        return response.redirect("/todo");
    }
};

// GET To-DO List
exports.data_findtask = function (request, response){
    if(request.session.user) {
    TodoTask.find({}, function(err, tasks) {
        response.render("ejs/todo.ejs", { todoTasks: tasks });
    });    
    } else {
        var accessDeniedTodo =request.session.accessDeniedTodo = {
                accessDeniedTodo: 'You must be logged in to view TO-Do List!'
            };
            request.session.save();
            return response.render('index.ejs', accessDeniedTodo);
    }
};

//Delete Item from To-Do List
exports.task_delete= function (request, response){
    var id = request.params.id;
    TodoTask.findByIdAndRemove(id, err => {
        if (err){
            return response.send(500, err);
        }
        response.redirect("/todo");
    });
};

//UPDATE FUNCTIONS
exports.get_edit = function(request, response){
    var id = request.params.id;
    TodoTask.find({}, function(err, tasks){
        if (err) {
            return response.send(500, err);
        }
        response.render('ejs/edit.ejs', { todoTasks: tasks, idTask: id });
    });
}

//Update To-Do List Post Function
exports.post_edit = function(request, response){
    var id = request.params.id;
    TodoTask.findByIdAndUpdate(id, { content: request.body.content }, err => {
        if (err) return response.send(500, err);
        response.redirect('/todo');
    });
}



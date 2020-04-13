//This is the Controller in the MVC

var Task = require('../models/taskModel');
const path = require("path");

//This section relates to TASKS only!
/****TASK LIST SECTION****/
//Create Task Database Entry
exports.data_addtask = async function (request, response){
    var task = new Task({
        name: request.body.name,
        description: request.body.description,
        resource: request.body.resource,
        priority: request.body.priority
    });
    try {
        await task.save();
        return response.redirect("/tasks");
    } catch (err) {
        //It just won't appear in list
        return response.redirect("/tasks");
    }
};

// GET Task List
exports.data_findtask = function (request, response){
    if(request.session.user) {
        Task.find({}, function(err, tasks) {
            console.log(tasks);
            response.render("ejs/tasks.ejs", { myTasks: tasks });
        });    
    } else {
        var accessDeniedTask =request.session.accessDeniedTask = {
                accessDeniedTask: 'You must be logged in to view Tasks List!'
            };
            request.session.save();
            return response.render('index.ejs', accessDeniedTask);
    }
};

//Delete Item from Task List
exports.task_delete= function (request, response){
    var id = request.params.id;
    Task.findByIdAndRemove(id, err => {
        if (err){
            return response.send(500, err);
        }
        response.redirect("/tasks");
    });
};

//UPDATE TASKS
exports.get_edit = function(request, response){
    var id = request.params.id;
    Task.find({}, function(err, tasks){
        if (err) {
            return response.send(500, err);
        }
        response.render('ejs/edit.ejs', { myTasks: tasks, idTask: id });
    });
}

//Update TASK List Post Function
exports.post_edit = function(request, response){
    var id = request.params.id;
    Task.findByIdAndUpdate(id, { content: request.body.content }, err => {
        if (err) return response.send(500, err);
        response.redirect('/tasks');
    });
}



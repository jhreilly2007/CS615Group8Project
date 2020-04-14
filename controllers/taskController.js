//This is the Controller in the MVC

var Task = require('../models/taskModel');
const path = require("path");
const multer = require('multer');
var fs = require('fs-extra');   
var mongoose = require('mongoose');
var db = mongoose.connection;
const { MongoClient, ObjectId } = require('mongodb');

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
    if(request.body.priority==null){
        request.body.priority =request.body.default;
    }
    Task.findByIdAndUpdate(id, 
        { name: request.body.name, 
          description: request.body.description,
          resource: request.body.resource,
          priority: request.body.priority
        }, err => {
        if (err) return response.send(500, err);
        response.redirect('/tasks');
    });
}

exports.uploadfile = function(request, response){
    var myfile = request.file;
    console.log(myfile);

    if (!myfile) {
        const error = new Error('You have not chosen a file to upload')
        error.httpStatusCode = 400
        //temporary response
        return response.send(error + '<br><a href="/tasks">back to Tasks</a>');
    } 

    var file = fs.readFileSync(request.file.path);
    var encode_file = file.toString('base64');

    var uploadedFile = {
        name: request.file.originalname,
        contentType: request.file.mimetype,
        file:  new Buffer(encode_file, 'base64')
    };
    console.log(uploadedFile);
    db.collection('myFiles').insertOne(uploadedFile,(err, result) => {
        console.log(result)

        if (err) 
            return console.log(err)

        console.log('File uploaded Success');
        return response.redirect('/tasks');  
  }) 
}

exports.getFiles = function(request, response){

    db.collection('myFiles').find().toArray((err, result) => {

        //var allFiles= result.map(element => element._id);
        var allFiles= result.map(element => element.name);

        if (err) return 
            console.log(err)

        response.send(allFiles)
    })
};

//this is downloads the file when id is entered
//myFiles/id
exports.getFileById = function (request, response){

    var filename = request.params.id;

    db.collection('myFiles').findOne({'_id': ObjectId(filename) },
        (err, result) => {
            if (err) 
                return console.log(err)

            var type = result.contentType;
            var data = result.file.buffer;
            response.send(result.name);
   
  })
}





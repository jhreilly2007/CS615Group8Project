//This is the Controller in the MVC

var Task = require('../models/taskModel');
const path = require("path");
const multer = require('multer');
var fs = require('fs-extra');   
var mongoose = require('mongoose');
var db = mongoose.connection;
const Grid = require("gridfs-stream");
const { MongoClient, ObjectId } = require('mongodb');

//Configuration for retrieving file from mongodb 
//using gridfs-stream
let gfs;

db.once("open", () => {
  gfs = Grid(db.db, mongoose.mongo);
  gfs.collection("uploads");
  console.log("Connection Successful");
});

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

//Upload a file usng gridfs-stream
exports.uploadfile = function(request, response){
    request.file.filename = request.file.filename + path.extname(request.file.originalname)
    console.log('File Successfully uploaded to Database');
    response.redirect('/upload/files')//for now just to show all files uploaded
};

//Retrieve all files stored by filename
exports.getFiles = function(request, response){

    db.collection('uploads.files').find().toArray((err, result) =>{

        var allFiles= result.map(files => files.filename);

        if (err) return 
            console.log(err)

        response.send(allFiles)//send a list of all files 
    })
};

//retrieve a file by using a filename and gridfs-stream
exports.getFileById = function(request, response){
    gfs.files.findOne({ filename: request.params.id }, (err, file) =>{

        console.log(file); //for testing
        //read the ouput to the browser
        const readstream = gfs.createReadStream(file.filename);

        readstream.on('error', function (err) {

            console.log('There is a Problem!', error);
            throw err;
        });
        console.log(response);
        readstream.pipe(response);
  });
};





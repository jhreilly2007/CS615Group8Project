//This is the Controller in the MVC

var Task = require('../models/taskModel');
var Group = require('../models/groupModel');
const path = require("path");
const multer = require('multer');
var fs = require('fs-extra');
var mongoose = require('mongoose');
var db = mongoose.connection;
const Grid = require("gridfs-stream");
const { MongoClient, ObjectId } = require('mongodb');
var session = require('express-session')

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
exports.data_addtask = async function (request, response) {
    //console.log(request.session.user);
    if (request.body.privacy == null) {
        request.body.privacy = 'Public';
    }
    if (request.body.priority == null) {
        request.body.priority = 'Medium';
    }
    var task = new Task({
        email: request.session.user.email,
        name: request.body.name,
        description: request.body.description,
        resource: request.body.resource,
        priority: request.body.priority,
        privacy: request.body.privacy,
        group: request.body.group
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
exports.data_findtask = async function (request, response) {
    if (request.session.user) {
        // store all group names of which a user is either an admin or member
        var myGroups = await Group.find({ $or: [{ admin: request.session.user.email }, { members: request.session.user.email }] }).exec();
        var group_names = myGroups.map(group => group.name);
        // console.log(new Set(group_names));
        //remove duplicates
        var uniqueArray = Array.from(new Set(group_names));
        //display those tasks to the current user that are either i. public ii. user's private task iii. group task of which a user is a member
        var tasks = await Task.find({ $or: [{ group: { $in: uniqueArray }, privacy: 'Group' }, { email: request.session.user.email, privacy: 'Private' }, { privacy: 'Public' }] }).exec();
        var groups = await Group.find({}).exec();
        response.render("ejs/tasks.ejs", { myTasks: tasks, myGroups: groups });
    } else {
        var accessDeniedTask = request.session.accessDeniedTask = {
            accessDeniedTask: 'You must be logged in to view Tasks List!'
        };
        request.session.save();
        return response.render('index.ejs', accessDeniedTask);
    }
};

//Delete Item from Task List
exports.task_delete = function (request, response) {
    var id = request.params.id;
    Task.findByIdAndRemove(id, err => {
        if (err) {
            return response.send(500, err);
        }
        response.redirect("/tasks");
    });
};

//UPDATE TASKS
exports.get_edit = function (request, response) {
    var id = request.params.id;
    Task.find({}, function (err, tasks) {
        if (err) {
            return response.send(500, err);
        }
        response.render('ejs/edit.ejs', { myTasks: tasks, idTask: id });
    });
}

//Update TASK List Post Function
exports.post_edit = function (request, response) {
    //console.log(request.body.privacy)
    var id = request.params.id;
    if (request.body.priority == null) {
        request.body.priority = request.body.default;
    }
    if (request.body.privacy == null) {
        request.body.privacy = request.body.currentprivacy;
    }
    Task.findByIdAndUpdate(id,
        {
            name: request.body.name,
            description: request.body.description,
            resource: request.body.resource,
            priority: request.body.priority,
            privacy: request.body.privacy
        }, err => {
            if (err) return response.send(500, err);
            response.redirect('/tasks');
        });
}

//Upload a file usng gridfs-stream
exports.uploadfile = function (request, response) {
    if (typeof request.file === 'undefined') {
        response.send("Please upload a file <a href='/tasks'>Go Back</a>");
    }else{
    request.file.filename = request.file.filename + path.extname(request.file.originalname)

    //add metatdata to hold user id
    var myquery = { "metadata.author": "empty" };
    var newvalues = {$set: {"metadata.author": request.session.user.email} };
    db.collection("uploads.files").updateOne(myquery, newvalues, 
        function(err, res) {
            if (err) throw err;
            console.log("MetaData Author Updated");
        });
    //add metatdata to hold details of associated task
    var myquery = { "metadata.task": "empty" };
    var newvalues = {$set: {"metadata.task": request.body.myTask} };
    db.collection("uploads.files").updateOne(myquery, newvalues, 
        function(err, res) {
            if (err) throw err;
            console.log("MetaData Tasks Updated");
        });

    console.log('File Successfully uploaded to Database');
    response.redirect('/upload/files')//for now just to show all files uploaded
    }
};

//Retrieve all files stored by filename
exports.getFiles = function (request, response) {

    db.collection('uploads.files').find().toArray((err, result) => {
        var allFiles = result.map(files => files);

        if (err) return
        console.log(err)        
        //response.send(allFiles)//send a list of all files 
        response.render('ejs/allFiles.ejs', { myFiles: allFiles });
    })
};

//retrieve a file by using a filename and gridfs-stream
//retrieve a file by using a filename and gridfs-stream
exports.getFileById = function (request, response) {
    var id = request.params.id;

    gfs.files.findOne({ _id: ObjectId(id) }, (err, file) => {
        const readstream = gfs.createReadStream(file._id);

        readstream.on('error', function (err) {
            console.log('There is a Problem!', error);
            throw err;
        });
        readstream.pipe(response);
    });
};

exports.deleteFileById = function (request, response) {
    var id = request.params.id;

    gfs.files.remove({ _id: ObjectId(id) }, (err) => {
        if (err) response.status(500).send(err);
        response.redirect('/upload/files');
    });
};





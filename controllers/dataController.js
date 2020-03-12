//This is the Controller in the MVC

var Data = require('../models/dataModel');

exports.test = function (request, response) {
    response.send('Controller is working!');
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
            return next(err);
        }
        response.send('Data Entered Successfully')
    })
};


//Find by id
exports.data_details = function (request, response) {
 
    Data.findById(request.params.id, function (err, data) {
        if (err) return next(err);
        response.send(data);
    })
};


//Update database function
exports.data_update = function (request, response) {

    Data.findByIdAndUpdate(request.params.id, {$set: request.body}, function (err, data) {
        if (err) return next(err);
        response.send('Data Successfully Updated');
    });
};


//Delete Entry
exports.data_delete = function (request, response) {

    Data.findByIdAndRemove(request.params.id, function (err) {
        if (err) return next(err);
        response.send('Deleted successfully!');
    })
};


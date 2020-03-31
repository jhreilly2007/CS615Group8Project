// Initialize express router
var express = require('express');
var router = express.Router();
//used to direct specific paths
const path = require("path");

//Required Controllers
var data_controller = require('../controllers/dataController');
var user_controller = require('../controllers/userController');
var general_controller = require('../controllers/generalController');

//DATABASE ROUTES
//General
router.get('/', general_controller.index);

router.get('/about', general_controller.about);

router.get('/tasks', general_controller.tasks);

router.get('/welcome', general_controller.welcome);

//module.exports = router;
//Test all our data is communicating
//http://localhost:3000/data/test
router.get('/data/test', data_controller.test);

//http://localhost:3000/data/create
router.post('/data/create', data_controller.data_create);

//http://localhost:3000/data/id
router.get('/data/:id', data_controller.data_details);

//http://localhost:3000/data/id/update
router.put('/data/:id/update', data_controller.data_update);

//http://localhost:3000/data/id/delete
router.delete('/data/:id/delete', data_controller.data_delete);


//Login Routes
//http://localhost:3000/user/signup
router.post('/user/signup', user_controller.user_auth);

router.post('/user/signin', user_controller.user_signin);

router.get('/user/logout', user_controller.user_logout);

module.exports = router;



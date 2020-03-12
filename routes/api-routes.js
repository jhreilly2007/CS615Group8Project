// Initialize express router
//This is the app routing

var express = require('express');
var router = express.Router();

//Require Controller
var data_controller = require('../controllers/dataController');
var user_controller = require('../controllers/userController');

//DATABASE ROUTES
//Test all our data is communicating
//http://localhost:3000/data/test
router.get('/test', data_controller.test);

//http://localhost:3000/data/create
router.post('/create', data_controller.data_create);

//http://localhost:3000/data/id
router.get('/:id', data_controller.data_details);

//http://localhost:3000/data/id/update
router.put('/:id/update', data_controller.data_update);

//http://localhost:3000/data/id/delete
router.delete('/:id/delete', data_controller.data_delete);

//Login Routes
//http://localhost:3000/user/signup
router.post('/signup', user_controller.user_auth);

router.post('/signin', user_controller.user_signin);

module.exports = router;



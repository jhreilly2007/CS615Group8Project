// Initialize express router
var express = require('express');
var router = express.Router();
//used to direct specific paths
const path = require("path");
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const crypto = require('crypto');
var env = require('dotenv').config();


// SET STORAGE
var storage = new GridFsStorage({
	url: process.env.DB_URI,
	file: (req, file) => {
		return new Promise((resolve, reject) => {
			crypto.randomBytes(16, (err, buf) => {
				if (err) {
					return reject(err);
				}
				//const filename = buf.toString('hex') + path.extname(file.originalname);
				const filename = file.originalname;
				const fileInfo = {
					filename: filename,
					bucketName: 'uploads'
				};
				resolve(fileInfo);
			});
		});
	}
});

const upload = multer({ storage });

//Required Controllers
var task_controller = require('../controllers/taskController');
var user_controller = require('../controllers/userController');
var general_controller = require('../controllers/generalController');
var group_controller = require('../controllers/groupController');

/****GENERAL ROUTES****/
router.get('/', general_controller.index);

router.get('/about', general_controller.about);

router.get('/groups', general_controller.groups);

router.get('/welcome', general_controller.welcome);

/****DataBase Routes for Groups****/

//Test all our data is communicating
//http://localhost:3000/group/test
router.get('/group/test', group_controller.test);

//http://localhost:3000/group/create
router.post('/group/create', group_controller.group_create);

//http://localhost:3000/group/id
router.get('/group/:id', group_controller.group_details);

//http://localhost:3000/group/id/update
router.put('/group/:id/update', group_controller.group_update);

//http://localhost:3000/group/id/delete
router.delete('/group/:id/delete', group_controller.group_delete);

/****TASK routes****/
//http://localhost:3000/tasks
router.post('/tasks', task_controller.data_addtask);

router.get('/tasks', task_controller.data_findtask);

router.get('/tasks/remove/:id', task_controller.task_delete);

router.get('/tasks/edit/:id', task_controller.get_edit);

router.post('/tasks/edit/:id', task_controller.post_edit);

router.post('/uploadfile', upload.single('myFile'), task_controller.uploadfile);

router.get('/upload/files', task_controller.getFiles);

router.get('/upload/files/:id', task_controller.getFileById);

/****Login Routes****/
//http://localhost:3000/user/signup
router.post('/user/signup', user_controller.user_auth);

router.get('/user/signupfailed', user_controller.signup_failed);

router.post('/user/signin', user_controller.user_signin);

router.get('/user/logout', user_controller.user_logout);

router.get('/user/details', user_controller.user_details);

router.get('/user/all', user_controller.user_all_details);

// ///////////
// router.post('/user/reset-password', user_controller.reset_password);
// ///////////////

module.exports = router;



// Initialize express router
var express = require('express');
var router = express.Router();
//used to direct specific paths
const path = require("path");
//node middleware for handling multi-part form data
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const crypto = require('crypto');
var env = require('dotenv').config();

// SET STORAGE
//GridFS storage engine for Multer to store 
//uploaded files directly to MongoDb
// Create a storage object with db config
var storage = new GridFsStorage({
	url: process.env.DB_URI,
	file: (request, file) => {
		return new Promise((resolve, reject) => {
			//the function cryto.randomBytes is used to 
			//generate names
			crypto.randomBytes(16, (err, buf) => {
				if (err) {
					return reject(err);
				}
				const filename = file.originalname;
				const fileInfo = {
					filename: filename,
					bucketName: 'uploads',
					//setting metadata to empty to manipulate in function
					metadata: {
						author: "empty",
						task: "empty"
					}
				};
				resolve(fileInfo);
			});
		});
	}
});
// Set multer storage engine to the newly created storage option
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
// router.delete('/group/delete/:id', group_controller.group_delete);
router.get('/group/delete/:id', group_controller.group_delete);

/****TASK routes****/
//http://localhost:3000/tasks
router.post('/tasks', task_controller.data_addtask);

router.get('/tasks', task_controller.data_findtask);

router.get('/task/archive', task_controller.task_archive);

router.get('/tasks/remove/:id', task_controller.task_delete);

router.get('/tasks/edit/:id', task_controller.get_edit);

router.post('/tasks/edit/:id', task_controller.post_edit);

router.get('/task/completed/:id', task_controller.get_complete);

router.get('/task/reactivate/:id', task_controller.get_active);

//uploading file using mutler (enctype="multipart/form-data")
//upload uses Multer storage engine set to the storage option created above
router.post('/uploadfile', upload.single('myFile'), task_controller.uploadfile);

router.get('/upload/files', task_controller.getFiles);

router.get('/upload/files/:id', task_controller.getFileById);

router.get('/upload/getfiles/:name', task_controller.getFilesByTaskName);

router.get('/delete/file/:id', task_controller.deleteFileById);

/****Login Routes****/
//http://localhost:3000/user/signup
router.post('/user/signup', user_controller.user_auth);

router.get('/user/signupfailed', user_controller.signup_failed);

router.post('/user/signin', user_controller.user_signin);

router.get('/user/logout', user_controller.user_logout);

router.get('/user/details', user_controller.user_details);

router.get('/user/all', user_controller.user_all_details);

module.exports = router;



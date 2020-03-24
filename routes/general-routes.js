var express = require('express');
var router = express.Router();

// Require controller modules.
var general_controller = require('../controllers/generalController');

/// BOOK ROUTES ///

// GET catalog home page.
router.get('/', general_controller.index);

router.get('/about', general_controller.about);

router.get('/tasks', general_controller.tasks);

module.exports = router;


const express = require('express');
const router = express.Router();
const schedulerController = require('../controllers/schedulerController');

// Scheduler routes
router.get('/status', schedulerController.getStatus);
router.post('/start', schedulerController.startScheduler);
router.post('/stop', schedulerController.stopScheduler);

module.exports = router;
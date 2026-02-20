const express = require('express');
const router = express.Router();
const googleDriveController = require('../controllers/googleDriveController');
const crypto = require('crypto'); // Used in controller, ensuring availability

// 1. Notification (Webhook)
router.post('/webhook', googleDriveController.handleNotification);

// 2. Start Watch Channel
router.post('/watch', googleDriveController.watch);

module.exports = router;

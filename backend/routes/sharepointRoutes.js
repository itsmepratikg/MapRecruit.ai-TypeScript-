const express = require('express');
const router = express.Router();
const sharepointController = require('../controllers/sharepointController');

// 1. Validation (GET) OR Notification (POST)
// Graph API might use GET or POST for validation depending on config, but standard is POST with query param
// We handle both just in case
router.get('/webhook', sharepointController.handleValidation);
router.post('/webhook', sharepointController.handleValidation, sharepointController.handleNotification);

// 2. Subscription Management
router.post('/subscribe', sharepointController.subscribe);

// 3. Renew Subscription (Ideally triggered by cron job internally, but exposed for testing)
// router.patch('/subscribe/:id', sharepointController.renewSubscription);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
    getIntegrationSettings,
    updateIntegrationSettings,
    testPermissions,
    getPublicIntegrationSettings
} = require('../controllers/integrationSettingsController');
const { protect } = require('../middleware/authMiddleware');

// Base path: /api/v1/integration-settings

router.route('/')
    .get(protect, getIntegrationSettings)
    .put(protect, updateIntegrationSettings);

router.get('/public/config', getPublicIntegrationSettings);

router.post('/test', protect, testPermissions);

module.exports = router;

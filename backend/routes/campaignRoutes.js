const express = require('express');
const router = express.Router();
const {
    getCampaigns,
    getCampaign,
    getCampaignStats,
    getRecentCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign,
} = require('../controllers/campaignController');
const { protect } = require('../middleware/authMiddleware');

const { tenantGuard } = require('../middleware/guardMiddleware');

router.route('/')
    .get(protect, getCampaigns)
    .post(protect, createCampaign);

router.get('/stats', protect, getCampaignStats);
router.get('/recent', protect, getRecentCampaigns);

router.route('/:id')
    .get(protect, tenantGuard('Campaign'), getCampaign)
    .put(protect, tenantGuard('Campaign'), updateCampaign)
    .delete(protect, tenantGuard('Campaign'), deleteCampaign);

module.exports = router;

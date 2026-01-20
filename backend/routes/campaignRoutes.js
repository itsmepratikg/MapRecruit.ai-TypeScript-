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

router.route('/')
    .get(protect, getCampaigns)
    .post(protect, createCampaign);

router.get('/stats', protect, getCampaignStats);
router.get('/recent', protect, getRecentCampaigns);

router.route('/:id')
    .get(protect, getCampaign)
    .put(protect, updateCampaign)
    .delete(protect, deleteCampaign);

module.exports = router;

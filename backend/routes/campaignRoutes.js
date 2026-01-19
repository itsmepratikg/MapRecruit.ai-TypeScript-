const express = require('express');
const router = express.Router();
const {
    getCampaigns,
    getCampaign,
    createCampaign,
    updateCampaign,
    deleteCampaign,
} = require('../controllers/campaignController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getCampaigns)
    .post(protect, createCampaign);

router.route('/:id')
    .get(protect, getCampaign)
    .put(protect, updateCampaign)
    .delete(protect, deleteCampaign);

module.exports = router;

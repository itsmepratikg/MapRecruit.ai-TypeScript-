const express = require('express');
const router = express.Router();
const {
    getProfiles,
    getProfile,
    createProfile,
    updateProfile,
    deleteProfile,
    getProfileStats,
    getFolderMetrics,
    getArticles,
    getTags
} = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

const { tenantGuard } = require('../middleware/guardMiddleware');

router.get('/stats', protect, getProfileStats);
router.get('/folder-metrics', protect, getFolderMetrics);
router.get('/articles', protect, getArticles);
router.get('/tags', protect, getTags);

router.route('/')
    .get(protect, getProfiles)
    .post(protect, createProfile);

router.route('/:id')
    .get(protect, tenantGuard('Candidate'), getProfile)
    .put(protect, tenantGuard('Candidate'), updateProfile)
    .delete(protect, tenantGuard('Candidate'), deleteProfile);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
    getProfiles,
    getProfile,
    createProfile,
    updateProfile,
    deleteProfile,
} = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getProfiles)
    .post(protect, createProfile);

router.route('/:id')
    .get(protect, getProfile)
    .put(protect, updateProfile)
    .delete(protect, deleteProfile);

module.exports = router;

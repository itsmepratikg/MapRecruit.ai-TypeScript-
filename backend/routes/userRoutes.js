const express = require('express');
const router = express.Router();
const { getUsers, getUserById, createUser, updateUser, updateActiveAt, resetPassword } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getUsers)
    .post(protect, createUser);

router.post('/active', protect, updateActiveAt);

const {
    getRecentSearches, logRecentSearch,
    getSavedSearches, saveSearch,
    getRecentVisits, logVisit
} = require('../controllers/userActivityController');

router.get('/recent-searches', protect, getRecentSearches);
router.post('/recent-searches', protect, logRecentSearch);

router.get('/saved-searches', protect, getSavedSearches);
router.post('/saved-searches', protect, saveSearch);

router.get('/recent-visits', protect, getRecentVisits);
router.post('/recent-visits', protect, logVisit);

router.route('/:id')
    .get(protect, getUserById)
    .put(protect, updateUser);

router.post('/:id/reset-password', protect, resetPassword);

module.exports = router;

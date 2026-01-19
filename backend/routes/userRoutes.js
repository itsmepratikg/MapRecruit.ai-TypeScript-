const express = require('express');
const router = express.Router();
const { getUsers, getUserById, createUser, updateUser, updateActiveAt, resetPassword } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getUsers)
    .post(protect, createUser);

router.post('/active', protect, updateActiveAt);

router.route('/:id')
    .get(protect, getUserById)
    .put(protect, updateUser);

router.post('/:id/reset-password', protect, resetPassword);

module.exports = router;

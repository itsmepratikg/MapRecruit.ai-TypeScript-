const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getMe
} = require('../controllers/authController');
const {
    getRegistrationOptions,
    verifyRegistration,
    getAuthenticationOptions,
    verifyLogin
} = require('../controllers/passkeyController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

// Passkey Routes
router.post('/passkey/register-options', protect, getRegistrationOptions);
router.post('/passkey/register-verify', protect, verifyRegistration);
router.post('/passkey/login-options', getAuthenticationOptions);
router.post('/passkey/login-verify', verifyLogin);

module.exports = router;

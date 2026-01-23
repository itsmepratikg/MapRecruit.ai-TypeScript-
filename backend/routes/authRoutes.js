const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getMe,
    listRoles,
    createRole,
    updateRole,
    switchCompany
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
router.post('/switch-context', protect, switchCompany);

// Passkey Routes
router.post('/passkey/register-options', protect, getRegistrationOptions);
router.post('/passkey/register-verify', protect, verifyRegistration);
router.post('/passkey/login-options', getAuthenticationOptions);
router.post('/passkey/login-verify', verifyLogin);

// Role Management Routes
router.route('/roles')
    .get(protect, listRoles)
    .post(protect, createRole);
router.put('/roles/:id', protect, updateRole);

// Impersonation Route
router.post('/impersonate', protect, require('../controllers/authController').impersonateUser);

module.exports = router;

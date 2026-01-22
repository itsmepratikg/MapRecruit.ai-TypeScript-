const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');

// Generate JWT
const generateToken = (id, email, companyID, activeClientID, role) => {
    return jwt.sign({ id, email, companyID, activeClientID, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
// Helper to generate password from domain
const getDomainPassword = (email) => {
    if (!email) return null;
    const domain = email.split('@')[1];
    if (!domain) return null;
    const name = domain.split('.')[0];
    return name.charAt(0).toUpperCase() + name.slice(1) + '12!';
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        let { email, password, role, companyID, activeClientID } = req.body;

        // Auto-generate password if not provided, based on domain rule: Domain12!
        if (!password && email) {
            password = getDomainPassword(email);
        }

        if (!email || !password || !companyID) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            email,
            password,
            role: role || 'User',
            companyID,
            activeClientID
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                email: user.email,
                role: user.role,
                companyID: user.companyID,
                activeClientID: user.activeClientID,
                token: generateToken(user._id, user.email, user.companyID, user.activeClientID, user.role),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user email
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            // Update login tracking
            user.loginCount = (user.loginCount || 0) + 1;
            user.lastLoginAt = new Date();
            user.lastActiveAt = new Date();
            await user.save();

            // Exclude password from response
            const userObj = user.toObject();
            delete userObj.password;

            res.json({
                ...userObj,
                token: generateToken(user._id, user.email, user.companyID, user.activeClientID, user.role),
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
            return res.status(400).json({ message: 'Invalid User ID format' });
        }

        const user = await User.findOne({ _id: new mongoose.Types.ObjectId(req.user.id) }).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate ETag based on updatedAt timestamp
        const lastUpdated = user.updatedAt ? new Date(user.updatedAt).getTime() : 0;
        const etag = `"${lastUpdated.toString(16)}"`;

        res.setHeader('ETag', etag);

        // Check for conditional GET
        if (req.headers['if-none-match'] === etag) {
            return res.status(304).end();
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Impersonate another user (Admin only)
// @route   POST /api/auth/impersonate
// @access  Private (Product Admin)
const impersonateUser = async (req, res) => {
    try {
        const { targetUserId, mode = 'read-only' } = req.body;

        // 1. Verify Requestor is Admin
        if (req.user.role !== 'Product Admin') {
            return res.status(403).json({ message: 'Not authorized for impersonation' });
        }

        // 2. Find Target User
        const targetUser = await User.findById(targetUserId);
        if (!targetUser) {
            return res.status(404).json({ message: 'Target user not found' });
        }

        // 4. Generate Impersonation Token
        const token = jwt.sign({
            id: targetUser._id,
            email: targetUser.email,
            companyID: targetUser.companyID,
            activeClientID: targetUser.activeClientID,
            role: targetUser.role,
            // Impersonation Claims
            impersonatorId: req.user.id,
            mode: mode // 'read-only' | 'full'
        }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.json({
            ...targetUser.toObject(),
            token,
            isImpersonated: true,
            mode
        });

    } catch (error) {
        console.error('Impersonation Error:', error);
        res.status(500).json({ message: 'Server Error during impersonation' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    impersonateUser
};

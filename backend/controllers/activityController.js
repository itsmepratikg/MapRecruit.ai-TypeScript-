const Activity = require('../models/Activity');
const mongoose = require('mongoose');

// @desc    Get activities for a company/candidate/campaign
// @route   GET /api/activities
// @access  Private
const getActivities = async (req, res) => {
    try {
        const {
            candidateID,
            campaignID,
            resumeID,
            limit = 50,
            activityType,
            activityGroup,
            activityOf,
            page = 1,
            skip
        } = req.query;

        const query = { companyID: req.user.companyID, deleted: false };

        if (candidateID) query.resumeID = candidateID; // Support both naming conventions if needed, or stick to schema
        if (resumeID) query.resumeID = resumeID;
        if (campaignID) query.campaignID = campaignID;
        if (activityType) query.activityType = activityType;
        if (activityGroup) query.activityGroup = activityGroup;
        if (activityOf) query.activityOf = activityOf;

        const limitNum = parseInt(limit);
        const pageNum = parseInt(page);
        const skipNum = skip ? parseInt(skip) : (pageNum - 1) * limitNum;

        const activities = await Activity.find(query)
            .sort({ activityAt: -1, createdAt: -1 })
            .skip(skipNum)
            .limit(limitNum)
            .populate('userID', 'firstName lastName avatar role')
            .populate('resumeID', 'firstName lastName email')
            .populate('campaignID', 'title');

        const total = await Activity.countDocuments(query);

        res.status(200).json({
            activities,
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum)
        });
    } catch (error) {
        console.error('getActivities Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Log a new activity
// @route   POST /api/activities
// @access  Private
const logActivity = async (req, res) => {
    try {
        const {
            activityType,
            activityGroup,
            campaignID,
            resumeID,
            activityIcon,
            activity, // Object with html strings
            metaData,
            activityOf,
            activityFields
        } = req.body;

        const newActivity = await Activity.create({
            companyID: req.user.companyID,
            userID: req.user._id,
            userName: `${req.user.firstName} ${req.user.lastName}`,
            activityType,
            activityGroup: activityGroup || 'Standard',
            campaignID: Array.isArray(campaignID) ? campaignID : (campaignID ? [campaignID] : []),
            resumeID: Array.isArray(resumeID) ? resumeID : (resumeID ? [resumeID] : []),
            activityIcon,
            activity,
            activityOf: activityOf || ['common'],
            activityFields,
            metaData,
            activityAt: new Date()
        });

        res.status(201).json(newActivity);
    } catch (error) {
        console.error('logActivity Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getActivities,
    logActivity
};

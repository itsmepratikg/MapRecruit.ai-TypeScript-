const Activity = require('../models/Activity');

// @desc    Get activities for a company/candidate/campaign
// @route   GET /api/activities
// @access  Private
const getActivities = async (req, res) => {
    try {
        const { candidateID, campaignID, limit = 50 } = req.query;
        const query = { companyID: req.user.companyID };

        if (candidateID) query.candidateID = candidateID;
        if (campaignID) query.campaignID = campaignID;

        const activities = await Activity.find(query)
            .sort({ date: -1 })
            .limit(parseInt(limit))
            .populate('userID', 'firstName lastName')
            .populate('candidateID', 'firstName lastName')
            .populate('campaignID', 'title schemaConfig.mainSchema.title');

        res.status(200).json(activities);
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
        const { candidateID, campaignID, type, title, description, metadata } = req.body;

        const activity = await Activity.create({
            companyID: req.user.companyID,
            userID: req.user._id,
            candidateID,
            campaignID,
            type,
            title,
            description,
            metadata
        });

        res.status(201).json(activity);
    } catch (error) {
        console.error('logActivity Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getActivities,
    logActivity
};

const Campaign = require('../models/Campaign');

// @desc    Get all campaigns for the tenant
// @route   GET /api/campaigns
// @access  Private
const getCampaigns = async (req, res) => {
    try {
        const campaigns = await Campaign.find({ companyID: req.user.companyID });
        res.status(200).json(campaigns);
    } catch (error) {
        console.error('getCampaigns Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get campaign statistics (counts)
// @route   GET /api/campaigns/stats
// @access  Private
const getCampaignStats = async (req, res) => {
    try {
        const companyID = req.user.companyID;

        // Count Active
        const active = await Campaign.countDocuments({
            companyID,
            $or: [
                { "schemaConfig.mainSchema.status": "Active" },
                { status: "Active" },
                { status: true }
            ]
        });

        // Count Closed
        const closed = await Campaign.countDocuments({
            companyID,
            $or: [
                { "schemaConfig.mainSchema.status": "Closed" },
                { status: "Closed" },
                { status: false }
            ]
        });

        // Count Archived
        const archived = await Campaign.countDocuments({
            companyID,
            $or: [
                { "schemaConfig.mainSchema.status": "Archived" },
                { status: "Archived" }
            ]
        });

        res.status(200).json({ active, closed, archived });
    } catch (error) {
        console.error('Stats Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get recent campaigns for dashboard
// @route   GET /api/campaigns/recent
// @access  Private
const getRecentCampaigns = async (req, res) => {
    try {
        const companyID = req.user.companyID;
        // Fetch 5 most recent active campaigns
        const campaigns = await Campaign.find({
            companyID,
            $or: [
                { "schemaConfig.mainSchema.status": "Active" },
                { status: "Active" },
                { status: true }
            ]
        })
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json(campaigns);
    } catch (error) {
        console.error('Recent Campaigns Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single campaign
// @route   GET /api/campaigns/:id
// @access  Private
const getCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findOne({
            _id: req.params.id,
            companyID: req.user.companyID
        });

        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        res.status(200).json(campaign);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create new campaign
// @route   POST /api/campaigns
// @access  Private
const createCampaign = async (req, res) => {
    try {
        // req.body contains flexible schema structure
        const campaign = await Campaign.create({
            ...req.body,
            companyID: req.user.companyID, // Force company context
            // Ensure schema default structure if needed
        });

        res.status(201).json(campaign);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update campaign
// @route   PUT /api/campaigns/:id
// @access  Private
const updateCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findOne({
            _id: req.params.id,
            companyID: req.user.companyID
        });

        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        const updatedCampaign = await Campaign.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: false } // flexible schema often needs validators off or loose
        );

        res.status(200).json(updatedCampaign);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete campaign
// @route   DELETE /api/campaigns/:id
// @access  Private
const deleteCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findOne({
            _id: req.params.id,
            companyID: req.user.companyID
        });

        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        await campaign.remove();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getCampaigns,
    getCampaign,
    getCampaignStats,
    getRecentCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign,
};

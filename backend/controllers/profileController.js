const Candidate = require('../models/Candidate');

// @desc    Get all candidate profiles for the tenant
// @route   GET /api/profiles
// @access  Private
const getProfiles = async (req, res) => {
    try {
        // Use projection to avoid sending massive payloads for list view
        // Select core fields: full name, email, job title (from currentRole if inferred), etc.
        const profiles = await Candidate.find({ companyID: req.user.companyID })
            .select('profile.fullName profile.emails professionalSummary.currentRole.jobTitle metaData.mrProfileID');
        res.status(200).json(profiles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single profile details
// @route   GET /api/profiles/:id
// @access  Private
const getProfile = async (req, res) => {
    try {
        const profile = await Candidate.findOne({
            _id: req.params.id,
            companyID: req.user.companyID
        });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.status(200).json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create new profile
// @route   POST /api/profiles
// @access  Private
const createProfile = async (req, res) => {
    try {
        const profile = await Candidate.create({
            ...req.body,
            companyID: req.user.companyID
        });

        res.status(201).json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update profile
// @route   PUT /api/profiles/:id
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const profile = await Candidate.findOne({
            _id: req.params.id,
            companyID: req.user.companyID
        });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        const updatedProfile = await Candidate.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: false }
        );

        res.status(200).json(updatedProfile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete profile
// @route   DELETE /api/profiles/:id
// @access  Private
const deleteProfile = async (req, res) => {
    try {
        const profile = await Candidate.findOne({
            _id: req.params.id,
            companyID: req.user.companyID
        });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        await profile.remove();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getProfiles,
    getProfile,
    createProfile,
    updateProfile,
    deleteProfile,
};

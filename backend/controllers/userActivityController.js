const UserRecentSearch = require('../models/UserRecentSearch');
const UserSavedSearch = require('../models/UserSavedSearch');
const UserRecentVisit = require('../models/UserRecentVisit');

// --- Recent Searches ---
const getRecentSearches = async (req, res) => {
    try {
        const searches = await UserRecentSearch.find({
            userID: req.user.id,
            companyID: req.user.currentCompanyID || req.user.companyID
        }).sort({ date: -1 }).limit(20);
        res.status(200).json(searches);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const logRecentSearch = async (req, res) => {
    try {
        await UserRecentSearch.create({
            userID: req.user.id,
            companyID: req.user.currentCompanyID || req.user.companyID,
            terms: req.body.terms
        });
        res.status(201).json({ message: 'Search logged' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- Saved Searches ---
const getSavedSearches = async (req, res) => {
    try {
        const searches = await UserSavedSearch.find({
            userID: req.user.id,
            companyID: req.user.currentCompanyID || req.user.companyID
        }).sort({ date: -1 });
        res.status(200).json(searches);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const saveSearch = async (req, res) => {
    try {
        const { name, filters } = req.body;
        const search = await UserSavedSearch.create({
            userID: req.user.id,
            companyID: req.user.currentCompanyID || req.user.companyID,
            name,
            filters
        });
        res.status(201).json(search);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- Recent Visits ---
const getRecentVisits = async (req, res) => {
    try {
        const visits = await UserRecentVisit.find({
            userID: req.user.id,
            companyID: req.user.currentCompanyID || req.user.companyID
        }).sort({ date: -1 }).limit(20);
        res.status(200).json(visits);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const logVisit = async (req, res) => {
    try {
        const { type, referenceID, title } = req.body;
        await UserRecentVisit.create({
            userID: req.user.id,
            companyID: req.user.currentCompanyID || req.user.companyID,
            type,
            referenceID,
            title
        });
        res.status(201).json({ message: 'Visit logged' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getRecentSearches,
    logRecentSearch,
    getSavedSearches,
    saveSearch,
    getRecentVisits,
    logVisit
};

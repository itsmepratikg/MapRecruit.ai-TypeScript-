const Company = require('../models/Company');
const Franchise = require('../models/Franchise');

// @desc    Get company details
// @route   GET /api/company
// @access  Private
const getCompany = async (req, res) => {
    try {
        // Since we currently have only one company or we fetch based on user's companyID
        // Prioritize the user's current active company context (for switching)
        // Then fall back to middleware-resolved ID or user's home company
        const companyId = req.user?.currentCompanyID || req.companyID || req.user?.companyID;

        if (!companyId) {
            return res.status(400).json({ message: 'Company ID not resolved' });
        }

        const company = await Company.findById(companyId).populate('franchiseID');

        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        res.json(company);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update company details
// @route   PUT /api/company
// @access  Private
const updateCompany = async (req, res) => {
    try {
        const companyId = req.user.companyID;

        let company;
        if (companyId) {
            company = await Company.findById(companyId);
        } else {
            company = await Company.findOne();
        }

        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        // Update fields
        Object.assign(company, req.body);

        const updatedCompany = await company.save();
        res.json(updatedCompany);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all franchises
// @route   GET /api/company/franchises
// @access  Private
const getFranchises = async (req, res) => {
    try {
        const franchises = await Franchise.find({}).populate('clientIDs');
        res.json(franchises);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create franchise
// @route   POST /api/company/franchises
const createFranchise = async (req, res) => {
    try {
        const { franchiseName, clientIDs } = req.body;
        const franchise = await Franchise.create({
            franchiseName,
            clientIDs,
            updatedBy: req.user.id
        });
        res.status(201).json(franchise);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    List All Companies (Product Admin only)
// @route   GET /api/company/all
const listAllCompanies = async (req, res) => {
    try {
        // console.log(`[DEBUG] listAllCompanies - User Role: ${req.user.role}`);
        if (req.user.role !== 'Product Admin') {
            // console.warn(`[DEBUG] listAllCompanies - Unauthorized: ${req.user.role}`);
            return res.status(403).json({ message: 'Not authorized' });
        }
        const companies = await Company.find({}).select('companyProfile status');
        // console.log(`[DEBUG] listAllCompanies - Found ${companies.length} companies`);
        res.json(companies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getCompany,
    updateCompany,
    getFranchises,
    createFranchise,
    listAllCompanies
};

const {
    getCompany,
    updateCompany,
    getFranchises,
    createFranchise,
    listAllCompanies
} = require('../controllers/companyController');
const { protect } = require('../middleware/authMiddleware');
const express = require('express');
const router = express.Router();

router.route('/')
    .get(protect, getCompany)
    .put(protect, updateCompany);

router.get('/all', protect, listAllCompanies);

router.route('/franchises')
    .get(protect, getFranchises)
    .post(protect, createFranchise);

module.exports = router;

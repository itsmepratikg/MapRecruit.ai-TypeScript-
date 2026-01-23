const mongoose = require('mongoose');

const companySchema = mongoose.Schema({
    status: {
        type: String,
        default: 'Active'
    },
    companyProfile: {
        type: mongoose.Schema.Types.Mixed
    },
    productSettings: {
        type: mongoose.Schema.Types.Mixed
    },
    accessabilitySettings: {
        type: mongoose.Schema.Types.Mixed
    },
    franchiseID: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Franchise'
    }]
}, {
    timestamps: true,
    strict: false
});

const Company = mongoose.model('Company', companySchema, 'companiesDB');

module.exports = Company;

const mongoose = require('mongoose');

const franchiseSchema = mongoose.Schema({
    franchiseName: {
        type: String,
        required: true
    },
    clientIDs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client'
    }],
    companyID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
    strict: false,
    collection: 'franchises'
});

const Franchise = mongoose.model('Franchise', franchiseSchema);

module.exports = Franchise;

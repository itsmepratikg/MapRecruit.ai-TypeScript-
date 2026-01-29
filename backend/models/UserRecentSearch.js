const mongoose = require('mongoose');

const userRecentSearchSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    companyID: {
        type: String,
        required: true
    },
    terms: [{
        type: String
    }],
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    collection: 'userrecentsearches'
});

module.exports = mongoose.model('UserRecentSearch', userRecentSearchSchema);

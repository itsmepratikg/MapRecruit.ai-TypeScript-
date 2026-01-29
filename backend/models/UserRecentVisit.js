const mongoose = require('mongoose');

const userRecentVisitSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    companyID: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Profile', 'Campaign'],
        required: true
    },
    referenceID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    collection: 'userrecentvisits'
});

module.exports = mongoose.model('UserRecentVisit', userRecentVisitSchema);

const mongoose = require('mongoose');

const activitySchema = mongoose.Schema({
    companyID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true
    },
    candidateID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
        index: true
    },
    campaignID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign',
        index: true
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['PROFILE_UPDATE', 'STATUS_CHANGE', 'EMAIL_SENT', 'NOTE_ADDED', 'CAMPAIGN_ATTACH', 'INTERVIEW_SCHEDULED', 'OTHER']
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Activity = mongoose.model('Activity', activitySchema, 'activitiesDB');

module.exports = Activity;

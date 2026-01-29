const mongoose = require('mongoose');

const interviewSchema = mongoose.Schema({
    resumeID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
        required: true,
        index: true
    },
    campaignID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign',
        required: true,
        index: true
    },
    companyID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
        index: true
    },
    clientID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true,
        index: true
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true,
        required: true
    },
    status: {
        type: String,
        default: 'Not Initiated',
        index: true
    },
    offerStatus: {
        type: String,
        default: 'Pending'
    },
    linked: {
        type: Boolean,
        default: true,
        index: true
    },
    active: {
        type: Boolean,
        default: true
    },
    applicationType: String,
    linkedBy: String,

    // Feedback object (handling both feedBack and feedback via virtuals or just accepting mixed)
    // We standardize on feedBack for new records.
    feedBack: {
        rating: Number,
        comment: String,
        status: String,
        shortlisted: Boolean,
        rejected: Boolean,
        reviewed: Boolean,
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        reviewedAt: Date
    },

    // Snapshots
    campaign: {
        title: { type: String, index: true },
        passcode: String,
        locations: [mongoose.Schema.Types.Mixed]
    },
    profile: {
        fullName: String,
        emails: [mongoose.Schema.Types.Mixed],
        phones: [mongoose.Schema.Types.Mixed],
        locations: [mongoose.Schema.Types.Mixed]
    },

    // Sourcing
    sourceAI: {
        applicationChannel: String,
        applicationSource: String,
        linkedAt: Date,
        applicationChannelRefID: mongoose.Schema.Types.ObjectId
    },

    // Deeply nested/flexible data
    screeningRounds: [mongoose.Schema.Types.Mixed],
    MRI: mongoose.Schema.Types.Mixed,
    metaData: mongoose.Schema.Types.Mixed

}, {
    timestamps: true,
    strict: false,
    collection: 'interviewsdb'
});

// Virtual for legacy 'feedback' property if needed
interviewSchema.virtual('feedback').get(function () {
    return this.feedBack;
}).set(function (val) {
    this.feedBack = val;
});

const Interview = mongoose.model('Interview', interviewSchema, 'interviewsdb');

module.exports = Interview;

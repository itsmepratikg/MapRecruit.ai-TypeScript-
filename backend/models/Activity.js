const mongoose = require('mongoose');

const activitySchema = mongoose.Schema({
    activityTypeID: { type: mongoose.Schema.Types.ObjectId, index: true },
    activityType: {
        type: String,
        required: true,
        index: true,
        // Enum validation can be loose or strict depending on requirement. 
        // Keeping it loose for now to allow new types without code changes immediately if needed, 
        // but can list common ones:
        // enum: ['Profile Uploaded', 'Profile Linked', 'Profile UnLinked', 'Profile Created', 'Profile Edited', 
        // 'Contact Details Viewed', 'Profile Merged', 'Email Opt-Out', 'Reject Profile', 'Scheduled Screening Round',
        // 'Started Screening Round', 'Completed Screening Round', 'Post Screening Email', 'Candidate Requested', 'Profile Downloaded']
    },
    activityGroup: {
        type: String,
        enum: ['Standard', 'Custom'],
        default: 'Standard'
    },
    code: { type: String, default: '' },
    companyID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
        index: true
    },
    clientID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client'
    },
    campaignID: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign'
    }],
    resumeID: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate'
    }],
    articleID: [{ type: mongoose.Schema.Types.ObjectId }], // Assuming Article model exists or just ID
    interviewID: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Interview'
    }],
    roundNumber: { type: Number, default: 1 },
    createdAt: { type: Date, default: Date.now },
    activityAt: { type: Date, default: Date.now },
    userName: { type: String },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    version: { type: String, default: 'V4' },
    userIcon: { type: String, default: '' },
    activityIcon: { type: String, default: '' },
    userType: { type: String, default: '' },
    mergedResumeID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate'
    },
    updatedFields: [{
        fieldName: String,
        sectionName: String,
        type: { type: String }, // 'field', 'List', etc.
        oldValue: mongoose.Schema.Types.Mixed,
        newValue: mongoose.Schema.Types.Mixed
    }],
    interviewResults: { type: String, default: '' },
    page: { type: String, default: '' },
    visible: { type: Boolean, default: true },
    deleted: { type: Boolean, default: false },
    manuallyAdded: { type: Boolean, default: false },
    activityTrigger: { type: Boolean, default: true },
    activityOf: [{
        type: String,
        enum: ['common', 'campaign', 'user', 'profile', 'profile-requisition']
    }],
    activityFields: [{
        type: { type: String }, // e.g., 'taskID', 'communicationID'
        value: mongoose.Schema.Types.Mixed
    }],
    activity: {
        profileActivity: { type: String, default: '' },
        requisitionActivity: { type: String, default: '' },
        campaignActivity: { type: String, default: '' },
        userActivities: { type: String, default: '' },
        commonActivity: { type: String, default: '' }
    },
    metaData: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true // This will add createdAt and updatedAt automatically too, matching the schema's updated field
});

const Activity = mongoose.model('Activity', activitySchema, 'activitiesDB');

module.exports = Activity;

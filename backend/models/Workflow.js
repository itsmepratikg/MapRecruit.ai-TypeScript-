const mongoose = require('mongoose');

const workflowSchema = mongoose.Schema({
    companyID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true
    },
    campaignID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign',
        index: true
    },
    name: {
        type: String,
        required: true
    },
    nodes: {
        type: mongoose.Schema.Types.Mixed,
        default: []
    },
    edges: {
        type: mongoose.Schema.Types.Mixed,
        default: []
    },
    jobFitPreferences: {
        answerContext: {
            enable: { type: Boolean, default: true },
            weightage: { type: Number, default: 10 }
        },
        accentNeutrality: {
            enable: { type: Boolean, default: true },
            weightage: { type: Number, default: 10 }
        },
        fluencyFillers: {
            enable: { type: Boolean, default: true },
            weightage: { type: Number, default: 10 },
            fillersThresholdCount: { type: Number, default: 10 },
            pauseThresholdTime: { type: Number, default: 1000 }
        },
        fluencyResponsiveness: {
            enable: { type: Boolean, default: true },
            weightage: { type: Number, default: 10 },
            thresholdFluencyResponseStartIgnoreTime: { type: Number, default: 2 }
        },
        spokenProficiency: {
            enable: { type: Boolean, default: true },
            weightage: { type: Number, default: 10 }
        },
        pronunciation: {
            enable: { type: Boolean, default: true },
            weightage: { type: Number, default: 10 }
        }
    },
    sharedWith: {
        accessLevel: { type: String, enum: ['Global', 'Team', 'Private'], default: 'Private' },
        users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }]
    },
    // Schema Alignment: Teams structure for legacy compatibility
    teams: {
        ownerID: [{ type: String }],
        managerID: [{ type: String }],
        recruiterID: [{ type: String }]
    },
    sharedUserID: [{ type: String }],
    status: {
        type: String,
        default: 'Active'
    }
}, {
    timestamps: true
});

const Workflow = mongoose.model('Workflow', workflowSchema, 'workflowsDB');

module.exports = Workflow;

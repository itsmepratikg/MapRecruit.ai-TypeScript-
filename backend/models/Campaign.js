const mongoose = require('mongoose');

const campaignSchema = mongoose.Schema({
    companyID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true
    },
    clientID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        index: true
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        index: true
    },
    // Meta-status from root of JSON
    status: {
        type: String,
        default: 'Active'
    },
    // The core schema structure
    schemaConfig: {
        mainSchema: {
            // Core indexed fields for searching/filtering
            title: { type: String, index: true },
            ownerID: { type: [mongoose.Schema.Types.Mixed], index: true },
            status: { type: String, default: 'Active', index: true },

            // Flexible bucket for everything else
            type: mongoose.Schema.Types.Mixed
        },
        values: {
            type: mongoose.Schema.Types.Mixed // Dropdown values etc.
        },
        listSchema: {
            type: mongoose.Schema.Types.Mixed
        }
    }
}, {
    timestamps: true,
    strict: false
});

const Campaign = mongoose.model('Campaign', campaignSchema, 'campaignsDB');

module.exports = Campaign;

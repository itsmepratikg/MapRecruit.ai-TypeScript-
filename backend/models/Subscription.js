const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    provider: {
        type: String,
        enum: ['microsoft', 'google'],
        required: true
    },
    subscriptionId: {
        type: String,
        unique: true,
        required: true
    },
    resourceId: {
        type: String,
        required: true
    },
    resourcePath: {
        type: String
    },
    expirationDateTime: {
        type: Date,
        required: true
    },
    clientState: {
        type: String,
        required: true
    },
    // Microsoft specific
    deltaToken: {
        type: String
    },
    // Google specific
    pageToken: {
        type: String
    }
}, {
    timestamps: true
});

// Index to quickly find subscriptions that need renewal
subscriptionSchema.index({ expirationDateTime: 1 });

// Index for efficient lookup by user and provider
subscriptionSchema.index({ userId: 1, provider: 1 });

module.exports = mongoose.model('Subscription', subscriptionSchema);

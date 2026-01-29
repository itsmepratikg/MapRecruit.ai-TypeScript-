const mongoose = require('mongoose');

const librarySchema = mongoose.Schema({
    companyID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Company',
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['CANNED_RESPONSE', 'EMAIL_TEMPLATE', 'QUESTION', 'OTHER'],
        default: 'CANNED_RESPONSE'
    },
    content: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    metaData: {
        shortcode: String,
        usageCount: { type: Number, default: 0 },
        tags: [String],
        active: { type: Boolean, default: true }
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
    strict: false,
    collection: 'librarydb'
});

// Index for searchable fields
librarySchema.index({ name: 'text', description: 'text', 'metaData.shortcode': 'text' });

const Library = mongoose.model('Library', librarySchema, 'librarydb');

module.exports = Library;

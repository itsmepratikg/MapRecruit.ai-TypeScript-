const mongoose = require('mongoose');

const tagSchema = mongoose.Schema({
    companyID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true
    },
    name: { type: String, required: true },
    color: { type: String, default: '#000000' },
    active: { type: Boolean, default: true },
    customData: mongoose.Schema.Types.Mixed
}, {
    timestamps: true,
    strict: false,
    collection: 'Tags'
});

const Tag = mongoose.model('Tag', tagSchema, 'Tags');

module.exports = Tag;

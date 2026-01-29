const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
    companyID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true
    },
    title: { type: String, required: true },
    description: { type: String },
    active: { type: Boolean, default: true },
    customData: mongoose.Schema.Types.Mixed
}, {
    timestamps: true,
    strict: false,
    collection: 'articledb'
});

const Article = mongoose.model('Article', articleSchema, 'articledb');

module.exports = Article;

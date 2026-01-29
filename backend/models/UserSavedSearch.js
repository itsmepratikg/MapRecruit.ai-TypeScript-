const mongoose = require('mongoose');

const userSavedSearchSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    companyID: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    filters: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    collection: 'usersavedsearches'
});

module.exports = mongoose.model('UserSavedSearch', userSavedSearchSchema);

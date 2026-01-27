const mongoose = require('mongoose');

const roleSchema = mongoose.Schema({
    roleName: {
        type: String,
        required: true
    },
    companyID: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    }],
    accessibilitySettings: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
    strict: false,
    collection: 'roles'
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;

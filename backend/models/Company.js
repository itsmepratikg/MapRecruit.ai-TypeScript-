const mongoose = require('mongoose');

const companySchema = mongoose.Schema({
    status: {
        type: String,
        default: 'Active'
    },
    companyProfile: {
        type: mongoose.Schema.Types.Mixed
    },
    productSettings: {
        franchise: { type: Boolean, default: false },
        authenticationSettings: {
            sessionTimeoutInMins: { type: Number, default: 240 },
            passwordSize: { type: Number, default: 10 },
            maxPasswordSize: { type: Number, default: 30 },
            passwordExpiryInDays: { type: Number, default: 90 },
            ssoProvider: { type: String, default: '' },
            sso: { type: Boolean, default: false },
            workspaceConfiguration: {
                google: {
                    enable: { type: Boolean, default: false },
                    mode: { type: String, enum: ['multi-tenant', 'single-tenant'], default: 'multi-tenant' },
                    clientId: { type: String },
                    clientSecret: { type: String },
                    serviceAccountJson: { type: String },
                    metadata: {
                        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                        updatedOn: { type: Date },
                        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                        createdAt: { type: Date },
                        expiryAt: { type: Date }
                    }
                },
                microsoft: {
                    enable: { type: Boolean, default: false },
                    mode: { type: String, enum: ['multi-tenant', 'single-tenant'], default: 'multi-tenant' },
                    clientId: { type: String },
                    clientSecret: { type: String },
                    tenantId: { type: String },
                    metadata: {
                        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                        updatedOn: { type: Date },
                        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                        createdAt: { type: Date },
                        expiryAt: { type: Date }
                    }
                }
            }
        },
        type: mongoose.Schema.Types.Mixed
    },
    accessabilitySettings: {
        type: mongoose.Schema.Types.Mixed
    },
    franchiseID: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Franchise'
    }]
}, {
    timestamps: true,
    strict: false
});

const Company = mongoose.model('Company', companySchema, 'companiesDB');

module.exports = Company;

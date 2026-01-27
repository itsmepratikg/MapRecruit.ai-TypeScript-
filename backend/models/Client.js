const mongoose = require('mongoose');

const clientSchema = mongoose.Schema({
    clientName: {
        type: String,
        required: true
    },
    companyID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        index: true
    },
    franchiseID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Franchise',
        index: true
    },
    // Flexible schema for other fields
    // settings: {
    //     profileSearchAccessLevel: 'Client' | 'Company' | 'OwningEntity',
    //     // ... other settings
    // }
}, {
    timestamps: true,
    strict: false, // Allow other fields
    collection: 'clientsdb' // Explicitly point to the existing collection
});

const Client = mongoose.model('Client', clientSchema, 'clientsdb');

module.exports = Client;

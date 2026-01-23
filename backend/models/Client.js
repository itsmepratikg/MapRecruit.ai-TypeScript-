const mongoose = require('mongoose');

const clientSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    franchiseID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Franchise',
        index: true
    },
    // Flexible schema for other fields
}, {
    timestamps: true,
    strict: false, // Allow other fields
    collection: 'clientsdb' // Explicitly point to the existing collection
});

const Client = mongoose.model('Client', clientSchema, 'clientsdb');

module.exports = Client;

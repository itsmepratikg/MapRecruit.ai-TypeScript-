const mongoose = require('mongoose');

const clientSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    // Flexible schema for other fields
}, {
    timestamps: true,
    strict: false, // Allow other fields
    collection: 'clientsdb' // Explicitly point to the existing collection
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;

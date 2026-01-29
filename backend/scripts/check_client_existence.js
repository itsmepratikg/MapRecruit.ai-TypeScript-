const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const Client = require('../models/Client'); // Assuming Client model exists
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/maprecruit_v5";

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('Connected to DB');

        // 1. Get User's ClientID
        const user = await User.findOne({ email: 'pratik.gaurav@maprecruit.ai' });
        if (!user) { console.log('User not found'); process.exit(0); }

        // Handle array or single
        const clientID = Array.isArray(user.clientID) ? user.clientID[0] : user.clientID;
        console.log(`User Client ID: ${clientID}`);

        // 2. Check if this Client exists
        // Note: Model might be 'Client' or 'Clients' or 'Account'? Need to be sure.
        // Try generic collection query if unsure of model name
        const clientDoc = await mongoose.connection.db.collection('clients').findOne({ _id: clientID }); // standard collection name usually 'clients'

        if (clientDoc) {
            console.log('Client FOUND in DB:');
            console.log('Name:', clientDoc.clientName || clientDoc.name);
            console.log('Type:', clientDoc.clientType || clientDoc.type);
        } else {
            console.log('Client NOT FOUND in DB!');

            // List all clients to see what we have
            const allClients = await mongoose.connection.db.collection('clients').find({}).limit(5).toArray();
            console.log('Available Clients (Top 5):');
            allClients.forEach(c => console.log(`- ID: ${c._id}, Name: ${c.clientName || c.name}`));
        }

        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

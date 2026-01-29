const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/maprecruit_v5";

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('Connected to DB');

        // 1. Get User
        const user = await User.findOne({ email: 'pratik.gaurav@maprecruit.ai' });
        if (!user) { console.warn('User not found'); process.exit(0); }

        const companyID = user.companyID;
        const clientID = user.clientID;

        console.log(`User: ${user.email}`);
        console.log(`Company ID: ${companyID}`);
        console.log(`Client ID: ${clientID}`);

        // 2. Update Company Document
        // Note: The controller uses 'companiesDB' collection
        const companyResult = await mongoose.connection.db.collection('companiesDB').updateOne(
            { _id: companyID },
            { $addToSet: { clients: clientID } }
        );
        console.log(`Updated Company collection 'companiesDB'. Modified: ${companyResult.modifiedCount}`);

        // 3. Update User's assigned clients just in case
        user.clients = [clientID];
        await user.save();
        console.log(`Updated User's assigned clients list.`);

        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

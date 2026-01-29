const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const User = require('../models/User');
const Campaign = require('../models/Campaign');
const Candidate = require('../models/Candidate');
const Interview = require('../models/Interview');

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/maprecruit_v5";

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('Connected to DB');

        // 1. Find the target User
        // Modify this if you know the exact email, otherwise we pick the first one which is usually the dev user
        const user = await User.findOne({ email: 'pratik.gaurav@maprecruit.ai' }); // or any other criteria

        if (!user) {
            console.error('User not found! Cannot proceed.');
            process.exit(1);
        }

        let { companyID, clientID, _id: userID } = user;

        // Fix: Handle array clientID
        if (Array.isArray(clientID)) {
            console.log('User has multiple clients, picking the first one:', clientID[0]);
            clientID = clientID[0];
        }

        console.log(`Target User: ${user.email}`);
        console.log(`Updating all seeded data to CompanyID: ${companyID}, ClientID: ${clientID}, UserID: ${userID}`);

        // 2. Update Campaigns
        const campResult = await Campaign.updateMany(
            {},
            {
                $set: {
                    companyID: companyID,
                    clientID: clientID,
                    userID: userID,
                    // Also update team arrays to include this user so they show up in filtered lists
                    "teams.ownerID": [userID],
                    "teams.managerID": [userID],
                    "teams.recruiterID": [userID]
                }
            }
        );
        console.log(`Updated ${campResult.modifiedCount} Campaigns.`);

        // 3. Update Interviews (important for linking)
        const intResult = await mongoose.connection.db.collection('interviewsdb').updateMany(
            {},
            {
                $set: {
                    companyID: companyID,
                    clientID: clientID,
                    userID: userID
                }
            }
        );
        console.log(`Updated ${intResult.modifiedCount} Interviews.`);

        // 4. Update Profiles (Candidates) if needed
        // Assuming candidates are shared across company or need specific scoping?
        // Usually candidates are less strict on companyID unless multi-tenant isolated.
        // Let's safe update them too if they have the field.
        const candResult = await Candidate.updateMany(
            {},
            {
                $set: {
                    companyID: companyID
                }
            }
        );
        console.log(`Updated ${candResult.modifiedCount} Candidates.`);

        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const User = require('../models/User');
const Campaign = require('../models/Campaign');
const Candidate = require('../models/Candidate');
const Client = require('../models/Client'); // Assuming this model exists

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/maprecruit_v5";

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('Connected to DB');

        // 1. Create a Seed Client
        const seedClientData = {
            clientName: "MapRecruit Global",
            clientType: "Client", // Branch, Vendor, etc.
            status: "Active",
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Upsert to avoid duplicates if re-run, but since collection is empty, create is fine.
        // We'll use findOneAndUpdate with upsert
        const clientDoc = await Client.findOneAndUpdate(
            { clientName: "MapRecruit Global" },
            { $set: seedClientData },
            { upsert: true, new: true }
        );

        console.log(`Ensured Client Exists: ${clientDoc.clientName} (ID: ${clientDoc._id})`);
        const newClientID = clientDoc._id;

        // 2. Find the User
        const user = await User.findOne({ email: 'pratik.gaurav@maprecruit.ai' });
        if (!user) { console.error('User not found'); process.exit(1); }

        const { companyID, _id: userID } = user;

        // 3. Update User's ClientID (make it an ARRAY as some parts of code expect it, or match schema)
        // Check User Schema if possible, but usually it's [ObjectId] or ObjectId. 
        // The previous error log showed "valueType: 'Array'" for clientID, implying schema might expect array?
        // "Cast to ObjectId failed for value ... at path clientID" -> Schema expects ObjectId, but got Array? 
        // RE-READ ERROR: "Cast to ObjectId failed for value [...] at path clientID" -> Value WAS array, failed casting to ObjectId.
        // So Schema expects SINGLE ObjectId.

        user.clientID = newClientID;
        await user.save();
        console.log(`Updated User ${user.email} with ClientID: ${newClientID}`);

        // 4. Update Campaigns
        const campResult = await Campaign.updateMany(
            {},
            {
                $set: {
                    companyID: companyID,
                    clientID: newClientID,
                    userID: userID,
                    // Ensure teams are valid
                    "teams.ownerID": [userID],
                    "teams.managerID": [userID],
                    "teams.recruiterID": [userID]
                }
            }
        );
        console.log(`Updated ${campResult.modifiedCount} Campaigns.`);

        // 5. Update Interviews
        const intResult = await mongoose.connection.db.collection('interviewsdb').updateMany(
            {},
            {
                $set: {
                    companyID: companyID,
                    clientID: newClientID,
                    userID: userID
                }
            }
        );
        console.log(`Updated ${intResult.modifiedCount} Interviews.`);

        // 6. Update Candidates
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

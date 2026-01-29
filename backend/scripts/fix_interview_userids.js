const mongoose = require('mongoose');
const Interview = require('../models/Interview');
const Campaign = require('../models/Campaign');
require('dotenv').config();

const fixInterviewUserIDs = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        // Find interviews with missing userID
        const interviews = await Interview.find({
            $or: [
                { userID: { $exists: false } },
                { userID: null }
            ]
        });

        console.log(`Found ${interviews.length} interviews with missing userID.`);

        let fixedCount = 0;
        let missedCount = 0;

        for (const interview of interviews) {
            // Find linked campaign
            const campaign = await Campaign.findById(interview.campaignID);

            if (campaign && campaign.userID) {
                // Update interview
                await Interview.updateOne(
                    { _id: interview._id },
                    { $set: { userID: campaign.userID } }
                );
                fixedCount++;
                if (fixedCount % 50 === 0) process.stdout.write('.');
            } else {
                console.warn(`Could not fix Interview ${interview._id}: Campaign or Campaign UserID not found.`);
                missedCount++;
            }
        }

        console.log(`\nMigration Complete.`);
        console.log(`Fixed: ${fixedCount} interviews.`);
        console.log(`Skipped (Missing Campaign Data): ${missedCount}`);

    } catch (err) {
        console.error(err);
    } finally {
        mongoose.connection.close();
    }
};

fixInterviewUserIDs();

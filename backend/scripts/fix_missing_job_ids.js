const mongoose = require('mongoose');
const Campaign = require('../models/Campaign');
require('dotenv').config();

const fixMissingJobIDs = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        // Find campaigns without migrationMeta.jobID
        const campaigns = await Campaign.find({
            $or: [
                { "migrationMeta.jobID": { $exists: false } },
                { "migrationMeta.jobID": null },
                { "migrationMeta.jobID": "" }
            ]
        }).sort({ createdAt: 1 }); // Sort by creation to assign IDs sequentially

        console.log(`Found ${campaigns.length} campaigns missing Job ID.`);

        let startId = 2000;
        let fixedCount = 0;

        for (const campaign of campaigns) {
            // Generate ID like "002001"
            const newJobId = String(startId + fixedCount).padStart(6, '0');

            // Ensure migrationMeta object exists
            const update = {
                $set: {
                    "migrationMeta.jobID": newJobId
                }
            };

            await Campaign.updateOne(
                { _id: campaign._id },
                update
            );

            console.log(`Updated Campaign: ${campaign.title || campaign._id} -> Job ID: ${newJobId}`);
            fixedCount++;
        }

        console.log(`\nJob ID Fix Complete.`);
        console.log(`Fixed: ${fixedCount} campaigns.`);

    } catch (err) {
        console.error(err);
    } finally {
        mongoose.connection.close();
    }
};

fixMissingJobIDs();

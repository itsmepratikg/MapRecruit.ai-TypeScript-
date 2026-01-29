const mongoose = require('mongoose');
const Campaign = require('../models/Campaign');
require('dotenv').config();

const revertJobIDs = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        // Find campaigns with migrationMeta.jobID matching the generated pattern (002000 onwards)
        // Or simply remove it for ALL campaigns where it looks like a generated ID, to be safe.
        // Since the previous script generated IDs starting with "002", we can target those.
        const regex = /^002\d{3}$/;

        const campaigns = await Campaign.find({
            "migrationMeta.jobID": { $regex: regex }
        });

        console.log(`Found ${campaigns.length} campaigns with generated Job IDs.`);

        let revertedCount = 0;

        for (const campaign of campaigns) {
            await Campaign.updateOne(
                { _id: campaign._id },
                { $unset: { "migrationMeta.jobID": "" } }
            );
            console.log(`Reverted Campaign: ${campaign.title || campaign._id} (Removed Job ID: ${campaign.migrationMeta.jobID})`);
            revertedCount++;
        }

        console.log(`\nJob ID Revert Complete.`);
        console.log(`Reverted: ${revertedCount} campaigns.`);

    } catch (err) {
        console.error(err);
    } finally {
        mongoose.connection.close();
    }
};

revertJobIDs();

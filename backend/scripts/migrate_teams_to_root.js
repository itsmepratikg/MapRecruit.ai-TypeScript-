const mongoose = require('mongoose');
const Campaign = require('../models/Campaign');
require('dotenv').config();

const migrateTeamsToRoot = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const campaigns = await Campaign.find({
            "teams": { $exists: true }
        });

        console.log(`Found ${campaigns.length} campaigns with 'teams' structure.`);

        let count = 0;
        for (const camp of campaigns) {
            const updates = {};
            let hasUpdate = false;

            if (camp.teams && camp.teams.ownerID && camp.teams.ownerID.length > 0) {
                updates.ownerID = camp.teams.ownerID;
                hasUpdate = true;
            }
            if (camp.teams && camp.teams.managerID && camp.teams.managerID.length > 0) {
                updates.managerID = camp.teams.managerID;
                hasUpdate = true;
            }
            if (camp.teams && camp.teams.recruiterID && camp.teams.recruiterID.length > 0) {
                updates.recruiterID = camp.teams.recruiterID;
                hasUpdate = true;
            }

            if (hasUpdate) {
                // Set new fields AND unset the old 'teams' object
                await Campaign.updateOne(
                    { _id: camp._id },
                    {
                        $set: updates,
                        $unset: { teams: "" }
                    }
                );
                console.log(`Migrated Campaign: ${camp.title || camp._id}`);
                count++;
            } else {
                // Even if empty arrays, we might want to unset teams if it exists
                await Campaign.updateOne(
                    { _id: camp._id },
                    { $unset: { teams: "" } }
                );
            }
        }

        console.log(`Migration Complete. Updated ${count} campaigns.`);

    } catch (err) {
        console.error(err);
    } finally {
        mongoose.connection.close();
    }
};

migrateTeamsToRoot();

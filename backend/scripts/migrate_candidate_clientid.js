const mongoose = require('mongoose');
const Candidate = require('../models/Candidate');
require('dotenv').config();

const migrateCandidateClientIDs = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const candidates = await Candidate.find({});
        console.log(`Found ${candidates.length} candidates to process.`);

        let modifiedCount = 0;
        let trashCount = 0;

        for (const candidate of candidates) {
            let newClientID = null;
            let needsUpdate = false;

            // Current value
            const current = candidate.clientID;

            if (Array.isArray(current)) {
                if (current.length > 0) {
                    // "Last one wins" logic
                    const lastId = current[current.length - 1];
                    try {
                        newClientID = new mongoose.Types.ObjectId(lastId);
                    } catch (e) {
                        console.warn(`Invalid ObjectId in array for Candidate ${candidate._id}: ${lastId}`);
                        continue;
                    }
                    needsUpdate = true;
                } else {
                    // Empty array -> null
                    newClientID = null;
                    needsUpdate = true;
                    trashCount++;
                }
            } else if (typeof current === 'string') {
                // Already a string, ensure it's ObjectId
                try {
                    newClientID = new mongoose.Types.ObjectId(current);
                    // If it was stored as string, we update it to strict ObjectId type
                    needsUpdate = true;
                } catch (e) {
                    console.warn(`Invalid ObjectId string for Candidate ${candidate._id}: ${current}`);
                    continue;
                }
            } else if (current instanceof mongoose.Types.ObjectId) {
                // Already ObjectId, do nothing
                continue;
            } else {
                // Undefined or null
                newClientID = null;
                // If it wasn't null before (e.g. undefined), we might want to set it explicit null? 
                // Schema allows null if not required. 
            }

            if (needsUpdate) {
                // Bypass schema strictness for the update if needed, but we are updating to conform to NEW schema
                await Candidate.updateOne(
                    { _id: candidate._id },
                    { $set: { clientID: newClientID } }
                );
                modifiedCount++;
                if (modifiedCount % 50 === 0) console.log(`Processed ${modifiedCount}...`);
            }
        }

        console.log("Migration Complete.");
        console.log(`Updated: ${modifiedCount} candidates.`);
        console.log(`Orphaned (Empty Array): ${trashCount}`);

    } catch (err) {
        console.error(err);
    } finally {
        mongoose.connection.close();
    }
};

migrateCandidateClientIDs();

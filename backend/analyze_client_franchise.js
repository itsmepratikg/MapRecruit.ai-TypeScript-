const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { ObjectId } = require('mongodb');
const fs = require('fs');

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
const log = (msg) => console.error(msg);

const analyzeClientFranchise = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        const db = mongoose.connection.db;

        const clientID = "6112806bc9147f673d28c6ec";
        const client = await db.collection('clientsdb').findOne({ _id: new ObjectId(clientID) });

        if (!client) {
            log('Client not found!');
            process.exit(1);
        }

        log(`Dump for Client ID: ${client._id}`);
        fs.writeFileSync('client_full_dump.json', JSON.stringify(client, null, 2));
        log('Full client document written to client_full_dump.json');

        // Check for franchiseID
        let franchiseID = client.franchiseID || client.franchise;
        if (franchiseID) {
            log(`Found Franchise reference: ${JSON.stringify(franchiseID)}`);

            // If it's an array, pick the first one for tracing
            const targetFranchiseID = Array.isArray(franchiseID) ? franchiseID[0] : franchiseID;

            if (targetFranchiseID) {
                const franchise = await db.collection('franchises').findOne({ _id: new ObjectId(targetFranchiseID) });
                if (franchise) {
                    log(`SUCCESS: Found Franchise: ${franchise.name || franchise.firstName} (${franchise._id})`);
                    log(`Franchise Company Link: ${franchise.companyID}`);
                    fs.writeFileSync('franchise_full_dump.json', JSON.stringify(franchise, null, 2));
                } else {
                    log(`Franchise document NOT found for ID: ${targetFranchiseID}`);
                }
            }
        } else {
            log('NO franchiseID found in client document.');
        }

        process.exit(0);
    } catch (e) {
        log(e.message);
        process.exit(1);
    }
};

analyzeClientFranchise();

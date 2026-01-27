const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { ObjectId } = require('mongodb');

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

const migrate = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        const db = mongoose.connection.db;
        console.log('Connected to Database');

        // 1. Migrate Users
        const users = await db.collection('usersDB').find({}).toArray();
        for (const user of users) {
            const updates = {};
            const unset = {};

            // Rename clients to clientID and convert to ObjectId
            if (user.clients) {
                updates.clientID = user.clients.map(id => new ObjectId(id));
                unset.clients = "";
            }

            // Standardize other IDs to ObjectId
            if (user.activeClientID && typeof user.activeClientID === 'string') {
                updates.activeClientID = new ObjectId(user.activeClientID);
            }
            if (user.companyID && typeof user.companyID === 'string') {
                updates.companyID = new ObjectId(user.companyID);
            }
            if (user.currentCompanyID && typeof user.currentCompanyID === 'string') {
                updates.currentCompanyID = new ObjectId(user.currentCompanyID);
            }
            if (user.roleID && typeof user.roleID === 'string') {
                updates.roleID = new ObjectId(user.roleID);
            }

            // Initialize AccessibleCompanyID if missing
            if (!user.AccessibleCompanyID && user.companyID) {
                updates.AccessibleCompanyID = [updates.companyID || new ObjectId(user.companyID)];
            }

            if (Object.keys(updates).length > 0) {
                const updateDoc = { $set: updates };
                if (Object.keys(unset).length > 0) updateDoc.$unset = unset;

                await db.collection('usersDB').updateOne({ _id: user._id }, updateDoc);
                console.log(`Updated User: ${user._id}`);
            }
        }

        // 2. Migrate Client 6112806bc9147f673d28c6ec (Verify companyID type)
        const client = await db.collection('clientsdb').findOne({ _id: new ObjectId("6112806bc9147f673d28c6ec") });
        if (client && typeof client.companyID === 'string') {
            await db.collection('clientsdb').updateOne(
                { _id: client._id },
                { $set: { companyID: new ObjectId(client.companyID) } }
            );
            console.log(`Updated Client companyID to ObjectId: ${client._id}`);
        }

        // 3. Migrate Franchise 697231f7fc7ba4d85eadd359
        const franchiseID = "697231f7fc7ba4d85eadd359";
        const franchise = await db.collection('franchises').findOne({ _id: new ObjectId(franchiseID) });
        if (franchise) {
            await db.collection('franchises').updateOne(
                { _id: franchise._id },
                {
                    $set: {
                        companyID: new ObjectId("6112806bc9147f673d28c6eb"),
                        active: true,
                        deleted: false,
                        description: franchise.franchiseName,
                        franchiseCode: "F001" // Default code if missing
                    }
                }
            );
            console.log(`Updated Franchise: ${franchise._id}`);
        }

        console.log('Migration Completed Successfully');
        process.exit(0);
    } catch (e) {
        console.error('Migration Failed:', e.message);
        process.exit(1);
    }
};

migrate();

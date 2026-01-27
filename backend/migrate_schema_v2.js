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

        // IDs from User Request
        const SPHERION_COMPANY_ID = new ObjectId("61814138c98444344034ca8c");
        const TRC_COMPANY_ID = new ObjectId("6112806bc9147f673d28c6eb");

        const SPHERION_CLIENT_ID = new ObjectId("693c61cf97a010153dc4d4b2");
        const TRC_CLIENT_ID = new ObjectId("6112806bc9147f673d28c6ec");

        const SPHERION_FRANCHISE_ID = new ObjectId("693c5f4897a010153dc4d4af");
        const ROLE_ID = new ObjectId("697231f6fc7ba4d85eadd350");
        const USER_ID = new ObjectId("696a1d32e8ceec1d15098204");

        // 1. Ensure Companies Exist
        console.log('--- Companies ---');
        await db.collection('companies').updateOne(
            { _id: SPHERION_COMPANY_ID },
            {
                $set: {
                    "companyProfile.companyName": "Spherion Staffing LLC",
                    "productSettings.franchise": true
                }
            },
            { upsert: true }
        );
        await db.collection('companies').updateOne(
            { _id: TRC_COMPANY_ID },
            {
                $set: {
                    "companyProfile.companyName": "TRC Talent Solutions",
                    "productSettings.franchise": false
                }
            },
            { upsert: true }
        );

        // 2. Ensure Clients Exist
        console.log('--- Clients ---');
        await db.collection('clientsdb').updateOne(
            { _id: SPHERION_CLIENT_ID },
            {
                $set: {
                    clientName: "75859 - SSL GSOP Best Buy OP",
                    companyID: SPHERION_COMPANY_ID,
                    franchiseID: [SPHERION_FRANCHISE_ID],
                    enable: true
                }
            },
            { upsert: true }
        );
        await db.collection('clientsdb').updateOne(
            { _id: TRC_CLIENT_ID },
            {
                $set: {
                    clientName: "TRC Talent Solutions",
                    companyID: TRC_COMPANY_ID,
                    franchiseID: null,
                    enable: true
                }
            },
            { upsert: true }
        );

        // 3. Ensure Spherion Franchise Exists
        console.log('--- Franchises ---');
        await db.collection('franchises').updateOne(
            { _id: SPHERION_FRANCHISE_ID },
            {
                $set: {
                    franchiseName: "86559 - Pentenburg OH District",
                    companyID: SPHERION_COMPANY_ID,
                    clientIDs: [SPHERION_CLIENT_ID],
                    active: true,
                    deleted: false
                }
            },
            { upsert: true }
        );

        // 4. Update/Create Role (Product Admin)
        console.log('--- Roles ---');
        await db.collection('roles').updateOne(
            { _id: ROLE_ID },
            {
                $set: {
                    roleName: "Product Admin",
                    companyID: [SPHERION_COMPANY_ID, TRC_COMPANY_ID] // Access to both in Admin role
                }
            },
            { upsert: true }
        );

        // 5. Update User (Pratik)
        console.log('--- User ---');
        await db.collection('usersDB').updateOne(
            { _id: USER_ID },
            {
                $set: {
                    email: "pratik.gaurav@maprecruit.ai",
                    role: "Product Admin",
                    roleID: ROLE_ID,
                    companyID: TRC_COMPANY_ID, // Default active company
                    AccessibleCompanyID: [SPHERION_COMPANY_ID, TRC_COMPANY_ID],
                    clientID: [SPHERION_CLIENT_ID, TRC_CLIENT_ID],
                    activeClientID: TRC_CLIENT_ID // Default active client
                }
            }
        );

        console.log('Migration Completed Successfully');
        process.exit(0);
    } catch (e) {
        console.error('Migration Failed:', e.message);
        process.exit(1);
    }
};

migrate();

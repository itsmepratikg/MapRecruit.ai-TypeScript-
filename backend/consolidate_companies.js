const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { ObjectId } = require('mongodb');

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

const consolidate = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        const db = mongoose.connection.db;
        console.log('Connected to Database');

        // IDs from our work
        const SPHERION_COMPANY_ID = new ObjectId("61814138c98444344034ca8c");
        const TRC_COMPANY_ID = new ObjectId("6112806bc9147f673d28c6eb");

        // Update companiesDB with the franchise flag
        console.log('Updating companiesDB...');
        await db.collection('companiesDB').updateOne(
            { _id: SPHERION_COMPANY_ID },
            { $set: { "productSettings.franchise": true } }
        );
        await db.collection('companiesDB').updateOne(
            { _id: TRC_COMPANY_ID },
            { $set: { "productSettings.franchise": false } }
        );

        // Remove the redundant 'companies' collection
        console.log('Dropping redundant "companies" collection...');
        try {
            await db.collection('companies').drop();
        } catch (e) {
            console.log('"companies" collection already dropped or not found.');
        }

        console.log('Consolidation Successful');
        process.exit(0);
    } catch (e) {
        console.error('Consolidation Failed:', e.message);
        process.exit(1);
    }
};

consolidate();

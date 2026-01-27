const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { ObjectId } = require('mongodb');

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
const log = (msg) => console.error(msg);

const run = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        const db = mongoose.connection.db;

        // List collections to be sure
        const cols = await db.listCollections().toArray();
        const colNames = cols.map(c => c.name);
        // log('Collections: ' + colNames.join(', '));

        const companyID = "6112806bc9147f673d28c6eb";
        const clientID = "6112806bc9147f673d28c6ec";

        log(`\n--- CHECKING NAMES ---`);

        // COMPANY
        const companyCol = colNames.find(c => c.toLowerCase() === 'companies') || 'companies';
        log(`Checking distinct collection: ${companyCol} for Company ${companyID}`);
        const company = await db.collection(companyCol).findOne({ _id: new ObjectId(companyID) });
        if (company) log(`✅ Company Found: Name="${company.name}"`);
        else log(`❌ Company NOT FOUND`);

        // CLIENT
        const clientCol = colNames.find(c => c.toLowerCase() === 'clients') || 'clients';
        log(`Checking distinct collection: ${clientCol} for Client ${clientID}`);
        const client = await db.collection(clientCol).findOne({ _id: new ObjectId(clientID) });
        if (client) log(`✅ Client Found: Name="${client.name}"`);
        else log(`❌ Client NOT FOUND`);

        log(`----------------------`);
        process.exit(0);
    } catch (e) {
        log(e.message);
        process.exit(1);
    }
};

run();

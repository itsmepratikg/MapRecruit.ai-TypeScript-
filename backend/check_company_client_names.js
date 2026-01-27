const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { ObjectId } = require('mongodb');

// Load env vars
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

// Use console.error for reliably capturing output
const log = (msg) => console.error(msg);

const checkNames = async () => {
    try {
        log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);

        const db = mongoose.connection.db;

        const companyID = "6112806bc9147f673d28c6eb";
        const clientID = "6112806bc9147f673d28c6ec";

        log(`\n--- DB LOOKUP REPORT ---`);

        // 1. QUERY COMPANY
        log(`\n1. Searching Companies Collection for ID: ${companyID}`);
        let company = await db.collection('companies').findOne({ _id: new ObjectId(companyID) });
        if (!company) {
            log('   Not found in "companies", checking "Company"...');
            company = await db.collection('Company').findOne({ _id: new ObjectId(companyID) });
        }

        if (company) {
            log(`   ✅ FOUND Document!`);
            log(`   Name: "${company.name}"`);
            log(`   _id: ${company._id}`);
        } else {
            log(`   ❌ NOT FOUND in any company collection.`);
        }

        // 2. QUERY CLIENT
        log(`\n2. Searching Clients Collection for ID: ${clientID}`);
        let client = await db.collection('clients').findOne({ _id: new ObjectId(clientID) });
        if (!client) {
            log('   Not found in "clients", checking "Client"...');
            client = await db.collection('Client').findOne({ _id: new ObjectId(clientID) });
        }

        if (client) {
            log(`   ✅ FOUND Document!`);
            log(`   Name: "${client.name}"`);
            log(`   _id: ${client._id}`);
            log(`   Linked Company ID: ${client.companyId}`);
        } else {
            log(`   ❌ NOT FOUND in any client collection.`);
        }

        log(`\n------------------------`);
        process.exit(0);

    } catch (err) {
        log('Error: ' + err.message);
        process.exit(1);
    }
};

checkNames();

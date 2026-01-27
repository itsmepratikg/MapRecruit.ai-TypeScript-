const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { ObjectId } = require('mongodb');
const fs = require('fs');

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
const log = (msg) => console.error(msg);

const analyzeCompanyFull = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        const db = mongoose.connection.db;

        const companyID = "6112806bc9147f673d28c6eb";

        // Try finding in companiesDB
        let company = await db.collection('companiesDB').findOne({ _id: new ObjectId(companyID) });

        if (!company) {
            log('Company not found in companiesDB, checking companies...');
            company = await db.collection('companies').findOne({ _id: new ObjectId(companyID) });
        }

        if (!company) {
            log('Company not found!');
            process.exit(1);
        }

        log(`Dump for Company ID: ${company._id}`);

        // Write full document to file for manual inspection
        fs.writeFileSync('company_full_dump.json', JSON.stringify(company, null, 2));
        log('Full document written to company_full_dump.json');

        // Log top-level keys
        log('Top-Level Keys: ' + Object.keys(company).join(', '));

        // Check for companyProfile
        if (company.companyProfile) {
            log('Found companyProfile!');
            if (Array.isArray(company.companyProfile)) {
                log('companyProfile is an ARRAY. First item keys: ' + Object.keys(company.companyProfile[0] || {}).join(', '));
            } else {
                log('companyProfile is NOT an array: ' + typeof company.companyProfile);
            }
        } else {
            log('companyProfile NOT found.');
        }

        process.exit(0);
    } catch (e) {
        log(e.message);
        process.exit(1);
    }
};

analyzeCompanyFull();

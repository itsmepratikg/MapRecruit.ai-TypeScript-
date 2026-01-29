const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const Campaign = require('../models/Campaign');

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/maprecruit_v5";

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('Connected to DB');

        // 1. Fetch ALL campaigns raw
        const allCampaigns = await Campaign.find({}).limit(5).lean();
        console.log(`Total campaigns found: ${allCampaigns.length}`);
        if (allCampaigns.length > 0) {
            console.log('Sample Campaign Structure:');
            console.log('ID:', allCampaigns[0]._id);
            console.log('CompanyID:', allCampaigns[0].companyID);
            console.log('Status:', allCampaigns[0].status);
            console.log('SchemaConfig Status:', allCampaigns[0].schemaConfig?.mainSchema?.status);
            console.log('Title:', allCampaigns[0].title);
        }

        // 2. Simulate User Query (replace with IDs from your app log if you have them, otherwise general)
        // We'll check unique companyIDs
        const distinctCompanyIDs = await Campaign.distinct('companyID');
        console.log('Distinct CompanyIDs in DB:', distinctCompanyIDs);

        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

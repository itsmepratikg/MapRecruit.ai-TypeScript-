const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const Campaign = require('../models/Campaign');

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/maprecruit_v5";

mongoose.connect(MONGO_URI)
    .then(async () => {
        // 1. List all campaigns and their status
        const allCamps = await Campaign.find({}, { status: 1, title: 1 });
        console.log(`Total Campaigns found: ${allCamps.length}`);
        allCamps.forEach(c => console.log(`- ${c.title || 'Untitled'}: ${c.status}`));

        // 2. Force ALL to 'Active' for testing
        const result = await Campaign.updateMany({}, { $set: { status: 'Active' } });
        console.log(`Force updated ${result.modifiedCount} campaigns to 'Active'.`);

        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

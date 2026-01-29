const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/maprecruit_v5";

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('Connected to DB');

        // Check Campaigns
        const campaignCount = await mongoose.connection.db.collection('campaignsDB').countDocuments();
        console.log(`Campaigns Count: ${campaignCount}`);

        // Check Interviews
        const interviewCount = await mongoose.connection.db.collection('interviewsdb').countDocuments();
        console.log(`Interviews Count: ${interviewCount}`);

        // Check Candidates
        const candidateCount = await mongoose.connection.db.collection('candidates').countDocuments();
        console.log(`Candidates Count: ${candidateCount}`);

        // Check if we have any link
        if (campaignCount > 0 && interviewCount > 0) {
            const sampleInterview = await mongoose.connection.db.collection('interviewsdb').findOne({});
            console.log('Sample Interview:', JSON.stringify(sampleInterview, null, 2));
        }

        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

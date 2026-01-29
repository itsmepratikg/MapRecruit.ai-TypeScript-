const mongoose = require('mongoose');
const Campaign = require('./models/Campaign');
const fs = require('fs');
require('dotenv').config();

const analyzeAllCampaigns = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const campaigns = await Campaign.find({}).lean();
        console.log(`Found ${campaigns.length} campaigns`);

        let markdownTable = "### Current Campaign Connections Data\n\n";
        markdownTable += "| Campaign _id | Title | Company ID | Client ID | User ID |\n";
        markdownTable += "| :--- | :--- | :--- | :--- | :--- |\n";

        campaigns.forEach(c => {
            const companyID = c.companyID ? c.companyID.toString() : 'MISSING';
            const clientID = c.clientID ? c.clientID.toString() : 'MISSING';
            const userID = c.userID ? c.userID.toString() : 'MISSING';
            markdownTable += `| ${c._id} | ${c.title || 'No Title'} | ${companyID} | ${clientID} | ${userID} |\n`;
        });

        fs.writeFileSync('campaign_data_table.md', markdownTable);
        console.log("Table written to campaign_data_table.md");

    } catch (err) {
        console.error(err);
    } finally {
        mongoose.connection.close();
    }
};

analyzeAllCampaigns();

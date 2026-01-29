const mongoose = require('mongoose');
const Campaign = require('./models/Campaign');
const Client = require('./models/Client');
const Company = require('./models/Company');
const User = require('./models/User');
const fs = require('fs');
require('dotenv').config();

const analyzeCampaign = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        // Fetch 1 latest campaign
        const campaign = await Campaign.findOne().sort({ createdAt: -1 }).lean();

        if (!campaign) {
            console.log("No campaigns found!");
            return;
        }

        let report = "=== CAMPAIGN ANALYSIS ===\n";
        report += `Campaign ID: ${campaign._id}\n`;
        report += `Title: ${campaign.title}\n`;
        report += `Raw companyID: ${campaign.companyID} (${typeof campaign.companyID})\n`;
        report += `Raw clientID: ${campaign.clientID} (${typeof campaign.clientID})\n`;
        report += `Raw userID: ${campaign.userID} (${typeof campaign.userID})\n`;

        // Check Relations
        const company = await Company.findById(campaign.companyID);
        const client = await Client.findById(campaign.clientID);
        const user = await User.findById(campaign.userID);

        report += "\n--- LINKED ENTITIES ---\n";
        report += `Company: ${company ? company._id + ' (Found)' : 'MISSING'}\n`;
        if (company) report += `   > Status: ${company.status}\n`;

        report += `Client: ${client ? client._id + ' (' + client.clientName + ')' : 'MISSING'}\n`;
        if (client) report += `   > Parent Company: ${client.companyID}\n`;

        report += `User: ${user ? user._id + ' (' + user.email + ')' : 'MISSING'}\n`;
        if (user) report += `   > Home Company: ${user.companyID}\n`;

        report += "\n=== FULL CAMPAIGN DUMP ===\n";
        report += JSON.stringify(campaign, null, 2);

        fs.writeFileSync('analysis_report.txt', report);
        console.log("Report written to analysis_report.txt");

    } catch (err) {
        console.error(err);
    } finally {
        mongoose.connection.close();
    }
};

analyzeCampaign();

const mongoose = require('mongoose');
const Client = require('../models/Client');
const Campaign = require('../models/Campaign');
require('dotenv').config();

const fixMissingClientCompanyIDs = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        // 1. Find Clients with missing companyID
        const brokenClients = await Client.find({
            $or: [
                { companyID: { $exists: false } },
                { companyID: null }
            ]
        });

        console.log(`Found ${brokenClients.length} clients with missing companyID.`);

        for (const client of brokenClients) {
            console.log(`Processing Client: ${client._id} (${client.clientName})`);

            // 2. Find a Campaign linked to this Client
            const campaign = await Campaign.findOne({ clientID: client._id }).select('companyID');

            if (campaign && campaign.companyID) {
                console.log(`   > Found linked Campaign: ${campaign._id}`);
                console.log(`   > Inferring CompanyID: ${campaign.companyID}`);

                // 3. Update Client
                await Client.updateOne(
                    { _id: client._id },
                    { $set: { companyID: campaign.companyID } }
                );
                console.log(`   > FIXED: Client updated.`);
            } else {
                console.log(`   > WARNING: No linked campaigns found to infer CompanyID.`);
            }
        }

    } catch (err) {
        console.error(err);
    } finally {
        mongoose.connection.close();
    }
};

fixMissingClientCompanyIDs();

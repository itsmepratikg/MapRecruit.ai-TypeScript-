const mongoose = require('mongoose');
const User = require('./models/User');
const Client = require('./models/Client');
const Campaign = require('./models/Campaign');
require('dotenv').config();

const debugAccess = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const userId = "696a1d32e8ceec1d15098204"; // Pratik's User ID
        const targetCompanyId = "6112806bc9147f673d28c6eb"; // Active Company ID
        const leakyClientId = "697a4077891fda1733d14a31"; // The 'Bad' Client

        console.log(`\n=== STEP 1: Inspect User Access ===`);
        const user = await User.findById(userId);
        console.log(`User ClientIDs: ${JSON.stringify(user.clientID)}`);

        console.log(`\n=== STEP 2: Inspect Bad Client ===`);
        const badClient = await Client.findById(leakyClientId);
        console.log(`Bad Client ID: ${badClient._id}`);
        console.log(`Bad Client CompanyID: ${badClient.companyID} (Type: ${typeof badClient.companyID})`);

        console.log(`\n=== STEP 3: Simulate getAllowedClientIds Logic ===`);
        const query = {
            _id: { $in: user.clientID },
            companyID: targetCompanyId
        };
        console.log(`Query: ${JSON.stringify(query)}`);

        const validClients = await Client.find(query).select('_id');
        console.log(`Valid Clients Found: ${validClients.length}`);
        validClients.forEach(c => console.log(` - ${c._id}`));

        const isLeakyClientIncluded = validClients.some(c => c._id.toString() === leakyClientId);
        console.log(`\nIs Leaky Client Included? ${isLeakyClientIncluded ? "YES (BUG CONFIRMED)" : "NO (Logic is sound)"}`);

        if (!isLeakyClientIncluded) {
            console.log("\n=== STEP 4: Check Campaign Fetching Logic ===");
            // If client logic is sound, maybe campaign fetching is bypassing it?
            // "const campaigns = await Campaign.find({ companyID: companyID, clientID: { $in: allowedClients } })"

            // Let's filter manually with what we found
            const allowedIds = validClients.map(c => c._id);
            const campaigns = await Campaign.find({
                companyID: targetCompanyId,
                clientID: { $in: allowedIds }
            }).select('_id title clientID');

            console.log(`Found ${campaigns.length} campaigns for valid clients.`);
            campaigns.forEach(c => console.log(` - ${c.title} (Client: ${c.clientID})`));
        }

    } catch (err) {
        console.error(err);
    } finally {
        mongoose.connection.close();
    }
};

debugAccess();

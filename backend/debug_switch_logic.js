const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '.env') });

const Client = require('./models/Client');
const Company = require('./models/Company');
const User = require('./models/User');

const debugSwitchLogic = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const companyId = '6112806bc9147f673d28c6eb'; // TRC Talent Solutions QA
        const userId = '6112806bc9147f673d28c6ee'; // An existing user ID (Product Admin)

        console.log(`Checking clients for Company: ${companyId}`);

        // 1. Get Company doc
        const company = await Company.findById(companyId);
        if (!company) {
            console.log('Company not found');
            return;
        }

        const companyClientIds = company.clients || [];
        console.log(`Company has ${companyClientIds.length} clients in its master list.`);

        // 2. Find first active client in the company
        const queryIds = companyClientIds.map(id => {
            return mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : id;
        });

        // Add additional string versions just in case
        companyClientIds.forEach(id => {
            if (typeof id !== 'string') queryIds.push(id.toString());
        });

        const activeClient = await Client.findOne({
            _id: { $in: queryIds },
            enable: true // Implementation plan says we check 'enable: true'
        });

        if (activeClient) {
            console.log(`Found active client: ${activeClient.clientName || activeClient.name} (${activeClient._id})`);
        } else {
            console.log('No active client found with enable: true. Checking for any client...');
            const anyClient = await Client.findOne({ _id: { $in: queryIds } });
            if (anyClient) {
                console.log(`Found a client (not necessarily enabled): ${anyClient.clientName || anyClient.name} (${anyClient._id})`);
            } else {
                console.log('No clients found at all in clientsDB that match company master list.');
            }
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
};

debugSwitchLogic();

const mongoose = require('mongoose');
const Client = require('./models/Client'); // Adjust path
const dotenv = require('dotenv');
dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const idToCheck = '6112806bc9147f673d28c6ec';
        const client = await Client.findById(idToCheck);

        console.log(`Checking Client ${idToCheck}:`, client ? 'Found' : 'Not Found');
        if (client) {
            console.log('Client Name:', client.name || client.companyName);
        }

        const allClients = await Client.find({});
        console.log('Total Clients in DB:', allClients.length);

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

run();

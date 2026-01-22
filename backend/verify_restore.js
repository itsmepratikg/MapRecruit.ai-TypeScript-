const mongoose = require('mongoose');
const Client = require('./models/Client');
const dotenv = require('dotenv');
dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const client = await Client.findById("6112806bc9147f673d28c6ec");
        console.log('TRC Client:', JSON.stringify(client, null, 2));

        const count = await Client.countDocuments({});
        console.log('Total Clients:', count);

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

run();

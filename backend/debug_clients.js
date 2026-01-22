const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const collection = mongoose.connection.collection('clientsdb');
        const count = await collection.countDocuments();
        console.log(`Total Clients: ${count}`);

        const sample = await collection.findOne({});
        console.log('Sample Client Document:');
        console.dir(sample, { depth: null });

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

run();

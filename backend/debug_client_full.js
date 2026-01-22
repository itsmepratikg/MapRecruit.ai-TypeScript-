const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const collection = mongoose.connection.collection('clientsdb');
        const item = await collection.findOne({});
        console.log('--- START DOCUMENT ---');
        console.log(JSON.stringify(item, null, 2));
        console.log('--- END DOCUMENT ---');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

run();

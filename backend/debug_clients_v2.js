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

        const items = await collection.find({}).limit(3).toArray();
        console.log('Sample Clients (Keys only):');
        items.forEach(item => {
            console.log(Object.keys(item));
            console.log('Sample Name Value:', item.name || item.info?.name || item.clientName || 'UNKNOWN');
        });

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

run();

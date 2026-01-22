const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const collection = mongoose.connection.collection('clientsdb');
        const item = await collection.findOne({});
        if (item) {
            console.log('KEYS:' + Object.keys(item).join(','));
            // Also print values for potential name fields
            console.log('NAME_VALUES:' + [item.name, item.ClientName, item.clientName, item.companyName, item.title].join(','));
            console.log('TYPE_VALUES:' + [item.type, item.clientType, item.category].join(','));
        } else {
            console.log('NO_DOCUMENTS_FOUND');
        }
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

run();

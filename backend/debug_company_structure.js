const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // Find ANY company
        const company = await mongoose.connection.collection('companiesDB').findOne({});
        console.log('Sample Company:', JSON.stringify(company, null, 2));

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

run();

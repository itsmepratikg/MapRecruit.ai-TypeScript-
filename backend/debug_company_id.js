const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const company = await mongoose.connection.collection('companiesDB').findOne({});
        console.log('ID:', company._id);
        console.log('ID Type:', company._id.constructor.name);

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

run();

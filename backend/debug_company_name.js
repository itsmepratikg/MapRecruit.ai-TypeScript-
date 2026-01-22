const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');
dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const user = await User.findOne({ email: { $regex: 'pratik', $options: 'i' } });
        const company = await mongoose.connection.collection('companiesDB').findOne({ _id: user.companyID.toString() });

        console.log('User Company ID:', user.companyID);
        console.log('Company Name:', company.name);
        console.log('Company Name Field:', company.companyName);

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

run();

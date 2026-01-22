const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const company = await mongoose.connection.collection('companiesDB').findOne({});
        console.log('Company Document Keys:', Object.keys(company));
        if (company.clients) {
            console.log('Company has clients array:', company.clients.length, 'entries');
            console.log('Sample client:', company.clients[0]);
        } else {
            console.log('Company DOES NOT have clients array');
        }
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

run();

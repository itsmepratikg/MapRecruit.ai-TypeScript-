const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
const log = (msg) => console.error(msg);

const findTRC = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        const db = mongoose.connection.db;

        log('\n--- LOOKING FOR TRC ---');

        // Find Company
        const trcCompany = await db.collection('companies').findOne({ name: { $regex: /TRC/i } });
        if (trcCompany) {
            log(`✅ TRC Company Found:`);
            log(`   Name: ${trcCompany.name}`);
            log(`   ID:   ${trcCompany._id}`);
        } else {
            log(`❌ TRC Company NOT FOUND`);
        }

        // Find Client
        const trcClient = await db.collection('clients').findOne({ name: { $regex: /TRC/i } });
        if (trcClient) {
            log(`✅ TRC Client Found:`);
            log(`   Name: ${trcClient.name}`);
            log(`   ID:   ${trcClient._id}`);
        } else {
            log(`❌ TRC Client NOT FOUND`);
        }

        log('-----------------------');
        process.exit(0);
    } catch (e) {
        log(e.message);
        process.exit(1);
    }
};

findTRC();

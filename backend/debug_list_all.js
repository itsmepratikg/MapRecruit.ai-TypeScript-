const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

const log = (msg) => console.error(msg);

const check = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        const db = mongoose.connection.db;

        const cols = await db.listCollections().toArray();
        log(`Total Collections: ${cols.length}`);

        for (const c of cols) {
            const count = await db.collection(c.name).countDocuments();
            log(`[${c.name}] Count: ${count}`);
        }

        process.exit(0);
    } catch (e) {
        log(e.message);
        process.exit(1);
    }
};

check();

import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const mongoose = require('../backend/node_modules/mongoose');
const dotenv = require('../backend/node_modules/dotenv');
const Activity = require('../backend/models/Activity.js');

const envPath = path.join(__dirname, '../.env');
dotenv.config({ path: envPath });
if (!process.env.MONGO_URI) {
    dotenv.config({ path: path.join(__dirname, '../backend/.env') });
}

const checkCount = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const count = await Activity.countDocuments();
        console.log(`Total Activities in DB: ${count}`);

        const sample = await Activity.findOne();
        console.log('Sample Activity Type:', sample ? sample.activityType : 'None');

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

checkCount();

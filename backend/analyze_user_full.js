const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { ObjectId } = require('mongodb');
const fs = require('fs');

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
const log = (msg) => console.error(msg);

const analyzeUserFull = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        const db = mongoose.connection.db;

        const userId = "696a1d32e8ceec1d15098204";
        const user = await db.collection('usersDB').findOne({ _id: new ObjectId(userId) });

        if (!user) {
            log('User not found!');
            process.exit(1);
        }

        log(`Dump for User: ${user.firstName} ${user.lastName} (${user._id})`);

        // Write full document to file for manual inspection
        fs.writeFileSync('user_full_dump.json', JSON.stringify(user, null, 2));
        log('Full document written to user_full_dump.json');

        // Also log top-level keys for immediate visibility
        const keys = Object.keys(user);
        log('Top-Level Keys: ' + keys.join(', '));

        // Check specifically for "client" related keys (case insensitive)
        const clientKeys = keys.filter(k => k.toLowerCase().includes('client'));
        if (clientKeys.length > 0) {
            log('Client-related keys found: ' + clientKeys.join(', '));
            clientKeys.forEach(k => {
                log(`  ${k}: ${JSON.stringify(user[k])}`);
            });
        } else {
            log('NO keys containing "client" found.');
        }

        // Check specifically for "company" related keys
        const companyKeys = keys.filter(k => k.toLowerCase().includes('company'));
        if (companyKeys.length > 0) {
            log('Company-related keys found: ' + companyKeys.join(', '));
        }

        process.exit(0);
    } catch (e) {
        log(e.message);
        process.exit(1);
    }
};

analyzeUserFull();

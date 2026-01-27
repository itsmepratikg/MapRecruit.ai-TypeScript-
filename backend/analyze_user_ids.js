const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { ObjectId } = require('mongodb');
const fs = require('fs');

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
const log = (msg) => console.error(msg);

// Regex for strict MongoDB ObjectId (24 hex chars)
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const scanForIds = (obj, prefix = '') => {
    let ids = [];

    for (const key in obj) {
        if (!obj.hasOwnProperty(key)) continue;

        const value = obj[key];
        const path = prefix ? `${prefix}.${key}` : key;

        if (value instanceof ObjectId) {
            ids.push({ key: path, value: value.toString(), type: 'ObjectId' });
        } else if (typeof value === 'string' && objectIdRegex.test(value)) {
            ids.push({ key: path, value: value, type: 'String' });
        } else if (typeof value === 'object' && value !== null) {
            // Recurse
            if (Array.isArray(value)) {
                value.forEach((item, index) => {
                    ids = ids.concat(scanForIds(item, `${path}[${index}]`));
                });
            } else if (!value._bsontype) { // Skip internal BSON types if any leak through
                ids = ids.concat(scanForIds(value, path));
            }
        }
    }
    return ids;
};

const analyzeUser = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        const db = mongoose.connection.db;

        const userId = "696a1d32e8ceec1d15098204";
        // Search 'usersDB' based on previous finding, fallback to 'users' if needed, but we know it's usersDB
        const user = await db.collection('usersDB').findOne({ _id: new ObjectId(userId) });

        if (!user) {
            log('User not found in usersDB!');
            process.exit(1);
        }

        log(`Analyzing User: ${user.firstName} ${user.lastName} (${user._id})`);

        const foundIds = scanForIds(user);

        log(`Scanned ${foundIds.length} IDs. Writing to user_id_scan.json...`);
        fs.writeFileSync('user_id_scan.json', JSON.stringify(foundIds, null, 2));
        log('Done.');

        process.exit(0);
    } catch (e) {
        log(e.message);
        process.exit(1);
    }
};

analyzeUser();

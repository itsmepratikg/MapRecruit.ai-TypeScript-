const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

console.log("Script started");
console.log("__dirname:", __dirname);

const MODEL_PATH = path.join(__dirname, '../models/Campaign');
console.log("Loading model from:", MODEL_PATH);

let Campaign;
try {
    Campaign = require(MODEL_PATH);
    console.log("Model loaded successfully");
} catch (e) {
    console.error("Failed to load model:", e);
    process.exit(1);
}

// Configuration
// Force fallback if env missing
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/maprecruit_v5";
const DATA_DIR = path.resolve(__dirname, '../../SchemaData/campaigns');
console.log("DATA_DIR:", DATA_DIR);
console.log("MONGO_URI:", MONGO_URI.replace(/:([^:@]+)@/, ':****@')); // Mask password

// Connect to MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected for Seeding'))
    .catch(err => {
        console.error('MongoDB Connection Error:', err);
        process.exit(1);
    });

// Helper to sanitize and convert ObjectIds
const toObjectId = (id) => {
    if (!id) return new mongoose.Types.ObjectId();
    if (typeof id === 'object' && id.$oid) return new mongoose.Types.ObjectId(id.$oid);
    if (mongoose.Types.ObjectId.isValid(id)) return new mongoose.Types.ObjectId(id);
    return new mongoose.Types.ObjectId(); // Fallback for invalid formats
};

// Recursive function to scan and convert $oid to ObjectId inside objects
const convertOids = (obj) => {
    if (Array.isArray(obj)) {
        return obj.map(item => convertOids(item));
    } else if (obj !== null && typeof obj === 'object') {
        if (obj.$oid) {
            return new mongoose.Types.ObjectId(obj.$oid);
        }
        // Handle $date if present (common in Mongo exports)
        if (obj.$date) {
            return new Date(obj.$date);
        }

        const newObj = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                newObj[key] = convertOids(obj[key]);
            }
        }
        return newObj;
    }
    return obj;
};

const mapCampaignData = (json) => {
    // 1. Core ID Conversion
    const mapped = {
        ...convertOids(json), // Deep convert any nested $oid or $date first
    };

    // 2. Ensure Top-Level IDs are valid
    mapped._id = toObjectId(json._id);
    mapped.companyID = toObjectId(json.companyID);
    mapped.clientID = toObjectId(json.clientID);
    mapped.userID = toObjectId(json.userID);

    // 3. Teams Array Mapping
    if (mapped.teams) {
        mapped.teams.ownerID = (Array.isArray(json.teams?.ownerID) ? json.teams.ownerID : []).map(toObjectId);
        mapped.teams.managerID = (Array.isArray(json.teams?.managerID) ? json.teams.managerID : []).map(toObjectId);
        mapped.teams.recruiterID = (Array.isArray(json.teams?.recruiterID) ? json.teams.recruiterID : []).map(toObjectId);
        // Fallback for single strings if legacy data exists
        if (json.teams?.ownerID && !Array.isArray(json.teams.ownerID)) mapped.teams.ownerID = [toObjectId(json.teams.ownerID)];
    }

    // 4. Shared Users
    if (mapped.sharedUserID) {
        mapped.sharedUserID = (Array.isArray(json.sharedUserID) ? json.sharedUserID : []).map(toObjectId);
    }

    // 5. Ensure Defaults
    mapped.status = mapped.status || 'Active';
    mapped.createdAt = mapped.createdAt ? new Date(mapped.createdAt) : new Date();
    mapped.updatedAt = mapped.updatedAt ? new Date(mapped.updatedAt) : new Date();

    return mapped;
};

const seedCampaigns = async () => {
    try {
        const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
        console.log(`Found ${files.length} campaign files to seed.`);

        // Optional: Clear existing ?
        // await Campaign.deleteMany({});
        // console.log('Cleared existing campaigns.');

        let count = 0;
        for (const file of files) {
            let rawData = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
            // Strip BOM
            rawData = rawData.replace(/^\uFEFF/, '');

            // Fix MongoDB Shell JSON extensions
            // ObjectId("...") -> {"$oid": "..."}
            rawData = rawData.replace(/ObjectId\s*\(\s*["']([^"']+)["']\s*\)/g, '{"$oid": "$1"}');
            // ISODate("...") -> {"$date": "..."}
            rawData = rawData.replace(/ISODate\s*\(\s*["']([^"']+)["']\s*\)/g, '{"$date": "$1"}');
            // NumberInt(123) -> 123
            rawData = rawData.replace(/NumberInt\s*\(\s*(\d+)\s*\)/g, '$1');
            // NumberLong("123") -> 123
            rawData = rawData.replace(/NumberLong\s*\(\s*["']?(\d+)["']?\s*\)/g, '$1');

            let jsonData;
            try {
                jsonData = JSON.parse(rawData);
            } catch (jsonErr) {
                console.error(`Skipping ${file}: Invalid JSON - ${jsonErr.message}`);
                continue;
            }
            const campaignData = mapCampaignData(jsonData);

            // Upsert based on _id to prevent duplicates on re-run
            try {
                await Campaign.findByIdAndUpdate(
                    campaignData._id,
                    campaignData,
                    { upsert: true, new: true, setDefaultsOnInsert: true }
                );
                console.log(`Processed: ${file} (ID: ${campaignData._id})`);
                count++;
            } catch (dbErr) {
                console.error(`Skipping ${file}: DB Error - ${dbErr.message}`);
                continue;
            }
        }

        console.log(`Successfully seeded/updated ${count} campaigns.`);
        process.exit(0);

    } catch (error) {
        console.error('Seeding Failed Message:', error.message);
        console.error('Seeding Failed Stack:', error.stack);
        process.exit(1);
    }
};

seedCampaigns();

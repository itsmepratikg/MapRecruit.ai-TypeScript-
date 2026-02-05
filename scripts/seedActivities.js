import fs from 'fs';
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

const logFile = path.join(__dirname, 'seed_log.txt');
const log = (msg) => {
    console.log(msg);
    fs.appendFileSync(logFile, msg + '\n');
};

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) throw new Error("MONGO_URI is missing");
        await mongoose.connect(mongoUri);
        log(`MongoDB Connected`);
    } catch (err) {
        log(`Error connecting to DB: ${err.message}`);
        process.exit(1);
    }
};

const parseMongoJSON = (content) => {
    let cleanContent = content
        .replace(/ObjectId\("([^"]+)"\)/g, '"$1"')
        .replace(/ISODate\("([^"]+)"\)/g, '"$1"');

    cleanContent = cleanContent.trim().replace(/\.$/, '');
    const doc = JSON.parse(cleanContent);

    // Fix empty strings for ObjectIds
    const fixObjectIds = (obj) => {
        for (const key in obj) {
            if (typeof obj[key] === 'string' && obj[key] === '' && (key.endsWith('ID') || key === '_id')) {
                obj[key] = null;
            } else if (Array.isArray(obj[key])) {
                obj[key] = obj[key].map(item => {
                    if (typeof item === 'string' && item === '') return null;
                    return item;
                }).filter(i => i !== null);
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                fixObjectIds(obj[key]);
            }
        }
    };
    fixObjectIds(doc);
    return doc;
};

const verifyKeys = (sourceDoc, savedDoc) => {
    const sourceKeys = Object.keys(sourceDoc);
    const savedObj = savedDoc.toObject();

    const missingKeys = [];
    for (const key of sourceKeys) {
        if (savedObj[key] === undefined) {
            // allow nulls
            if (sourceDoc[key] === null) continue;

            // Allow empty object for metaData (Mongoose minimizes empty objects)
            if (key === 'metaData' &&
                typeof sourceDoc[key] === 'object' &&
                sourceDoc[key] !== null &&
                Object.keys(sourceDoc[key]).length === 0) {
                continue;
            }

            missingKeys.push(key);
        }
    }

    if (missingKeys.length > 0) {
        log(`Verification Failed for ${sourceDoc._id}. Missing keys in DB: ${missingKeys.join(', ')}`);
        return false;
    }
    return true;
};

const importAndVerify = async () => {
    fs.writeFileSync(logFile, `Starting Seed at ${new Date().toISOString()}\n`);
    try {
        await connectDB();

        const schemaDataDir = path.join(__dirname, '../SchemaData/Activities');
        log(`Searching for activities in: ${schemaDataDir}`);

        if (!fs.existsSync(schemaDataDir)) {
            log(`Directory not found: ${schemaDataDir}`);
            process.exit(1);
        }

        const files = fs.readdirSync(schemaDataDir).filter(file => /^Activity\d+\.json$/.test(file));
        log(`Found ${files.length} Activity files.`);

        let successCount = 0;
        let failCount = 0;

        for (const file of files) {
            const filePath = path.join(schemaDataDir, file);
            const content = fs.readFileSync(filePath, 'utf-8');

            try {
                const docData = parseMongoJSON(content);

                // upsert
                const result = await Activity.findOneAndUpdate(
                    { _id: docData._id },
                    docData,
                    { upsert: true, new: true, runValidators: false }
                );

                const isVerified = verifyKeys(docData, result);

                if (isVerified) {
                    log(`[PASS] ${file} imported/verified. Deleting...`);
                    fs.unlinkSync(filePath);
                    successCount++;
                } else {
                    log(`[FAIL] ${file} verification failed.`);
                    failCount++;
                }

            } catch (e) {
                log(`Error processing ${file}: ${e.message}`);
                failCount++;
            }
        }

        log(`Complete. Success: ${successCount}, Failed: ${failCount}`);
        process.exit(0);
    } catch (error) {
        log(`Script Error: ${error}`);
        process.exit(1);
    }
};

importAndVerify();

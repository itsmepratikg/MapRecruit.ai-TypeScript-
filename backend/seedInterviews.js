const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Define models (using local requires to avoid server-wide side effects)
const Interview = require('./models/Interview');

const transformData = (data) => {
    if (Array.isArray(data)) {
        return data.map(transformData);
    } else if (data !== null && typeof data === 'object') {
        if (data.$oid) return new mongoose.Types.ObjectId(data.$oid);
        if (data.$date) {
            // Check if $date is a string or an object with $numberLong
            if (typeof data.$date === 'string') return new Date(data.$date);
            if (data.$date.$numberLong) return new Date(parseInt(data.$date.$numberLong));
            return new Date(data.$date);
        }
        if (data.$numberInt) return parseInt(data.$numberInt);
        if (data.$numberLong) return parseInt(data.$numberLong);
        if (data.$numberDouble) return parseFloat(data.$numberDouble);

        const transformed = {};
        for (const key in data) {
            transformed[key] = transformData(data[key]);
        }
        return transformed;
    }
    return data;
};

const seed = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) throw new Error('MONGO_URI is not defined in .env');

        console.log('Connecting to MongoDB...');
        await mongoose.connect(uri);
        console.log('Connected successfully!');

        const directoryPath = path.join(__dirname, '..', 'SchemaData', 'Interviews');
        console.log('Searching in:', directoryPath);
        if (!fs.existsSync(directoryPath)) {
            throw new Error(`Directory not found: ${directoryPath}`);
        }

        const files = fs.readdirSync(directoryPath).filter(file => file.endsWith('.json'));
        console.log(`Files found: ${files.join(', ')}`);

        const transformedRecords = [];
        for (const file of files) {
            const filePath = path.join(directoryPath, file);
            console.log(`Processing ${file}...`);
            let rawContent = fs.readFileSync(filePath, 'utf8');

            // Handle MongoDB Shell format
            const sanitizedContent = rawContent
                .replace(/ObjectId\("([^"]+)"\)/g, '"$1"')
                .replace(/ISODate\("([^"]+)"\)/g, '"$1"')
                .replace(/NumberLong\((\d+)\)/g, '$1')
                .replace(/NumberInt\((\d+)\)/g, '$1');

            try {
                const content = JSON.parse(sanitizedContent);
                const transformed = transformData(content);
                console.log(`Parsed ${file}, IDs found: resume=${!!transformed.resumeID}, campaign=${!!transformed.campaignID}`);

                // Basic data integrity check
                if (!transformed.resumeID || !transformed.campaignID) {
                    console.warn(`Warning: ${file} is missing resumeID or campaignID. Skipping.`);
                    continue;
                }

                // Ensure linked status is true if not specified
                if (transformed.linked === undefined) transformed.linked = true;

                transformedRecords.push(transformed);
            } catch (parseError) {
                console.error(`Failed to parse ${file}:`, parseError.message);
            }
        }

        console.log(`Accumulated ${transformedRecords.length} records.`);
        if (transformedRecords.length > 0) {
            console.log('Sample Record (First 5 keys):', Object.keys(transformedRecords[0]).slice(0, 5));
            console.log('ResumeID of first record:', transformedRecords[0].resumeID);
            // We use deleteMany to clear existing test data if needed. 
            // Warning: This clears the collection!
            const answer = "y"; // Hardcoded for this task environment
            if (answer.toLowerCase() === 'y') {
                console.log('Clearing existing interviews...');
                await Interview.deleteMany({});
            }

            console.log(`Inserting ${transformedRecords.length} records...`);
            try {
                const result = await Interview.collection.insertMany(transformedRecords, { ordered: false });
                console.log(`Successfully seeded ${result.insertedCount} records into interviewsdb.`);
            } catch (bulkError) {
                console.warn(`Bulk insert had some issues: ${bulkError.message}`);
                console.log(`Inserted count: ${bulkError.result?.result?.nInserted || bulkError.insertedCount || 0}`);
            }
        } else {
            console.log('No valid records found to seed.');
        }

    } catch (error) {
        console.error('Seeding failed:', error.stack || error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
        process.exit(0);
    }
};

seed();


require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const standardizeIds = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;

    if (Array.isArray(obj)) {
        return obj.map(item => standardizeIds(item));
    }

    const newObj = { ...obj };
    for (const key in newObj) {
        const value = newObj[key];

        // Convert known ID fields to ObjectId if valid
        if ([
            '_id', 'companyID', 'clientID', 'userID', 'campaignID',
            'articleID', 'sharedUserID', 'favouriteUserID', 'tagID',
            'franchiseID', 'resumeFileID', 'attachedBy'
        ].includes(key)) {
            if (typeof value === 'string' && mongoose.Types.ObjectId.isValid(value)) {
                newObj[key] = new mongoose.Types.ObjectId(value);
            } else if (Array.isArray(value)) {
                newObj[key] = value.map(id =>
                    (typeof id === 'string' && mongoose.Types.ObjectId.isValid(id))
                        ? new mongoose.Types.ObjectId(id)
                        : id
                );
            }
        } else if (typeof value === 'object') {
            newObj[key] = standardizeIds(value);
        }
    }
    return newObj;
};

const seed = async () => {
    await connectDB();

    try {
        const filePath = path.join(__dirname, '../SchemaData/pratikResume.json');
        if (!fs.existsSync(filePath)) {
            console.error(`File not found: ${filePath}`);
            process.exit(1);
        }

        const rawData = fs.readFileSync(filePath, 'utf-8');
        let data = JSON.parse(rawData);

        // Standardize IDs
        data = standardizeIds(data);

        // Ensure mandatory fields
        const companyID = new mongoose.Types.ObjectId('6112806bc9147f673d28c6eb');
        data.companyID = companyID;

        // The CandidateProfile.tsx expects:
        // const profileResume = resumeDetails.resume || {};
        // So we wrap the fields (profile, professionalSummary, etc.) inside a 'resume' field
        // if they are currently at the top level.

        // The source JSON ALREADY has a 'resume' wrapper. 
        // We will keep the original structure as it's already compatible with the frontend.

        // Static collection access
        const Resume = mongoose.connection.db.collection('resumesDB');

        const result = await Resume.replaceOne(
            { _id: data._id },
            data,
            { upsert: true }
        );

        console.log('Seeding successful!');
        console.log('Result:', result);
        console.log('Document ID:', finalDoc._id.toString());

    } catch (err) {
        console.error('Seeding Error:', err);
    } finally {
        await mongoose.connection.close();
        process.exit();
    }
};

seed();

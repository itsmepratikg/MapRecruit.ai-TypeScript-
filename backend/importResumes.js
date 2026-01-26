
require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Models (or raw schema if preferred, but models are safer)
// Assuming Resume model exists or we can use dynamic model
const ResumeSchema = new mongoose.Schema({}, { strict: false, collection: 'resumesDB' });
const Resume = mongoose.model('Resume', ResumeSchema);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const run = async () => {
    await connectDB();

    try {
        // 1. Update Profile companyID
        const targetId = '69774e95cf3020c9148d7622';
        const newCompanyId = '6112806bc9147f673d28c6eb';

        const updateResult = await Resume.updateOne(
            { _id: new mongoose.Types.ObjectId(targetId) },
            { $set: { companyID: new mongoose.Types.ObjectId(newCompanyId) } } // Fix: Use ObjectId
        );
        console.log(`Update Result for ${targetId}:`, updateResult);

        // 2. Import Resumes
        const filesToImport = [
            '../SchemaData/resume_6965e3f1f40a2ed220a0dc17.json',
            '../SchemaData/resume_6965e3b8f40a2ed220a0dc16.json'
        ];

        for (const relPath of filesToImport) {
            const filePath = path.join(__dirname, relPath);
            if (!fs.existsSync(filePath)) {
                console.warn(`File not found: ${filePath}`);
                continue;
            }

            const rawData = fs.readFileSync(filePath, 'utf-8');
            let data = JSON.parse(rawData);

            // Transform IDs to ObjectId
            if (data._id && typeof data._id === 'string') data._id = new mongoose.Types.ObjectId(data._id);
            if (data.companyID && typeof data.companyID === 'string') data.companyID = new mongoose.Types.ObjectId(data.companyID);

            // Arrays of IDs
            ['clientID', 'userID', 'campaignID', 'articleID', 'sharedUserID', 'favouriteUserID', 'tagID'].forEach(field => {
                if (Array.isArray(data[field])) {
                    data[field] = data[field].map(id => {
                        if (typeof id === 'string' && mongoose.Types.ObjectId.isValid(id)) return new mongoose.Types.ObjectId(id);
                        return id;
                    });
                }
            });

            // Convert array of objects with nested IDs
            if (Array.isArray(data.attachedCampaigns)) {
                data.attachedCampaigns = data.attachedCampaigns.map(c => {
                    if (c.campaignID && typeof c.campaignID === 'string') c.campaignID = new mongoose.Types.ObjectId(c.campaignID);
                    if (c.userID && typeof c.userID === 'string' && mongoose.Types.ObjectId.isValid(c.userID)) c.userID = new mongoose.Types.ObjectId(c.userID);
                    if (c.attachedBy && typeof c.attachedBy === 'string' && mongoose.Types.ObjectId.isValid(c.attachedBy)) c.attachedBy = new mongoose.Types.ObjectId(c.attachedBy);
                    return c;
                });
            }

            // Insert or Upsert
            const result = await Resume.replaceOne(
                { _id: data._id },
                data,
                { upsert: true }
            );
            console.log(`Imported ${relPath}:`, result);
        }

    } catch (err) {
        console.error('Script Error:', err);
    } finally {
        await mongoose.connection.close();
        process.exit();
    }
};

run();

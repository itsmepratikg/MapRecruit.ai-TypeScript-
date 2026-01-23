import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Get __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
dotenv.config({ path: path.join(__dirname, '../.env') });

// Load Models - Note: If models are CJS, default import works or named import?
// Mongoose models usually export the model instance.
// Using dynamic import for CJS models in ESM if needed, or just standard import.
// Since backend is CJS, we might need createRequire.
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const Company = require('../backend/models/Company.js');
const User = require('../backend/models/User.js');

// Paths to JSON
const company2Path = path.join(__dirname, '../SchemaData/company2.json');
const company2ProductPath = path.join(__dirname, '../SchemaData/company2Product.json');

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/maprecruit';

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('Connection Error:', err);
        process.exit(1);
    }
};

const run = async () => {
    await connectDB();

    try {
        // 1. Read JSONs
        const company2Data = JSON.parse(fs.readFileSync(company2Path, 'utf8'));
        const company2ProductData = JSON.parse(fs.readFileSync(company2ProductPath, 'utf8'));

        // 2. Prepare Company Object
        const mainData = company2Data.result;
        const productData = company2ProductData[0]; // Array of 1

        if (mainData._id !== productData._id) {
            console.warn('Warning: IDs in files do not match!', mainData._id, productData._id);
        }

        const newCompany = {
            _id: mainData._id,
            status: 'Active',
            companyProfile: mainData.companyProfile,
            productSettings: { ...mainData.productSettings, ...productData.productSettings }, // Merge
            accessabilitySettings: mainData.accessabilitySettings,
            communicationSettings: productData.communicationSettings,
            themesdata: productData.themesdata
        };

        // 3. Upsert Company
        const result = await Company.findByIdAndUpdate(
            newCompany._id,
            newCompany,
            { upsert: true, new: true }
        );
        console.log(`Company '${result.companyProfile.companyName}' upserted with ID: ${result._id}`);

        // 4. Find User Pratik
        const user = await User.findOne({
            $or: [
                { email: /pratik/i },
                { 'personalDetails.firstName': /pratik/i }
            ]
        });

        if (user) {
            console.log('Found User:', user.email, user._id);
            console.log('Current CompanyID:', user.companyID);
            console.log('Current CurrentCompanyID:', user.currentCompanyID);
            console.log('Role:', user.role, user.roleID);

            // Check if user has access or update status
            // If user's currentCompanyID is not set, maybe set it?
            // But user asked to "give me access".

            // If the user needs to be able to switch, we assume they are Super Admin or have a mapping.
            // I'll jus tprint for now.
        } else {
            console.log('User Pratik not found.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
        process.exit(0);
    }
};

run();

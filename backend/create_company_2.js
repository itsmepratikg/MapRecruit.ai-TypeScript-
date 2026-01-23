const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Models
const Company = require('./models/Company');
const User = require('./models/User');

// Paths to JSON (Warning: Parent of backend is root)
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
        console.log('Reading JSONs...');
        if (!fs.existsSync(company2Path)) throw new Error(`File not found: ${company2Path}`);

        const company2Data = JSON.parse(fs.readFileSync(company2Path, 'utf8'));
        const company2ProductData = JSON.parse(fs.readFileSync(company2ProductPath, 'utf8'));

        const mainData = company2Data.result;
        const productData = company2ProductData[0];

        const newCompany = {
            _id: mainData._id,
            status: 'Active',
            companyProfile: mainData.companyProfile,
            productSettings: { ...mainData.productSettings, ...productData.productSettings },
            accessabilitySettings: mainData.accessabilitySettings,
            communicationSettings: productData.communicationSettings,
            themesdata: productData.themesdata
        };

        console.log('Upserting Company...');
        const result = await Company.findByIdAndUpdate(
            newCompany._id,
            newCompany,
            { upsert: true, new: true }
        );
        console.log(`Company '${result.companyProfile.companyName}' upserted with ID: ${result._id}`);

        console.log('Finding User Pratik...');
        const user = await User.findOne({
            $or: [
                { email: /pratik/i },
                { 'personalDetails.firstName': /pratik/i }
            ]
        });

        if (user) {
            console.log('Found User:', user.email, 'ID:', user._id);
            console.log('Current CompanyID:', user.companyID);
            console.log('Current CurrentCompanyID:', user.currentCompanyID);

            // Update user to new company
            user.currentCompanyID = newCompany._id;
            await user.save();
            console.log('Updated User currentCompanyID to:', newCompany._id);

        } else {
            console.log('User Pratik not found.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Done.');
    }
};

run();

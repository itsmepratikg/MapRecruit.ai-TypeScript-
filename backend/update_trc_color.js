const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const updateTRCColor = async () => {
    await connectDB();

    const companyId = '6112806bc9147f673d28c6eb'; // TRC ID
    const Company = require('./models/Company');

    const company = await Company.findById(companyId);

    if (company) {
        // Ensure themesdata structure exists
        if (!company.themesdata) company.themesdata = {};
        if (!company.themesdata.themeVariables) company.themesdata.themeVariables = {};

        // Set to Green
        company.themesdata.themeVariables.mainColor = '#10b981';

        // Mark modified if mixed type doesn't auto-detect (Mongoose Mixed type caveat)
        company.markModified('themesdata');

        await company.save();
        console.log('SUCCESS: Updated TRC (6112806bc9147f673d28c6eb) mainColor to #10b981 (Green)');
    } else {
        console.log('ERROR: TRC Company not found');
    }

    process.exit();
};

updateTRCColor();

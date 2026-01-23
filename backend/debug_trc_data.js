const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURI = 'mongodb+srv://pratikgaurav:6g7_%23C3OPqh%3D@campaigndb.7vpl08o.mongodb.net/MRv5';
        const conn = await mongoose.connect(mongoURI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const checkTRC = async () => {
    await connectDB();
    const Company = require('./models/Company');

    console.log("Fetching TRC Company...");
    const company = await Company.findById('6112806bc9147f673d28c6eb');

    if (company) {
        console.log("--- TRC DATA ---");
        console.log("ID:", company._id);
        console.log("Name:", company.companyProfile?.companyName);
        console.log("ThemesData:", JSON.stringify(company.themesdata, null, 2));

        // Detailed check
        const mainColor = company.themesdata?.themeVariables?.mainColor;
        console.log("Main Color found:", mainColor);
    } else {
        console.log("TRC Company NOT FOUND.");
    }

    process.exit();
};

checkTRC();

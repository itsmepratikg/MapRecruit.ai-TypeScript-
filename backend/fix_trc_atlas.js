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

const updateTRC = async () => {
    await connectDB();
    const Company = require('./models/Company');

    // Update TRC (6112806bc9147f673d28c6eb)
    const res = await Company.findByIdAndUpdate(
        '6112806bc9147f673d28c6eb',
        {
            $set: {
                "themesdata": {
                    "themeVariables": {
                        "mainColor": "#10b981"
                    }
                }
            }
        },
        { new: true, upsert: true }
    );

    console.log('SUCCESS: Updated TRC themesdata:', JSON.stringify(res.themesdata, null, 2));
    process.exit();
};

updateTRC();

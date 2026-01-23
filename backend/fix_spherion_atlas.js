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

const updateSpherion = async () => {
    await connectDB();
    const Company = require('./models/Company');

    // Update Spherion (61814138c98444344034ca8c)
    const res = await Company.findByIdAndUpdate(
        '61814138c98444344034ca8c',
        {
            $set: {
                "themesdata": {
                    "themeVariables": {
                        "mainColor": "#e1671c" // Orange
                    }
                }
            }
        },
        { new: true, upsert: true }
    );

    console.log('SUCCESS: Updated Spherion themesdata:', JSON.stringify(res.themesdata, null, 2));
    process.exit();
};

updateSpherion();

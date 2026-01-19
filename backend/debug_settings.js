
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        // Pratik's ID
        const userId = '696a1d32e8ceec1d15098204';
        const user = await User.findById(userId);

        if (user) {
            console.log("User Found:", user.email);
            console.log("Accessibility Settings:", JSON.stringify(user.accessibilitySettings, null, 2));
        } else {
            console.log("User not found");
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.connection.close();
        process.exit();
    }
};

checkUser();

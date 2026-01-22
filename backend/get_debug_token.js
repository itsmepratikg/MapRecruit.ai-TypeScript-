const mongoose = require('mongoose');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const fs = require('fs');

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOne({ email: { $regex: 'pratik', $options: 'i' } });
        if (!user) {
            console.error('User not found');
            process.exit(1);
        }

        const token = jwt.sign({
            id: user._id,
            email: user.email,
            companyID: user.companyID,
            activeClientID: user.activeClientID,
            role: user.role
        }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        console.log('---TOKEN_START---');
        console.log(token);
        console.log('---TOKEN_END---');
        fs.writeFileSync('token.txt', token);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

run();

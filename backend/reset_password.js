
const mongoose = require('mongoose');
const dotenv = require('dotenv'); // Adjust path to .env
const path = require('path');
const bcrypt = require('bcryptjs');

// Load env from root
dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/MRv5';

const reset = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB...');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Test1234!', salt);

        const res = await User.updateOne({ email: 'new@user.com' }, { password: hashedPassword });
        console.log('Password updated for new@user.com:', res);
        process.exit();
    } catch (error) {
        console.error('Reset failed:', error);
        process.exit(1);
    }
};

reset();

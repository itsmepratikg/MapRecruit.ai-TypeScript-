const mongoose = require('mongoose');
const Role = require('./models/Role');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const checkRole = async () => {
    await connectDB();
    const roleId = '697231f6fc7ba4d85eadd350';
    try {
        const role = await Role.findById(roleId);
        if (role) {
            console.log('Role Found:', role.roleName);
            console.log('Settings:', JSON.stringify(role.accessibilitySettings?.settings, null, 2));
        } else {
            console.log('Role NOT found');
        }
    } catch (err) {
        console.error(err);
    }
    process.exit();
};

checkRole();

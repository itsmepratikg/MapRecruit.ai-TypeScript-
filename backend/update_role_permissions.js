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

const updateRole = async () => {
    await connectDB();
    const Role = require('./models/Role');

    const roleId = '697231f6fc7ba4d85eadd350'; // Product Admin Role ID

    console.log(`Updating Role ID: ${roleId}...`);

    try {
        const role = await Role.findById(roleId);
        if (!role) {
            console.error('Role not found!');
            process.exit(1);
        }

        // Initialize structure if missing
        if (!role.accessibilitySettings) role.accessibilitySettings = {};
        if (!role.accessibilitySettings.settings) role.accessibilitySettings.settings = {};

        // Enable companySwitcher and clientSwitcher
        role.accessibilitySettings.settings.companySwitcher = true;
        role.accessibilitySettings.settings.clientSwitcher = true;
        role.markModified('accessibilitySettings');

        await role.save();

        console.log('SUCCESS: Updated Role permissions.');
        console.log('New Settings:', JSON.stringify(role.accessibilitySettings.settings, null, 2));

    } catch (err) {
        console.error('Update failed:', err);
    }

    process.exit();
};

updateRole();

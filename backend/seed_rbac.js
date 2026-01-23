
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Models
const Role = require('./models/Role');
const Company = require('./models/Company');
const User = require('./models/User');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/MRv5';

const DEFAULT_PERMISSIONS = {
    "System & Administration": {
        "overRide": false,
        "globalSearch": true,
        "tableEdit": { "visible": true, "enabled": true, "saveDefault": true },
        "settings": {
            "enabled": true,
            "visible": true,
            "companyInfo": { "enabled": true, "visible": true },
            "users": { "enabled": true, "visible": true, "createUser": true, "updateUser": true, "removeUser": true },
            "roles": { "enabled": true, "visible": true, "createRole": true, "updateRole": true, "removeRole": true }
        }
    }
};

const seed = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB for Seeding...');

        // 1. Create a Global "Product Admin" Template if not exists
        let adminRole = await Role.findOne({ roleName: 'Product Admin' });
        if (!adminRole) {
            const allCompanies = await Company.find({}).select('_id');
            const companyIds = allCompanies.map(c => c._id);

            adminRole = await Role.create({
                roleName: 'Product Admin',
                description: 'Global maintenance role with cross-tenant access.',
                accessibilitySettings: {
                    ...DEFAULT_PERMISSIONS,
                    "System & Administration": {
                        ...DEFAULT_PERMISSIONS["System & Administration"],
                        overRide: true
                    }
                },
                companyID: companyIds // Assign to all companies
            });
            console.log('Created "Product Admin" Role Template.');
        }

        // 2. Map existing Users to the Admin Role for testing
        // We'll map the primary user (e.g., pratik) to this role
        const users = await User.find({ role: 'Product Admin' });
        for (const user of users) {
            user.roleID = adminRole._id;
            await user.save();
        }
        console.log(`Updated ${users.length} Admin users with new roleID.`);

        // 3. Ensure Companies have Profiles
        const companies = await Company.find({});
        for (const comp of companies) {
            if (!comp.companyProfile || !comp.companyProfile.companyName) {
                comp.companyProfile = comp.companyProfile || {};
                comp.companyProfile.companyName = comp.companyId || 'Default Company';
                await comp.save();
            }
        }
        console.log(`Verified profiles for ${companies.length} companies.`);

        console.log('Seed completed successfully.');
        process.exit();
    } catch (error) {
        console.error('Seed failed:', error);
        process.exit(1);
    }
};

seed();

const mongoose = require('mongoose');
const User = require('./models/User');
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

const checkUser = async () => {
    await connectDB();
    try {
        // Find user by role name 'Product Admin' OR email 'pratik'
        const users = await User.find({
            $or: [
                { role: 'Product Admin' },
                { email: { $regex: 'pratik', $options: 'i' } }
            ]
        });

        console.log('--- Checking Users ---');
        for (const user of users) {
            console.log(`User: ${user.firstName} ${user.lastName} (${user.email})`);
            console.log(`Role (String): ${user.role}`);
            console.log(`RoleID (Ref): ${user.roleID}`);

            if (user.role === 'Product Admin' && !user.roleID) {
                console.log('!!! WARNING: Product Admin user missing RoleID linkage!');
                // Try to self-heal
                const adminRole = await Role.findOne({ roleName: 'Product Admin' });
                if (adminRole) {
                    console.log(`Found Product Admin Role ID: ${adminRole._id}. Linking...`);
                    user.roleID = adminRole._id;
                    await user.save();
                    console.log('User updated with RoleID.');
                } else {
                    console.log('Could not find a Role named "Product Admin" to link.');
                }
            }
            if (user.roleID) {
                // Verify the linked role has the switchers
                const roleDoc = await Role.findById(user.roleID);
                if (roleDoc) {
                    console.log(` Linked Role '${roleDoc.roleName}' - Permissions:`,
                        JSON.stringify(roleDoc.accessibilitySettings?.settings?.clientSwitcher ? 'ClientSwitcher: OK' : 'ClientSwitcher: MISSING')
                    );
                }
            }
            console.log('---');
        }

    } catch (err) {
        console.error(err);
    }
    process.exit();
};

checkUser();

const mongoose = require('mongoose');
const User = require('./models/User'); // Adjust path
const dotenv = require('dotenv');
dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // Find a likely admin user (e.g., pratik)
        const user = await User.findOne({ email: { $regex: 'pratik', $options: 'i' } });
        if (!user) {
            console.log('No user found matching "pratik"');
            process.exit(0);
        }

        console.log(`Checking Access for User: ${user.name} (${user.email}) Role: ${user.role}`);
        console.log(`User Assigned Clients:`, user.clients);

        const company = await mongoose.connection.collection('companiesDB').findOne({ _id: user.companyID.toString() });
        if (!company) {
            console.log('Company not found');
            process.exit(0);
        }

        console.log(`Company: ${company.name}`);
        console.log(`Company Master Client List:`, company.clients?.length || 0);

        if (['Product Admin', 'Admin', 'Super Admin'].includes(user.role)) {
            console.log('User is Admin. Should see ALL company clients.');
            console.log('Expected Count:', company.clients?.length || 0);
        } else {
            // Calculate intersection
            const companyClientIds = (company.clients || []).map(id => id.toString());
            const userClientIds = (user.clients || []).map(id => id.toString());
            const intersection = companyClientIds.filter(id => userClientIds.includes(id));
            console.log('User is Standard. Should see INTERSECTION.');
            console.log('Expected Count:', intersection.length);
        }

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

run();

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const User = mongoose.model('User', new mongoose.Schema({
            companyID: mongoose.Schema.Types.Mixed,
            email: String
        }, { strict: false, collection: 'usersDB' }));

        const users = await User.find({}).limit(5);
        console.log(`Found ${users.length} users`);
        users.forEach(u => {
            console.log(`User: ${u.email}`);
            console.log(`  _id Type: ${typeof u._id} - ${u._id.constructor.name}`);
            console.log(`  companyID Type: ${typeof u.companyID} - ${u.companyID?.constructor?.name}`);
            console.log(`  companyID Value: ${u.companyID}`);

            // Test ObjectId match
            if (typeof u.companyID === 'string') {
                console.log('  companyID is STRICTLY a String');
            }
            if (u.companyID instanceof mongoose.Types.ObjectId) {
                console.log('  companyID is STRICTLY an ObjectId');
            }
        });

        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

run();

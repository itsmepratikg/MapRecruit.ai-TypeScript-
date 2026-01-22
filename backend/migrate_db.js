const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        // flexible schema to read whatever is there
        const User = mongoose.model('User', new mongoose.Schema({
            companyID: mongoose.Schema.Types.Mixed,
            email: String
        }, { strict: false, collection: 'usersDB' }));

        const users = await User.find({});
        console.log(`Found ${users.length} users. Checking for String companyIDs...`);

        let updatedCount = 0;
        for (const user of users) {
            const type = typeof user.companyID;

            if (type === 'string') {
                console.log(`Migrating User: ${user.email} | companyID: ${user.companyID} (String) -> ObjectId`);

                // manual update using updateOne to force the set
                try {
                    if (mongoose.Types.ObjectId.isValid(user.companyID)) {
                        const newId = new mongoose.Types.ObjectId(user.companyID);
                        await User.updateOne({ _id: user._id }, { $set: { companyID: newId } });
                        updatedCount++;
                    } else {
                        console.warn(`SKIPPING: Invalid ObjectId string for user ${user.email}: ${user.companyID}`);
                    }
                } catch (err) {
                    console.error(`Failed to update user ${user.email}:`, err);
                }
            } else {
                // console.log(`Skipping User: ${user.email} (Type: ${type}, Constructor: ${user.companyID?.constructor?.name})`);
            }
        }

        console.log(`Migration Complete. Updated ${updatedCount} users.`);
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

run();

const mongoose = require('mongoose');
const User = require('../models/User');
const Campaign = require('../models/Campaign');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' });

const runTest = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to DB');

        // 1. Create Tenant User
        const tenantId = 'tenant_123';
        const email = `test_${Date.now()}@example.com`;

        const user = await User.create({
            email,
            password: 'password123',
            tenantId,
            role: 'Product Admin',
            // Test flexible schema
            customSetting: { theme: 'dark', verified: true }
        });
        console.log('User created:', user.email);
        console.log('Custom Setting stored:', user.customSetting);

        // 2. Create Campaign with Flexible Schema
        const campaign = await Campaign.create({
            tenantId,
            status: true,
            schema: {
                mainSchema: {
                    title: 'Senior Developer',
                    ownerID: [user._id],
                    // Flexible field not defined in Mongoose explicitly
                    "custom_salary_range": { min: 100000, max: 150000 },
                    "urgent_hiring": true
                }
            }
        });
        console.log('Campaign created:', campaign._id);

        // 3. Verify Persistence
        const fetchedCampaign = await Campaign.findById(campaign._id);
        if (fetchedCampaign.schema.mainSchema.urgent_hiring === true) {
            console.log('SUCCESS: Flexible field "urgent_hiring" successfully retrieved.');
        } else {
            console.error('FAILURE: Flexible field missing.');
        }

        mongoose.connection.close();
    } catch (error) {
        console.error('Test Failed:', error);
        process.exit(1);
    }
};

runTest();

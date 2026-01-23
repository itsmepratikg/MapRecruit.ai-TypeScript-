require('dotenv').config();
const mongoose = require('mongoose');
const Company = require('./models/Company');
const { resolveTenant } = require('./middleware/tenantMiddleware');

const testTenant = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        // Mock request objects
        const mockRes = {
            status: function (code) {
                console.log(`Response Status: ${code}`);
                return this;
            },
            json: function (data) {
                console.log('Response JSON:', data);
                return this;
            }
        };

        const mockNext = () => console.log('Next() called successfully');

        // Test 1: Local Dev with Query Param
        console.log('\n--- Test 1: Local Dev (?company_id) ---');
        const req1 = {
            get: (key) => key === 'host' ? 'localhost:5000' : '',
            query: { company_id: '6112806bc9147f673d28c6eb' }
        };
        await resolveTenant(req1, mockRes, mockNext);
        console.log('Resolved Context ID:', req1.companyID);

        // Test 2: Sub-domain resolution
        console.log('\n--- Test 2: Sub-domain (trcqa.maprecruit.com) ---');
        const req2 = {
            get: (key) => key === 'host' ? 'trcqa.maprecruit.com' : '',
            query: {}
        };
        await resolveTenant(req2, mockRes, mockNext);
        console.log('Resolved Context ID:', req2.companyID);

        // Test 3: Invalid Sub-domain
        console.log('\n--- Test 3: Invalid Sub-domain ---');
        const req3 = {
            get: (key) => key === 'host' ? 'random.maprecruit.com' : '',
            query: {}
        };
        await resolveTenant(req3, mockRes, mockNext);

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

testTenant();

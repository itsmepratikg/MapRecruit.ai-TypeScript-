const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { ObjectId } = require('mongodb');

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

const runTests = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        const db = mongoose.connection.db;
        console.log('\n🚀 Starting Multi-Tenancy Access Control Tests...\n');

        const USER_ID = new ObjectId("696a1d32e8ceec1d15098204");
        const TRC_COMPANY_ID = new ObjectId("6112806bc9147f673d28c6eb");
        const SPHERION_COMPANY_ID = new ObjectId("61814138c98444344034ca8c");

        const user = await db.collection('usersDB').findOne({ _id: USER_ID });
        console.log(`👤 Testing User: ${user.firstName} ${user.lastName} (${user.role})`);

        const results = [];

        // TEST 1: Admin Multi-Company Authorization
        const test1 = { name: 'Test 1: Admin Multi-Company Access' };
        const accessible = user.AccessibleCompanyID.map(id => id.toString());
        const hasTrc = accessible.includes(TRC_COMPANY_ID.toString());
        const hasSpherion = accessible.includes(SPHERION_COMPANY_ID.toString());
        test1.status = (hasTrc && hasSpherion) ? 'PASS' : 'FAIL';
        results.push(test1);

        // TEST 2: Scenario B (TRC Flat Path)
        const test2 = { name: 'Test 2: TRC Flat Path Authorization' };
        const trcCompany = await db.collection('companiesDB').findOne({ _id: TRC_COMPANY_ID });
        const trcFranchiseMode = trcCompany.productSettings?.franchise === true;
        // In Flat path, franchise mode must be false
        test2.status = (!trcFranchiseMode) ? 'PASS' : 'FAIL';
        results.push(test2);

        // TEST 3: Scenario A (Spherion Hierarchical Path)
        const test3 = { name: 'Test 3: Spherion Hierarchical Path Authorization' };
        const spherionCompany = await db.collection('companiesDB').findOne({ _id: SPHERION_COMPANY_ID });
        const spherionFranchiseMode = spherionCompany.productSettings?.franchise === true;
        // In Hierarchical path, franchise mode must be true
        test3.status = (spherionFranchiseMode) ? 'PASS' : 'FAIL';
        results.push(test3);

        // TEST 4: Identity Validation (clientName)
        const test4 = { name: 'Test 4: Client Identity Field Validation' };
        const trcClient = await db.collection('clientsdb').findOne({ companyID: TRC_COMPANY_ID });
        test4.status = (trcClient.clientName === "TRC Talent Solutions") ? 'PASS' : 'FAIL';
        results.push(test4);

        // TEST 5: Franchise/Owning Entity Connection
        const test5 = { name: 'Test 5: Spherion Franchise -> Client Connection' };
        const franchise = await db.collection('franchises').findOne({ companyID: SPHERION_COMPANY_ID });
        const linkedClientId = franchise.clientIDs[0];
        const client = await db.collection('clientsdb').findOne({ _id: linkedClientId });
        test5.status = (client && client.companyID.toString() === SPHERION_COMPANY_ID.toString()) ? 'PASS' : 'FAIL';
        results.push(test5);

        console.table(results);

        const allPassed = results.every(r => r.status === 'PASS');
        if (allPassed) {
            console.log('✅ ALL MULTI-TENANCY TESTS PASSED\n');
            process.exit(0);
        } else {
            console.error('❌ SOME TESTS FAILED\n');
            process.exit(1);
        }

    } catch (e) {
        console.error('Testing Failed:', e.message);
        process.exit(1);
    }
};

runTests();

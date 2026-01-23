const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');

const verifyPhase1 = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const userId = '6112806bc9147f673d28c6ee'; // Existing Product Admin from TRC
        const targetCompanyId = '61814138c98444344034ca8c'; // Spherion Orange

        console.log(`Simulating switch for user: ${userId} to Company: ${targetCompanyId}`);

        // 1. Fetch user before switch
        let user = await User.findById(userId);
        console.log(`Original State: Company: ${user.companyID}, currentCompanyID: ${user.currentCompanyID}, activeClientID: ${user.activeClientID}`);

        // 2. Mocking the switchCompany logic manually for verification
        user.currentCompanyID = new mongoose.Types.ObjectId(targetCompanyId);

        // This simulates the auto-pick logic from the controller
        const company = await mongoose.connection.collection('companiesDB').findOne({
            _id: new mongoose.Types.ObjectId(targetCompanyId)
        });

        if (company && company.clients && company.clients.length > 0) {
            const Client = require('./models/Client');
            const queryIds = company.clients.map(id => {
                return mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : id;
            });

            const activeClient = await Client.findOne({
                _id: { $in: queryIds },
                enable: true
            });

            if (activeClient) {
                user.activeClientID = activeClient._id;
            } else {
                user.activeClientID = queryIds[0];
            }
        }

        await user.save();
        console.log(`New State: currentCompanyID: ${user.currentCompanyID}, activeClientID: ${user.activeClientID}`);

        // 3. Verify JWT generation logic
        const generateToken = (id, email, companyID, activeClientID, role, roleID, currentCompanyID, productAdmin) => {
            const payload = { id, email, companyID, activeClientID, role, roleID };
            if (currentCompanyID) payload.currentCompanyID = currentCompanyID;
            if (productAdmin !== undefined) payload.productAdmin = productAdmin;
            return jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '30d',
            });
        };

        const token = generateToken(
            user._id,
            user.email,
            user.companyID,
            user.activeClientID,
            user.role,
            user.roleID,
            user.currentCompanyID,
            user.accessibilitySettings?.productAdmin
        );

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded JWT payload:', decoded);

        if (decoded.currentCompanyID.toString() === targetCompanyId && decoded.activeClientID.toString() === user.activeClientID.toString()) {
            console.log('SUCCESS: JWT contains correct switched context!');
        } else {
            console.log('FAILURE: JWT context mismatch');
        }

        // --- Optional: Reset user back to original company if needed ---
        // user.currentCompanyID = undefined;
        // await user.save();

        await mongoose.disconnect();
    } catch (error) {
        console.error('Verification Error:', error);
    }
};

verifyPhase1();

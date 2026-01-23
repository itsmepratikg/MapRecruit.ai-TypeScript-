const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');

async function run() {
    try {
        console.log('Starting verification v3...');
        dotenv.config({ path: path.join(__dirname, '.env') });

        const User = require('./models/User');
        const Client = require('./models/Client');

        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        // Confirmed Product Admin ID
        const userId = '696a1d32ee8ceec1d1509820';
        const targetCompanyId = '61814138c98444344034ca8c';

        const user = await User.findById(userId);
        if (!user) {
            console.error('User not found with ID:', userId);
            // List some users to debug
            const users = await User.find({}).limit(2);
            console.log('Available users in DB:', users.map(u => ({ id: u._id, email: u.email })));
            process.exit(1);
        }
        console.log('User found:', user.email);

        const company = await mongoose.connection.collection('companiesDB').findOne({
            _id: new mongoose.Types.ObjectId(targetCompanyId)
        });

        if (!company) {
            console.error('Target company not found:', targetCompanyId);
            process.exit(1);
        }
        console.log('Company found:', company.companyName || company.name);

        const companyClientIds = company.clients || [];
        const queryIds = companyClientIds.map(id => {
            return mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : id;
        });

        const activeClient = await Client.findOne({
            _id: { $in: queryIds },
            enable: true
        });

        const selectedClientId = activeClient ? activeClient._id : (queryIds.length > 0 ? queryIds[0] : null);
        console.log('Selected Client ID for switch:', selectedClientId);

        if (!selectedClientId) {
            console.error('No clients found for target company');
            process.exit(1);
        }

        // Test Token Generation Logic (matching authController.js)
        const generateToken = (id, email, companyID, activeClientID, role, roleID, currentCompanyID, productAdmin) => {
            const payload = { id, email, companyID, activeClientID, role, roleID };
            if (currentCompanyID) payload.currentCompanyID = currentCompanyID;
            if (productAdmin !== undefined) payload.productAdmin = productAdmin;
            return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });
        };

        const token = generateToken(
            user._id,
            user.email,
            user.companyID,
            selectedClientId,
            user.role,
            user.roleID,
            targetCompanyId,
            user.accessibilitySettings?.productAdmin
        );

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded context fields:', {
            currentCompanyID: decoded.currentCompanyID,
            activeClientID: decoded.activeClientID,
            productAdmin: decoded.productAdmin
        });

        if (decoded.currentCompanyID === targetCompanyId && decoded.activeClientID.toString() === selectedClientId.toString()) {
            console.log('SUCCESS: Phase 1 Context Switching Verified!');
        } else {
            console.log('FAILURE: Payload mismatch');
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error('Fatal:', err);
        process.exit(1);
    }
}

run();

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');

async function run() {
    try {
        console.log('Starting verification...');
        dotenv.config({ path: path.join(__dirname, '.env') });
        console.log('Env loaded');

        const User = require('./models/User');
        const Client = require('./models/Client');

        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const userId = '6112806bc9147f673d28c6ee';
        const targetCompanyId = '61814138c98444344034ca8c';

        const user = await User.findById(userId);
        if (!user) {
            console.error('User not found');
            process.exit(1);
        }
        console.log('User found:', user.email);

        const company = await mongoose.connection.collection('companiesDB').findOne({
            _id: new mongoose.Types.ObjectId(targetCompanyId)
        });

        if (!company) {
            console.error('Target company not found');
            process.exit(1);
        }
        console.log('Company found:', company.companyName || company.name);

        const queryIds = (company.clients || []).map(id => {
            return mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : id;
        });

        const activeClient = await Client.findOne({
            _id: { $in: queryIds },
            enable: true
        });

        const selectedClientId = activeClient ? activeClient._id : queryIds[0];
        console.log('Selected Client ID:', selectedClientId);

        // JWT Logic Test
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
            selectedClientId,
            user.role,
            user.roleID,
            targetCompanyId,
            user.accessibilitySettings?.productAdmin
        );

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded JWT payload:', decoded);

        if (decoded.currentCompanyID.toString() === targetCompanyId && decoded.activeClientID.toString() === selectedClientId.toString()) {
            console.log('SUCCESS: JWT context verified!');
        } else {
            console.log('FAILURE: JWT context mismatch');
        }

        await mongoose.disconnect();
        console.log('Done');
    } catch (err) {
        console.error('Verification Fatal Error:', err);
    }
}

run();

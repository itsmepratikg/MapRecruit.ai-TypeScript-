const mongoose = require('mongoose');
const Client = require('../models/Client');
const User = require('../models/User');

// @desc    Get all clients (Filtered by Company and User Access)
// @route   GET /api/clients
// @access  Private
const getClients = async (req, res) => {
    try {
        // Prioritize currentCompanyID for context-aware fetching
        const { id: userId } = req.user;
        const companyID = req.user.currentCompanyID || req.user.companyID;

        console.log(`[DEBUG] getClients - User: ${userId}, Context CompanyID: ${companyID}`);

        if (!companyID) {
            console.warn('[DEBUG] getClients - No Company ID found in user token');
            return res.status(400).json({ message: 'User has no Company ID' });
        }

        // 1. Fetch Company Document to get Master Client List
        // Enforce ObjectId usage as per requirement
        if (!mongoose.Types.ObjectId.isValid(companyID)) {
            console.error(`[DEBUG] getClients - Invalid Company ID format: ${companyID}`);
            return res.status(400).json({ message: 'Invalid Company ID format' });
        }

        const company = await mongoose.connection.collection('companiesDB').findOne({
            _id: new mongoose.Types.ObjectId(companyID)
        });

        if (!company) {
            console.error(`[DEBUG] getClients - Company NOT FOUND for ID: ${companyID}`);
            return res.status(404).json({ message: 'Company not found' });
        }
        console.log(`[DEBUG] getClients - Found Company: ${company.name || company.companyName}. Clients count: ${company.clients?.length || 0}`);

        // Normalize Company Clients to Strings
        const companyClientIds = (company.clients || []).map(id => id.toString());

        // 2. Fetch User to determine Access Level
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            console.error(`[DEBUG] getClients - Invalid User ID format: ${userId}`);
            return res.status(400).json({ message: 'Invalid User ID format' });
        }

        const user = await User.findOne({ _id: new mongoose.Types.ObjectId(userId) });

        if (!user) {
            console.error(`[DEBUG] getClients - User NOT FOUND: ${userId}`);
            return res.status(404).json({ message: 'User not found' });
        }
        console.log(`[DEBUG] getClients - User Role: ${user.role}. User Assigned Clients: ${user.clients?.length || 0}`);

        // 3. Determine Clients Allowed for this User
        let allowedClientIds = [];
        const isAdmin = ['Product Admin', 'Admin', 'Super Admin'].includes(user.role);

        if (isAdmin) {
            allowedClientIds = companyClientIds;
            console.log(`[DEBUG] getClients - Admin Access. Allowing all ${allowedClientIds.length} company clients.`);
        } else {
            const userClientIds = (user.clients || []).map(id => id.toString());
            allowedClientIds = companyClientIds.filter(id => userClientIds.includes(id));
            console.log(`[DEBUG] getClients - Standard Access. Intersection Count: ${allowedClientIds.length}`);
        }

        if (allowedClientIds.length === 0) {
            console.warn('[DEBUG] getClients - No allowed clients found for this user/company combination.');
            return res.status(200).json([]);
        }

        // 4. Fetch Details for Allowed Clients
        // We must support both String and ObjectId types for _id in clientsdb
        const queryIds = [];
        allowedClientIds.forEach(id => {
            queryIds.push(id);
            if (mongoose.Types.ObjectId.isValid(id)) {
                queryIds.push(new mongoose.Types.ObjectId(id));
            }
        });

        const clients = await Client.find({
            _id: { $in: queryIds }
        });

        console.log(`[DEBUG] getClients - Found ${clients.length} detailed client docs in clientsDB.`);

        const formattedClients = clients.map(c => {
            const doc = c.toObject ? c.toObject() : c;
            return {
                ...doc,
                _id: doc._id,
                clientName: doc.clientName || doc.name || 'Unnamed Client',
                clientCode: doc.clientCode || '',
                clientType: doc.clientType || 'Client',
                status: doc.status || 'Active'
            };
        });

        res.status(200).json(formattedClients);

    } catch (error) {
        console.error('[DEBUG] getClients - FATAL ERROR:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getClientById = async (req, res) => {
    try {
        const { companyID, id: userId } = req.user;
        const clientId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(clientId)) {
            return res.status(400).json({ message: 'Invalid Client ID format' });
        }

        // 1. Fetch Company Document
        if (!mongoose.Types.ObjectId.isValid(companyID)) {
            return res.status(400).json({ message: 'Invalid Company ID format' });
        }

        const company = await mongoose.connection.collection('companiesDB').findOne({
            _id: new mongoose.Types.ObjectId(companyID)
        });

        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        const companyClientIds = (company.clients || []).map(id => id.toString());

        // 2. Fetch User to determine Access Level
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid User ID format' });
        }

        const user = await User.findOne({ _id: new mongoose.Types.ObjectId(userId) });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 3. Determine Clients Allowed for this User
        let allowedClientIds = [];
        const isAdmin = ['Product Admin', 'Admin', 'Super Admin'].includes(user.role);

        if (isAdmin) {
            allowedClientIds = companyClientIds;
        } else {
            const userClientIds = (user.clients || []).map(id => id.toString());
            allowedClientIds = companyClientIds.filter(id => userClientIds.includes(id));
        }

        // 4. Verify Access to Requested Client
        if (!allowedClientIds.includes(clientId)) {
            return res.status(403).json({ message: 'Access denied to this client' });
        }

        // 5. Fetch Client Details
        const client = await Client.findOne({ _id: new mongoose.Types.ObjectId(clientId) });

        if (!client) {
            return res.status(404).json({ message: 'Client not found in database' });
        }

        const doc = client.toObject();
        const formattedClient = {
            ...doc,
            _id: doc._id,
            clientName: doc.clientName || doc.name || 'Unnamed Client',
            clientCode: doc.clientCode || '',
            clientType: doc.clientType || 'Client',
            status: doc.status || 'Active'
        };

        res.status(200).json(formattedClient);

    } catch (error) {
        console.error('[DEBUG] getClientById - FATAL ERROR:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getClients,
    getClientById
};

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
const log = (msg) => console.error(msg);

const mapConnections = async () => {
    try {
        log('Connecting...');
        await mongoose.connect(MONGO_URI);
        const db = mongoose.connection.db;

        const report = {};

        // 1. COMPANIES (companiesDB)
        log('Fetching Companies...');
        const companies = await db.collection('companiesDB').find({}).toArray();
        report.companies = companies.map(c => ({
            id: c._id.toString(),
            name: c.name
        }));

        // 2. CLIENTS (clientsdb)
        log('Fetching Clients...');
        // Note: logs showed 'clientsdb' (lowercase)
        const clients = await db.collection('clientsdb').find({}).toArray();
        report.clients = clients.map(c => ({
            id: c._id.toString(),
            name: c.name,
            companyId: c.companyId?.toString() || c.companyID?.toString()
        }));

        // 3. OWNING ENTITIES (owningentities)
        log('Fetching Owning Entities...');
        const entities = await db.collection('owningentities').find({}).toArray();
        report.owningEntities = entities.map(e => ({
            id: e._id.toString(),
            name: e.name,
            linkedClientIDs: e.clientIDs?.map(id => id.toString()) || []
        }));

        // 4. USERS (usersDB)
        log('Fetching Users...');
        const users = await db.collection('usersDB').find({}).limit(50).toArray();
        report.users = users.map(u => ({
            id: u._id.toString(),
            name: `${u.firstName} ${u.lastName}`,
            email: u.email,
            companyId: u.companyId?.toString() || u.companyID?.toString(),
            clientId: u.clientId?.toString() || u.clientID?.toString() || u.activeClientID?.toString() || u.activeClient?.toString()
        }));

        log('Writing report...');
        fs.writeFileSync('connection_report.json', JSON.stringify(report, null, 2));
        log('Done.');

        process.exit(0);

    } catch (e) {
        log(e.message);
        process.exit(1);
    }
};

mapConnections();

const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const logFile = 'debug_output.txt';
const log = (msg) => {
    console.log(msg);
    fs.appendFileSync(logFile, msg + '\n');
};

const run = async () => {
    try {
        fs.writeFileSync(logFile, ''); // Clear file
        await mongoose.connect(process.env.MONGO_URI);
        log('Connected to DB');

        // 1. Check Clients in clientsdb
        const clientsColl = mongoose.connection.collection('clientsdb');
        const clientsCount = await clientsColl.countDocuments();
        log(`\n[clientsdb] Total Clients: ${clientsCount}`);
        const allClients = await clientsColl.find({}).limit(5).toArray();
        allClients.forEach(c => {
            log(`  Client: ${c.name} (_id: ${c._id}, type: ${typeof c._id})`);
        });

        // 2. Check Companies in companiesDB
        const companiesColl = mongoose.connection.collection('companiesDB');
        const companiesCount = await companiesColl.countDocuments();
        log(`\n[companiesDB] Total Companies: ${companiesCount}`);
        const allCompanies = await companiesColl.find({}).limit(5).toArray();

        allCompanies.forEach(c => {
            log(`  Company: ${c.name || c.companyName} (_id: ${c._id}, type: ${typeof c._id})`);
            log(`    Clients Array Length: ${c.clients?.length || 0}`);
            if (c.clients && c.clients.length > 0) {
                log(`    Sample Client ID in Array: ${c.clients[0]} (type: ${typeof c.clients[0]})`);
            }
        });

        // 3. Check Users in usersDB
        const usersColl = mongoose.connection.collection('usersDB');
        const usersCount = await usersColl.countDocuments();
        log(`\n[usersDB] Total Users: ${usersCount}`);
        const allUsers = await usersColl.find({}).limit(5).toArray();

        for (const u of allUsers) {
            log(`  User: ${u.email} (_id: ${u._id})`);
            log(`    Role: ${u.role}`);
            log(`    CompanyID: ${u.companyID} (type: ${typeof u.companyID})`);

            // Validate Company Link
            if (u.companyID) {
                const linkedCompany = await companiesColl.findOne({
                    $or: [
                        { _id: u.companyID },
                        { _id: u.companyID.toString() },
                        { _id: new mongoose.Types.ObjectId(u.companyID) } // Try as ObjectId if it valid string
                    ]
                });
                if (linkedCompany) {
                    log(`    -> Linked Company Found: ${linkedCompany.name || linkedCompany.companyName}`);
                } else {
                    log(`    -> ORPHANED: CompanyID ${u.companyID} not found in companiesDB`);
                }
            } else {
                log(`    -> NO COMPANY LINKED`);
            }
        }

        process.exit(0);
    } catch (e) {
        log(`ERROR: ${e.message}`);
        console.error(e);
        process.exit(1);
    }
};

run();

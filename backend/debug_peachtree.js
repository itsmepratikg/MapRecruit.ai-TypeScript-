const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const clients = await mongoose.connection.collection('clientsdb').find({
            $or: [
                { name: { $regex: 'Peachtree', $options: 'i' } },
                { clientName: { $regex: 'Peachtree', $options: 'i' } }
            ]
        }).toArray();
        console.log(JSON.stringify(clients.map(c => ({
            name: c.name || c.clientName,
            type: c.clientType
        })), null, 2));
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};
run();

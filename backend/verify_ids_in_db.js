const mongoose = require('mongoose');
const Client = require('./models/Client'); // Adjust path
const dotenv = require('dotenv');
dotenv.config();

const clientIDs = [
    "6112806bc9147f673d28c6ec",
    "62d1026687ec2c2f0faa4949",
    "62d1049a074e604a7ab72180",
    "62d104c34a907656480d9f47",
    "62d104e8074e604a7ab72182",
    "62d10513074e604a7ab72183",
    "62d10535074e604a7ab72184",
    "62d1057c074e604a7ab72186",
    "62d105cb074e604a7ab72188",
    "62d105f7074e604a7ab72189",
    "62fc715f7a56a3e23a512ca3",
    "62fc7187531e0d81b16081ad",
    "62fc724c7a56a3e23a512ca5",
    "62fc72757a56a3e23a512ca6",
    "62fc72ab8aaf6189133b4c2d",
    "62fc72d27a56a3e23a512ca7",
    "6364a0f865cc72affda86c55",
    "6364a12d17646e2f55edd9cb",
    "6364a12e17646e2f55edd9cc",
    "6364a12e17646e2f55edd9cd",
    "6364a12e17646e2f55edd9ce",
    "6364a12e17646e2f55edd9cf",
    "6364a12f17646e2f55edd9d0",
    "6364a12f17646e2f55edd9d1",
    "6364a12f17646e2f55edd9d2",
    "6364a13017646e2f55edd9d3",
    "6364a13017646e2f55edd9d4",
    "6364a13017646e2f55edd9d5",
    "6364a13017646e2f55edd9d6",
    "6364a13117646e2f55edd9d7",
    "6364a13117646e2f55edd9d8",
    "6364a13117646e2f55edd9d9",
    "637707e36a5c4b1890d76a77",
    "63cb6dfb9987b6a9eb0d8b87",
    "6364b4adcba935a92fe2646b",
    "6364b51cf0745116ec88f1d2",
    "6364b51df0745116ec88f1d3",
    "6364b51ef0745116ec88f1d4",
    "6364b51ff0745116ec88f1d5",
    "6364b520f0745116ec88f1d6",
    "6364b522f0745116ec88f1d8",
    "6364b523f0745116ec88f1d9",
    "6364b524f0745116ec88f1da",
    "6364b525f0745116ec88f1db",
    "6364b526f0745116ec88f1dc",
    "6364b527f0745116ec88f1dd",
    "6364b528f0745116ec88f1de",
    "6364b529f0745116ec88f1df",
    "6364b52af0745116ec88f1e0",
    "643ea487e608480b45917380",
    "67af4ee99b90afd53f253011",
    "67eaa2df9251685e6dc8133e",
    "6916d147a05f57a943bbc6b3"
];

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const existing = await Client.find({ _id: { $in: clientIDs } }).select('_id');
        const existingIds = existing.map(c => c._id.toString());

        console.log(`Total IDs provided: ${clientIDs.length}`);
        console.log(`IDs found in DB: ${existingIds.length}`);

        const missing = clientIDs.filter(id => !existingIds.includes(id));
        console.log(`Missing IDs: ${missing.length}`);
        if (missing.length > 0) {
            console.log('First 5 missing:', missing.slice(0, 5));
        }

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

run();

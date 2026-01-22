const mongoose = require('mongoose');
const Client = require('./models/Client');
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

// Details for the one complete record we have
const knownClientOne = {
    _id: new mongoose.Types.ObjectId("6112806bc9147f673d28c6ec"),
    companyID: "6112806bc9147f673d28c6eb",
    name: "TRC Talent Solutions", // Mapped from clientName
    clientName: "TRC Talent Solutions",
    clientURL: "https://trctalent.com/",
    clientType: "Branch",
    description: "At TRC, we take pride in fulfilling our opportunity to add value...",
    language: "English",
    country: "United States",
    status: true
};

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        let insertedCount = 0;
        let updatedCount = 0;

        for (const idStr of clientIDs) {
            const id = new mongoose.Types.ObjectId(idStr);
            const exists = await Client.findById(id);

            if (exists) {
                // If it exists, we skip overwriting unless it's the known one and we want to ensure details
                if (idStr === "6112806bc9147f673d28c6ec") {
                    Object.assign(exists, knownClientOne);
                    await exists.save();
                    console.log(`Updated details for known client: ${idStr}`);
                    updatedCount++;
                } else {
                    console.log(`Client ${idStr} already exists. Skipping.`);
                }
            } else {
                // Not found - Insert
                let doc = {};
                if (idStr === "6112806bc9147f673d28c6ec") {
                    doc = knownClientOne;
                } else {
                    // Placeholder
                    doc = {
                        _id: id,
                        name: `Restored Client ${idStr.slice(-6)}`,
                        clientType: "Uncategorized",
                        companyID: "6112806bc9147f673d28c6eb", // Default to user's company
                        note: "Automatically restored as placeholder. Please update details."
                    };
                }

                await Client.create(doc);
                console.log(`Inserted: ${doc.name} (${idStr})`);
                insertedCount++;
            }
        }

        console.log(`\nOperation Complete.`);
        console.log(`Inserted: ${insertedCount}`);
        console.log(`Updated: ${updatedCount}`);

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

run();

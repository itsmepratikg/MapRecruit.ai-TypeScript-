const fs = require('fs');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');

const MONGO_URI = 'mongodb+srv://pratikgaurav:6g7_%23C3OPqh%3D@campaigndb.7vpl08o.mongodb.net/MRv5';
const TRASH_DIR = path.join(__dirname, '..', '.trash', 'SchemaData', 'Interviews');
const TARGET_CAMPAIGNS = ['6931992db394b307b3b087df', '693696b395bfcea522303666'];

async function syncInterviews() {
    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db('MRv5');
        const collection = db.collection('interviewsdb');

        const files = fs.readdirSync(TRASH_DIR).filter(f => f.endsWith('.txt'));
        let totalUpserted = 0;

        for (const file of files) {
            console.log(`Processing ${file}...`);
            const filePath = path.join(TRASH_DIR, file);
            let content = fs.readFileSync(filePath, 'utf8');

            // Clean EJSON tags to make it valid JSON
            // ObjectId("...") -> "..."
            content = content.replace(/ObjectId\("([^"]+)"\)/g, '"$1"');
            // ISODate("...") -> "..."
            content = content.replace(/ISODate\("([^"]+)"\)/g, '"$1"');

            let data;
            try {
                data = JSON.parse(content);
            } catch (e) {
                console.error(`Error parsing ${file}:`, e.message);
                continue;
            }

            if (!Array.isArray(data)) data = [data];

            const filteredData = data.filter(item =>
                TARGET_CAMPAIGNS.includes(item.campaignID)
            );

            console.log(`Found ${filteredData.length} relevant documents in ${file}`);

            for (const item of filteredData) {
                const id = new ObjectId(item._id);
                delete item._id; // Remove _id from update body

                // Convert string dates to Date objects
                if (item.createdAt) item.createdAt = new Date(item.createdAt);
                if (item.updatedAt) item.updatedAt = new Date(item.updatedAt);
                if (item.MRI && item.MRI.calculatedAt) item.MRI.calculatedAt = new Date(item.MRI.calculatedAt);

                // Ensure other potential ObjectIds are converted if needed
                if (item.resumeID) item.resumeID = new ObjectId(item.resumeID);
                if (item.campaignID) item.campaignID = new ObjectId(item.campaignID);
                if (item.companyID) item.companyID = new ObjectId(item.companyID);
                if (item.clientID) item.clientID = new ObjectId("697a4077891fda1733d14a31"); // Forced to match target environment
                if (item.userID) item.userID = new ObjectId(item.userID);

                await collection.updateOne(
                    { _id: id },
                    { $set: item },
                    { upsert: true }
                );
                totalUpserted++;
            }
        }

        console.log(`Sync complete. Total upserted: ${totalUpserted}`);
    } catch (err) {
        console.error('Sync failed:', err);
    } finally {
        await client.close();
    }
}

syncInterviews();

const mongoose = require('mongoose');
const Candidate = require('../models/Candidate');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGO_URI || "mongodb://localhost:27017/maprecruit";

const seedData = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Create a dummy company ID if we don't want to query (or query purely for safety)
        const companyID = new mongoose.Types.ObjectId("65a000000000000000000001");

        const candidateData = {
            companyID: companyID,
            profile: {
                firstName: 'Testy',
                lastName: 'McTestFace',
                fullName: 'Testy McTestFace',
                emails: [
                    { text: 'testy@example.com', email: 'testy@example.com', type: 'Personal', preferred: 'Yes' }
                ],
                phones: [
                    { text: '555-0123', phoneNumberOnly: '5550123', type: 'Mobile' }
                ]
            },
            professionalSummary: {
                summary: 'Experienced software test dummy with over 5 years of crashing into walls.',
                currentSalary: { value: 100000, currency: 'USD' },
                expectedSalary: { value: 120000, currency: 'USD' }
            },
            professionalExperience: [
                {
                    company: { text: "Crash Test Dummies Inc." },
                    jobTitle: { text: "Lead Dummy" },
                    startDate: { text: "2018-01-01" },
                    endDate: { text: "Present" },
                    description: "Responsible for safety checks."
                }
            ],
            professionalQualification: {
                skills: [{ text: "Safety" }, { text: "Crashing" }, { text: "Flying" }]
            },
            metaData: {
                mrProfileID: `MR-${Date.now()}`
            }
        };

        const newCandidate = await Candidate.create(candidateData);
        console.log(`Candidate seeded successfully!`);
        console.log(`ID: ${newCandidate._id}`);
        console.log(`URL: http://localhost:3000/profiles/${newCandidate._id}`);

    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        await mongoose.disconnect();
    }
};

seedData();

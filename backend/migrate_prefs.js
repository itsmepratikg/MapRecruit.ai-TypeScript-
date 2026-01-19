
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const migrateSettings = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const userIdStr = '696a1d32e8ceec1d15098204';

        // Use the robust query similar to controller
        let query = { $or: [{ _id: userIdStr }] };
        if (mongoose.Types.ObjectId.isValid(userIdStr)) {
            query.$or.push({ _id: new mongoose.Types.ObjectId(userIdStr) });
        }

        const user = await User.findOne(query);

        if (user) {
            console.log(`Found User: ${user.email} (ID Type: ${typeof user._id})`);

            // Default Settings from data.ts
            const defaults = {
                theme: "system",
                language: "English (US)",
                dashboardConfig: {
                    rowHeight: 30,
                    margin: 15,
                    layouts: {
                        desktop: [
                            { "id": "welcome", "x": 0, "y": 0, "w": 4, "h": 10, "visible": true },
                            { "id": "active_campaigns", "x": 4, "y": 0, "w": 2, "h": 4, "visible": true },
                            { "id": "closed_campaigns", "x": 6, "y": 0, "w": 2, "h": 4, "visible": true },
                            { "id": "active_profiles", "x": 8, "y": 0, "w": 2, "h": 4, "visible": true },
                            { "id": "shortlisted", "x": 10, "y": 0, "w": 2, "h": 4, "visible": true },
                            { "id": "alerts", "x": 4, "y": 5, "w": 8, "h": 5, "visible": true },
                            { "id": "trend_graph", "x": 0, "y": 11, "w": 6, "h": 12, "visible": true },
                            { "id": "source_distribution", "x": 6, "y": 11, "w": 6, "h": 12, "visible": true },
                            { "id": "upcoming_interviews", "x": 0, "y": 24, "w": 6, "h": 10, "visible": true },
                            { "id": "email_delivery", "x": 6, "y": 24, "w": 6, "h": 10, "visible": true },
                            { "id": "portal_reports", "x": 6, "y": 35, "w": 6, "h": 10, "visible": true },
                            { "id": "pre_screening", "x": 0, "y": 35, "w": 6, "h": 10, "visible": true }
                        ],
                        tablet: [
                            { id: "welcome", x: 0, y: 0, w: 12, h: 6, visible: true },
                            { id: "active_campaigns", x: 0, y: 6, w: 6, h: 4, visible: true },
                            { id: "closed_campaigns", x: 6, y: 6, w: 6, h: 4, visible: true },
                            { id: "active_profiles", x: 0, y: 10, w: 6, h: 4, visible: true },
                            { id: "shortlisted", x: 6, y: 10, w: 6, h: 4, visible: true },
                            { id: "alerts", x: 0, y: 14, w: 12, h: 4, visible: true },
                            { id: "trend_graph", x: 0, y: 18, w: 12, h: 12, visible: true },
                            { id: "source_distribution", x: 0, y: 30, w: 12, h: 12, visible: true },
                            { id: "upcoming_interviews", x: 0, y: 42, w: 6, h: 8, visible: true },
                            { id: "email_delivery", x: 6, y: 42, w: 6, h: 8, visible: true },
                            { id: "portal_reports", x: 0, y: 50, w: 6, h: 8, visible: true },
                            { id: "pre_screening", x: 0, y: 58, w: 12, h: 8, visible: true }
                        ],
                        mobile: [
                            { id: "welcome", x: 0, y: 0, w: 12, h: 8, visible: true },
                            { id: "active_campaigns", x: 0, y: 8, w: 12, h: 4, visible: true },
                            { id: "closed_campaigns", x: 0, y: 12, w: 12, h: 4, visible: true },
                            { id: "active_profiles", x: 0, y: 16, w: 12, h: 4, visible: true },
                            { id: "shortlisted", x: 0, y: 20, w: 12, h: 4, visible: true },
                            { id: "alerts", x: 0, y: 24, w: 12, h: 4, visible: true },
                            { id: "trend_graph", x: 0, y: 28, w: 12, h: 12, visible: true },
                            { id: "source_distribution", x: 0, y: 40, w: 12, h: 12, visible: true },
                            { id: "upcoming_interviews", x: 0, y: 52, w: 12, h: 8, visible: true },
                            { id: "email_delivery", x: 0, y: 60, w: 12, h: 8, visible: true },
                            { id: "portal_reports", x: 0, y: 68, w: 12, h: 8, visible: true },
                            { id: "pre_screening", x: 0, y: 76, w: 12, h: 8, visible: true }
                        ]
                    }
                }
            };

            // Force update
            user.accessibilitySettings = defaults;
            await user.save();
            console.log("User updated successfully with default settings.");
        } else {
            console.log("Detailed query failed to find user.");
        }
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.connection.close();
        process.exit();
    }
};

migrateSettings();

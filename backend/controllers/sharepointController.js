const { Client } = require('@microsoft/microsoft-graph-client');

const Subscription = require('../models/Subscription');
const axios = require('axios'); // Fallback/Alternative for raw requests
const fs = require('fs');
const path = require('path');

// --- Helper: Get Graph Client (App-Only Auth) ---
// In a real app, use a proper AuthProvider. For structure, we assume a function or middleware provides the token.
// For now, we'll placeholder the auth logic.
async function getGraphClient() {
    // TODO: Implement Client Credentials Flow to get token
    // const accessToken = await getAccessToken();
    // return Client.init({ authProvider: (done) => done(null, accessToken) });
    return null; // Placeholder
}

// --- 1. Validation (The "Gotcha") ---
exports.handleValidation = (req, res, next) => {
    // Graph sends validationToken in query string
    const validationToken = req.query.validationToken;
    if (validationToken) {
        console.log('Received SharePoint validation token:', validationToken);
        // Must return text/plain 200 OK with the token
        res.setHeader('Content-Type', 'text/plain');
        return res.status(200).send(validationToken);
    }
    // If no token, it might be a real notification
    next();
};

// --- 2. Notification Handler ---
exports.handleNotification = async (req, res) => {
    // Acknowledge immediately to avoid retries
    res.status(202).send();

    const notifications = req.body.value;
    if (!notifications || notifications.length === 0) return;

    for (const notification of notifications) {
        try {
            const subId = notification.subscriptionId;
            const sub = await Subscription.findOne({ subscriptionId: subId });

            if (!sub) {
                console.warn(`Received notification for unknown subscription: ${subId}`);
                continue;
            }

            // --- 3. Delta Query (The "Delta Gotcha") ---
            // We use the saved deltaToken (or null for first run)
            // Ideally, execute this in background/queue
            await processDeltaChanges(sub);

        } catch (error) {
            console.error('Error processing notification:', error);
        }
    }
};

async function processDeltaChanges(subscription) {
    // Placeholder for Graph Client
    // const client = await getGraphClient();

    // Construct Delta URL
    // If we have a deltaLink/token, use it. Otherwise call /delta
    // Code logic to fetch changes...

    console.log(`Processing changes for subscription ${subscription.subscriptionId}`);

    // Simulate finding a file
    // 1. Get changes
    // 2. Filter for 'file' type and 'created'/'updated'
    // 3. Download content
    // 4. Update subscription with new deltaToken
}

// --- 4. Create Subscription ---
exports.subscribe = async (req, res) => {
    try {
        const { resource, userId } = req.body; // resource = drives/{id}/root

        // Call Graph API to create subscription
        // const client = await getGraphClient();
        // const graphSub = await client.api('/subscriptions').post({...});

        // Save to DB
        // const newSub = await Subscription.create({...});

        res.status(201).json({ message: 'Subscribed successfully', mock: true });
    } catch (error) {
        console.error('Subscription error:', error);
        res.status(500).json({ error: error.message });
    }
};

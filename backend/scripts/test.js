console.log('Start Test');
try {
    const mongoose = require('mongoose');
    console.log('Mongoose version:', mongoose.version);
    const Campaign = require('../models/Campaign');
    console.log('Campaign Model loaded');
} catch (e) {
    console.error('Failed to load:', e);
}

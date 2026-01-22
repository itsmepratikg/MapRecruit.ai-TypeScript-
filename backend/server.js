const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Set mongoose options
mongoose.set('strictQuery', false);

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Support large JSON payloads for schemaless data

// Logging Middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
    next();
});

// Database Connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/clients', require('./routes/clientRoutes'));
app.use('/api/campaigns', require('./routes/campaignRoutes'));
app.use('/api/profiles', require('./routes/profileRoutes'));
app.get('/api/debug', (req, res) => res.json({
    message: 'Backend is alive',
    time: new Date().toISOString(),
    env: process.env.NODE_ENV,
    rpID: process.env.RP_ID
}));

app.get('/', (req, res) => {
    res.send('MapRecruit Schema API is running...');
});

// 404 Handler for /api
app.use('/api', (req, res) => {
    console.warn(`API 404: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        message: `Route ${req.method} ${req.originalUrl} not found`,
        availablePaths: [
            '/api/auth/register',
            '/api/auth/login',
            '/api/auth/me',
            '/api/auth/passkey/register-options',
            '/api/auth/passkey/register-verify',
            '/api/auth/passkey/login-options',
            '/api/auth/passkey/login-verify'
        ]
    });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    });
}

module.exports = app;
// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    // server.close(() => process.exit(1));
});

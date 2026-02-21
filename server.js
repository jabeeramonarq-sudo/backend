const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - CORS Configuration
const allowedOrigins = [
    'http://localhost:8080',
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL || 'https://www.amonarq.com',
    'https://www.amonarq.com',
    'https://amonarq.com',
    'https://api.amonarq.com'
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, Postman)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(null, true); // Allow all for development
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 86400 // 24 hours
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
const mongoOptions = {
    serverSelectionTimeoutMS: 30000, // Increased from 5000ms
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    minPoolSize: 2,
    retryWrites: true,
    retryReads: true,
    // bufferCommands: true, // Enable buffering (default)
    autoIndex: true,
};

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/amonarq', mongoOptions)
    .then(() => {
        console.log('✅ Connected to MongoDB');
        console.log('Database:', mongoose.connection.name);
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
        console.error('Full error:', err);
        // Don't exit in serverless - let it retry on next request
    });

// Handle connection events
mongoose.connection.on('error', err => {
    console.error('MongoDB error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
});

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/invitations', require('./src/routes/invitationRoutes'));
app.use('/api/settings', require('./src/routes/settingsRoutes'));
app.use('/api/inbox', require('./src/routes/inboxRoutes'));
app.use('/api/upload', require('./src/routes/uploadRoutes'));
app.use('/api/dashboard', require('./src/routes/dashboardRoutes'));
app.use('/api/email', require('./src/routes/emailRoutes'));
app.use('/api/content', require('./src/routes/contentRoutes'));

// Health check
app.get('/health', (req, res) => res.status(200).send('API is healthy'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// Export for Vercel serverless
module.exports = app;

// Only listen on port if not in serverless environment
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: '*', // For development, allow all. Refine for production.
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/amonarq')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/invitations', require('./src/routes/invitationRoutes'));
app.use('/api/settings', require('./src/routes/settingsRoutes'));
app.use('/api/content', require('./src/routes/contentRoutes'));
app.use('/api/inbox', require('./src/routes/inboxRoutes'));
app.use('/api/upload', require('./src/routes/uploadRoutes'));
app.use('/api/dashboard', require('./src/routes/dashboardRoutes'));
app.use('/api/email', require('./src/routes/emailRoutes'));

// Health check
app.get('/health', (req, res) => res.status(200).send('API is healthy'));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

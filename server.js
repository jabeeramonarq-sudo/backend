const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Config
dotenv.config();

// Routes
const authRoutes = require('./src/routes/authRoutes');
const contactRoutes = require('./src/routes/contactRoutes');
const contentRoutes = require('./src/routes/contentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/amonarq')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes); // Legacy support and new submission logic
app.use('/api/contacts', contactRoutes); // Admin management
app.use('/api/content', contentRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

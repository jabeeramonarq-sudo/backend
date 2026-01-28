const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Settings = require('../models/Settings');
const auth = require('../middleware/auth');

// Public route to get settings
router.get('/', async (req, res) => {
    try {
        // Prevent caching to ensure fresh data
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');

        console.log('Fetching settings...');
        
        // Check if MongoDB is connected
        if (mongoose.connection.readyState !== 1) {
            console.log('MongoDB not connected, attempting to reconnect...');
            await mongoose.connect(process.env.MONGODB_URI);
        }
        
        let settings = await Settings.findOne();
        console.log('Settings found:', settings ? 'Yes' : 'No');

        if (!settings) {
            console.log('Creating default settings...');
            settings = new Settings();
            await settings.save();
            console.log('Default settings created');
        }
        res.json(settings);
    } catch (error) {
        console.error('Settings route error:', error);
        console.error('Error name:', error.name);
        console.error('Error code:', error.code);
        
        // Specific error handling
        if (error.name === 'MongooseServerSelectionError') {
            return res.status(503).json({
                error: 'Database connection failed',
                message: 'Unable to connect to database. Please check configuration.'
            });
        }
        
        res.status(500).json({
            error: 'Failed to fetch settings',
            message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        });
    }
});

// Admin route to update settings
router.put('/', auth, async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings(req.body);
        } else {
            Object.assign(settings, req.body);
            settings.updatedAt = Date.now();
        }
        await settings.save();
        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

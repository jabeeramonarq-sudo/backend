const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Settings = require('../models/Settings');
const auth = require('../middleware/auth');

const ensureDbConnected = async () => {
    if (mongoose.connection.readyState === 1) return;
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is not set');
    }
    await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        minPoolSize: 2,
        retryWrites: true,
        retryReads: true,
        autoIndex: true,
    });
};

// Public route to get settings
router.get('/', async (req, res) => {
    try {
        // Prevent caching to ensure fresh data
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');

        await ensureDbConnected();

        console.log('Fetching settings...');
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
        res.status(500).json({
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Admin route to update settings
router.put('/', auth, async (req, res) => {
    try {
        await ensureDbConnected();
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

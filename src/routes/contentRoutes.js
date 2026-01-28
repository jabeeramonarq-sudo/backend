const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Content = require('../models/Content');
const auth = require('../middleware/auth');

// Public: Get content
router.get('/', async (req, res) => {
    try {
        // Prevent caching to ensure fresh data
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');

        console.log('Fetching content...');
        
        // Check if MongoDB is connected
        if (mongoose.connection.readyState !== 1) {
            console.log('MongoDB not connected, attempting to reconnect...');
            await mongoose.connect(process.env.MONGODB_URI);
        }
        
        const content = await Content.find({ isActive: true }).sort({ order: 1 });
        console.log('Content found:', content.length, 'items');

        res.json(content);
    } catch (error) {
        console.error('Content route error:', error);
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
            error: 'Failed to fetch content',
            message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        });
    }
});

// Admin: Create or update content
router.post('/', auth, async (req, res) => {
    try {
        const { sectionId } = req.body;
        let content = await Content.findOne({ sectionId });

        if (content) {
            Object.assign(content, req.body);
            content.updatedAt = Date.now();
        } else {
            content = new Content(req.body);
        }

        await content.save();
        res.json(content);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Admin: Delete content
router.delete('/:sectionId', auth, async (req, res) => {
    try {
        await Content.findOneAndDelete({ sectionId: req.params.sectionId });
        res.json({ message: 'Content deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

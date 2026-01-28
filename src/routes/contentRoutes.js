const express = require('express');
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
        const content = await Content.find({ isActive: true }).sort({ order: 1 });
        console.log('Content found:', content.length, 'items');

        res.json(content);
    } catch (error) {
        console.error('Content route error:', error);
        res.status(500).json({
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
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

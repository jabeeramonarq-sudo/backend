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

        const content = await Content.find({ isActive: true }).sort({ order: 1 });
        res.json(content);
    } catch (error) {
        res.status(500).json({ error: error.message });
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

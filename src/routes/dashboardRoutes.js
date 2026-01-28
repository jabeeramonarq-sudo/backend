const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const Content = require('../models/Content');
const User = require('../models/User');

router.get('/stats', async (req, res) => {
    try {
        const inboxCount = await Contact.countDocuments();
        const pendingCount = await Contact.countDocuments({ isRead: false });
        const sectionCount = await Content.countDocuments();
        const userCount = await User.countDocuments();

        res.json({
            inboxCount,
            pendingCount,
            sectionCount,
            userCount,
            siteQuality: 98 // Hardcoded for now, or calculate based on empty sections
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

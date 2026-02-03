const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const User = require('../models/User');

router.get('/stats', async (req, res) => {
    try {
        const inboxCount = await Contact.countDocuments();
        const pendingCount = await Contact.countDocuments({ isRead: false });
        const userCount = await User.countDocuments();

        res.json({
            inboxCount,
            pendingCount,
            userCount,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

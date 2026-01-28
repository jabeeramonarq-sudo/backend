const express = require('express');
const router = express.Router();
const { sendTestEmail } = require('../services/emailService');
const auth = require('../middleware/auth');

// Test email endpoint (admin only)
router.post('/test', auth, async (req, res) => {
    try {
        const { email } = req.body;
        await sendTestEmail(email || process.env.EMAIL_USER);
        res.json({ message: 'Test email sent successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

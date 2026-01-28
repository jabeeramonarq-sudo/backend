const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`Login attempt for: ${email}`);

        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found in database');
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);
        console.log('Password comparison result:', isMatch);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Check if setup is needed
router.get('/setup-status', async (req, res) => {
    try {
        const count = await User.countDocuments();
        res.json({ needsSetup: count === 0 });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Initial Setup
router.post('/setup-superadmin', async (req, res) => {
    try {
        const count = await User.countDocuments();
        if (count > 0) {
            return res.status(403).json({ error: 'Setup already completed' });
        }

        const { name, email, password } = req.body;
        const admin = new User({ name, email, password, role: 'superadmin' });
        await admin.save();

        res.status(201).json({ message: 'Super Admin created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

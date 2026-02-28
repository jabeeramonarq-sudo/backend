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

// Emergency reset/create superadmin (protected by env key)
router.post('/reset-superadmin', async (req, res) => {
    try {
        const { key, name, email, password } = req.body || {};
        if (!process.env.ADMIN_RESET_KEY) {
            return res.status(403).json({ error: 'Admin reset is disabled' });
        }
        if (key !== process.env.ADMIN_RESET_KEY) {
            return res.status(401).json({ error: 'Invalid reset key' });
        }
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        let admin = await User.findOne({ email });
        if (!admin) {
            // Reuse any existing superadmin/user to avoid duplicate-key failures on legacy unique indexes
            admin = await User.findOne({ role: 'superadmin' }) || await User.findOne();
        }

        if (!admin) {
            admin = new User({
                name: name || 'Super Admin',
                email,
                password,
                role: 'superadmin'
            });
        } else {
            admin.name = name || admin.name || 'Super Admin';
            admin.email = email;
            admin.password = password;
            admin.role = 'superadmin';
        }

        await admin.save();
        res.json({ message: 'Super Admin reset successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

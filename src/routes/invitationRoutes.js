const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { sendInvitationEmail } = require('../services/emailService');

// Middleware to check if user is super admin
const isSuperAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'superadmin') {
            return res.status(403).json({ error: 'Access denied. Super admin only.' });
        }
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Send invitation email
router.post('/send', auth, isSuperAdmin, async (req, res) => {
    try {
        const { email, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser && existingUser.isActive) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        // Generate invitation token
        const invitationToken = crypto.randomBytes(32).toString('hex');
        const invitationExpires = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours

        // Create or update user with invitation
        let user;
        if (existingUser) {
            // Update existing inactive user
            existingUser.invitationToken = invitationToken;
            existingUser.invitationExpires = invitationExpires;
            existingUser.role = role || 'admin';
            user = await existingUser.save();
        } else {
            // Create new user with temporary password
            user = new User({
                name: 'Pending',
                email,
                password: crypto.randomBytes(16).toString('hex'), // Temporary password
                role: role || 'admin',
                invitationToken,
                invitationExpires,
                isActive: false
            });
            await user.save();
        }

        // Send invitation email
        await sendInvitationEmail(email, invitationToken);

        res.status(200).json({
            message: 'Invitation sent successfully',
            email: user.email
        });
    } catch (error) {
        console.error('Error sending invitation:', error);
        res.status(500).json({ error: error.message });
    }
});

// Verify invitation token
router.get('/verify/:token', async (req, res) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({
            invitationToken: token,
            invitationExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired invitation token' });
        }

        res.json({
            email: user.email,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Complete registration
router.post('/complete', async (req, res) => {
    try {
        const { token, name, password } = req.body;

        const user = await User.findOne({
            invitationToken: token,
            invitationExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired invitation token' });
        }

        // Update user details
        user.name = name;
        user.password = password; // Will be hashed by pre-save hook
        user.isActive = true;
        user.invitationToken = undefined;
        user.invitationExpires = undefined;

        await user.save();

        res.json({
            message: 'Registration completed successfully',
            email: user.email
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

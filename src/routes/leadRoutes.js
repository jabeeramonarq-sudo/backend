const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const auth = require('../middleware/auth');
const User = require('../models/User');
const mongoose = require('mongoose');

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

router.post('/', async (req, res) => {
    try {
        const { name, email, sourceUrl } = req.body || {};
        const userAgent = req.get('user-agent') || '';

        if (!name || name.trim().length < 2) {
            return res.status(400).json({ error: 'Name is required' });
        }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: 'Valid email is required' });
        }

        await ensureDbConnected();

        const lead = new Lead({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            sourceUrl: (sourceUrl || '').trim(),
            userAgent
        });
        await lead.save();

        res.status(201).json({ message: 'Lead saved' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/', auth, isSuperAdmin, async (_req, res) => {
    try {
        const leads = await Lead.find().sort({ createdAt: -1 });
        res.json(leads);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', auth, isSuperAdmin, async (req, res) => {
    try {
        await Lead.findByIdAndDelete(req.params.id);
        res.json({ message: 'Lead deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

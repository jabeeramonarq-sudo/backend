const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { sendContactEmail } = require('../services/emailService');
const sendMail = require('../config/mail');
const auth = require('../middleware/auth');

// Public route to submit contact form
router.post('/submit', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Backend Validation
        if (!name || name.trim().length < 2) {
            return res.status(400).json({ error: 'Name must be at least 2 characters' });
        }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: 'Please provide a valid email address' });
        }
        if (!subject || subject.trim().length < 2) {
            return res.status(400).json({ error: 'Subject must be at least 2 characters' });
        }
        if (!message || message.trim().length < 2) {
            return res.status(400).json({ error: 'Message must be at least 2 characters' });
        }

        const newContact = new Contact({
            name: name.trim(),
            email: email.trim(),
            subject: subject.trim(),
            message: message.trim()
        });
        await newContact.save();

        // Send notification email to admin
        try {
            await sendContactEmail(name, email, subject, message);
        } catch (emailError) {
            console.error('Failed to send email notification:', emailError);
            // Don't fail the request if email fails
        }

        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Submission error:', error);
        res.status(500).json({ error: 'An internal server error occurred. Please try again later.' });
    }
});

// Admin: Get all messages
router.get('/', auth, async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Admin: Mark as read
router.patch('/:id/read', auth, async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
        res.json(contact);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Admin: Reply to message
router.post('/:id/reply', auth, async (req, res) => {
    try {
        const { replyMessage } = req.body;
        const contact = await Contact.findById(req.params.id);

        if (!contact) return res.status(404).json({ error: 'Message not found' });

        await sendMail(contact.email, `Re: ${contact.subject || 'Your inquiry'}`, replyMessage, `<p>${replyMessage}</p>`);

        contact.isReplied = true;
        await contact.save();

        res.json({ message: 'Reply sent successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Admin: Delete message
router.delete('/:id', auth, async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.json({ message: 'Message deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

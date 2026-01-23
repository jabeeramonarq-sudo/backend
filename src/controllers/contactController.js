const Contact = require('../models/Contact');
const { sendContactNotification } = require('../services/emailService');

// @desc    Submit contact form
// @route   POST /api/contact
const submitContact = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        const contact = new Contact({ name, email, subject, message });
        await contact.save();

        // Send notification to admin
        try {
            await sendContactNotification(contact);
        } catch (emailError) {
            console.error('Failed to send contact notification email:', emailError);
        }

        res.status(201).json({ message: 'Contact request saved successfully' });
    } catch (error) {
        console.error('Error saving contact request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// @desc    Get all contacts
// @route   GET /api/contacts
const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update contact status
// @route   PATCH /api/contacts/:id
const updateContactStatus = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (contact) {
            contact.status = req.body.status || contact.status;
            const updatedContact = await contact.save();
            res.json(updatedContact);
        } else {
            res.status(404).json({ message: 'Contact not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete contact
// @route   DELETE /api/contacts/:id
const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (contact) {
            await contact.deleteOne();
            res.json({ message: 'Contact removed' });
        } else {
            res.status(404).json({ message: 'Contact not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    submitContact,
    getContacts,
    updateContactStatus,
    deleteContact
};

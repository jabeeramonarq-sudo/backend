const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    logos: {
        main: { type: String, default: '' }, // URL
        footer: { type: String, default: '' }, // URL
        favicon: { type: String, default: '' } // URL
    },
    contactInfo: {
        address: { type: String, default: '' },
        email: { type: String, default: '' },
        phone: { type: String, default: '' },
        mapsUrl: { type: String, default: '' }
    },
    contactForm: {
        recipientEmail: { type: String, default: '' }
    },
    socialMedia: [
        {
            platform: { type: String },
            url: { type: String },
            icon: { type: String }
        }
    ],
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Settings', settingsSchema);

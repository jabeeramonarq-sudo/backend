const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, index: true },
    sourceUrl: { type: String, default: '' },
    userAgent: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);

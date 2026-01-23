const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    page: { type: String, required: true }, // e.g., 'home', 'about'
    key: { type: String, required: true }, // e.g., 'hero_title'
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    type: { type: String, enum: ['text', 'image', 'rich-text', 'array'], default: 'text' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedAt: { type: Date, default: Date.now }
});

// Compound index to ensure unique keys per page
contentSchema.index({ page: 1, key: 1 }, { unique: true });

module.exports = mongoose.model('Content', contentSchema);

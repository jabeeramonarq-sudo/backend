const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    sectionId: { type: String, required: true, unique: true },
    title: { type: String },
    subtitle: { type: String },
    body: { type: String },
    image: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Content', contentSchema);

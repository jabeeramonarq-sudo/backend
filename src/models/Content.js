const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    sectionId: { type: String, required: true, unique: true, index: true },
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    body: { type: String, default: '' },
    image: { type: String, default: '' },
    images: [{ type: String }],
    isDeleted: { type: Boolean, default: false, index: true },
    order: { type: Number, default: 0, index: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Content', contentSchema);

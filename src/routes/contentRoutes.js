const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const auth = require('../middleware/auth');

const normalizeImages = (value, fallbackImage) => {
    if (Array.isArray(value)) {
        return value.filter((v) => typeof v === 'string' && v.trim()).map((v) => v.trim());
    }
    if (typeof fallbackImage === 'string' && fallbackImage.trim()) {
        return [fallbackImage.trim()];
    }
    return [];
};

// Public: get all content sections
router.get('/', async (req, res) => {
    try {
        const sections = await Content.find().sort({ order: 1, sectionId: 1 });
        res.json(sections);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Admin: update one section by sectionId
router.put('/:sectionId', auth, async (req, res) => {
    try {
        const sectionId = req.params.sectionId;
        const payload = {
            title: req.body.title || '',
            subtitle: req.body.subtitle || '',
            body: req.body.body || '',
            image: req.body.image || '',
            images: normalizeImages(req.body.images, req.body.image),
            isDeleted: false,
            order: Number.isFinite(req.body.order) ? req.body.order : 0,
            isActive: typeof req.body.isActive === 'boolean' ? req.body.isActive : true
        };

        const section = await Content.findOneAndUpdate(
            { sectionId },
            { $set: { sectionId, ...payload } },
            { new: true, upsert: true }
        );

        res.json(section);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Admin: bulk upsert sections (for initialization + save all)
router.post('/bulk-upsert', auth, async (req, res) => {
    try {
        const sections = Array.isArray(req.body.sections) ? req.body.sections : [];
        if (!sections.length) {
            return res.status(400).json({ error: 'sections array is required' });
        }

        const operations = sections
            .filter((s) => s && typeof s.sectionId === 'string' && s.sectionId.trim())
            .map((s) => ({
                updateOne: {
                    filter: { sectionId: s.sectionId.trim() },
                    update: {
                        $set: {
                            sectionId: s.sectionId.trim(),
                            title: s.title || '',
                            subtitle: s.subtitle || '',
                            body: s.body || '',
                            image: s.image || '',
                            images: normalizeImages(s.images, s.image),
                            isDeleted: false,
                            order: Number.isFinite(s.order) ? s.order : 0,
                            isActive: typeof s.isActive === 'boolean' ? s.isActive : true
                        }
                    },
                    upsert: true
                }
            }));

        if (!operations.length) {
            return res.status(400).json({ error: 'No valid sections provided' });
        }

        await Content.bulkWrite(operations, { ordered: false });
        const allSections = await Content.find().sort({ order: 1, sectionId: 1 });
        res.json(allSections);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Admin: delete one section by sectionId
router.delete('/:sectionId', auth, async (req, res) => {
    try {
        const sectionId = req.params.sectionId;
        await Content.findOneAndUpdate(
            { sectionId },
            { $set: { sectionId, isDeleted: true, isActive: false } },
            { new: true, upsert: true }
        );
        res.json({ message: 'Section deleted successfully (hidden from frontend).' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

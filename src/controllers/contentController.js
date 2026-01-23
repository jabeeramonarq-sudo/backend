const Content = require('../models/Content');

// @desc    Get all content for a page
// @route   GET /api/content/:page
const getPageContent = async (req, res) => {
    try {
        const content = await Content.find({ page: req.params.page });
        res.json(content);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update or create content
// @route   POST /api/content
const updateContent = async (req, res) => {
    const { page, key, value, type } = req.body;

    try {
        let content = await Content.findOne({ page, key });

        if (content) {
            content.value = value;
            content.type = type || content.type;
            content.updatedBy = req.user._id;
            content.updatedAt = Date.now();
            await content.save();
        } else {
            content = await Content.create({
                page,
                key,
                value,
                type,
                updatedBy: req.user._id
            });
        }

        res.json(content);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getPageContent,
    updateContent
};

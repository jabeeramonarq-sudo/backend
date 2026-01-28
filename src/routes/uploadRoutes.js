const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const auth = require('../middleware/auth');

router.post('/image', auth, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        res.json({ url: req.file.path });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/assets', auth, upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'footerLogo', maxCount: 1 },
    { name: 'favicon', maxCount: 1 }
]), (req, res) => {
    try {
        const urls = {};
        if (req.files.logo) urls.logo = req.files.logo[0].path;
        if (req.files.footerLogo) urls.footerLogo = req.files.footerLogo[0].path;
        if (req.files.favicon) urls.favicon = req.files.favicon[0].path;

        res.json(urls);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

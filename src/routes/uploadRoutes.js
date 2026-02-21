const express = require('express');
const router = express.Router();
const { upload, hasCloudinary } = require('../config/cloudinary');
const auth = require('../middleware/auth');

router.post('/image', auth, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const url = hasCloudinary
            ? req.file.path
            : `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        res.json({ url });
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
        const fileUrl = (file) => hasCloudinary
            ? file.path
            : `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;

        if (req.files.logo) urls.logo = fileUrl(req.files.logo[0]);
        if (req.files.footerLogo) urls.footerLogo = fileUrl(req.files.footerLogo[0]);
        if (req.files.favicon) urls.favicon = fileUrl(req.files.favicon[0]);

        res.json(urls);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

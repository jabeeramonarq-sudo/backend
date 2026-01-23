const express = require('express');
const router = express.Router();
const { getPageContent, updateContent } = require('../controllers/contentController');
const { protect } = require('../middleware/auth');

router.get('/:page', getPageContent);
router.post('/', protect, updateContent);

module.exports = router;

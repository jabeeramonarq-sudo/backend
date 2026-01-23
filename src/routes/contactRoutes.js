const express = require('express');
const router = express.Router();
const {
    submitContact,
    getContacts,
    updateContactStatus,
    deleteContact
} = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', submitContact);
router.get('/', protect, getContacts);
router.patch('/:id', protect, updateContactStatus);
router.delete('/:id', protect, authorize('superadmin'), deleteContact);

module.exports = router;

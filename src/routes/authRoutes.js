const express = require('express');
const router = express.Router();
const {
    login,
    inviteAdmin,
    setupPassword,
    forgotPassword,
    resetPassword,
    checkSetupStatus,
    setupSuperAdmin
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

router.get('/setup-status', checkSetupStatus);
router.post('/setup-superadmin', setupSuperAdmin);
router.post('/login', login);
router.post('/invite', protect, authorize('superadmin'), inviteAdmin);
router.post('/setup-password/:token', setupPassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;

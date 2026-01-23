const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { sendInviteEmail, sendResetPasswordEmail } = require('../services/emailService');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

// @desc    Invite new admin
// @route   POST /api/auth/invite
const inviteAdmin = async (req, res) => {
    const { name, email, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const inviteToken = crypto.randomBytes(20).toString('hex');
    const inviteExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    const user = await User.create({
        name,
        email,
        role,
        isInvited: true,
        inviteToken,
        inviteExpires
    });

    const inviteLink = `${process.env.FRONTEND_URL}/admin/setup-password/${inviteToken}`;

    try {
        await sendInviteEmail(user, inviteLink);
        res.status(201).json({ message: 'Invitation sent' });
    } catch (error) {
        user.inviteToken = undefined;
        user.inviteExpires = undefined;
        await user.save();
        res.status(500).json({ message: 'Email could not be sent' });
    }
};

// @desc    Setup password from invitation
// @route   POST /api/auth/setup-password/:token
const setupPassword = async (req, res) => {
    const { password } = req.body;
    const user = await User.findOne({
        inviteToken: req.params.token,
        inviteExpires: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).json({ message: 'Invalid or expired invite token' });
    }

    user.password = password;
    user.isInvited = false;
    user.inviteToken = undefined;
    user.inviteExpires = undefined;
    await user.save();

    res.json({ message: 'Password set successfully. You can now login.' });
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/admin/reset-password/${resetToken}`;

    try {
        await sendResetPasswordEmail(user, resetLink);
        res.json({ message: 'Reset link sent to email' });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.status(500).json({ message: 'Email could not be sent' });
    }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
const resetPassword = async (req, res) => {
    const { password } = req.body;
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully' });
};

// @desc    Check if setup is required (no users exist)
// @route   GET /api/auth/setup-status
const checkSetupStatus = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        res.json({ setupRequired: userCount === 0 });
    } catch (error) {
        res.status(500).json({ message: 'Server error check setup status' });
    }
};

// @desc    Initial superadmin setup
// @route   POST /api/auth/setup-superadmin
const setupSuperAdmin = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        if (userCount > 0) {
            return res.status(400).json({ message: 'Setup already completed' });
        }

        const { name, email, password } = req.body;
        const user = await User.create({
            name,
            email,
            password,
            role: 'superadmin',
            isInvited: false
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
                message: 'Super Admin created successfully'
            });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error during setup' });
    }
};

module.exports = {
    login,
    inviteAdmin,
    setupPassword,
    forgotPassword,
    resetPassword,
    checkSetupStatus,
    setupSuperAdmin
};

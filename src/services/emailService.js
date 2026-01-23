const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const sendEmail = async ({ to, subject, html }) => {
    try {
        const info = await transporter.sendMail({
            from: `"${process.env.SITE_NAME || 'Amonarq'}" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html
        });
        console.log('Email sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

const sendInviteEmail = async (user, inviteLink) => {
    const html = `
        <h1>Welcome to Amonarq Admin Panel</h1>
        <p>Hello ${user.name},</p>
        <p>You have been invited to manage the Amonarq website. Please click the link below to set your password and activate your account:</p>
        <a href="${inviteLink}">${inviteLink}</a>
        <p>This link will expire in 24 hours.</p>
    `;
    return sendEmail({ to: user.email, subject: 'Admin Invitation', html });
};

const sendResetPasswordEmail = async (user, resetLink) => {
    const html = `
        <h1>Reset Your Password</h1>
        <p>Hello ${user.name},</p>
        <p>You requested a password reset. Please click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request this, please ignore this email.</p>
    `;
    return sendEmail({ to: user.email, subject: 'Password Reset Request', html });
};

const sendContactNotification = async (contact) => {
    const html = `
        <h1>New Contact Inquiry</h1>
        <p><strong>Name:</strong> ${contact.name}</p>
        <p><strong>Email:</strong> ${contact.email}</p>
        <p><strong>Subject:</strong> ${contact.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${contact.message}</p>
    `;
    return sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `New Inquiry: ${contact.subject}`,
        html
    });
};

module.exports = {
    sendEmail,
    sendInviteEmail,
    sendResetPasswordEmail,
    sendContactNotification
};

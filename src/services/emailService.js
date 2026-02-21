const nodemailer = require('nodemailer');
const Settings = require('../models/Settings');

// Create transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: Number(process.env.EMAIL_PORT || 587) === 465, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS
    }
});

const parseRecipientList = (value) => {
    if (!value) return [];
    return String(value)
        .split(/[\n,;]+/)
        .map((email) => email.trim())
        .filter(Boolean);
};

const resolveContactRecipientEmail = async () => {
    try {
        const settings = await Settings.findOne().lean();
        const settingsEmails = parseRecipientList(settings?.contactForm?.recipientEmail);
        if (settingsEmails.length > 0) return settingsEmails;
    } catch (error) {
        console.error('Failed to load contact recipient email from settings:', error.message);
    }

    const envEmails = parseRecipientList(process.env.CONTACT_RECEIVER_EMAIL);
    if (envEmails.length > 0) return envEmails;
    return parseRecipientList(process.env.EMAIL_USER);
};

// Send invitation email
const sendInvitationEmail = async (email, token) => {
    const invitationUrl = `${process.env.FRONTEND_URL}/invite/${token}`;

    const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: email,
        subject: 'You\'ve been invited to join Amonarq Admin Panel',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Welcome to Amonarq</h1>
                    </div>
                    <div class="content">
                        <p>Hello,</p>
                        <p>You've been invited to join the Amonarq Admin Panel. Click the button below to complete your registration and set up your account.</p>
                        <p style="text-align: center;">
                            <a href="${invitationUrl}" class="button">Complete Registration</a>
                        </p>
                        <p>Or copy and paste this link into your browser:</p>
                        <p style="word-break: break-all; color: #667eea;">${invitationUrl}</p>
                        <p><strong>Note:</strong> This invitation link will expire in 48 hours.</p>
                        <p>If you didn't expect this invitation, you can safely ignore this email.</p>
                    </div>
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} Amonarq. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Invitation email sent to ${email}`);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

// Send contact form email
const sendContactEmail = async (name, email, subject, message) => {
    const recipientEmails = await resolveContactRecipientEmail();

    const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: recipientEmails,
        replyTo: email,
        subject: `Contact Form: ${subject}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
                    .header { background: #667eea; color: white; padding: 20px; text-align: center; }
                    .content { background: white; padding: 30px; margin-top: 20px; }
                    .field { margin-bottom: 15px; }
                    .label { font-weight: bold; color: #667eea; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>New Contact Form Submission</h2>
                    </div>
                    <div class="content">
                        <div class="field">
                            <div class="label">From:</div>
                            <div>${name}</div>
                        </div>
                        <div class="field">
                            <div class="label">Email:</div>
                            <div>${email}</div>
                        </div>
                        <div class="field">
                            <div class="label">Subject:</div>
                            <div>${subject}</div>
                        </div>
                        <div class="field">
                            <div class="label">Message:</div>
                            <div>${message}</div>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Contact form email sent from ${email} to ${recipientEmails.join(', ')}`);
        return true;
    } catch (error) {
        console.error('Error sending contact email:', error);
        throw error;
    }
};

// Send test email
const sendTestEmail = async (email) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: email,
        subject: 'Test Email from Amonarq',
        html: `
            <h1>Email Configuration Test</h1>
            <p>If you're reading this, your Nodemailer configuration is working correctly!</p>
            <p>Sent at: ${new Date().toLocaleString()}</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Test email sent to ${email}`);
        return true;
    } catch (error) {
        console.error('Error sending test email:', error);
        throw error;
    }
};

module.exports = {
    sendInvitationEmail,
    sendContactEmail,
    sendTestEmail
};

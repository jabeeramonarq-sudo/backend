const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Content = require('./src/models/Content');
const Settings = require('./src/models/Settings');

dotenv.config();

const seedContent = [
    // --- HOME PAGE ---
    {
        sectionId: 'home-hero',
        title: 'Your Digital Life, Shouldn’t End in Chaos.',
        subtitle: 'MyNxt helps individuals and families define what should happen to their digital assets, responsibilities, and information.',
        body: 'MyNxt structures life responsibilities into Life Events. Each Life Event brings together information, people, and rules in a clear and organised way.',
        order: 1
    },
    {
        sectionId: 'home-problem',
        title: 'Life responsibilities are scattered.',
        subtitle: 'Important information is often spread across documents, people, and conversations.',
        body: 'When clarity is missing, even simple situations can turn chaotic. MyNxt exists to bring structure, clarity, and continuity to everyday life responsibilities.',
        order: 2
    },
    {
        sectionId: 'home-mission',
        title: 'Our Mission',
        subtitle: 'Reducing chaos during critical moments.',
        body: 'AMONARQ’s mission is to reduce chaos during critical moments by bringing structure, clarity, and trust to digital continuity.',
        order: 3
    },
    {
        sectionId: 'home-life-events',
        title: 'Everything is organised as Life Events.',
        subtitle: 'MyNxt structures life responsibilities into Life Events.',
        body: 'Each Life Event brings together information, people, and rules in a clear and organised way. This keeps responsibilities easy to manage today and protected for the future.',
        order: 4
    },
    {
        sectionId: 'home-continuity',
        title: 'Continuity works quietly in the background.',
        subtitle: 'MyNxt includes continuity mechanisms that help ensure responsibilities are handled when you\'re unavailable.',
        body: 'There is no instant access. Every action follows predefined rules and confirmations.',
        order: 5
    },
    {
        sectionId: 'home-different-heading',
        title: 'What Makes MyNxt Different',
        subtitle: 'Focus on life continuity vs just a vault.',
        body: 'MyNxt is designed with a unique architecture focused on long-term continuity.',
        order: 20
    },
    { sectionId: 'home-does-1', title: 'Focus on life continuity', order: 21 },
    { sectionId: 'home-does-2', title: 'Use consent-driven access', order: 22 },
    { sectionId: 'home-does-3', title: 'Follow rule-based execution', order: 23 },
    { sectionId: 'home-does-4', title: 'Reduce confusion and disputes', order: 24 },
    { sectionId: 'home-does-not-1', title: 'Act as a vault or locker', order: 25 },
    { sectionId: 'home-does-not-2', title: 'Provide instant access', order: 26 },
    { sectionId: 'home-does-not-3', title: 'Replace legal processes', order: 27 },
    { sectionId: 'home-does-not-4', title: 'Take actions without consent', order: 28 },
    {
        sectionId: 'home-trust',
        title: 'Built with care and responsibility.',
        subtitle: 'MyNxt is designed with security, consent, and restraint at its core.',
        body: 'Access is controlled, actions are logged, and intent is respected at every step.',
        order: 30
    },
    {
        sectionId: 'home-values-heading',
        title: 'One place to organise life responsibilities.',
        subtitle: 'Everything you need to manage important life matters, in one secure place.',
        body: 'Features list follows below.',
        order: 10
    },
    { sectionId: 'home-value-1', title: 'Organise important life information', order: 5 },
    { sectionId: 'home-value-2', title: 'Define who can help and how', order: 6 },
    { sectionId: 'home-value-3', title: 'Set clear access and sharing rules', order: 7 },
    { sectionId: 'home-value-4', title: 'Reduce confusion during critical moments', order: 8 },

    // --- ABOUT PAGE ---
    {
        sectionId: 'about-hero',
        title: 'About Amonarq',
        subtitle: 'Building systems focused on life continuity.',
        body: 'Technology that reduces chaos and respects intent.',
        order: 10
    },
    {
        sectionId: 'about-mission-heading',
        title: 'AMONARQ is building technology for digital life continuity.',
        subtitle: 'Uncertainty, emotional stress, and operational challenges.',
        body: 'As our lives become increasingly digital, important information, responsibilities, and instructions often remain unstructured and inaccessible when they are needed the most.',
        order: 11
    },
    {
        sectionId: 'about-product-intro-heading',
        title: 'MYNXT is designed to solve this gap.',
        body: 'Instead of storing data, MYNXT enables individuals to pre-define how their digital life should continue — clearly, securely, and with consent. Users can specify who should be involved, what information or instructions matter, when continuity should be triggered, and how execution should occur.',
        order: 12
    },
    {
        sectionId: 'about-quote',
        body: 'The platform focuses on controlled access, validation-driven execution, and traceable processes — ensuring that digital continuity happens responsibly, without ambiguity or misuse.',
        order: 13
    },
    {
        sectionId: 'about-mission-statement',
        title: 'Our Mission',
        body: 'AMONARQ’s mission is to reduce chaos during critical moments by bringing structure, clarity, and trust to digital continuity.',
        order: 14
    },
    {
        sectionId: 'about-vision',
        title: 'Our Vision',
        body: 'To help life continue smoothly, even when someone is unavailable.',
        order: 15
    },
    {
        sectionId: 'about-philosophy-heading',
        title: 'Our Philosophy',
        order: 16
    },
    { sectionId: 'about-philosophy-1', title: 'Reduce confusion', order: 17 },
    { sectionId: 'about-philosophy-2', title: 'Respect consent', order: 18 },
    { sectionId: 'about-philosophy-3', title: 'Build with restraint', order: 19 },
    { sectionId: 'about-philosophy-4', title: 'Focus on real-world problems', order: 20 },

    // --- PRODUCT PAGE ---
    {
        sectionId: 'product-hero',
        title: "Life's Matters. Continuity Ensured.",
        subtitle: "MyNxt is a premium continuity platform by Amonarq.",
        body: "Protect your intent, organise your responsibilities, and bridge the gap between today and tomorrow.",
        order: 30
    },
    {
        sectionId: 'product-not-vault',
        title: "Not just another vault. A platform for continuity.",
        body: "Unlike traditional storage apps, MyNxt is designed around the concept of Life Events. It doesn't just store data; it maps out who needs to know what, when they need to know it, and the rules that must be followed for access.",
        order: 31
    },
    {
        sectionId: 'product-mini-1',
        title: 'Consent-Driven',
        body: 'Access is only granted based on your predefined rules and triggers.',
        order: 32
    },
    {
        sectionId: 'product-mini-2',
        title: 'Zero-Knowledge Security',
        body: 'Your sensitive information stays encrypted and private.',
        order: 33
    },
    {
        sectionId: 'product-mini-3',
        title: 'Co-Pilot Support',
        body: 'Empower trusted individuals to help execute your instructions.',
        order: 34
    },
    {
        sectionId: 'product-real-world-heading',
        title: 'Designed for the real world.',
        subtitle: 'Every feature in MyNxt is built to solve actual challenges encountered when Managing life\'s most critical responsibilities.',
        order: 35
    },
    { sectionId: 'product-feature-1', title: 'Continuity Checks', body: 'Smart reminders to keep your information up to date.', order: 36 },
    { sectionId: 'product-feature-2', title: 'Active Notifications', body: 'Keep your co-pilots and family informed.', order: 37 },
    { sectionId: 'product-feature-3', title: 'Execution Rules', body: 'Define exactly what should happen when a Life Event is triggered.', order: 38 },
    { sectionId: 'product-feature-4', title: 'Multi-Role Access', body: 'Assign different roles for specific events.', order: 39 },
    { sectionId: 'product-feature-5', title: 'Tamper-Proof Logs', body: 'Every access request is logged for transparency.', order: 40 },
    { sectionId: 'product-feature-6', title: 'Seamless Experience', body: 'A clean, intuitive interface designed for humans.', order: 41 },
    {
        sectionId: 'product-cta',
        title: 'Ready to ensure continuity?',
        body: 'Join the early access program and be among the first to experience a new way of Managing life\'s responsibilities.',
        order: 42
    },

    // --- CONTINUITY PAGE ---
    {
        sectionId: 'continuity-hero',
        title: "Continuity & Triggers",
        subtitle: "How MyNxt ensures responsibilities don't get stuck.",
        body: "Technology working quietly to protect your intent.",
        order: 50
    },
    {
        sectionId: 'continuity-explained',
        title: 'Continuity Explained',
        body: 'MyNxt uses continuity checks to ensure responsibilities don\'t get stuck if someone becomes unavailable.',
        order: 51
    },
    {
        sectionId: 'continuity-note',
        title: 'Important Note',
        subtitle: 'Triggers do not grant access.',
        body: 'They only initiate a controlled process based on predefined rules. Every step requires verification and follows the consent framework you\'ve established.',
        order: 52
    },
    {
        sectionId: 'continuity-how-heading',
        title: 'How Continuity Works',
        order: 53
    },
    { sectionId: 'continuity-step-1', title: 'Regular Check-ins', body: 'MyNxt periodically verifies your availability through simple confirmations.', order: 54 },
    { sectionId: 'continuity-step-2', title: 'Trigger Activation', body: 'If confirmations are missed, the continuity process begins based on your rules.', order: 55 },
    { sectionId: 'continuity-step-3', title: 'Verification Steps', body: 'Multiple verification steps ensure the trigger is valid before any action.', order: 56 },
    { sectionId: 'continuity-step-4', title: 'Controlled Access', body: 'Only after all conditions are met, designated people receive limited access as defined.', order: 57 },
    {
        sectionId: 'continuity-cta',
        title: 'Consent is at the heart of everything',
        body: 'Learn how MyNxt ensures no action happens without proper authorization.',
        order: 58
    },

    // --- LIFE EVENTS PAGE ---
    {
        sectionId: 'life-events-hero',
        title: "Life Events",
        subtitle: "The core building block of MyNxt.",
        body: "A structured way to organise specific areas of life responsibility.",
        order: 60
    },
    {
        sectionId: 'life-event-what',
        title: 'What is a Life Event?',
        body: 'A Life Event is a structured way to organise a specific area of life responsibility. It brings together relevant information and clear rules in one secure place.',
        order: 61
    },
    { sectionId: 'life-event-part-1', title: 'Relevant Information', body: 'Documents, details, and context', order: 62 },
    { sectionId: 'life-event-part-2', title: 'Clear Rules', body: 'Access and sharing conditions', order: 63 },
    {
        sectionId: 'life-events-matter-heading',
        title: 'Why Life Events Matter',
        order: 64
    },
    { sectionId: 'life-events-matter-1', title: 'Clarity for everyone', body: 'Everyone involved knows what\'s expected and where to find information.', order: 65 },
    { sectionId: 'life-events-matter-2', title: 'Less confusion', body: 'Reduces chaos and misunderstandings during critical moments.', order: 66 },
    { sectionId: 'life-events-matter-3', title: 'Clear intent', body: 'Your wishes and responsibilities are documented and respected.', order: 67 },
    { sectionId: 'life-events-matter-4', title: 'Privacy Focused', body: 'Built with zero-knowledge architecture and consent-driven access.', order: 68 },
    {
        sectionId: 'life-events-cta',
        title: 'See how Life Events work with continuity',
        body: 'Learn how MyNxt ensures your Life Events are protected for the future.',
        order: 69
    },

    // --- CONSENT PAGE ---
    {
        sectionId: 'consent-hero',
        title: 'Consent & Approval',
        subtitle: 'Every action requires explicit authorization.',
        order: 70
    },
    {
        sectionId: 'consent-first',
        title: 'Consent First',
        subtitle: 'Every role, action, and access level in MyNxt is defined with consent.',
        body: 'No action happens automatically. No responsibility transferred without confirmation.',
        order: 71
    },
    {
        sectionId: 'consent-matters-heading',
        title: 'Why This Matters',
        order: 72
    },
    { sectionId: 'consent-matters-1', title: 'Prevents Misuse', body: 'Multiple layers of consent ensure your information can\'t be accessed without proper authorization.', order: 73 },
    { sectionId: 'consent-matters-2', title: 'Reduces Disputes', body: 'Clear consent trails mean everyone knows what was agreed and when.', order: 74 },
    { sectionId: 'consent-matters-3', title: 'Respects Intent', body: 'Your personal intentions and wishes are honored exactly as you defined them.', order: 75 },
    {
        sectionId: 'consent-flow-heading',
        title: 'The Approval Flow',
        order: 76
    },
    { sectionId: 'consent-step-1', title: 'You Define Roles', body: 'Assign trusted people with specific responsibilities and access levels.', order: 77 },
    { sectionId: 'consent-step-2', title: 'They Accept Responsibility', body: 'Each person must explicitly accept their role and acknowledge the rules.', order: 78 },
    { sectionId: 'consent-step-3', title: 'Actions Require Confirmation', body: 'When actions are triggered, they require additional confirmation steps.', order: 79 },
    { sectionId: 'consent-step-4', title: 'Everything is Logged', body: 'Complete audit trail ensures transparency and accountability.', order: 80 },
    {
        sectionId: 'consent-cta',
        title: 'Security is built into every layer',
        body: 'Learn about our comprehensive approach to protecting your data.',
        order: 81
    },

    // --- CONSENT APPROVAL PAGE ---
    {
        sectionId: 'consent-approval-hero',
        title: 'Consent & Approval Flow',
        subtitle: 'Building trust through explicit authorization and clear intent.',
        order: 90
    },
    {
        sectionId: 'consent-approval-first-heading',
        title: 'Consent First',
        subtitle: 'Every role, action, and access level in MyNxt is defined with consent.',
        order: 91
    },
    {
        sectionId: 'consent-approval-principle-1',
        title: 'No action happens automatically.',
        order: 92
    },
    {
        sectionId: 'consent-approval-principle-2',
        title: 'No responsibility is transferred without confirmation.',
        order: 93
    },
    {
        sectionId: 'consent-approval-why-heading',
        title: 'Why This Matters',
        order: 94
    },
    {
        sectionId: 'consent-approval-benefit-1',
        title: 'Prevents misuse',
        order: 95
    },
    {
        sectionId: 'consent-approval-benefit-2',
        title: 'Reduces disputes',
        order: 96
    },
    {
        sectionId: 'consent-approval-benefit-3',
        title: 'Respects personal intent',
        order: 97
    },

    // --- SECURITY PAGE ---
    {
        sectionId: 'security-hero',
        title: 'Security & Trust',
        subtitle: 'MyNxt does not claim ownership of user data or digital assets.',
        body: 'The platform facilitates consent-based continuity instructions and controlled access flows, executed only under predefined user conditions.',
        order: 90
    },
    {
        sectionId: 'security-approach-heading',
        title: 'Our Approach',
        subtitle: 'MyNxt is built with security and responsibility at its foundation.',
        order: 91
    },
    { sectionId: 'security-item-1', title: 'Data Protection', body: 'Your data is encrypted at rest and in transit using industry-standard protocols.', order: 92 },
    { sectionId: 'security-item-2', title: 'Controlled Access', body: 'Strict access controls ensure only authorized actions can be performed.', order: 93 },
    { sectionId: 'security-item-3', title: 'Clear Audit Trails', body: 'Every action is logged with timestamps for complete transparency.', order: 94 },
    { sectionId: 'security-item-4', title: 'Responsible Execution', body: 'Actions follow predefined rules with multiple verification steps.', order: 95 },
    {
        sectionId: 'security-commitment',
        title: 'Our Commitment',
        body: 'Trust isn\'t claimed—it\'s earned. We\'re committed to transparent practices, robust security, and respecting your privacy at every step. When you use MyNxt, you can be confident that your data is protected and your intentions are respected.',
        order: 96
    },
    {
        sectionId: 'security-badge-text',
        title: 'Designed in alignment with applicable data protection norms',
        order: 97
    },
    {
        sectionId: 'security-cta',
        title: 'Ready to learn more?',
        body: 'Get in touch to learn more about MyNxt or request early access.',
        order: 98
    },

    // --- HOW IT WORKS PAGE ---
    {
        sectionId: 'how-it-works-hero',
        title: 'How MyNxt Works',
        subtitle: 'A simple flow to organise, protect, and ensure continuity.',
        order: 100
    },
    { sectionId: 'how-step-1', title: 'Organise', body: 'Create Life Events to organise responsibilities and information.', order: 101 },
    { sectionId: 'how-step-2', title: 'Define Roles', body: 'Add people and define how they can help.', order: 102 },
    { sectionId: 'how-step-3', title: 'Set Rules', body: 'Decide what is shared, when, and under what conditions.', order: 103 },
    { sectionId: 'how-step-4', title: 'Continuity Protection', body: 'Enable continuity checks that work quietly in the background.', order: 104 },
    { sectionId: 'how-step-5', title: 'Controlled Execution', body: 'When needed, actions follow predefined rules and confirmations.', order: 105 },
    { sectionId: 'how-step-6', title: 'Who should be notified', body: 'Define who should be notified or receive access when the time comes.', order: 106 },
    { sectionId: 'how-step-7', title: 'What information is involved', body: 'Specify digital references, instructions, or information that needs protection.', order: 107 },
    { sectionId: 'how-step-8', title: 'When it\'s triggered', body: 'Determine the exact conditions when the continuity process begins.', order: 108 },
    { sectionId: 'how-step-9', title: 'How access occurs', body: 'Set the protocols for how notification, access, or execution should occur.', order: 109 },
    {
        sectionId: 'how-footer-note',
        title: 'MyNxt executes this only after predefined validations and confirmations.',
        order: 110
    },
    {
        sectionId: 'how-cta',
        title: 'Ready to organise your life responsibilities?',
        body: 'Request early access to be among the first to experience MyNxt.',
        order: 111
    },

    // --- CONTACT PAGE ---
    {
        sectionId: 'contact-hero',
        title: 'Contact',
        subtitle: 'Interested in MyNxt or early access? Get in touch with us.',
        order: 120
    },
    {
        sectionId: 'contact-info-heading',
        title: 'Get in Touch',
        body: 'Have a question about MyNxt, interested in early access, or want to learn more about Amonarq? We\'d love to hear from you.',
        order: 121
    },
    {
        sectionId: 'contact-early-access-note',
        title: 'Early Access',
        body: 'MyNxt is currently in development. Request early access through the form to be among the first to experience it.',
        order: 122
    },
    {
        sectionId: 'contact-success-title',
        title: 'Message Sent',
        body: 'Thank you for your interest in MyNxt. We\'ll get back to you as soon as possible.',
        order: 123
    },

    // --- LEGAL ---
    {
        sectionId: 'privacy-policy',
        title: 'Privacy Policy',
        subtitle: 'Amonarq / MyNxt | Last updated: January 2026',
        body: `Amonarq ("we", "our", "us") operates the MyNxt platform. This Privacy Policy explains how we collect, use, store, and protect information when you use MyNxt.

MyNxt does not claim ownership of user data or digital assets.

The platform facilitates consent-based continuity instructions and controlled access flows, executed only under predefined user conditions.

---

1. Information We Collect

We collect information only to enable continuity execution and platform functionality.

a) Information provided by users
• Name, email, phone number
• Emergency contacts / trusted individuals (as defined by the user)
• Instructions and continuity-related information
• Preferences, rules, and triggers defined by the user

b) System & usage information
• Login activity
• Inactivity status
• Device and browser information
• Platform usage logs

---

2. Purpose of Data Collection

We use collected information to:
• Enable continuity execution workflows
• Monitor predefined triggers (such as inactivity)
• Notify designated contacts or heirs as instructed
• Ensure platform security and integrity
• Comply with applicable laws

We do not use personal data for advertising or resale.

---

3. Consent-Based Access

MyNxt follows a consent-driven access model:
• No data is disclosed by default
• Access is granted only after predefined conditions and approvals are met
• Notification does not automatically mean access

---

4. Data Storage & Security

• Data is stored using secure and encrypted systems
• Access controls and audit logs are applied
• Reasonable technical and organizational safeguards are used

While we take security seriously, no digital system can be guaranteed to be 100% secure.

---

5. Data Sharing

We do not sell or rent user data. Data may be shared only:
• As per user-defined instructions
• With designated individuals after conditions are met
• When required by law or lawful authorities

---

6. User Control

Users can:
• Update or modify their information
• Change triggers, instructions, or contacts
• Request account deactivation

Certain information may be retained if required by law.

---

7. Third-Party Services

MyNxt may use trusted third-party services (such as cloud infrastructure providers) strictly for platform operation. These providers are bound by confidentiality and security obligations.

---

8. Children's Privacy

MyNxt is not intended for individuals under the age of 18.

---

9. Changes to This Policy

This Privacy Policy may be updated periodically. Continued use of the platform indicates acceptance of the updated policy.

---

10. Contact

For privacy-related questions:
📧 contact@amonarq.com
📍 4-578 & Row House, Prasanth Nagar, Madanapalle, Andhra Pradesh PIN-517325, India.`,
        order: 130
    },
    {
        sectionId: 'terms-of-service',
        title: 'Terms of Service',
        subtitle: 'Amonarq / MyNxt | Last updated: January 2026',
        body: `These Terms govern the use of MyNxt, a continuity execution platform operated by Amonarq. By accessing or using MyNxt, you agree to these Terms.

---

1. Nature of the Service

MyNxt is a continuity execution platform, not:
• A digital locker or vault
• A password manager
• A legal advisory or decision-making service

MyNxt enables users to define rules and instructions that may be executed under specific conditions.

---

2. User Responsibility

Users are responsible for:
• Providing accurate information
• Defining lawful and appropriate instructions
• Selecting trusted individuals or heirs

Amonarq does not verify the legal validity of user instructions.

---

3. No Guaranteed Outcomes

MyNxt facilitates execution workflows but:
• Does not guarantee legal enforceability
• Does not replace wills, legal documents, or professional advice
• Does not make decisions on behalf of users

---

4. Consent & Execution

• No access is granted without predefined conditions
• Execution depends on system triggers and verification processes
• Delays or failures may occur due to technical or external factors

---

5. Account Security

Users are responsible for safeguarding their login credentials. Unauthorized use must be reported immediately.

---

6. Platform Availability

We aim to maintain platform availability but do not guarantee uninterrupted access.

---

7. Limitation of Liability

To the maximum extent permitted by law:
• Amonarq shall not be liable for indirect or consequential damages
• Use of MyNxt is at the user's own risk

---

8. Suspension or Termination

We reserve the right to suspend or terminate access in case of:
• Misuse
• Violation of these Terms
• Legal or regulatory requirements

---

9. Governing Law

These Terms are governed by the laws of India. Courts in India shall have jurisdiction.

---

10. Contact

For questions regarding these Terms:
📧 contact@amonarq.com`,
        order: 140
    }
];

const seedSettings = {
    logos: {
        main: '/mynxt-logo.png',
        footer: '/mynxt-logo.png',
        favicon: '/favicon.ico'
    },
    contactInfo: {
        address: '4-578 & Row House, Prasanth Nagar, Madanapalle, Andhra Pradesh PIN-517325, India',
        email: 'contact@amonarq.com',
        phone: '+91 00000 00000',
        mapsUrl: ''
    },
    contactForm: {
        recipientEmail: 'contact@amonarq.com'
    },
    socialMedia: [
        { platform: 'LinkedIn', url: 'https://linkedin.com/company/amonarq', icon: 'linkedin' },
        { platform: 'X', url: 'https://x.com/amonarq', icon: 'twitter' }
    ]
};

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB...');

        // Clear existing content if needed, or update
        console.log('Seeding content...');
        for (const item of seedContent) {
            await Content.findOneAndUpdate(
                { sectionId: item.sectionId },
                item,
                { upsert: true, new: true }
            );
        }

        console.log('Seeding settings...');
        let settings = await Settings.findOne();
        if (settings) {
            Object.assign(settings, seedSettings);
            await settings.save();
        } else {
            await Settings.create(seedSettings);
        }

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
}

seed();

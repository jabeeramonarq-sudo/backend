const mongoose = require('mongoose');
const User = require('./src/models/User');
const dotenv = require('dotenv');

dotenv.config();

const seedAdmin = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected. Checking for existing admin...');

        const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL || 'admin@amonarq.com' });
        if (existingAdmin) {
            console.log('Admin already exists');
        } else {
            console.log('Creating admin user...');
            const admin = new User({
                email: process.env.ADMIN_EMAIL || 'admin@amonarq.com',
                password: process.env.ADMIN_PASS || 'admin123'
            });
            await admin.save();
            console.log('Admin user created successfully');
        }

        mongoose.connection.close();
    } catch (error) {
        console.error('Seeding failed:', error);
    }
};

seedAdmin();

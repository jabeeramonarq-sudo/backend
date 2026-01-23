const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Content = require('./src/models/Content');

dotenv.config();

const defaultContent = [
    { page: 'home', key: 'hero_title', value: 'Continuity & Trust', type: 'text' },
    { page: 'home', key: 'hero_subtitle', value: 'Investing in legacy, protecting the future. Amonarq provides strategic capital and operational expertise to family-owned businesses.', type: 'rich-text' },
    { page: 'about', key: 'about_title', value: 'Our Heritage', type: 'text' },
    { page: 'contact', key: 'contact_title', value: 'Start a Dialogue', type: 'text' }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        for (const item of defaultContent) {
            await Content.findOneAndUpdate(
                { page: item.page, key: item.key },
                item,
                { upsate: true, new: true, upsert: true }
            );
        }

        console.log('Database seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();

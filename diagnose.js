const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Content = require('./src/models/Content');
const Settings = require('./src/models/Settings');

dotenv.config();

async function diagnose() {
    console.log('🔍 Diagnosing MongoDB connection and data...');
    
    try {
        // Test MongoDB connection
        console.log('\n1. Testing MongoDB connection...');
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('✅ MongoDB connected successfully');
        console.log('📊 Database name:', mongoose.connection.name);
        
        // Check Content collection
        console.log('\n2. Checking Content collection...');
        const contentCount = await Content.countDocuments();
        console.log(`📄 Content documents: ${contentCount}`);
        
        if (contentCount > 0) {
            const sampleContent = await Content.findOne();
            console.log('📝 Sample content sectionId:', sampleContent.sectionId);
        } else {
            console.log('⚠️  No content found - you may need to run seed_site_content.js');
        }
        
        // Check Settings collection
        console.log('\n3. Checking Settings collection...');
        const settingsCount = await Settings.countDocuments();
        console.log(`⚙️  Settings documents: ${settingsCount}`);
        
        if (settingsCount > 0) {
            const settings = await Settings.findOne();
            console.log('🏢 Settings contact email:', settings.contactInfo?.email || 'Not set');
        } else {
            console.log('⚠️  No settings found - default settings will be created on first request');
        }
        
        // Test queries that the API uses
        console.log('\n4. Testing API queries...');
        const activeContent = await Content.find({ isActive: true }).sort({ order: 1 });
        console.log(`📄 Active content items: ${activeContent.length}`);
        
        const settingsDoc = await Settings.findOne();
        console.log(`⚙️  Settings exists: ${!!settingsDoc}`);
        
        console.log('\n✅ Diagnosis complete!');
        console.log('\n💡 Next steps:');
        console.log('- If content count is 0, run: node seed_site_content.js');
        console.log('- If settings count is 0, the API will create defaults automatically');
        console.log('- Check Vercel logs for runtime errors');
        
        mongoose.connection.close();
        
    } catch (error) {
        console.error('\n❌ Diagnosis failed:');
        console.error('Error:', error.message);
        console.error('Stack:', error.stack);
        
        if (error.name === 'MongooseServerSelectionError') {
            console.error('\n🔧 Possible fixes:');
            console.error('1. Check MONGODB_URI in environment variables');
            console.error('2. Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0');
            console.error('3. Check database user permissions');
            console.error('4. Verify cluster is running and accessible');
        }
    }
}

diagnose();

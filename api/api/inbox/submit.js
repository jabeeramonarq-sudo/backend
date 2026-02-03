import mongoose from 'mongoose';
import Cors from 'cors';

// Initialize Cors
const cors = Cors({
  methods: ['POST', 'OPTIONS'],
  origin: [
    process.env.FRONTEND_URL || 'https://www.amonarq.com',
    'https://www.amonarq.com',
    'https://amonarq.com',
    'https://api.amonarq.com'
  ]
});

// Helper method to run middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

// Database connection caching
let cachedDbConnection = null;

async function connectToDatabase() {
  if (cachedDbConnection && mongoose.connection.readyState === 1) {
    return cachedDbConnection;
  }

  try {
    const mongoOptions = {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 2,
      retryWrites: true,
      retryReads: true,
      bufferCommands: false,
      autoIndex: true,
    };

    if (cachedDbConnection) {
      await mongoose.disconnect();
    }

    await mongoose.connect(process.env.MONGODB_URI, mongoOptions);
    cachedDbConnection = mongoose.connection;
    
    return cachedDbConnection;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    throw error;
  }
}

export default async function handler(req, res) {
  // Run cors middleware
  await runMiddleware(req, res, cors);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await connectToDatabase();

    // Dynamically import the Contact model
    const { default: ContactModel } = await import('../../../src/models/Contact');
    
    const newContact = new ContactModel({ name, email, subject, message });
    await newContact.save();

    // Send notification email to admin (optional, don't block the response)
    try {
      // Dynamically import email service
      const { sendContactEmail } = await import('../../../src/services/emailService');
      await sendContactEmail(name, email, subject, message);
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Don't fail the request if email fails
    }

    return res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Inbox submit error:', error);
    return res.status(500).json({ 
      error: 'Failed to submit message',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};
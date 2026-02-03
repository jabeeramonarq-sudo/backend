import mongoose from 'mongoose';
import Cors from 'cors';

// Initialize Cors
const cors = Cors({
  methods: ['GET', 'HEAD'],
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

  // Set cache control headers to prevent caching
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectToDatabase();
    
    // Dynamically import the Settings model to avoid server startup issues
    const { default: SettingsModel } = await import('../../../src/models/Settings');
    
    const settings = await SettingsModel.findOne().lean();
    return res.status(200).json(settings || {});
  } catch (error) {
    console.error('Settings route error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch settings',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};
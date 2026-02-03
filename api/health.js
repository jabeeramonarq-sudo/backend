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

export default async function handler(req, res) {
  // Run cors middleware
  await runMiddleware(req, res, cors);

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return res.status(200).send('API is healthy');
}

export const config = {
  api: {
    bodyParser: false,
  },
};
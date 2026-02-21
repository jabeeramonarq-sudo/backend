const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const hasCloudinary =
    !!process.env.CLOUDINARY_CLOUD_NAME &&
    !!process.env.CLOUDINARY_API_KEY &&
    !!process.env.CLOUDINARY_API_SECRET;

if (hasCloudinary) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
}

const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = hasCloudinary
    ? new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: 'amonarq',
            allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'svg', 'ico'],
        },
    })
    : multer.diskStorage({
        destination: (_req, _file, cb) => cb(null, uploadsDir),
        filename: (_req, file, cb) => {
            const ext = path.extname(file.originalname || '').toLowerCase() || '.jpg';
            cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
        }
    });

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload, hasCloudinary };

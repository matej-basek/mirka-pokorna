const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const isCloudinaryConfigured = !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
);

let storage;

if (isCloudinaryConfigured) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    storage = new CloudinaryStorage({
        cloudinary,
        params: {
            folder: 'mirka-pokorna',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
            transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        },
    });
} else {
    // Na Vercelu (serverless) ukládáme obrázek do paměti a převádíme na Base64 Data URL uložené přímo v MongoDB
    storage = multer.memoryStorage();
}

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit
});

const getUploadedFileUrl = (file) => {
    if (!file) return '';
    if (file.path && file.path.startsWith('http')) {
        return file.path;
    }
    if (file.buffer) {
        const mime = file.mimetype || 'image/jpeg';
        return `data:${mime};base64,${file.buffer.toString('base64')}`;
    }
    if (file.filename) {
        return `/uploads/${file.filename}`;
    }
    return file.path || '';
};

module.exports = { cloudinary, upload, getUploadedFileUrl, isCloudinaryConfigured };

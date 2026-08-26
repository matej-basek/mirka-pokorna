const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const authRoutes = require('../routes/auth');
const eventsRoutes = require('../routes/events');
const studiosRoutes = require('../routes/studios');
const contactRoutes = require('../routes/contact');
const seedRoutes = require('../routes/seed');
const reviewsRoutes = require('../routes/reviews');
const servicesRoutes = require('../routes/services');

const app = express();

const allowedOrigins = [
    'http://localhost:3000',
    'https://mirkapokorna.cz',
    'https://www.mirkapokorna.cz',
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin) || origin.endsWith('.onrender.com') || origin.endsWith('.vercel.app')) {
            return callback(null, true);
        }
        if (process.env.NODE_ENV !== 'production') {
            return callback(null, true);
        }
        callback(new Error('CORS zablokován pro tento origin: ' + origin));
    },
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Root & Health Check
app.get('/', (req, res) => res.json({ status: 'ok', message: 'Mirka Pokorna API running on Vercel' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// Database connection helper
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mirkapokorna';
let isConnecting = null;

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    if (isConnecting) { await isConnecting; return; }
    if (!process.env.MONGO_URI) {
        console.log('⚠️ MONGO_URI missing in process.env');
        return;
    }
    isConnecting = mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 3000 });
    try {
        await isConnecting;
        console.log('✅ MongoDB connected');
    } catch (err) {
        console.error('⚠️ Mongo connection error:', err.message);
    } finally {
        isConnecting = null;
    }
};

app.use(async (req, res, next) => {
    try { await connectDB(); } catch (e) {}
    next();
});

// Statická složka pro nahrané soubory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/studios', studiosRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/seed', seedRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/services', servicesRoutes);

// Fallback routes without /api prefix
app.use('/auth', authRoutes);
app.use('/events', eventsRoutes);
app.use('/studios', studiosRoutes);
app.use('/contact', contactRoutes);
app.use('/seed', seedRoutes);
app.use('/reviews', reviewsRoutes);
app.use('/services', servicesRoutes);

module.exports = app;

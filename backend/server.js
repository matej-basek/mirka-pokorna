const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const eventsRoutes = require('./routes/events');
const studiosRoutes = require('./routes/studios');
const contactRoutes = require('./routes/contact');
const seedRoutes = require('./routes/seed');
const reviewsRoutes = require('./routes/reviews');
const servicesRoutes = require('./routes/services');

const app = express();

const allowedOrigins = [
    'http://localhost:3000',
    'https://mirkapokorna.cz',
    'https://www.mirkapokorna.cz',
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        callback(null, origin);
    },
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Root & Health Check (Fast response without waiting for DB)
app.get('/', (req, res) => res.json({ status: 'ok', message: 'Mirka Pokorna API running on Vercel' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// Database connection helper
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mirkapokorna';
let isConnecting = null;

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        return;
    }
    if (isConnecting) {
        await isConnecting;
        return;
    }
    isConnecting = mongoose.connect(MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
    });
    try {
        await isConnecting;
        console.log('✅ MongoDB připojen ke stávající databázi');
    } catch (err) {
        console.error('⚠️ Chyba při připojování k MongoDB Atlas:', err.message);
    } finally {
        isConnecting = null;
    }
};

// Auto-connect DB middleware for API routes
app.use(async (req, res, next) => {
    try {
        await connectDB();
    } catch (err) {
        console.error('DB Connection middleware error:', err);
    }
    next();
});

// Statická složka pro nahrané soubory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/studios', studiosRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/seed', seedRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/services', servicesRoutes);

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`🚀 Backend server mirkapokorna.cz běží na portu ${PORT}`);
        connectDB();
    });
} else {
    connectDB().catch(err => console.error('Top level connectDB error:', err));
}

module.exports = app;

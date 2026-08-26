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

// Health Check
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

const PORT = process.env.PORT || 5000;
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

// Middleware pro automatické připojení DB u serverless requestů
app.use(async (req, res, next) => {
    try {
        await connectDB();
    } catch (err) {
        console.error('DB Connection middleware error:', err);
    }
    next();
});

// Pokud nebydlíme na Vercelu jako serverless funkce, spustíme HTTP server pro lokální vývoj
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`🚀 Backend server mirkapokorna.cz běží na portu ${PORT}`);
        connectDB();
    });
} else {
    connectDB();
}

module.exports = app;

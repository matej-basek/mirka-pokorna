const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const authRoutes = require('../routes/auth');
const eventsRoutes = require('../routes/events');
const studiosRoutes = require('../routes/studios');
const contactRoutes = require('../routes/contact');
const seedRoutes = require('../routes/seed');
const reviewsRoutes = require('../routes/reviews');
const servicesRoutes = require('../routes/services');

const app = express();

app.use(cors({
    origin: function (origin, callback) {
        // Dynamicky vrátíme příchozí origin, aby fungovaly credentials (cookies / headers) v prohlížeči
        if (!origin) return callback(null, true);
        callback(null, origin);
    },
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Root & Health Check
app.get('/', (req, res) => res.json({ status: 'ok', message: 'Mirka Pokorna API running on Vercel' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// Safe Database connection helper
let isConnecting = null;

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    if (isConnecting) {
        try { await isConnecting; } catch (e) {}
        return;
    }
    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.log('⚠️ MONGO_URI missing in process.env');
        return;
    }
    try {
        isConnecting = mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
        await isConnecting;
        console.log('✅ MongoDB connected successfully');
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

// Statická složka pro uploads (pokud existuje)
const uploadsDir = path.join(__dirname, '../uploads');
if (fs.existsSync(uploadsDir)) {
    app.use('/uploads', express.static(uploadsDir));
}

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

// Error handler
app.use((err, req, res, next) => {
    console.error('Express error:', err);
    res.status(500).json({ message: err.message || 'Internal Server Error' });
});

module.exports = (req, res) => {
    return app(req, res);
};

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

// Spustíme Express HTTP server ihned, aby API reagovalo okamžitě a nečekalo na DB
app.listen(PORT, () => {
    console.log(`🚀 Backend server mirkapokorna.cz běží na portu ${PORT}`);

    // Self-ping pro udržení aktivity na Render.com (Render nastavuje RENDER_EXTERNAL_URL automaticky)
    const renderUrl = process.env.RENDER_EXTERNAL_URL || process.env.SELF_PING_URL;
    if (renderUrl) {
        const pingUrl = `${renderUrl.replace(/\/$/, '')}/api/health`;
        const client = pingUrl.startsWith('https') ? require('https') : require('http');
        console.log(`📡 Self-ping aktivní pro: ${pingUrl}`);
        setInterval(() => {
            client.get(pingUrl, (res) => {
                console.log(`[Self-Ping] Ping ok (${res.statusCode})`);
            }).on('error', (err) => {
                console.error('[Self-Ping] Chyba self-pingu:', err.message);
            });
        }, 10 * 60 * 1000); // každých 10 minut
    }
});

mongoose
    .connect(MONGO_URI, {
        serverSelectionTimeoutMS: 5000, // Maximálně 5s čekání na MongoDB
    })
    .then(() => {
        console.log('✅ MongoDB připojen ke stávající databázi');
    })
    .catch((err) => {
        console.error('⚠️ Chyba při připojování k MongoDB Atlas:', err.message);
    });

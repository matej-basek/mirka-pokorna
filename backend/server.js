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

    // Keep-alive ping pro udržení aktivity na Render.com free tieru
    const backendUrl = process.env.RENDER_EXTERNAL_URL || 'https://mirka-pokorna.onrender.com';
    const frontendUrl = process.env.FRONTEND_RENDER_URL || 'https://mirka-pokorna-web.onrender.com';
    console.log(`📡 Keep-alive ping aktivní pro backend: ${backendUrl}/api/health`);
    console.log(`📡 Keep-alive ping aktivní pro frontend: ${frontendUrl}`);
    setInterval(() => {
        // Ping backendu
        fetch(`${backendUrl}/api/health`)
            .then(res => console.log(`[${new Date().toISOString()}] Backend ping ok:`, res.status))
            .catch(err => console.log(`[${new Date().toISOString()}] Backend ping selhal:`, err.message));
        // Ping frontendu
        fetch(frontendUrl)
            .then(res => console.log(`[${new Date().toISOString()}] Frontend ping ok:`, res.status))
            .catch(err => console.log(`[${new Date().toISOString()}] Frontend ping selhal:`, err.message));
    }, 14 * 60 * 1000); // každých 14 minut (Render uspí po 15 min)
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

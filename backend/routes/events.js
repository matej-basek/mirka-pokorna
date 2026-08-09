const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Event = require('../models/Event');
const auth = require('../middleware/auth');

// Multer storage setup for local fallback uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// GET /api/events - Veřejný výpis akcí
router.get('/', async (req, res) => {
    try {
        const events = await Event.find().sort({ order: 1, createdAt: -1 });
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: 'Chyba při načítání akcí.' });
    }
});

// GET /api/events/:id
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Akce nenalezena.' });
        res.json(event);
    } catch (err) {
        res.status(500).json({ message: 'Chyba při načítání akce.' });
    }
});

// POST /api/events - Vytvoření akce (Admin)
router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        const { title, description, registrationUrl, date, location, mapsUrl, price, active, order } = req.body;
        let imageUrl = req.body.imageUrl || '';
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        }

        const newEvent = new Event({
            title,
            description,
            imageUrl,
            registrationUrl,
            date,
            location,
            mapsUrl: mapsUrl || '',
            price,
            active: active !== undefined ? active === 'true' || active === true : true,
            order: order ? Number(order) : 0,
        });

        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (err) {
        res.status(500).json({ message: 'Chyba při vytváření akce.' });
    }
});

// PUT /api/events/:id - Úprava akce (Admin)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
    try {
        const { title, description, registrationUrl, date, location, mapsUrl, price, active, order } = req.body;
        const updateData = {
            title,
            description,
            registrationUrl,
            date,
            location,
            mapsUrl: mapsUrl || '',
            price,
            order: order ? Number(order) : 0,
        };
        if (active !== undefined) {
            updateData.active = active === 'true' || active === true;
        }

        if (req.file) {
            updateData.imageUrl = `/uploads/${req.file.filename}`;
        } else if (req.body.imageUrl !== undefined) {
            updateData.imageUrl = req.body.imageUrl;
        }

        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedEvent) return res.status(404).json({ message: 'Akce nenalezena.' });

        res.json(updatedEvent);
    } catch (err) {
        res.status(500).json({ message: 'Chyba při úpravě akce.' });
    }
});

// DELETE /api/events/:id - Mazání akce (Admin)
router.delete('/:id', auth, async (req, res) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);
        if (!deletedEvent) return res.status(404).json({ message: 'Akce nenalezena.' });
        res.json({ message: 'Akce byla úspěšně smazána.' });
    } catch (err) {
        res.status(500).json({ message: 'Chyba při mazání akce.' });
    }
});

module.exports = router;

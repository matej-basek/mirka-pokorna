const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middleware/auth');
const { upload, getUploadedFileUrl } = require('../config/cloudinary');

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
            imageUrl = getUploadedFileUrl(req.file);
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
        console.error('Chyba při POST /api/events:', err);
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
            updateData.imageUrl = getUploadedFileUrl(req.file);
        } else if (req.body.imageUrl !== undefined) {
            updateData.imageUrl = req.body.imageUrl;
        }

        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedEvent) return res.status(404).json({ message: 'Akce nenalezena.' });

        res.json(updatedEvent);
    } catch (err) {
        console.error('Chyba při PUT /api/events:', err);
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

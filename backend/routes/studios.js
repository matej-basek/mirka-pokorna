const express = require('express');
const router = express.Router();
const Studio = require('../models/Studio');
const auth = require('../middleware/auth');
const { upload, getUploadedFileUrl } = require('../config/cloudinary');

// GET /api/studios
router.get('/', async (req, res) => {
    try {
        const studios = await Studio.find().sort({ order: 1 });
        res.json(studios);
    } catch (err) {
        res.status(500).json({ message: 'Chyba při načítání studií.' });
    }
});

// POST /api/studios
router.post('/', auth, upload.single('photo'), async (req, res) => {
    try {
        const { name, location, description, order, lessons, mapsUrl, registrationUrl } = req.body;
        let photoUrl = req.body.photoUrl || '';
        if (req.file) {
            photoUrl = getUploadedFileUrl(req.file);
        }

        let parsedLessons = [];
        if (lessons) {
            parsedLessons = typeof lessons === 'string' ? JSON.parse(lessons) : lessons;
        }

        const newStudio = new Studio({
            name,
            location,
            description,
            photoUrl,
            mapsUrl: mapsUrl || '',
            registrationUrl: registrationUrl || '',
            order: order ? Number(order) : 0,
            lessons: parsedLessons,
        });

        await newStudio.save();
        res.status(201).json(newStudio);
    } catch (err) {
        console.error('Chyba při POST /api/studios:', err);
        res.status(500).json({ message: 'Chyba při vytváření studia/kurzu.' });
    }
});

// PUT /api/studios/:id
router.put('/:id', auth, upload.single('photo'), async (req, res) => {
    try {
        const { name, location, description, order, lessons, mapsUrl, registrationUrl } = req.body;
        const updateData = { name, location, description, order: order ? Number(order) : 0 };

        if (mapsUrl !== undefined) updateData.mapsUrl = mapsUrl;
        if (registrationUrl !== undefined) updateData.registrationUrl = registrationUrl;

        if (lessons !== undefined) {
            updateData.lessons = typeof lessons === 'string' ? JSON.parse(lessons) : lessons;
        }

        if (req.file) {
            updateData.photoUrl = getUploadedFileUrl(req.file);
        } else if (req.body.photoUrl !== undefined) {
            updateData.photoUrl = req.body.photoUrl;
        }

        const updatedStudio = await Studio.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedStudio) return res.status(404).json({ message: 'Studio nenalezeno.' });

        res.json(updatedStudio);
    } catch (err) {
        console.error('Chyba při PUT /api/studios:', err);
        res.status(500).json({ message: 'Chyba při úpravě studia.' });
    }
});

// DELETE /api/studios/:id
router.delete('/:id', auth, async (req, res) => {
    try {
        const deletedStudio = await Studio.findByIdAndDelete(req.params.id);
        if (!deletedStudio) return res.status(404).json({ message: 'Studio nenalezeno.' });
        res.json({ message: 'Studio bylo úspěšně smazáno.' });
    } catch (err) {
        res.status(500).json({ message: 'Chyba při mazání studia.' });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Service = require('../models/Service');
const auth = require('../middleware/auth');

// Multer storage setup
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

// GET /api/services - Veřejný výpis služeb
router.get('/', async (req, res) => {
    try {
        const services = await Service.find().sort({ order: 1, createdAt: 1 });
        res.json(services);
    } catch (err) {
        res.status(500).json({ message: 'Chyba při načítání služeb.' });
    }
});

// GET /api/services/:id
router.get('/:id', async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) return res.status(404).json({ message: 'Služba nenalezena.' });
        res.json(service);
    } catch (err) {
        res.status(500).json({ message: 'Chyba při načítání služby.' });
    }
});

// POST /api/services - Vytvoření služby (Admin)
router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        const { title, subtitle, description, benefits, icon, active, order } = req.body;

        let imageUrl = req.body.imageUrl || '';
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        }

        // benefits může přijít jako JSON string nebo pole
        let parsedBenefits = [];
        if (benefits) {
            try {
                parsedBenefits = typeof benefits === 'string' ? JSON.parse(benefits) : benefits;
            } catch {
                parsedBenefits = Array.isArray(benefits) ? benefits : [benefits];
            }
        }

        const newService = new Service({
            title,
            subtitle: subtitle || '',
            description,
            benefits: parsedBenefits,
            imageUrl,
            icon: icon || 'flower',
            active: active !== undefined ? active === 'true' || active === true : true,
            order: order ? Number(order) : 0,
        });

        await newService.save();
        res.status(201).json(newService);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Chyba při vytváření služby.' });
    }
});

// PUT /api/services/:id - Úprava služby (Admin)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
    try {
        const { title, subtitle, description, benefits, icon, active, order } = req.body;

        let parsedBenefits = [];
        if (benefits) {
            try {
                parsedBenefits = typeof benefits === 'string' ? JSON.parse(benefits) : benefits;
            } catch {
                parsedBenefits = Array.isArray(benefits) ? benefits : [benefits];
            }
        }

        const updateData = {
            title,
            subtitle: subtitle || '',
            description,
            benefits: parsedBenefits,
            icon: icon || 'flower',
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

        const updatedService = await Service.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedService) return res.status(404).json({ message: 'Služba nenalezena.' });

        res.json(updatedService);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Chyba při úpravě služby.' });
    }
});

// DELETE /api/services/:id - Mazání služby (Admin)
router.delete('/:id', auth, async (req, res) => {
    try {
        const deletedService = await Service.findByIdAndDelete(req.params.id);
        if (!deletedService) return res.status(404).json({ message: 'Služba nenalezena.' });
        res.json({ message: 'Služba byla úspěšně smazána.' });
    } catch (err) {
        res.status(500).json({ message: 'Chyba při mazání služby.' });
    }
});

module.exports = router;

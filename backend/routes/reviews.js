const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const auth = require('../middleware/auth');

// GET /api/reviews - Veřejný výpis recenzí
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find({ active: true }).sort({ order: 1, createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: 'Chyba při načítání recenzí.' });
    }
});

// GET /api/reviews/all - Všechny recenze (i neaktivní) pro admin
router.get('/all', auth, async (req, res) => {
    try {
        const reviews = await Review.find().sort({ order: 1, createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: 'Chyba při načítání recenzí.' });
    }
});

// POST /api/reviews - Vytvoření recenze (Admin)
router.post('/', auth, async (req, res) => {
    try {
        const { content, author, course, rating, active, order } = req.body;
        const newReview = new Review({
            content,
            author,
            course,
            rating: rating || 5,
            active: active !== undefined ? active : true,
            order: order || 0
        });
        await newReview.save();
        res.status(201).json(newReview);
    } catch (err) {
        res.status(500).json({ message: 'Chyba při vytváření recenze.' });
    }
});

// PUT /api/reviews/:id - Úprava recenze (Admin)
router.put('/:id', auth, async (req, res) => {
    try {
        const { content, author, course, rating, active, order } = req.body;
        const updateData = { content, author, course, rating, active, order };
        
        const updatedReview = await Review.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedReview) return res.status(404).json({ message: 'Recenze nenalezena.' });
        
        res.json(updatedReview);
    } catch (err) {
        res.status(500).json({ message: 'Chyba při úpravě recenze.' });
    }
});

// DELETE /api/reviews/:id - Mazání recenze (Admin)
router.delete('/:id', auth, async (req, res) => {
    try {
        const deletedReview = await Review.findByIdAndDelete(req.params.id);
        if (!deletedReview) return res.status(404).json({ message: 'Recenze nenalezena.' });
        res.json({ message: 'Recenze byla úspěšně smazána.' });
    } catch (err) {
        res.status(500).json({ message: 'Chyba při mazání recenze.' });
    }
});

module.exports = router;

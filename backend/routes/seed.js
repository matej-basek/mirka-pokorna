const express = require('express');
const router = express.Router();
const runSeed = require('../seed');
const auth = require('../middleware/auth');

// GET /api/seed - Chráněný přístup pro seed databáze (pouze přihlášený admin)
router.get('/', auth, async (req, res) => {
    try {
        await runSeed();
        res.json({ message: 'Seed databáze proběhl úspěšně.' });
    } catch (err) {
        res.status(500).json({ message: 'Chyba při seedování:', error: err.message });
    }
});

module.exports = router;

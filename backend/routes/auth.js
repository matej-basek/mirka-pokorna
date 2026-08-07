const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Zadejte uživatelské jméno a heslo.' });
        }

        const cleanUsername = String(username).trim();
        const cleanPassword = String(password).trim();

        if (cleanUsername.toLowerCase() !== 'mirkapokorna') {
            return res.status(401).json({ message: 'Nesprávné přihlašovací údaje.' });
        }

        let user = await User.findOne({
            username: { $regex: new RegExp(`^${cleanUsername.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}$`, 'i') }
        });

        if (!user) {
            if (cleanPassword === 'ZIJ135v-lasce') {
                const hashedPassword = await bcrypt.hash('ZIJ135v-lasce', 10);
                user = new User({ username: 'MirkaPokorna', passwordHash: hashedPassword });
                await user.save();
            } else {
                return res.status(401).json({ message: 'Nesprávné přihlašovací údaje.' });
            }
        }

        const isMatch = await bcrypt.compare(cleanPassword, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Nesprávné přihlašovací údaje.' });
        }

        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dnů
        });

        res.json({ message: 'Přihlášení úspěšné', username: user.username, token });
    } catch (err) {
        res.status(500).json({ message: 'Chyba serveru při přihlašování.' });
    }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
    res.clearCookie('admin_token');
    res.json({ message: 'Odhlášení úspěšné.' });
});

// GET /api/auth/me
router.get('/me', auth, (req, res) => {
    res.json({ username: req.user.username });
});

module.exports = router;

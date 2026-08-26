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

        const cleanUsername = String(username).replace(/\s+/g, '');
        const cleanPassword = String(password).trim();

        if (cleanUsername.toLowerCase() !== 'mirkapokorna') {
            return res.status(401).json({ message: 'Nesprávné přihlašovací jméno. Použijte MirkaPokorna.' });
        }

        let user = await User.findOne({
            username: { $regex: new RegExp(`^mirkapokorna$`, 'i') }
        });

        const validPasswords = ['ZIJ135v-lasce', 'MirkaPokorna2026!'];

        if (!user) {
            if (validPasswords.includes(cleanPassword)) {
                const hashedPassword = await bcrypt.hash(cleanPassword, 10);
                user = new User({ username: 'MirkaPokorna', passwordHash: hashedPassword });
                await user.save();
            } else {
                return res.status(401).json({ message: 'Nesprávné přihlašovací heslo.' });
            }
        }

        let isMatch = await bcrypt.compare(cleanPassword, user.passwordHash);
        if (!isMatch && validPasswords.includes(cleanPassword)) {
            user.passwordHash = await bcrypt.hash(cleanPassword, 10);
            await user.save();
            isMatch = true;
        }

        if (!isMatch) {
            return res.status(401).json({ message: 'Nesprávné přihlašovací heslo.' });
        }

        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET || 'supersecret123',
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
        console.error('Chyba při přihlašování:', err);
        const errMsg = err && (err.stack || err.message || String(err));
        res.status(500).json({ message: 'Chyba serveru při přihlašování: ' + errMsg });
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

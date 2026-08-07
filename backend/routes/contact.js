const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Message = require('../models/Message');

// POST /api/contact - Odeslání kontaktního formuláře
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, service, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Vyplňte prosím všechna povinná pole (Jméno, E-mail, Zpráva).' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Zadejte prosím platnou e-mailovou adresu.' });
        }

        // 1. Uložit zprávu do databáze MongoDB
        const newMessage = new Message({
            name,
            email,
            phone: phone || '',
            service: service || 'Všeobecný dotaz',
            message,
        });

        await newMessage.save();

        // 2. Pokus o odeslání e-mailu (pokud jsou nastaveny SMTP nebo Gmail údaje)
        const recipientEmail = process.env.NOTIFICATION_EMAIL || 've.smiru@seznam.cz';

        let transporter = null;
        if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
            transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT) || 465,
                secure: process.env.SMTP_SECURE !== 'false',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });
        } else if (process.env.GMAIL_APP_PASSWORD && process.env.GMAIL_USER) {
            transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.GMAIL_USER,
                    pass: process.env.GMAIL_APP_PASSWORD,
                },
            });
        }

        if (transporter) {
            try {
                const senderEmail = process.env.SMTP_USER || process.env.GMAIL_USER || 'no-reply@mirkapokorna.cz';
                const mailOptions = {
                    from: `"Mirka Pokorná Web" <${senderEmail}>`,
                    to: recipientEmail,
                    replyTo: email,
                    subject: `[mirkapokorna.cz] Nová zpráva od ${name} (${service || 'Všeobecný dotaz'})`,
                    text: `
Jméno: ${name}
E-mail: ${email}
Telefon: ${phone || 'Nezadán'}
Téma / Služba: ${service || 'Všeobecný dotaz'}

Zpráva:
${message}
                    `,
                };

                await transporter.sendMail(mailOptions);
                console.log(`✅ E-mail odeslán na adresu: ${recipientEmail}`);
            } catch (mailErr) {
                console.error('Varování: Nepodařilo se odeslat e-mail přes Nodemailer:', mailErr.message);
            }
        }

        res.status(200).json({
            success: true,
            message: 'Děkujeme za vaši zprávu! Mirka vás bude brzy kontaktovat.',
        });
    } catch (err) {
        console.error('Chyba při zpracování kontaktního formuláře:', err);
        res.status(500).json({ message: 'Chyba při ukládání zprávy. Zkuste to prosím znovu.' });
    }
});

// GET /api/contact - Výpis zpráv pro správce (volitelné)
router.get('/', async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: 'Chyba při načítání zpráv.' });
    }
});

module.exports = router;

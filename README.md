# 🌸 Mirka Pokorná – Webová prezentace & CMS (mirkapokorna.cz)

Osobní prezentace a rezervační systém pro **Mirku Pokornou** zaměřené na intuitivní zpěv, muzikoterapii, spontánní tanec a ženské kruhy.

---

## 🎨 Vizuální Identita & Design System

* **Barevná paleta:**
  * `--bg-primary`: `#FFFFFF` (Čistá bílá)
  * `--bg-secondary`: `#F2F6F9` (Jemný pastelovo-modrý podklad)
  * `--color-primary`: `#1E3A5F` (Hluboká mořská modrá pro čitelnost a stabilizaci)
  * `--color-accent-pink`: `#F5D6DF` (Jemná pudrová růžová)
  * `--color-accent-gold`: `#C5A059` (Tlumená zlatá pro CTA akce)
  * `--color-text-body`: `#2C3E50` (Tmavá břidlicová pro vysoký kontrast)
* **Typografie:**
  * Nadpisy: `Cormorant Garamond` (elegantní serif)
  * Běžný text: `Montserrat` (čistý bezpatkový font)
* **Motivy & Animace:**
  * Květ jabloně (vodoznaky, ikony a patička)
  * Mikro-interakce vodních vlnek (`btn-ripple`) u tlačítka pro rezervaci

---

## 🛠️ Technologický Stack

* **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Framer Motion, Lucide React, Axios.
* **Backend:** Node.js, Express.js, MongoDB via Mongoose, Cloudinary, Nodemailer, JWT autentizace & cookie storage.

---

## 🚀 Jak spustit projekt lokálně

### 1. Backend
```bash
cd backend
npm install
npm run seed  # Naplnění databáze ukázkovými daty
npm run dev   # Běží na http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev   # Běží na http://localhost:3000
```

---

## 🔐 CMS Administrace
Přístup do správy obsahu: `http://localhost:3000/admin/login`
- **Jméno:** `MirkaPokorna`
- **Heslo:** `ZIJ135v-lasce`

# 📖 Návod na obsluhu webu a technická dokumentace
**Web:** [mirkapokorna.cz](https://mirkapokorna.cz)  
**Majitelka:** Mirka Pokorná  

---

## 📌 ČÁST 1: Uživatelský návod pro obsluhu administrace

Administrace slouží k jednoduché správě obsahu webu (služby, plánované akce, stálá studia a rozvrhy lekcí) bez nutnosti znalosti programování.

### 1. Přihlášení do administrace
1. Otevřete internetový prohlížeč a přejděte na adresu:  
   👉 **`https://mirkapokorna.cz/admin/login`**
2. Zadejte váš **E-mail** a **Heslo**.
3. Klikněte na tlačítko **Přihlásit se**.

---

### 2. Správa Služeb a Hlavních témat (`Služby`)
V této záložce spravujete karty služeb na hlavní stránce (např. *Ženský kruh*, *Intuitivní zpěv*, *Muzikoterapie*).

* **Přidání nové služby:**  
  Klikněte na tlačítko **+ Přidat novou službu**.
* **Úprava stávající služby:**  
  U vybrané služby v tabulce nebo kartách klikněte na tlačítko **Upravit**.
* **Pole formuláře:**
  * **Název služby:** Titulek karty (např. *Ženský kruh*).
  * **Podtitulek:** Krátký vystihující popisek (např. *Bezpečné sdílení, uvolnění a sounáležitost*).
  * **Popis:** Detailní text, který se zobrazí návštěvníkovi po kliknutí na tlačítko *Zjistit více*.
    > 💡 **Tip k formátování:** Všechna odřádkování, odstavce i odrážky zadané v tomto poli se zobrazí na webu přesně tak, jak je napíšete.
  * **Ikona:** Výběr grafické ikony na kartě služby.
  * **Výhody / body programu:** Jednotlivé body, které se zobrazí na kartě služby. Přidáte napsáním textu a stisknutím klávesy *Enter* nebo kliknutím na *Přidat*.
  * **Fotka detailu:** Fotka, která se zobrazí v pop-up okně po rozkliknutí služby.
  * **Zobrazovat veřejně na webu:** Prepínač pro skrytí nebo publikování služby na webu.
* **Uložení:** Klikněte na tlačítko **Uložit změny** nebo **Vytvořit službu**.

---

### 3. Správa Akcí a Workshopů (`Akce`)
Zde spravujete nadcházející jednodenní či víkendové akce, workshopy a retreaty.

* **Přidání nové akce:** Klikněte na **+ Přidat novou akci**.
* **Pole formuláře:**
  * **Název akce:** Název workshopu či setkání.
  * **Popis akce:** Detailní informace o programu a průběhu.
  * **Datum a čas:** Textový zápis termínu (např. *15. Října 2026, 17:00 – 20:00*).
  * **Cena:** Cena akce (např. *1 200 Kč*).
  * **Místo konání:** Název a adresa místa (např. *Prostor Pro Tebe, Mánesova 54, Praha 2*).
  * **Odkaz na mapy:** Odkaz z Google Maps na konkrétní lokaci. V pop-up okně se adresa stane kliknutelnou a otevře návštěvníkovi navigaci.
  * **Odkaz na registrace:** Odkaz na váš rezervační formulář (Google Forms apod.). Pokud odkaz nezadáte, tlačítko na webu návštěvníka automaticky posune na kontaktní formulář.
  * **Plakát / Fotka:** Plakát nebo ilustrační fotka k akci.
  * **Stav (Aktivní / Skrytá):** Umožňuje staré nebo vyprodané akce skrýt bez nutnosti jejich mazání.

---

### 4. Správa Studií a Rozvrhu (`Studia a rozvrh`)
Tato sekce slouží ke správě stálých studií a jejich pravidelných týdenních kurzů.

* **Přidání studia:** Klikněte na **+ Přidat nové studio**.
* **Pole formuláře:**
  * **Název studia:** Název prostoru (např. *Prostor Pro Tebe – Praha*).
  * **Lokace:** Město/čtvrť (např. *Praha 2, Vinohrady*).
  * **Popis studia:** Krátké představení prostoru.
  * **Odkaz na mapy:** Odkaz na Google Maps. Při rozkliknutí studia se název studia stane kliknutelným odkazem.
  * **Odkaz na rezervaci:** Odkaz na formulář pro přihlášení do kurzu.
  * **Fotka studia:** Fotka prostoru, která se zobrazí v hlavičce rozvrhu v pop-up okně.
  * **Rozvrh lekcí:** V sekci *Rozvrh lekcí* klikněte na **+ Přidat lekci** a vyplňte:
    * *Název kurzu* (např. *Intuitivní zpěv*)
    * *Den* (např. *Úterý*)
    * *Čas* (např. *18:00 – 19:30*)
    * *Cena za lekci* (např. *350 Kč*)

---
---

## 🛠️ ČÁST 2: Základní technická dokumentace

Dokumentace pro správu, údržbu a případný další vývoj aplikace.

### 1. Použitý technologický stoh (Tech Stack)
* **Frontend:** Next.js (React 19), TypeScript, Tailwind CSS, Framer Motion, Lucide Icons.
* **Backend:** Node.js, Express.js REST API, Mongoose ODM.
* **Databáze:** MongoDB Atlas (Cloud NoSQL databáze).
* **Ukládání médií:** Cloudinary (Automatická optimalizace a trvalé hosting nahrávaných fotek a plakátů).
* **Hosting:** Render.com (Web Service pro frontend i backend).
* **Doména & DNS:** FORPSI (DNS A record + CNAME).

### 2. URL Adresy a Produkční prostředí
* **Web (Vlastní doména):** `https://mirkapokorna.cz` (`www.mirkapokorna.cz`)
* **Frontend (Render):** `https://mirka-pokorna-web.onrender.com`
* **Backend API (Render):** `https://mirka-pokorna.onrender.com/api`
* **Healthcheck:** `https://mirka-pokorna.onrender.com/api/health`

### 3. Konfigurace Environmentálních proměnných (Env Variables)

#### Backend (`/backend/.env` & Render Environment Variables):
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/mirkapokorna
JWT_SECRET=<tajny_klic_pro_tokens>
CLOUDINARY_CLOUD_NAME=<cloudinary_cloud_name>
CLOUDINARY_API_KEY=<cloudinary_api_key>
CLOUDINARY_API_SECRET=<cloudinary_api_secret>
RENDER_EXTERNAL_URL=https://mirka-pokorna.onrender.com
FRONTEND_RENDER_URL=https://mirkapokorna.cz
```

#### Frontend (`/frontend/.env.local` & Render Environment Variables):
```env
NEXT_PUBLIC_API_URL=https://mirka-pokorna.onrender.com/api
```

### 4. Automatické předcházení usnutí serveru (Keep-Alive Ping)
Bezplatná verze na Render.com po 15 minutách neaktivity usíná. V backendovém souboru `server.js` je zaveden automatický `fetch` interval (každých 14 minut), který odesílá pingy na backend i frontend, čímž udržuje aplikaci neustále aktivní a připravenou pro návštěvníky.

### 5. Lokální spuštění projektu
1. **Klonování repozitáře:**
   ```bash
   git clone https://github.com/matej-basek/mirka-pokorna.git
   ```
2. **Spuštění Backendu:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
3. **Spuštění Frontendu:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Aplikace poběží na `http://localhost:3000`.

---
*Vytvořeno v roce 2026 pro projekt Mirka Pokorná.*

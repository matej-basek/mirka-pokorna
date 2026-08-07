/**
 * Seed skript — naplní kolekci 'services' třemi výchozími službami
 * Spuštění: node seed_services.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('./models/Service');

const SERVICES = [
  {
    title: 'Ženský kruh',
    subtitle: 'Bezpečné sdílení, uvolnění a sounáležitost',
    description:
      'Prostor pro ženskou regeneraci, kde v bezpečí a bez hodnocení odkládáme masky a každodenní tlaky. Společně se ladíme na přirozený rytmus svého těla i duše skrz hluboký prožitek.',
    benefits: [
      'Meditace a zklidnění mysli',
      'Intuitivní tanec a vědomý pohyb',
      'Intuitivní zpěv a pasivní muzikoterapie',
    ],
    imageUrl: '/service-kruh.jpg',
    icon: 'flower',
    active: true,
    order: 0,
  },
  {
    title: 'Intuitivní zpěv',
    subtitle: 'Objevení přirozené síly a svobody vlastního hlasu',
    description:
      'Hlas je naším nejpřirozenějším nástrojem k uvolnění emocí a napětí. V laskavém a podporujícím prostoru probouzíme svou hlasovou autenticitu a radost ze spontánního zvukového projevu.',
    benefits: [
      'Společný intuitivní ženský zpěv',
      'Hra na jednoduché nástroje (perkuse)',
      'Uvolnění hlasového bloku a rezonance těla',
    ],
    imageUrl: '/service-zpev.jpg',
    icon: 'music',
    active: true,
    order: 1,
  },
  {
    title: 'Muzikoterapie pro MŠ',
    subtitle: 'Harmonizace, radost ze zvuků a práce s emocemi pro děti',
    description:
      'Hravé a empatické programy přizpůsobené na míru pro mateřské školy. Skrz hudbu, rytmus a akustické nástroje dětem pomáháme přirozeně objevovat svět zvuků i vlastních prožitků.',
    benefits: [
      'Aktivní i pasivní muzikoterapie',
      'Rozvoj emoční inteligence u dětí',
      'Zklidnění, koncentrace a podpora vnímání',
    ],
    imageUrl: '/service-ms.jpg',
    icon: 'smile',
    active: true,
    order: 2,
  },
];

async function main() {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mirkapokorna';
  console.log('Připojuji se k MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('✅ Připojeno');

  const existing = await Service.countDocuments();
  if (existing > 0) {
    console.log(`⚠️  Kolekce 'services' již obsahuje ${existing} záznam(ů). Přeskakuji seed.`);
    console.log('   Pokud chcete přepsat, smažte záznamy ručně v admin panelu nebo MongoDB Atlasu.');
  } else {
    await Service.insertMany(SERVICES);
    console.log(`✅ Vloženo ${SERVICES.length} služeb do databáze.`);
  }

  await mongoose.disconnect();
  console.log('Odpojeno.');
}

main().catch((err) => {
  console.error('Chyba:', err);
  process.exit(1);
});

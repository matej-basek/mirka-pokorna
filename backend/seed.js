require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');
const Studio = require('./models/Studio');
const Review = require('./models/Review');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mirkapokorna';

async function seedData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Seed Events
    const fallbackEvents = [
      {
        title: 'Odemkni svůj vnitřní hlas – Intenzivní jednodenní workshop',
        description: 'Celodenní zážitkový workshop zaměřený na uvolnění stahu v hrdle, objevování síly vlastního zvuku a harmonizaci těla pomocí muzikoterapeutických nástrojů.',
        date: '15. Října 2026',
        location: 'Prostor Pro Tebe, Praha Vinohrady',
        price: '1 800 Kč',
        registrationUrl: 'https://forms.google.com/',
        active: true,
      },
      {
        title: 'Podzimní Ženský Kruh: Síla Něžnosti & Spontánní Tanec',
        description: 'Bezpečné večerní setkání žen. Využijeme spontánní pohyb, jemné vedení hlasu a podporu komunity pro načerpání nové energie a klidu.',
        date: '28. Října 2026',
        location: 'Studio Harmonik, Brno',
        price: '750 Kč',
        registrationUrl: 'https://forms.google.com/',
        active: true,
      },
      {
        title: 'Retreat v přírodě: Zvuk, Pohyb a Sebeláska',
        description: 'Víkendový pobyt uprostřed přírody s ubytováním, vegetariánskou stravou, denní muzikoterapií, tancem a večerním ohňovým rituálem.',
        date: '20. - 22. Listopadu 2026',
        location: 'Přírodní centrum Jizerka',
        price: '4 500 Kč',
        registrationUrl: 'https://forms.google.com/',
        active: true,
      }
    ];

    await Event.deleteMany({});
    await Event.insertMany(fallbackEvents);
    console.log('Events seeded.');

    // Seed Studios
    const fallbackStudios = [
      {
        name: 'Prostor Pro Tebe – Praha',
        location: 'Praha 2, Vinohrady',
        description: 'Klidné, komorní studio s výbornou akustikou pro Intuitivní zpěv.',
        lessons: [
          {
            name: 'Intuitivní zpěv & Hlasové lázně',
            day: 'Úterý',
            time: '18:00 – 19:30',
            pricePerLesson: '350 Kč',
            courseInfo: 'Cyklus 5 setkání',
            coursePrice: '1 600 Kč',
            additionalInfo: 'Kapacita max. 10 žen. Vhodné i pro začátečnice.',
          },
          {
            name: 'Spontánní tanec & Meditace v pohybu',
            day: 'Čtvrtek',
            time: '17:30 – 19:00',
            pricePerLesson: '350 Kč',
            courseInfo: 'Otevřené lekce',
            coursePrice: '',
            additionalInfo: 'Pohodlné oblečení, tančíme naboso.',
          }
        ]
      },
      {
        name: 'Studio Harmonik – Brno',
        location: 'Brno - centrum',
        description: 'Nádherný prosvětlený sál s křišťálovými mísami a kruhovým sezením.',
        lessons: [
          {
            name: 'Ženský kruh & Hlasové uvolnění',
            day: 'Středa',
            time: '18:15 – 20:15',
            pricePerLesson: '450 Kč',
            courseInfo: 'Měsíční setkání',
            coursePrice: '',
            additionalInfo: 'Součástí je bylinkový rituál a muzikoterapie.',
          }
        ]
      }
    ];

    await Studio.deleteMany({});
    await Studio.insertMany(fallbackStudios);
    console.log('Studios seeded.');

    // Seed Reviews
    const fallbackReviews = [
      {
        author: 'Klientka',
        course: 'Večerní setkání a muzikoterapie',
        content: 'Moc se mi to líbilo, jde z tebe cítit taková uklidňující a pozitivní energie. Jen na začátku jak jsme si sedly, a mluvila jsi o vnitřním dítěti, rozbrečela jsem se. Ta otevřenost a upřímnost tam byla přímo hmotná. Při tanci jsem cítila jak že mě odchází strach a stres. Při hraní ke mně promluvil ocean drum a melodie, kterou jsme společně vytvořily mě Hladila po duši a vyplavila mi všechny krásné vzpomínky a radosti, které jsem kdy zažila.',
        rating: 5,
        active: true
      },
      {
        author: 'Klientka',
        course: 'Terapie propojení s dětským já',
        content: 'Ahoj, konečně se mohu vyjádřit k báječnému setkání, kde jsem měla možnost prožít chvíle, které rehabilitovaly mou duši. Terapie propojení se svým dětským já ve mě vzbudilo spousty vzpomínek, které mě dojímaly. Tanec byl naprosto fantastický, moc mě bavil a muzikoterapii jsem si taky moc užívala. Vše mě hřálo u srdce a bylo mi moc příjemné. Děkuji za krásné okamžiky 🧡',
        rating: 5,
        active: true
      },
      {
        author: 'Klientka',
        course: 'Intuitivní zpěv a zvuková lázeň',
        content: 'Mirko, setkání s tebou pro mě bylo opravdovým pohlazením. Úplně jsem ztratila pojem o čase a poprvé po dlouhé době jsem si dovolila jen tak být. Vibrace nástrojů a tvůj hlas mě naprosto pohltily a uvolnily napětí, které jsem si v sobě nesla. Odcházela jsem s pocitem obrovské lehkosti a vnitřního klidu. Z celého srdce děkuji za ten nádherný, bezpečný prostor, který dokážeš tak přirozeně vytvořit.',
        rating: 5,
        active: true
      }
    ];

    await Review.deleteMany({});
    await Review.insertMany(fallbackReviews);
    console.log('Reviews seeded.');

    console.log('Seeding complete!');
    if (require.main === module) {
      process.exit(0);
    }
  } catch (err) {
    console.error('Error seeding data:', err);
    if (require.main === module) {
      process.exit(1);
    }
  }
}

if (require.main === module) {
  seedData();
}

module.exports = seedData;

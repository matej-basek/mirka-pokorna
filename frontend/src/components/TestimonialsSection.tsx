'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import axios from 'axios';

interface Review {
  _id?: string;
  author: string;
  course?: string;
  content: string;
  rating: number;
}

const fallbackTestimonials = [
  {
    author: 'Klientka',
    course: 'Večerní setkání a muzikoterapie',
    content: 'Moc se mi to líbilo, jde z tebe cítit taková uklidňující a pozitivní energie. Jen na začátku jak jsme si sedly, a mluvila jsi o vnitřním dítěti, rozbrečela jsem se. Ta otevřenost a upřímnost tam byla přímo hmotná. Při tanci jsem cítila jak že mě odchází strach a stres. Při hraní ke mně promluvil ocean drum a melodie, kterou jsme společně vytvořily mě Hladila po duši a vyplavila mi všechny krásné vzpomínky a radosti, které jsem kdy zažila.',
    rating: 5,
  },
  {
    author: 'Klientka',
    course: 'Terapie propojení s dětským já',
    content: 'Ahoj, konečně se mohu vyjádřit k báječnému setkání, kde jsem měla možnost prožít chvíle, které rehabilitovaly mou duši. Terapie propojení se svým dětským já ve mě vzbudilo spousty vzpomínek, které mě dojímaly. Tanec byl naprosto fantastický, moc mě bavil a muzikoterapii jsem si taky moc užívala. Vše mě hřálo u srdce a bylo mi moc příjemné. Děkuji za krásné okamžiky 🧡',
    rating: 5,
  },
  {
    author: 'Klientka',
    course: 'Intuitivní zpěv a zvuková lázeň',
    content: 'Mirko, setkání s tebou pro mě bylo opravdovým pohlazením. Úplně jsem ztratila pojem o čase a poprvé po dlouhé době jsem si dovolila jen tak být. Vibrace nástrojů a tvůj hlas mě naprosto pohltily a uvolnily napětí, které jsem si v sobě nesla. Odcházela jsem s pocitem obrovské lehkosti a vnitřního klidu. Z celého srdce děkuji za ten nádherný, bezpečný prostor, který dokážeš tak přirozeně vytvořit.',
    rating: 5,
  },
];

import { getApiBaseUrl } from '@/lib/baseUrl';

export default function TestimonialsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const apiUrl = getApiBaseUrl();
        const res = await axios.get(`${apiUrl}/reviews`, { timeout: 10000 });
        if (Array.isArray(res.data)) {
          setReviews(res.data.filter((r: any) => r.active !== false));
        }
      } catch (err) {
        console.error('Fetch reviews error:', err);
      }
    };
    fetchReviews();
  }, []);

  const displayedReviews = reviews.length > 0 ? reviews : fallbackTestimonials;

  return (
    <section id="reference" className="section">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '56px' }}
        >
          <div
            style={{
              fontSize: '16px',
              fontWeight: 700,
              color: '#111',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            Kruhy podpory & Pocity
          </div>
          <h2 className="section-title">
            <span className="gradient-text">Zpětná</span> vazba
          </h2>
          <div className="gradient-line" style={{ margin: '16px auto 0' }} />
        </motion.div>

        {/* Testimonials Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '28px',
          }}
        >
          {displayedReviews.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 1, y: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="glass glass-hover"
              style={{
                borderRadius: '24px',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <Quote size={32} style={{ color: '#f5d6df', marginBottom: '16px', opacity: 0.8 }} />
                <p style={{ color: 'rgba(17, 17, 17,0.85)', fontSize: '15px', fontStyle: 'italic', lineHeight: '1.75', marginBottom: '24px' }}>
                  „{item.content}“
                </p>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyItems: 'space-between' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#111' }}>
                    {item.author}
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(17, 17, 17,0.5)' }}>
                    {item.course}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '2px', color: '#e4b4c3' }}>
                  {[...Array(item.rating || 5)].map((_, idx) => (
                    <Star key={idx} size={15} fill="#e4b4c3" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

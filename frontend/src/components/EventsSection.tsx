'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';
import axios from 'axios';

const getBaseUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  return apiUrl.replace('/api', '');
};

interface EventItem {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  registrationUrl?: string;
  date?: string;
  location?: string;
  price?: string;
  active: boolean;
}

const fallbackEvents: EventItem[] = [
  {
    _id: '1',
    title: 'Odemkni svůj vnitřní hlas – Intenzivní jednodenní workshop',
    description:
      'Celodenní zážitkový workshop zaměřený na uvolnění stahu v hrdle, objevování síly vlastního zvuku a harmonizaci těla pomocí muzikoterapeutických nástrojů.',
    date: '15. Října 2026',
    location: 'Prostor Pro Tebe, Praha Vinohrady',
    price: '1 800 Kč',
    registrationUrl: '#kontakt',
    active: true,
  },
  {
    _id: '2',
    title: 'Podzimní Ženský Kruh: Síla Něžnosti & Spontánní Tanec',
    description:
      'Bezpečné večerní setkání žen. Využijeme spontánní pohyb, jemné vedení hlasu a podporu komunity pro načerpání nové energie a klidu.',
    date: '28. Října 2026',
    location: 'Studio Harmonik, Brno',
    price: '750 Kč',
    registrationUrl: '#kontakt',
    active: true,
  },
  {
    _id: '3',
    title: 'Retreat v přírodě: Zvuk, Pohyb a Sebeláska',
    description:
      'Víkendový pobyt uprostřed přírody s ubytováním, vegetariánskou stravou, denní muzikoterapií, tancem a večerním ohňovým rituálem.',
    date: '20. - 22. Listopadu 2026',
    location: 'Přírodní centrum Jizerka',
    price: '4 500 Kč',
    registrationUrl: '#kontakt',
    active: true,
  },
];

export default function EventsSection() {
  const [events, setEvents] = useState<EventItem[]>(fallbackEvents);
  const [selected, setSelected] = useState<EventItem | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const res = await axios.get(`${apiUrl}/events`, { timeout: 3000 });
        if (Array.isArray(res.data)) {
          setEvents(res.data.filter((e: EventItem) => e.active !== false));
        }
      } catch (err) {
        // Ponechat fallback události pouze při chybě API
      }
    };
    fetchEvents();
  }, []);

  return (
    <section id="akce" className="section">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
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
            Plánované akce
          </div>
          <h2 className="section-title">
            <span className="gradient-text">Nadcházející</span> akce
          </h2>
          <div className="gradient-line" style={{ margin: '16px auto 0' }} />
        </motion.div>

        {/* Posters grid */}
        {events.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '48px 32px',
              margin: '0 auto',
              maxWidth: '640px',
              background: 'rgba(255, 255, 255, 0.65)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              borderRadius: '24px',
              border: '1px solid rgba(228, 180, 195, 0.3)',
              boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.05)',
            }}
          >
            <p
              style={{
                fontSize: '17px',
                lineHeight: '1.7',
                color: '#475569',
                fontWeight: 500,
                margin: 0,
              }}
            >
              Žádné akce momentálně nejsou naplánované. V případě zájmu o individuální setkání mě neváhejte kontaktovat.
            </p>
          </motion.div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '28px',
            }}
          >
            {events.map((event, i) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                onClick={() => setSelected(event)}
                className="glass glass-hover"
                style={{
                  borderRadius: '24px',
                  padding: '24px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '320px',
                }}
              >
                <div>
                  {event.imageUrl && (
                    <div style={{ width: '100%', aspectRatio: '9 / 16', borderRadius: '16px', overflow: 'hidden', marginBottom: '20px', background: 'rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={event.imageUrl.startsWith('http') ? event.imageUrl : `${getBaseUrl()}${event.imageUrl}`} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} />
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e4b4c3', fontSize: '16px', fontWeight: 700 }}>
                      <Calendar size={18} />
                      <span>{event.date || 'Termín dle dohody'}</span>
                    </div>
                    {event.price && (
                      <span style={{ background: 'rgba(228, 180, 195,0.2)', border: '1px solid rgba(228, 180, 195,0.4)', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', color: '#111', fontWeight: 700 }}>
                        {event.price}
                      </span>
                    )}
                  </div>

                  <h3 className="event-card-title" style={{ fontSize: '1.4rem', color: '#111', marginBottom: '12px', lineHeight: 1.25 }}>
                    {event.title}
                  </h3>

                  {event.location && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(17, 17, 17,0.6)', fontSize: '13px', marginBottom: '16px' }}>
                      <MapPin size={14} />
                      <span>{event.location}</span>
                    </div>
                  )}

                  <p style={{ color: 'rgba(17, 17, 17,0.75)', fontSize: '14px', lineHeight: '1.7' }}>
                    {event.description}
                  </p>
                </div>

                <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', color: '#e4b4c3', fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Detail akce & rezervace →</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelected(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 40 }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
              className="glass"
              style={{
                borderRadius: '28px',
                maxWidth: 'min(90vw, 540px)',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'hidden auto',
                padding: '36px',
                position: 'relative',
              }}
            >
              <button
                onClick={() => setSelected(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(228, 180, 195, 0.1)',
                  border: '1px solid rgba(228, 180, 195, 0.3)',
                  borderRadius: '50%',
                  width: 36,
                  height: 36,
                  cursor: 'pointer',
                  color: '#111',
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ×
              </button>

              <h3 className="event-card-title" style={{ fontSize: '1.8rem', marginBottom: '16px', color: '#111' }}>
                {selected.title}
              </h3>

              {selected.imageUrl && (
                <div style={{ width: '100%', aspectRatio: '9 / 16', borderRadius: '20px', overflow: 'hidden', marginBottom: '24px', background: 'rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={selected.imageUrl.startsWith('http') ? selected.imageUrl : `${getBaseUrl()}${selected.imageUrl}`} alt={selected.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} />
                </div>
              )}

              {selected.date && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#e4b4c3', fontSize: '16px', fontWeight: 700 }}>
                  <Calendar size={18} />
                  <span>{selected.date}</span>
                </div>
              )}

              <p style={{ color: 'rgba(17, 17, 17,0.8)', lineHeight: '1.8', marginBottom: '28px', fontSize: '15px' }}>
                {selected.description}
              </p>

              {selected.registrationUrl ? (
                <a
                  href={selected.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ width: '100%', textDecoration: 'none', display: 'flex', justifyContent: 'center' }}
                >
                  Přihlásit se na akci →
                </a>
              ) : (
                <button
                  onClick={() => {
                    setSelected(null);
                    document.querySelector('#kontakt')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="btn-primary"
                  style={{ width: '100%' }}
                >
                  Přihlásit se na akci →
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}



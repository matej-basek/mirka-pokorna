'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';
import axios from 'axios';

const getBaseUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  return apiUrl.replace('/api', '');
};

const getImageSrc = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${getBaseUrl()}${url}`;
};

interface EventItem {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  registrationUrl?: string;
  date?: string;
  location?: string;
  mapsUrl?: string;
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

        {/* Events grid — vždy 3 sloupce, pevná velikost */}
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
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '24px',
            }}
            className="events-grid"
          >
            {events.map((event, i) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                onClick={() => setSelected(event)}
                className="glass glass-hover"
                style={{
                  borderRadius: '20px',
                  padding: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  {event.imageUrl && (
                    <div style={{
                      width: '100%',
                      aspectRatio: '3 / 4',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      marginBottom: '16px',
                      background: 'rgba(0,0,0,0.03)',
                    }}>
                      <img
                        src={getImageSrc(event.imageUrl)}
                        alt={event.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
                      />
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#e4b4c3', fontSize: '14px', fontWeight: 700 }}>
                      <Calendar size={15} />
                      <span>{event.date || 'Termín dle dohody'}</span>
                    </div>
                    {event.price && (
                      <span style={{ background: 'rgba(228, 180, 195,0.2)', border: '1px solid rgba(228, 180, 195,0.4)', padding: '3px 8px', borderRadius: '20px', fontSize: '11px', color: '#111', fontWeight: 700 }}>
                        {event.price}
                      </span>
                    )}
                  </div>

                  <h3 className="event-card-title" style={{ fontSize: '1.15rem', color: '#111', marginBottom: '10px', lineHeight: 1.3 }}>
                    {event.title}
                  </h3>

                  {event.location && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'rgba(17, 17, 17,0.6)', fontSize: '12px', marginBottom: '12px' }}>
                      <MapPin size={12} />
                      <span>{event.location}</span>
                    </div>
                  )}

                  <p style={{ color: 'rgba(17, 17, 17,0.7)', fontSize: '13px', lineHeight: '1.6', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {event.description}
                  </p>
                </div>

                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', color: '#e4b4c3', fontSize: '14px', fontWeight: 700 }}>
                  Detail akce & rezervace →
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
              className="glass modal-content"
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

              {/* Plakát — větší velikost (maxHeight 420px), vycentrovaný, zachovaný poměr stran bez ořezu */}
              {selected.imageUrl && (
                <div
                  style={{
                    width: '100%',
                    maxHeight: '420px',
                    borderRadius: '18px',
                    overflow: 'hidden',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(228, 180, 195, 0.06)',
                    padding: '6px',
                  }}
                >
                  <img
                    src={getImageSrc(selected.imageUrl)}
                    alt={selected.title}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '408px',
                      width: 'auto',
                      height: 'auto',
                      objectFit: 'contain',
                      borderRadius: '14px',
                      display: 'block',
                    }}
                  />
                </div>
              )}

              <h3 className="event-card-title" style={{ fontSize: '1.6rem', marginBottom: '12px', color: '#111', paddingRight: '40px' }}>
                {selected.title}
              </h3>

              {selected.date && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#e4b4c3', fontSize: '15px', fontWeight: 700 }}>
                  <Calendar size={16} />
                  <span>{selected.date}</span>
                </div>
              )}

              {selected.location && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: 'rgba(17,17,17,0.65)', fontSize: '14px' }}>
                  <MapPin size={15} style={{ color: '#e4b4c3', flexShrink: 0 }} />
                  {selected.mapsUrl ? (
                    <div>
                      <a
                        href={selected.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#ba6d86', textDecoration: 'underline', fontWeight: 600 }}
                      >
                        {selected.location}
                      </a>
                      <span style={{ fontSize: '11px', color: 'rgba(17,17,17,0.4)', marginLeft: '6px' }}>
                        (klikni pro mapy)
                      </span>
                    </div>
                  ) : (
                    <span>{selected.location}</span>
                  )}
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

      {/* Responsivní grid styly */}
      <style jsx>{`
        .events-grid {
          grid-template-columns: repeat(3, 1fr);
        }
        @media (max-width: 900px) {
          .events-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 580px) {
          .events-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

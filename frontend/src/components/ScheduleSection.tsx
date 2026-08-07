'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, BookOpen, Info, MapPin } from 'lucide-react';
import axios from 'axios';

interface Lesson {
  _id?: string;
  name: string;
  day: string;
  time: string;
  pricePerLesson?: string;
  courseInfo?: string;
  coursePrice?: string;
  additionalInfo?: string;
}

interface StudioItem {
  _id: string;
  name: string;
  location?: string;
  description?: string;
  photoUrl?: string;
  registrationUrl?: string;
  lessons: Lesson[];
}

const fallbackStudios: StudioItem[] = [
  {
    _id: 's1',
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
      },
    ],
  },
  {
    _id: 's2',
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
      },
    ],
  },
];

export default function ScheduleSection() {
  const [studios, setStudios] = useState<StudioItem[]>(fallbackStudios);
  const [selected, setSelected] = useState<StudioItem | null>(null);

  useEffect(() => {
    const fetchStudios = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const res = await axios.get(`${apiUrl}/studios`, { timeout: 3000 });
        if (Array.isArray(res.data)) {
          setStudios(res.data);
        }
      } catch (err) {
        // Ponechat fallback studia pouze v případě chyby připojení k API
      }
    };
    fetchStudios();
  }, []);

  return (
    <section id="kurzy" className="section">
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
            Kde se setkáváme
          </div>
          <h2 className="section-title">
            <span className="gradient-text">Stálé</span> kurzy
          </h2>
          <div className="gradient-line" style={{ margin: '16px auto 0' }} />
        </motion.div>

        {studios.length === 0 ? (
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
              V tuto chvíli nejsou vypsána žádná studia ani stálé kurzy. V případě zájmu o individuální setkání mě neváhejte kontaktovat.
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
            {studios.map((studio, i) => (
              <motion.div
                key={studio._id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                onClick={() => setSelected(studio)}
                className="glass glass-hover"
                style={{
                  borderRadius: '24px',
                  padding: '28px',
                  cursor: 'pointer',
                  transition: 'all 0.35s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <h3
                    className="card-title"
                    style={{
                      fontSize: '1.4rem',
                      color: '#111',
                      marginBottom: '8px',
                    }}
                  >
                    {studio.name}
                  </h3>

                  {studio.location && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e4b4c3', fontSize: '16px', marginBottom: '12px', fontWeight: 700 }}>
                      <MapPin size={18} />
                      <span>{studio.location}</span>
                    </div>
                  )}

                  {studio.description && (
                    <p style={{ color: 'rgba(17, 17, 17,0.75)', fontSize: '13.5px', lineHeight: '1.6', marginBottom: '20px' }}>
                      {studio.description}
                    </p>
                  )}
                </div>

                <div>
                  <div style={{ color: 'rgba(17, 17, 17,0.55)', fontSize: '13px', marginBottom: '14px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '14px' }}>
                    {studio.lessons.length} {studio.lessons.length === 1 ? 'kurz' : studio.lessons.length < 5 ? 'kurzy' : 'kurzů'}
                  </div>
                  <div style={{ color: '#e4b4c3', fontSize: '16px', fontWeight: 700 }}>
                    Zobrazit rozvrh a lekce →
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Studio Detail Modal */}
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
                maxWidth: '680px',
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

              <h3 className="card-title" style={{ fontSize: '1.8rem', marginBottom: '8px' }}>
                {selected.name}
              </h3>

              {selected.location && (
                <p style={{ color: '#e4b4c3', fontSize: '16px', fontWeight: 700, marginBottom: '24px' }}>
                  📍 {selected.location}
                </p>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {selected.lessons.map((lesson, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(228, 180, 195, 0.05)',
                      border: '1px solid rgba(228, 180, 195, 0.2)',
                      borderRadius: '16px',
                      padding: '20px',
                    }}
                  >
                    <div className="card-title" style={{ fontSize: '1.1rem', color: '#111', marginBottom: '10px' }}>
                      {lesson.name}
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                      <span style={{ background: 'rgba(228, 180, 195,0.2)', border: '1px solid rgba(228, 180, 195,0.3)', borderRadius: '20px', padding: '4px 12px', fontSize: '12px', color: '#111' }}>
                        📅 {lesson.day}
                      </span>
                      <span style={{ background: 'rgba(228, 180, 195,0.2)', border: '1px solid rgba(228, 180, 195,0.3)', borderRadius: '20px', padding: '4px 12px', fontSize: '12px', color: '#111' }}>
                        ⏰ {lesson.time}
                      </span>
                      {lesson.pricePerLesson && (
                        <span style={{ background: 'rgba(245,214,223,0.2)', border: '1px solid rgba(245,214,223,0.3)', borderRadius: '20px', padding: '4px 12px', fontSize: '12px', color: '#111' }}>
                          💳 1 lekce {lesson.pricePerLesson}
                        </span>
                      )}
                    </div>

                    {lesson.additionalInfo && (
                      <p style={{ color: 'rgba(17, 17, 17,0.65)', fontSize: '13px', fontStyle: 'italic' }}>
                        {lesson.additionalInfo}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <a
                href={selected.registrationUrl || 'https://forms.google.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{
                  width: '100%',
                  marginTop: '28px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                Rezervovat místo →
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}



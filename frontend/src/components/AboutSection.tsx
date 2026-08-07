'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Facebook, Instagram } from 'lucide-react';
import Image from 'next/image';

export default function AboutSection() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const introPlayed = typeof window !== 'undefined' && sessionStorage.getItem('mirka_intro_played') === 'true';
    const forceIntro = typeof window !== 'undefined' && window.location.search.includes('intro');

    if (introPlayed && !forceIntro) {
      setReady(true);
    } else {
      const handleFinish = () => setReady(true);
      window.addEventListener('mirka-intro-finished', handleFinish);
      return () => window.removeEventListener('mirka-intro-finished', handleFinish);
    }
  }, []);

  return (
    <section id="o-mne" style={{ position: 'relative', overflow: 'hidden' }}>
      <style>{`
        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
          padding: 100px 48px 40px;
          gap: 64px;
        }
        .about-photo-wrap {
          position: relative;
          width: 100%;
          display: block;
          max-width: 520px;
          margin: 0 auto;
        }
        .about-photo-wrap .profile-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          margin: 0 auto;
        }
        @media (max-width: 900px) {
          .about-grid {
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 80px 24px 40px;
            gap: 40px;
          }
          .about-grid > div:nth-child(2) {
            order: -1;
            width: 100%;
            padding: 0 5%;
          }
          .about-text {
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .about-text .btn-row {
            justify-content: center !important;
          }
          .about-text .social-row {
            justify-content: center !important;
          }
        }
      `}</style>

      <div className="about-grid">
        {/* LEFT – Text */}
        <motion.div
          className="about-text"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div
            style={{
              fontSize: '16px',
              fontWeight: 700,
              color: '#111111',
              letterSpacing: '4px',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}
          >
            O mně
          </div>

          <h2
            style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
              fontWeight: 400,
              lineHeight: 1.1,
              color: '#111',
              marginBottom: '12px',
            }}
          >
            Vítejte, jsem{' '}
            <span className="gradient-text">
              Mirka Pokorná
            </span>
          </h2>

          <div
            style={{
              fontSize: '1.1rem',
              fontWeight: 600,
              color: 'rgba(17, 17, 17,0.75)',
              marginBottom: '20px',
            }}
          >
            Průvodkyně intuitivním zpěvem, muzikoterapeutka & lektorka spontánního tance
          </div>

          <div
            style={{
              width: 64,
              height: 3,
              background: 'linear-gradient(90deg, #e4b4c3, #ff758c)',
              borderRadius: 10,
              marginBottom: '20px',
            }}
          />

          <p
            style={{
              color: 'rgba(17, 17, 17,0.85)',
              fontSize: '15.5px',
              lineHeight: '1.85',
              marginBottom: '20px',
            }}
          >
            Jsem certifikovaná muzikoterapeutka a učitelka v mateřské škole s více než desetiletou praxí.
          </p>

          <p
            style={{
              color: 'rgba(17, 17, 17,0.85)',
              fontSize: '15.5px',
              lineHeight: '1.85',
              marginBottom: '20px',
            }}
          >
            Vnímám svět skrze křehkost dětské duše i skrytou touhu dospělých po vnitřním klidu a sebepřijetí.
          </p>

          <p
            style={{
              color: 'rgba(17, 17, 17,0.85)',
              fontSize: '15.5px',
              lineHeight: '1.85',
              marginBottom: '32px',
            }}
          >
            Mým posláním je skrze tóny a laskavou náruč hudby vytvářet bezpečný prostor, ve kterém znovu objevíte přirozenou hravost, jedinečnost a uslyšíte hlas svého srdce.
          </p>

          {/* CTA buttons */}
          <div
            className="btn-row"
            style={{
              display: 'flex',
              gap: '14px',
              flexWrap: 'wrap',
              marginBottom: '32px',
            }}
          >
            <button
              className="btn-primary"
              onClick={() =>
                document.querySelector('#kontakt')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Napište mi zprávu →
            </button>
            <button
              onClick={() =>
                document.querySelector('#kurzy')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="btn-secondary-glass"
            >
              Rozvrh kurzů
            </button>
          </div>

          {/* Social links */}
          <div className="social-row" style={{ display: 'flex', gap: '16px', marginTop: '10px', alignItems: 'center' }}>
            <a
              href="https://www.instagram.com/vesmiru_/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="glass glass-hover"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                color: '#e4b4c3',
                textDecoration: 'none',
                border: '1px solid rgba(228, 180, 195, 0.3)'
              }}
            >
              <Instagram size={22} />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61560386386160"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="glass glass-hover"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                color: '#e4b4c3',
                textDecoration: 'none',
                border: '1px solid rgba(228, 180, 195, 0.3)'
              }}
            >
              <Facebook size={22} />
            </a>
            <span
              style={{
                fontFamily: "'Festigan', 'Cormorant Garamond', Georgia, serif",
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '1.8rem',
                color: '#111',
                letterSpacing: '0.04em',
                alignSelf: 'center',
                lineHeight: 1,
                userSelect: 'none',
              }}
            >
              Vesmíru
            </span>
          </div>
        </motion.div>

        {/* RIGHT – Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div
            className="about-photo-wrap"
            style={{
              position: 'relative',
              width: '100%',
              paddingBottom: '125%',
              margin: '0 auto',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, borderRadius: '32px', overflow: 'visible', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', border: 'none', boxShadow: '0 0 60px rgba(255, 255, 255, 1), inset 0 0 30px rgba(255, 255, 255, 1)' }}>
              <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '22px', overflow: 'hidden' }}>
                <Image
                  src="/mirka-profile-pink.jpg"
                  alt="Mirka Pokorná - Intuitivní zpěv a muzikoterapie"
                  fill
                  sizes="(max-width: 900px) 90vw, 520px"
                  style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
                  className="profile-img"
                  priority
                  fetchPriority="high"
                />
              </div>
              <motion.div
                initial={{ opacity: 0, rotate: -20, scale: 0.8 }}
                whileInView={{ opacity: 1, rotate: 10, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.6, ease: 'easeOut' }}
                style={{
                  zIndex: 20,
                  filter: 'drop-shadow(0 15px 25px rgba(228, 180, 195, 0.2))',
                }}
                className="photo-flower-overlay"
              >
                <Image
                  src="/photo-flower.png"
                  alt="Decorative flower"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}



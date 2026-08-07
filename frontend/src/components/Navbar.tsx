'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const navLinks = [
  { label: 'O mně', href: '#o-mne' },
  { label: 'Služby', href: '#sluzby' },
  { label: 'Průběh', href: '#jak-to-probiha' },
  { label: 'Akce', href: '#akce' },
  { label: 'Rozvrh', href: '#kurzy' },
  { label: 'Reference', href: '#reference' },
  { label: 'Kontakt', href: '#kontakt' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let currentScrolled = false;
    const handleScroll = () => {
      const isPast = window.scrollY > 30;
      if (isPast !== currentScrolled) {
        currentScrolled = isPast;
        setScrolled(isPast);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 900,
          padding: '0 24px',
          height: '72px',
          width: '100%',
          display: 'flex',
          background: scrolled
            ? 'rgba(228, 180, 195, 0.98)'
            : 'rgba(228, 180, 195, 0.90)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          borderBottom: '1px solid rgba(255,255,255,0.2)',
          transition: 'background 0.3s ease',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            maxWidth: 1200,
            margin: '0 auto',
          }}
        >
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'none',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                position: 'relative',
                flexShrink: 0,
                filter: 'drop-shadow(0 4px 15px rgba(214, 140, 163, 0.5))',
              }}
            >
              <Image
                src="/logo-flower.png"
                alt="Mirka Pokorná Logo"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div
                style={{
                  fontFamily: "'Alex Brush', 'Great Vibes', 'Festigan', cursive",
                  fontWeight: 400,
                  fontSize: '26px',
                  color: '#111111',
                  lineHeight: 1.1,
                }}
              >
                Mirka Pokorná
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: 'rgba(17, 17, 17, 0.75)',
                  marginTop: 2,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                }}
              >
                Zpěv • Zvuk • Pohyb
              </div>
            </div>
          </button>

          {/* Desktop nav */}
          <div
            style={{ display: 'flex', gap: '4px', alignItems: 'center' }}
            className="desktop-nav"
          >
            {navLinks.map((link) => (
              <motion.button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                whileHover={{
                  scale: 1.08,
                  y: -2,
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  color: '#111111',
                  boxShadow: '0 4px 15px rgba(255, 255, 255, 0.25)',
                }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: 'none',
                  border: '1px solid transparent',
                  color: '#111111',
                  cursor: 'pointer',
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  padding: '8px 16px',
                  borderRadius: '50px',
                  transition: 'color 0.2s ease, border-color 0.2s ease',
                }}
              >
                {link.label}
              </motion.button>
            ))}
          </div>

          {/* Hamburger button */}
          <button
            className="hamburger-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'rgba(197, 160, 89, 0.1)',
              border: '1px solid rgba(197, 160, 89, 0.3)',
              borderRadius: '10px',
              cursor: 'pointer',
              padding: '8px',
              display: 'none',
              flexDirection: 'column',
              gap: '5px',
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            aria-label="Menu"
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: 'block',
                  width: 22,
                  height: 2,
                  background: '#111111',
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  transform: menuOpen
                    ? i === 0
                      ? 'translateY(7px) rotate(45deg)'
                      : i === 1
                      ? 'scaleX(0)'
                      : 'translateY(-7px) rotate(-45deg)'
                    : 'none',
                }}
              />
            ))}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed',
              top: 72,
              left: 0,
              right: 0,
              zIndex: 899,
              background: 'rgba(228, 180, 195, 0.98)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(228, 180, 195, 0.2)',
              padding: '16px 24px 24px',
            }}
            className="mobile-menu"
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <button
                  onClick={() => scrollTo(link.href)}
                  style={{
                    display: 'block',
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    color: '#111111',
                    cursor: 'pointer',
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '17px',
                    fontWeight: 600,
                    padding: '12px 16px',
                    textAlign: 'left',
                    borderRadius: '12px',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      'rgba(255,255,255,0.08)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = 'none')
                  }
                >
                  {link.label}
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}



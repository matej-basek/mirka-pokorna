'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function IntroOverlay() {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Zkontrolovat, zda uživatel intro v tomto sezení již neviděl (s výjimkou testování přes ?intro v URL)
    const hasSeenIntro = sessionStorage.getItem('mirka_intro_played');
    const forceIntro = window.location.search.includes('intro');

    if (hasSeenIntro === 'true' && !forceIntro) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);
    document.body.style.overflow = 'hidden';

    // Spuštění videa
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Ignorovat případné restrikce prohlížeče
      });
    }

    // Časovač: animace textu trvá ~3.5s + 1.5s pauza ke čtení = 5s celkem, pak začne plynulé prolínání na web
    const exitTimer = setTimeout(() => {
      startFadeOut();
    }, 5000);

    return () => {
      clearTimeout(exitTimer);
      document.body.style.overflow = '';
    };
  }, []);

  const startFadeOut = () => {
    if (isExiting) return;
    setIsExiting(true);
    sessionStorage.setItem('mirka_intro_played', 'true');
    window.dispatchEvent(new Event('mirka-intro-finished'));

    // Po 1.5s animace (fade-out) uvolnit rolování a odrolovat na O mně
    setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = '';
      
      // Jemně přejít do sekce O mně, pokud jsme stále úplně nahoře
      if (window.scrollY < 100) {
        document.querySelector('#o-mne')?.scrollIntoView({ behavior: 'smooth' });
      }
    }, 1500);
  };

  // Umožnit okamžité přeskočení intra scrollovaním nebo klávesami
  useEffect(() => {
    if (!isVisible || isExiting) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Escape', ' ', 'Enter', 'ArrowDown'].includes(e.key)) {
        startFadeOut();
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 20) {
        startFadeOut();
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const touchEndY = e.touches[0].clientY;
      if (Math.abs(touchEndY - touchStartY) > 30) {
        startFadeOut();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isVisible, isExiting]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          onClick={startFadeOut}
          className="fixed inset-0 z-[9999] w-screen h-screen bg-[#050B14] flex flex-col items-center justify-center overflow-hidden cursor-pointer select-none"
        >
          {/* Tmavé pozadí pro okamžité zobrazení bez čekání na načtení videa na mobilu */}
          <div className="absolute inset-0 bg-[#050B14] bg-gradient-to-br from-[#050B14] via-[#160c18] to-[#050B14]" />

          {/* Video na pozadí s okamžitým přehráváním a preloadingem */}
          <video
            ref={videoRef}
            src="/intro-video.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover opacity-75 filter contrast-105 brightness-95 scale-105 transition-opacity duration-700 ease-out pointer-events-none"
          />

          {/* Jemné filmové stíny a barevné přechody (vignette & gradient) pro hloubku */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050B14] via-black/40 to-[#050B14]/70 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,11,20,0.6)_100%)] pointer-events-none" />

          {/* Kontejner pro animovaný psaný text (rozepisování) */}
          <div className="relative z-10 max-w-5xl px-6 text-center">
            <motion.h1
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.22,
                    delayChildren: 0.3,
                  },
                },
              }}
              initial="hidden"
              animate="visible"
              style={{ color: '#ffffff' }}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] font-normal !text-white leading-tight sm:leading-[1.25] tracking-tight drop-shadow-md text-center max-w-5xl mx-auto overflow-visible py-4 flex flex-col items-center justify-center gap-y-1 sm:gap-y-3"
            >
              {/* První řádek: Návrat k sobě skrze */}
              <div className="flex flex-wrap items-center justify-center gap-x-2 sm:gap-x-3.5 md:gap-x-4">
                {["Návrat", "k", "sobě", "skrze"].map((word, idx) => (
                  <motion.span
                    key={idx}
                    variants={{
                      hidden: { opacity: 0, y: 15 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.8, ease: 'easeOut' },
                      },
                    }}
                    style={{ color: '#ffffff' }}
                    className="inline-block px-6 -mx-6 py-2 -my-2 overflow-visible !text-white"
                  >
                    {word}
                  </motion.span>
                ))}
              </div>

              {/* Druhý řádek: hlas, zvuk a vědomý pohyb */}
              <div className="flex flex-wrap items-center justify-center gap-x-2 sm:gap-x-3.5 md:gap-x-4">
                {[
                  { text: "hlas,", gradient: true },
                  { text: "zvuk", gradient: true },
                  { text: "a", gradient: false },
                  { text: "vědomý", gradient: true },
                  { text: "pohyb", gradient: true },
                ].map((item, idx) => (
                  <motion.span
                    key={idx}
                    variants={{
                      hidden: { opacity: 0, y: 15 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.8, ease: 'easeOut' },
                      },
                    }}
                    style={item.gradient ? {} : { color: '#ffffff' }}
                    className={`inline-block px-1 -mx-4 py-2 -my-2 overflow-visible ${item.gradient ? 'gradient-text font-normal' : '!text-white'}`}
                  >
                    {item.gradient ? `\u00A0${item.text}\u00A0` : item.text}
                  </motion.span>
                ))}
              </div>
            </motion.h1>

            {/* Jemná instrukce pro uživatele dole */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 2.2, duration: 1 }}
              className="absolute -bottom-16 sm:-bottom-20 left-1/2 -translate-x-1/2 text-[10px] sm:text-[11px] uppercase tracking-[1px] sm:tracking-[3px] text-white/80 font-sans pointer-events-none w-full max-w-[280px] sm:max-w-none text-center px-2"
            >
              Kliknutím nebo posunem přejdete na web
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}



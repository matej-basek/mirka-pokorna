'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const PARTICLES = [
  { id: 1, x: '-30%', y: '10%', size: 4, duration: 4.2, delay: 0.2, color: '#e4b4c3', xOffset: -10 },
  { id: 2, x: '-15%', y: '25%', size: 3, duration: 3.8, delay: 0.8, color: '#d4af37', xOffset: 10 },
  { id: 3, x: '0%', y: '5%', size: 5, duration: 5.1, delay: 1.2, color: '#e4b4c3', xOffset: -5 },
  { id: 4, x: '15%', y: '30%', size: 3, duration: 4.0, delay: 0.4, color: '#d4af37', xOffset: 8 },
  { id: 5, x: '30%', y: '15%', size: 4, duration: 4.6, delay: 1.0, color: '#e4b4c3', xOffset: -8 },
];

export default function HeroSection() {
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
    <section className="relative pt-24 pb-4 overflow-x-clip overflow-y-visible text-center">
      {/* Container for Headline & Particles */}
      <div className="max-w-6xl w-full mx-auto px-4 flex flex-col items-center justify-end text-center relative z-10 overflow-visible">
        
        {/* Soft aura background */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.1, ease: 'easeOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-4xl h-[360px] bg-[radial-gradient(circle_at_center,rgba(228,180,195,0.2)_0%,transparent_70%)] pointer-events-none -z-10"
        />

        {/* Lightweight Particles */}
        <div className="absolute inset-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-64 pointer-events-none z-20 overflow-visible">
          {PARTICLES.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 0 }}
              animate={{
                opacity: [0, 0.6, 0],
                y: [0, -60, -120],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                position: 'absolute',
                left: `calc(50% + ${p.x})`,
                top: `calc(50% + ${p.y})`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: p.color,
                borderRadius: '50%',
                opacity: 0.5,
              }}
            />
          ))}
        </div>

        {/* Main H1 Headline odstraněn podle přání klienta */}
      </div>
    </section>
  );
}



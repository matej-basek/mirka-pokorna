'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

// Deterministically generated stars for 3D parallax background
const STARS = [
  { id: 1, x: '8%', y: '5%', size: 2.5, duration: 3.2, delay: 0.1, color: '#fce3a1', char: '✦' },
  { id: 2, x: '23%', y: '12%', size: 2, duration: 4.1, delay: 0.7, color: '#111111' },
  { id: 3, x: '45%', y: '8%', size: 3.5, duration: 5.0, delay: 1.2, color: '#e4b4c3', char: '✧' },
  { id: 4, x: '68%', y: '15%', size: 2, duration: 3.8, delay: 0.4, color: '#d4af37' },
  { id: 5, x: '85%', y: '7%', size: 3, duration: 4.5, delay: 1.5, color: '#fce3a1', char: '✦' },
  { id: 6, x: '12%', y: '22%', size: 2, duration: 3.5, delay: 0.8, color: '#111111' },
  { id: 7, x: '35%', y: '28%', size: 4, duration: 5.2, delay: 1.9, color: '#d4af37', char: '✧' },
  { id: 8, x: '58%', y: '24%', size: 2.5, duration: 3.9, delay: 0.3, color: '#e4b4c3' },
  { id: 9, x: '77%', y: '32%', size: 3, duration: 4.7, delay: 1.1, color: '#fce3a1', char: '✦' },
  { id: 10, x: '92%', y: '26%', size: 2, duration: 3.3, delay: 0.5, color: '#111111' },
  { id: 11, x: '5%', y: '38%', size: 3.5, duration: 4.9, delay: 1.6, color: '#ffefc2', char: '✧' },
  { id: 12, x: '28%', y: '44%', size: 2, duration: 3.6, delay: 0.2, color: '#d4af37' },
  { id: 13, x: '52%', y: '40%', size: 3, duration: 4.3, delay: 1.4, color: '#e4b4c3', char: '✦' },
  { id: 14, x: '72%', y: '48%', size: 2.5, duration: 3.7, delay: 0.9, color: '#111111' },
  { id: 15, x: '88%', y: '42%', size: 3.5, duration: 5.4, delay: 1.8, color: '#fce3a1', char: '✧' },
  { id: 16, x: '15%', y: '55%', size: 2, duration: 3.4, delay: 0.6, color: '#111111' },
  { id: 17, x: '38%', y: '60%', size: 3, duration: 4.6, delay: 1.3, color: '#d4af37', char: '✦' },
  { id: 18, x: '62%', y: '54%', size: 2.5, duration: 3.9, delay: 0.4, color: '#e4b4c3' },
  { id: 19, x: '82%', y: '62%', size: 4, duration: 5.1, delay: 1.7, color: '#fce3a1', char: '✧' },
  { id: 20, x: '95%', y: '56%', size: 2, duration: 3.2, delay: 0.1, color: '#111111' },
  { id: 21, x: '8%', y: '70%', size: 3.5, duration: 4.8, delay: 1.5, color: '#ffefc2', char: '✦' },
  { id: 22, x: '30%', y: '75%', size: 2, duration: 3.5, delay: 0.7, color: '#d4af37' },
  { id: 23, x: '50%', y: '72%', size: 3, duration: 4.2, delay: 1.2, color: '#e4b4c3', char: '✧' },
  { id: 24, x: '75%', y: '78%', size: 2.5, duration: 3.8, delay: 0.5, color: '#111111' },
  { id: 25, x: '90%', y: '74%', size: 3.5, duration: 5.3, delay: 1.9, color: '#fce3a1', char: '✦' },
  { id: 26, x: '18%', y: '85%', size: 2, duration: 3.6, delay: 0.8, color: '#111111' },
  { id: 27, x: '42%', y: '88%', size: 3, duration: 4.4, delay: 1.4, color: '#d4af37', char: '✧' },
  { id: 28, x: '65%', y: '84%', size: 2.5, duration: 3.9, delay: 0.3, color: '#e4b4c3' },
  { id: 29, x: '84%', y: '92%', size: 4, duration: 5.0, delay: 1.6, color: '#fce3a1', char: '✦' },
  { id: 30, x: '96%', y: '86%', size: 2, duration: 3.3, delay: 0.2, color: '#111111' },
  { id: 31, x: '10%', y: '96%', size: 3, duration: 4.7, delay: 1.1, color: '#ffefc2', char: '✧' },
  { id: 32, x: '32%', y: '93%', size: 2.5, duration: 3.7, delay: 0.6, color: '#d4af37' },
  { id: 33, x: '55%', y: '97%', size: 3.5, duration: 5.2, delay: 1.8, color: '#e4b4c3', char: '✦' },
  { id: 34, x: '78%', y: '94%', size: 2, duration: 3.4, delay: 0.4, color: '#111111' },
  { id: 35, x: '88%', y: '98%', size: 3, duration: 4.5, delay: 1.3, color: '#fce3a1', char: '✧' },
];

const CornerWaveTopLeft = ({ className }: { className?: string }) => (
  <motion.svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={`absolute pointer-events-none w-[250px] h-[250px] md:w-[450px] md:h-[450px] overflow-visible blur-3xl ${className}`} animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.55, 0.3] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}>
    <motion.path fill="#ffffff" animate={{ d: ["M0,0 L200,0 C170,60 130,40 100,100 C70,160 30,180 0,200 Z", "M0,0 L200,0 C150,40 140,80 90,120 C50,150 20,160 0,200 Z", "M0,0 L200,0 C170,60 130,40 100,100 C70,160 30,180 0,200 Z"]}} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} />
    <motion.path fill="#ffffff" opacity="0.6" animate={{ d: ["M0,0 L160,0 C130,50 110,60 80,110 C50,150 20,150 0,170 Z", "M0,0 L160,0 C140,30 100,80 60,110 C30,130 10,160 0,170 Z", "M0,0 L160,0 C130,50 110,60 80,110 C50,150 20,150 0,170 Z"]}} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }} />
    <motion.path fill="#ffffff" opacity="0.3" animate={{ d: ["M0,0 L120,0 C90,40 80,50 50,80 C20,110 10,120 0,130 Z", "M0,0 L120,0 C100,30 70,60 40,80 C15,100 5,120 0,130 Z", "M0,0 L120,0 C90,40 80,50 50,80 C20,110 10,120 0,130 Z"]}} transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }} />
  </motion.svg>
);

const CornerWaveTopRight = ({ className }: { className?: string }) => (
  <motion.svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={`absolute pointer-events-none w-[250px] h-[250px] md:w-[450px] md:h-[450px] overflow-visible blur-3xl ${className}`} animate={{ scale: [1, 1.1, 1], opacity: [0.35, 0.6, 0.35] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}>
    <motion.path fill="#ffffff" animate={{ d: ["M0,0 L190,0 C150,50 120,80 90,140 C60,180 25,185 0,190 Z", "M0,0 L190,0 C160,40 130,90 70,130 C40,160 10,175 0,190 Z", "M0,0 L190,0 C150,50 120,80 90,140 C60,180 25,185 0,190 Z"]}} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
    <motion.path fill="#ffffff" opacity="0.6" animate={{ d: ["M0,0 L150,0 C110,40 90,80 60,120 C30,150 15,150 0,160 Z", "M0,0 L150,0 C120,30 100,70 50,110 C20,140 10,155 0,160 Z", "M0,0 L150,0 C110,40 90,80 60,120 C30,150 15,150 0,160 Z"]}} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }} />
    <motion.path fill="#ffffff" opacity="0.3" animate={{ d: ["M0,0 L110,0 C80,30 60,60 40,90 C20,110 5,120 0,130 Z", "M0,0 L110,0 C90,40 50,60 30,80 C10,100 0,125 0,130 Z", "M0,0 L110,0 C80,30 60,60 40,90 C20,110 5,120 0,130 Z"]}} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} />
  </motion.svg>
);

const CornerWaveBottomLeft = ({ className }: { className?: string }) => (
  <motion.svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={`absolute pointer-events-none w-[250px] h-[250px] md:w-[450px] md:h-[450px] overflow-visible blur-3xl ${className}`} animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.5, 0.25] }} transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}>
    <motion.path fill="#ffffff" animate={{ d: ["M0,0 L180,0 C140,30 130,80 100,130 C70,170 30,180 0,200 Z", "M0,0 L180,0 C160,50 110,70 90,140 C50,180 20,185 0,200 Z", "M0,0 L180,0 C140,30 130,80 100,130 C70,170 30,180 0,200 Z"]}} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
    <motion.path fill="#ffffff" opacity="0.6" animate={{ d: ["M0,0 L140,0 C110,40 100,70 70,110 C40,140 10,160 0,170 Z", "M0,0 L140,0 C130,30 90,60 60,120 C30,150 15,160 0,170 Z", "M0,0 L140,0 C110,40 100,70 70,110 C40,140 10,160 0,170 Z"]}} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }} />
    <motion.path fill="#ffffff" opacity="0.3" animate={{ d: ["M0,0 L100,0 C80,30 60,60 40,90 C20,110 5,130 0,140 Z", "M0,0 L100,0 C90,40 70,50 30,80 C15,100 10,130 0,140 Z", "M0,0 L100,0 C80,30 60,60 40,90 C20,110 5,130 0,140 Z"]}} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }} />
  </motion.svg>
);

const CornerWaveBottomRight = ({ className }: { className?: string }) => (
  <motion.svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={`absolute pointer-events-none w-[250px] h-[250px] md:w-[450px] md:h-[450px] overflow-visible blur-3xl ${className}`} animate={{ scale: [1, 1.12, 1], opacity: [0.28, 0.55, 0.28] }} transition={{ duration: 9.5, repeat: Infinity, ease: "easeInOut" }}>
    <motion.path fill="#ffffff" animate={{ d: ["M0,0 L200,0 C160,50 140,70 80,130 C40,170 10,180 0,190 Z", "M0,0 L200,0 C180,30 130,90 70,120 C30,150 20,180 0,190 Z", "M0,0 L200,0 C160,50 140,70 80,130 C40,170 10,180 0,190 Z"]}} transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }} />
    <motion.path fill="#ffffff" opacity="0.6" animate={{ d: ["M0,0 L160,0 C130,40 100,60 60,110 C20,140 5,150 0,160 Z", "M0,0 L160,0 C140,30 90,80 50,100 C30,130 10,155 0,160 Z", "M0,0 L160,0 C130,40 100,60 60,110 C20,140 5,150 0,160 Z"]}} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }} />
    <motion.path fill="#ffffff" opacity="0.3" animate={{ d: ["M0,0 L120,0 C90,30 70,50 40,80 C20,100 5,110 0,120 Z", "M0,0 L120,0 C100,40 60,60 30,90 C15,110 10,115 0,120 Z", "M0,0 L120,0 C90,30 70,50 40,80 C20,100 5,110 0,120 Z"]}} transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 3 }} />
  </motion.svg>
);

export default function ScrollReactiveBackground() {
  const { scrollYProgress } = useScroll();

  // Parallax trasy pro světelné sféry (orbs)
  const orb1Y = useTransform(scrollYProgress, [0, 1], ['-5%', '180%']);
  const orb1X = useTransform(scrollYProgress, [0, 1], ['10%', '-40%']);
  const orb1Scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.3, 0.9]);

  const orb2Y = useTransform(scrollYProgress, [0, 1], ['20%', '-140%']);
  const orb2X = useTransform(scrollYProgress, [0, 1], ['-10%', '50%']);
  const orb2Scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.4, 1]);

  const orb3Y = useTransform(scrollYProgress, [0, 1], ['45%', '-90%']);
  const orb3X = useTransform(scrollYProgress, [0, 1], ['80%', '10%']);
  const orb3Scale = useTransform(scrollYProgress, [0, 0.6, 1], [1, 1.5, 1.1]);

  const orb4Y = useTransform(scrollYProgress, [0, 1], ['70%', '-120%']);
  const orb4X = useTransform(scrollYProgress, [0, 1], ['0%', '60%']);

  const orb5Y = useTransform(scrollYProgress, [0, 1], ['85%', '-80%']);
  const orb5X = useTransform(scrollYProgress, [0, 1], ['70%', '-20%']);

  // Parallax pro hvězdné pole (starlight field)
  const starsY = useTransform(scrollYProgress, [0, 1], ['0%', '-35%']);

  // Jemná rotace a zvětšení pro posvátnou geometrii / zvukové vlny v pozadí
  const waveRotate = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const waveScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Modré pozadí bylo odstraněno, aby mohlo prosvítat globální růžové pozadí ze třídy .animated-bg */}

      {/* VRSTVA 0.5: Abstraktní vlnky ve čtyřech rozích */}
      <CornerWaveTopLeft className="top-0 left-0" />
      <CornerWaveTopRight className="top-0 right-0 transform scale-x-[-1]" />
      <CornerWaveBottomLeft className="bottom-0 left-0 transform scale-y-[-1]" />
      <CornerWaveBottomRight className="bottom-0 right-0 transform scale-x-[-1] scale-y-[-1]" />

      {/* VRSTVA 2: 5 Světelných plovoucích sfér (Orbs) s 3D Parallax efektem podle scrollu */}
      {/* Orb 1: Teplé šampaňské zlato */}
      <motion.div
        style={{ top: orb1Y, left: orb1X, scale: orb1Scale }}
        className="absolute -top-[10%] -right-[5%] w-[650px] h-[650px] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.18)_0%,rgba(252,227,161,0.06)_45%,transparent_75%)] blur-3xl"
      />

      {/* Orb 2: Hluboká růžová / Magenta */}
      <motion.div
        style={{ top: orb2Y, left: orb2X, scale: orb2Scale }}
        className="absolute top-[20%] -left-[10%] w-[750px] h-[750px] bg-[radial-gradient(circle_at_center,rgba(228, 180, 195,0.14)_0%,rgba(228, 180, 195,0.04)_50%,transparent_75%)] blur-3xl"
      />

      {/* Orb 3: Mystická fialová */}
      <motion.div
        style={{ top: orb3Y, left: orb3X, scale: orb3Scale }}
        className="absolute top-[45%] -right-[15%] w-[850px] h-[850px] bg-[radial-gradient(circle_at_center,rgba(88,28,135,0.22)_0%,rgba(59,7,100,0.08)_50%,transparent_75%)] blur-3xl"
      />

      {/* Orb 4: Nebeská tyrkysová / Aqua */}
      <motion.div
        style={{ top: orb4Y, left: orb4X }}
        className="absolute top-[70%] -left-[5%] w-[700px] h-[700px] bg-[radial-gradient(circle_at_center,rgba(13,148,136,0.10)_0%,rgba(45,212,191,0.03)_50%,transparent_75%)] blur-3xl"
      />

      {/* Orb 5: Zlatá záře spodní sekce */}
      <motion.div
        style={{ top: orb5Y, left: orb5X }}
        className="absolute top-[85%] right-[10%] w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.16)_0%,rgba(228, 180, 195,0.05)_50%,transparent_75%)] blur-3xl"
      />

      {/* VRSTVA 3: Parallax Hvězdné pole (Starlight Field) s vlastním posuvem a třpytem */}
      <motion.div
        style={{ top: starsY }}
        className="absolute inset-0 w-full h-[200%] pointer-events-none"
      >
        {STARS.map((s) => (
          <motion.div
            key={s.id}
            animate={{
              opacity: [0.15, 0.7, 0.25, 0.15],
              scale: [0.9, 1.3, 0.9],
            }}
            transition={{
              duration: s.duration,
              delay: s.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              left: s.x,
              top: s.y,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              ...(s.char
                ? {
                    color: s.color,
                    fontSize: `${s.size * 3.5}px`,
                    textShadow: `0 0 8px ${s.color}`,
                    lineHeight: 1,
                  }
                : {
                    width: `${s.size}px`,
                    height: `${s.size}px`,
                    backgroundColor: s.color,
                    borderRadius: '50%',
                    boxShadow: `0 0 ${s.size * 2}px ${s.color}, 0 0 ${s.size * 4}px ${s.color}`,
                  }),
            }}
          >
            {s.char || null}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}



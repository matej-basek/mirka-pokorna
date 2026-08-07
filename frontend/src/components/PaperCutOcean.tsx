'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function PaperCutOcean() {
  const { scrollYProgress } = useScroll();

  // Scroll Parallax Transforms for 3D Paper Cut Layers
  const layer1Y = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const layer1Rotate = useTransform(scrollYProgress, [0, 1], [0, 3]);

  const layer2Y = useTransform(scrollYProgress, [0, 1], [0, -250]);
  const layer2Scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  const layer3Y = useTransform(scrollYProgress, [0, 1], [0, -420]);
  const layer3Rotate = useTransform(scrollYProgress, [0, 1], [0, -4]);

  const soundRippleScale = useTransform(scrollYProgress, [0, 1], [0.9, 1.35]);
  const soundRippleOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 0.9, 0.4]);

  return (
    <div className="paper-cut-ocean-wrapper pointer-events-none">
      <style>{`
        .paper-cut-ocean-wrapper {
          position: fixed;
          inset: 0;
          z-index: -1;
          overflow: hidden;
          background-color: #060D1A;
        }

        /* 3D Paper Shadow Effects */
        .paper-layer-1 {
          filter: drop-shadow(0 16px 28px rgba(0, 0, 0, 0.75)) drop-shadow(0 0 10px rgba(228, 180, 195, 0.25));
        }

        .paper-layer-2 {
          filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.85)) drop-shadow(0 0 15px rgba(245, 214, 223, 0.2));
        }

        .paper-layer-3 {
          filter: drop-shadow(0 25px 50px rgba(3, 8, 20, 0.95));
        }
      `}</style>

      {/* Layer 0: The Abyss Background & Ambient Lighting */}
      <div className="absolute inset-0 bg-[#060D1A]">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[750px] h-[750px] bg-radial from-[#1E3A5F]/40 via-[#122B53]/20 to-transparent blur-3xl" />
        <div className="absolute bottom-10 left-10 w-[550px] h-[550px] bg-radial from-[#3A6B88]/25 via-transparent to-transparent blur-3xl" />
      </div>

      {/* SVG Definitions */}
      <svg className="hidden">
        <defs>
          <linearGradient id="abyssGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B1A30" />
            <stop offset="50%" stopColor="#122B53" />
            <stop offset="100%" stopColor="#060D1A" />
          </linearGradient>

          <linearGradient id="midWaveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1E3A5F" />
            <stop offset="100%" stopColor="#122B53" />
          </linearGradient>

          <linearGradient id="topTealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3A6B88" />
            <stop offset="60%" stopColor="#1E3A5F" />
            <stop offset="100%" stopColor="#122B53" />
          </linearGradient>

          <linearGradient id="goldEdge" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#e4b4c3" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#F5D6DF" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#e4b4c3" stopOpacity="0.8" />
          </linearGradient>

          <linearGradient id="soundRipple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e4b4c3" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#F5D6DF" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>

      {/* Concentric Sound Wave Ripples - Responding to Scroll */}
      <motion.svg
        className="absolute inset-0 w-full h-full"
        style={{ scale: soundRippleScale, opacity: soundRippleOpacity }}
        preserveAspectRatio="none"
        viewBox="0 0 1440 900"
      >
        <circle cx="200" cy="250" r="120" stroke="url(#soundRipple)" strokeWidth="1" strokeDasharray="4 8" fill="none" />
        <circle cx="200" cy="250" r="180" stroke="url(#soundRipple)" strokeWidth="1" strokeDasharray="3 9" fill="none" />
        <circle cx="200" cy="250" r="250" stroke="url(#soundRipple)" strokeWidth="1.5" fill="none" />

        <circle cx="1240" cy="650" r="160" stroke="url(#soundRipple)" strokeWidth="1" strokeDasharray="5 10" fill="none" />
        <circle cx="1240" cy="650" r="240" stroke="url(#soundRipple)" strokeWidth="1" strokeDasharray="4 8" fill="none" />
      </motion.svg>

      {/* 3D Paper Layer 1 (Back Wave Cutouts - Scroll Parallax 1) */}
      <motion.svg
        className="absolute inset-0 w-full h-[120vh]"
        style={{ y: layer1Y, rotate: layer1Rotate }}
        preserveAspectRatio="none"
        viewBox="0 0 1440 900"
      >
        <path
          className="paper-layer-1"
          d="M0,0 Q360,180 720,80 T1440,0 L1440,900 Q1080,720 720,820 T0,900 Z"
          fill="url(#abyssGrad)"
          stroke="url(#goldEdge)"
          strokeWidth="1"
        />
      </motion.svg>

      {/* 3D Paper Layer 2 (Middle Waves - Scroll Parallax 2) */}
      <motion.svg
        className="absolute inset-0 w-full h-[130vh]"
        style={{ y: layer2Y, scale: layer2Scale }}
        preserveAspectRatio="none"
        viewBox="0 0 1440 900"
      >
        <path
          className="paper-layer-2"
          d="M-50,0 C250,300 450,100 700,280 C950,460 1200,200 1490,0 L1490,950 C1250,750 900,880 650,720 C400,560 150,850 -50,950 Z"
          fill="url(#midWaveGrad)"
          stroke="rgba(245, 214, 223, 0.4)"
          strokeWidth="1.5"
        />
      </motion.svg>

      {/* 3D Paper Layer 3 (Foreground Waves - Scroll Parallax 3) */}
      <motion.svg
        className="absolute inset-0 w-full h-[140vh]"
        style={{ y: layer3Y, rotate: layer3Rotate }}
        preserveAspectRatio="none"
        viewBox="0 0 1440 900"
      >
        <path
          className="paper-layer-3"
          d="M0,-20 C200,180 350,40 550,160 C750,280 1100,50 1440,-20 L1440,920 C1150,780 900,900 600,760 C300,620 150,880 0,920 Z"
          fill="url(#topTealGrad)"
          fillOpacity="0.45"
          stroke="url(#goldEdge)"
          strokeWidth="1.5"
        />
      </motion.svg>
    </div>
  );
}



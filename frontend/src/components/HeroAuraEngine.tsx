'use client';

import React from 'react';

export default function HeroAuraEngine() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-1">
      <style>{`
        .ethereal-aura-container {
          position: absolute;
          inset: 0;
          z-index: 1;
          overflow: hidden;
          background: linear-gradient(180deg, #060D1A 0%, #081324 50%, #0A1832 100%);
        }

        .aura-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(150px);
          pointer-events: none;
          will-change: transform, opacity;
        }

        /* Orb 1: Soft Powder Pink */
        .aura-pink {
          width: 650px;
          height: 650px;
          background: rgba(245, 214, 223, 0.45);
          top: -120px;
          left: 50%;
          transform: translateX(-50%);
          animation: auraBreathingPink 24s ease-in-out infinite alternate;
        }

        /* Orb 2: Warm Peach */
        .aura-peach {
          width: 580px;
          height: 580px;
          background: rgba(232, 165, 184, 0.4);
          top: 30%;
          left: 15%;
          animation: auraDriftPeach 28s ease-in-out infinite alternate;
        }

        /* Orb 3: Subtle Ambient Gold */
        .aura-gold {
          width: 600px;
          height: 600px;
          background: rgba(228, 180, 195, 0.35);
          top: 25%;
          right: 15%;
          animation: auraDriftGold 26s ease-in-out infinite alternate;
        }

        @keyframes auraBreathingPink {
          0% {
            transform: translateX(-50%) scale(1) translateY(0);
            opacity: 0.5;
          }
          50% {
            transform: translateX(-50%) scale(1.18) translateY(30px);
            opacity: 0.65;
          }
          100% {
            transform: translateX(-50%) scale(0.95) translateY(-20px);
            opacity: 0.45;
          }
        }

        @keyframes auraDriftPeach {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 0.4;
          }
          50% {
            transform: translate(60px, -40px) scale(1.15);
            opacity: 0.6;
          }
          100% {
            transform: translate(-30px, 30px) scale(0.9);
            opacity: 0.45;
          }
        }

        @keyframes auraDriftGold {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 0.35;
          }
          50% {
            transform: translate(-50px, 40px) scale(1.12);
            opacity: 0.55;
          }
          100% {
            transform: translate(40px, -30px) scale(0.92);
            opacity: 0.38;
          }
        }
      `}</style>

      {/* LAYER 1: Dark Midnight Navy Linear Gradient & Pure CSS Ethereal Aura Glow Orbs */}
      <div className="ethereal-aura-container">
        <div className="aura-orb aura-pink" />
        <div className="aura-orb aura-peach" />
        <div className="aura-orb aura-gold" />
      </div>

      {/* LAYER 2: Readability Shield (Soft Dark Radial Vignette for 100% WCAG AAA Contrast) */}
      <div className="absolute inset-0 bg-radial from-[#060D1A]/85 via-[#060D1A]/50 to-transparent z-2 pointer-events-none" />

      {/* BOTTOM ACCENT: Ultra-Thin 1px Horizontal Sound Frequency / Calm Horizon Line */}
      <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#e4b4c3]/60 to-transparent z-2" />
    </div>
  );
}



'use client';

import { motion } from 'framer-motion';

export default function SpinningFlowerBackground() {
  return (
    <div className="fixed inset-0 z-[-2] flex items-center justify-center overflow-hidden pointer-events-none bg-white">
      <motion.svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[120vw] h-[120vh] max-w-[800px] max-h-[800px] opacity-15"
        animate={{ rotate: 360 }}
        transition={{ duration: 150, repeat: Infinity, ease: 'linear' }}
      >
        <g stroke="#e4b4c3" strokeWidth="1.2" fill="none" transform="translate(100, 100)">
          {/* Central part */}
          <circle cx="0" cy="0" r="8" />
          <circle cx="0" cy="0" r="12" strokeDasharray="2,2" />
          
          {/* 8 Petals */}
          {Array.from({ length: 8 }).map((_, i) => {
            const rotation = i * 45;
            return (
              <g key={i} transform={`rotate(${rotation})`}>
                {/* Petal path - elegant curved petal shape */}
                <path d="M 0,-12 C -25,-40 -30,-80 0,-95 C 30,-80 25,-40 0,-12 Z" />
                {/* Inner decorative stamen lines */}
                <path d="M 0,-12 L -5,-35" strokeWidth="0.8" />
                <circle cx="-5" cy="-35" r="1.5" fill="#e4b4c3" />
                <path d="M 0,-12 L 5,-35" strokeWidth="0.8" />
                <circle cx="5" cy="-35" r="1.5" fill="#e4b4c3" />
                <path d="M 0,-12 L 0,-40" strokeWidth="0.8" />
                <circle cx="0" cy="-40" r="1.5" fill="#e4b4c3" />
              </g>
            );
          })}
        </g>
      </motion.svg>
    </div>
  );
}


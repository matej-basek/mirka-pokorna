'use client';

export default function SeaWaves() {
  return (
    <div className="ocean-waves-wrapper pointer-events-none">
      <style>{`
        .ocean-waves-wrapper {
          position: fixed;
          inset: 0;
          z-index: -1;
          overflow: hidden;
          opacity: 0.45;
        }

        .wave-layer {
          position: absolute;
          left: 0;
          width: 200%;
          height: 100%;
          background-repeat: repeat-x;
          transform-origin: center bottom;
        }

        .wave-1 {
          bottom: -10px;
          opacity: 0.5;
          animation: waveMove1 16s linear infinite;
        }

        .wave-2 {
          bottom: 20px;
          opacity: 0.35;
          animation: waveMove2 12s linear infinite;
        }

        .wave-3 {
          bottom: 50px;
          opacity: 0.25;
          animation: waveMove1 22s linear infinite reverse;
        }

        .wave-top-1 {
          top: -20px;
          opacity: 0.3;
          transform: rotate(180deg);
          animation: waveMove2 20s linear infinite;
        }

        @keyframes waveMove1 {
          0% { transform: translateX(0) translateZ(0) scaleY(1); }
          50% { transform: translateX(-25%) translateZ(0) scaleY(1.15); }
          100% { transform: translateX(-50%) translateZ(0) scaleY(1); }
        }

        @keyframes waveMove2 {
          0% { transform: translateX(0) translateZ(0) scaleY(1); }
          50% { transform: translateX(-25%) translateZ(0) scaleY(0.85); }
          100% { transform: translateX(-50%) translateZ(0) scaleY(1); }
        }
      `}</style>

      {/* Top Ambient Wave */}
      <div className="wave-layer wave-top-1">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-40">
          <path
            d="M0,0 C150,90 350,-40 500,50 C650,140 900,10 1200,60 L1200,0 L0,0 Z"
            fill="url(#waveGrad1)"
          />
          <defs>
            <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0e4b6e" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#f5d6df" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#e4b4c3" stopOpacity="0.4" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Middle Floating Sea Waves */}
      <div className="wave-layer wave-3">
        <svg viewBox="0 0 1200 140" preserveAspectRatio="none" className="w-full h-56">
          <path
            d="M0,40 C200,120 450,0 700,70 C950,130 1100,20 1200,50 L1200,140 L0,140 Z"
            fill="rgba(228, 180, 195, 0.15)"
          />
        </svg>
      </div>

      <div className="wave-layer wave-2">
        <svg viewBox="0 0 1200 140" preserveAspectRatio="none" className="w-full h-64">
          <path
            d="M0,60 C300,130 600,10 900,80 C1100,120 1150,30 1200,60 L1200,140 L0,140 Z"
            fill="rgba(245, 214, 223, 0.2)"
          />
        </svg>
      </div>

      {/* Main Ocean Bottom Wave */}
      <div className="wave-layer wave-1">
        <svg viewBox="0 0 1200 140" preserveAspectRatio="none" className="w-full h-72">
          <path
            d="M0,30 C150,90 400,10 600,60 C800,110 1000,20 1200,40 L1200,140 L0,140 Z"
            fill="url(#oceanBottomGrad)"
          />
          <defs>
            <linearGradient id="oceanBottomGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0e4b6e" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#030814" stopOpacity="0.9" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}



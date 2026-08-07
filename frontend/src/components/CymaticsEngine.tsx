'use client';

import React, { useEffect, useRef } from 'react';

export default function CymaticsEngine() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Mouse & Scroll Sound Vibration Physics
    let targetFreq = 3.2;
    let currentFreq = 3.2;
    let targetAmp = 1.0;
    let currentAmp = 1.0;

    const handleMouseMove = (e: MouseEvent) => {
      const distFromCenter = Math.hypot(
        e.clientX - width / 2,
        e.clientY - height / 2
      );
      targetFreq = 3.0 + (distFromCenter / width) * 3.0;
      targetAmp = 1.0 + Math.sin(Date.now() * 0.003) * 0.35;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let time = 0;

    const render = () => {
      time += 0.014;

      // Smooth LERP Easing
      currentFreq += (targetFreq - currentFreq) * 0.04;
      currentAmp += (targetAmp - currentAmp) * 0.04;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height * 0.45;
      const maxRadius = Math.max(width, height) * 0.65;

      ctx.save();
      ctx.translate(cx, cy);

      // Render Concentric Cymatics Pink Waves Across the Full Viewport
      const ringCount = 18;
      for (let rIdx = 1; rIdx <= ringCount; rIdx++) {
        const radius = (rIdx / ringCount) * maxRadius;
        const points = 140;

        ctx.beginPath();
        for (let i = 0; i <= points; i++) {
          const angle = (i / points) * Math.PI * 2;

          const n = Math.round(currentFreq);
          const m = n + 1;
          const chladniDisplacement =
            (Math.sin(n * angle + time) * Math.cos(m * angle - time * 0.85) +
              Math.sin(m * angle * 0.5 + time * 1.3)) *
            18 *
            currentAmp;

          const r = radius + chladniDisplacement;
          const x = Math.cos(angle) * r;
          const y = Math.sin(angle) * r;

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();

        // Lush Ethereal Pink Waves Palette (#e4b4c3, #F5D6DF, #FF69B4, #E8A5B8)
        const strokeGrad = ctx.createLinearGradient(
          -radius,
          -radius,
          radius,
          radius
        );
        const alpha = Math.max(
          0.06,
          (1 - (rIdx / ringCount) * 0.7) * 0.38 * currentAmp
        );
        strokeGrad.addColorStop(0, `rgba(228, 180, 195, ${alpha * 1.3})`);
        strokeGrad.addColorStop(0.35, `rgba(245, 214, 223, ${alpha * 1.5})`);
        strokeGrad.addColorStop(0.7, `rgba(255, 105, 180, ${alpha * 1.2})`);
        strokeGrad.addColorStop(1, `rgba(232, 165, 184, ${alpha})`);

        ctx.strokeStyle = strokeGrad;
        ctx.lineWidth = 1.6;
        ctx.shadowColor = 'rgba(228, 180, 195, 0.65)';
        ctx.shadowBlur = 12;
        ctx.stroke();
      }

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-1 overflow-hidden">
      {/* Dark Midnight Navy Luxury Background (#050B14 to #0A192F) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050B14] via-[#071325] to-[#0A192F] z-1" />

      {/* Interactive Glowing Pink Cymatics Waves Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-2" />

      {/* Soft Dark Radial Vignette Readability Shield */}
      <div className="absolute inset-0 bg-radial from-[#050B14]/75 via-[#050B14]/45 to-transparent z-3 pointer-events-none" />
    </div>
  );
}



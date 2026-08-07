'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

interface Petal {
  id: number;
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  swayAmplitude: number;
  swayFrequency: number;
  initialX: number;
  floatingOnWater: boolean;
  floatTimer: number;
}

interface WaterRipple {
  id: number;
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
}

export default function HeroTreeEngine() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let time = 0;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // 8 to 12 Delicate Petals Across Full Viewport
    const maxPetals = width < 768 ? 6 : 10;
    const petals: Petal[] = [];
    const ripples: WaterRipple[] = [];

    const createPetal = (id: number): Petal => {
      const initialX = Math.random() * (width * 0.9) + width * 0.05;
      return {
        id,
        x: initialX,
        initialX,
        y: Math.random() * (height * 0.35) - 20,
        size: Math.random() * 4 + 6,
        speedY: Math.random() * 0.22 + 0.25,
        speedX: (Math.random() - 0.5) * 0.15,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 1.2,
        opacity: Math.random() * 0.35 + 0.65,
        swayAmplitude: Math.random() * 22 + 10,
        swayFrequency: Math.random() * 0.012 + 0.006,
        floatingOnWater: false,
        floatTimer: 0,
      };
    };

    for (let i = 0; i < maxPetals; i++) {
      petals.push(createPetal(i));
    }

    const drawPetalShape = (ctx: CanvasRenderingContext2D, size: number) => {
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.bezierCurveTo(size * 0.85, -size * 0.5, size * 0.85, size * 0.5, 0, size);
      ctx.bezierCurveTo(-size * 0.85, size * 0.5, -size * 0.85, -size * 0.5, 0, -size);
      ctx.closePath();
    };

    // Meditative Liquid Water Surface (Bottom 25% of Viewport)
    const drawLiquidOcean = (ctx: CanvasRenderingContext2D, time: number) => {
      const waterTopY = height * 0.75;

      ctx.save();

      // Liquid Wave Surface Path
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(0, waterTopY);

      for (let x = 0; x <= width; x += 25) {
        const wave1 = Math.sin(x * 0.004 + time * 0.0005) * 10;
        const wave2 = Math.cos(x * 0.007 - time * 0.0003) * 5;
        const y = waterTopY + wave1 + wave2;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(width, height);
      ctx.closePath();

      // Deep Ocean Linear Gradient
      const oceanGrad = ctx.createLinearGradient(0, waterTopY, 0, height);
      oceanGrad.addColorStop(0, 'rgba(16, 36, 66, 0.94)');
      oceanGrad.addColorStop(0.5, 'rgba(10, 24, 48, 0.98)');
      oceanGrad.addColorStop(1, '#060D1A');
      ctx.fillStyle = oceanGrad;
      ctx.fill();

      // Glowing Cyan Wave Surface Line
      ctx.beginPath();
      for (let x = 0; x <= width; x += 25) {
        const wave1 = Math.sin(x * 0.004 + time * 0.0005) * 10;
        const wave2 = Math.cos(x * 0.007 - time * 0.0003) * 5;
        const y = waterTopY + wave1 + wave2;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(74, 144, 226, 0.75)';
      ctx.lineWidth = 2.2;
      ctx.shadowColor = 'rgba(112, 181, 255, 0.8)';
      ctx.shadowBlur = 12;
      ctx.stroke();

      ctx.restore();
    };

    const waterTopY = height * 0.75;

    const render = () => {
      time += 16;
      ctx.clearRect(0, 0, width, height);

      // Render Liquid Ocean
      drawLiquidOcean(ctx, time);

      // Render Ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        ctx.save();

        ctx.beginPath();
        ctx.ellipse(r.x, r.y, r.radius * 1.5, r.radius * 0.45, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(74, 144, 226, ${r.opacity})`;
        ctx.lineWidth = 1.6;
        ctx.shadowColor = 'rgba(112, 181, 255, 0.7)';
        ctx.shadowBlur = 8;
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(r.x, r.y, r.radius * 0.9, r.radius * 0.25, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(245, 214, 223, ${r.opacity * 0.85})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.restore();

        r.radius += 0.4;
        r.opacity -= 0.009;

        if (r.opacity <= 0 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
        }
      }

      // Render Petals
      petals.forEach((p) => {
        if (!p.floatingOnWater) {
          p.y += p.speedY;
          p.rotation += p.rotationSpeed;
          p.x = p.initialX + Math.sin(p.y * p.swayFrequency) * p.swayAmplitude;

          const currentWaterY = waterTopY + Math.sin(p.x * 0.004 + time * 0.0005) * 10;
          if (p.y >= currentWaterY) {
            p.floatingOnWater = true;
            p.floatTimer = 0;

            if (ripples.length < 12) {
              ripples.push({
                id: Date.now() + Math.random(),
                x: p.x,
                y: currentWaterY,
                radius: 2.5,
                maxRadius: Math.random() * 18 + 14,
                opacity: 0.85,
              });
            }
          }
        } else {
          p.floatTimer += 16;
          p.opacity -= 0.01;
        }

        if (p.y > height + 40 || p.opacity <= 0) {
          Object.assign(p, createPetal(p.id));
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);

        const pGrad = ctx.createLinearGradient(0, -p.size, 0, p.size);
        pGrad.addColorStop(0, `rgba(255, 255, 255, ${p.opacity})`);
        pGrad.addColorStop(0.45, `rgba(245, 214, 223, ${p.opacity * 0.95})`);
        pGrad.addColorStop(0.85, `rgba(228, 180, 195, ${p.opacity * 0.9})`);
        pGrad.addColorStop(1, `rgba(228, 180, 195, ${p.opacity * 0.7})`);

        ctx.fillStyle = pGrad;
        ctx.shadowColor = 'rgba(245, 214, 223, 0.5)';
        ctx.shadowBlur = 6;

        drawPetalShape(ctx, p.size);
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-1">
      {/* LAYER 1: Dark Midnight Ocean Base */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#060D1A] via-[#0A1832] to-[#102442] z-1" />

      {/* LAYER 2: canopy.png Bigger, More Visible & Floating ABOVE the Water Line (Height max 72vh) */}
      <div
        className="hero-canopy-wrapper absolute -top-4 left-1/2 -translate-x-1/2 w-[115vw] max-w-[1400px] h-[72vh] z-2 pointer-events-none transition-all"
        style={{
          opacity: 0.96,
          filter:
            'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.75)) drop-shadow(0 0 35px rgba(245, 214, 223, 0.45))',
        }}
      >
        <Image
          src="/canopy.png"
          alt="Rozkvetlá jabloň klenba Mirka Pokorná"
          fill
          priority
          className="object-contain object-top"
        />
      </div>

      {/* LAYER 3: Readability Shield */}
      <div className="absolute inset-0 bg-radial from-[#060D1A]/85 via-[#060D1A]/50 to-transparent z-3 pointer-events-none" />

      {/* LAYER 4: Interactive Liquid Ocean Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-4" />
    </div>
  );
}



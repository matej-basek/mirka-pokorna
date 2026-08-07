'use client';

import React, { useEffect, useRef } from 'react';

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

export default function HeroOceanTree() {
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

    // 8 to 12 Meditative Falling Petals
    const maxPetals = width < 768 ? 6 : 10;
    const petals: Petal[] = [];
    const ripples: WaterRipple[] = [];

    const createPetal = (id: number): Petal => {
      const initialX = Math.random() * (width * 0.75) + width * 0.1;
      return {
        id,
        x: initialX,
        initialX,
        y: Math.random() * (height * 0.35) - 30,
        size: Math.random() * 5 + 7,
        speedY: Math.random() * 0.25 + 0.25,
        speedX: (Math.random() - 0.5) * 0.2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 1.2,
        opacity: Math.random() * 0.35 + 0.65,
        swayAmplitude: Math.random() * 22 + 12,
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

    // Draw Majestic Full-Bloom Sakura / Apple Tree Canopy
    const drawMajesticTree = (ctx: CanvasRenderingContext2D) => {
      ctx.save();

      // Strong Wooden Trunk & Boughs (#1A2530)
      ctx.beginPath();
      ctx.moveTo(width * 0.05, height * 0.8);
      ctx.bezierCurveTo(
        width * 0.12, height * 0.5,
        width * 0.22, height * 0.35,
        width * 0.35, height * 0.25
      );
      ctx.lineWidth = 26;
      ctx.strokeStyle = '#1A2530';
      ctx.lineCap = 'round';
      ctx.shadowColor = 'rgba(228, 180, 195, 0.3)';
      ctx.shadowBlur = 15;
      ctx.stroke();

      // Major Boughs Sweeping Across Upper/Middle Canopy
      const boughs = [
        { sx: width * 0.35, sy: height * 0.25, cx1: width * 0.48, cy1: height * 0.18, ex: width * 0.65, ey: height * 0.22, w: 16 },
        { sx: width * 0.65, sy: height * 0.22, cx1: width * 0.78, cy1: height * 0.26, ex: width * 0.92, ey: height * 0.32, w: 10 },
        { sx: width * 0.25, sy: height * 0.38, cx1: width * 0.38, cy1: height * 0.45, ex: width * 0.55, ey: height * 0.42, w: 12 },
        { sx: width * 0.55, sy: height * 0.42, cx1: width * 0.68, cy1: height * 0.48, ex: width * 0.82, ey: height * 0.52, w: 8 },
        { sx: width * 0.35, sy: height * 0.25, cx1: width * 0.38, cy1: height * 0.12, ex: width * 0.45, ey: height * 0.08, w: 10 },
      ];

      boughs.forEach((b) => {
        ctx.beginPath();
        ctx.moveTo(b.sx, b.sy);
        ctx.quadraticCurveTo(b.cx1, b.cy1, b.ex, b.ey);
        ctx.lineWidth = b.w;
        ctx.strokeStyle = '#1A2530';
        ctx.stroke();
      });

      // Dense Voluminous Cloud-Like Pink Blossom Canopy Clusters (Hundreds of Flowers)
      const canopyClouds = [
        // Upper Main Canopy Cluster
        { x: width * 0.35, y: height * 0.22, r: 75 },
        { x: width * 0.45, y: height * 0.16, r: 85 },
        { x: width * 0.55, y: height * 0.18, r: 90 },
        { x: width * 0.65, y: height * 0.22, r: 80 },
        { x: width * 0.78, y: height * 0.28, r: 70 },
        { x: width * 0.88, y: height * 0.34, r: 60 },

        // Lower Sweeping Canopy Cluster
        { x: width * 0.28, y: height * 0.36, r: 65 },
        { x: width * 0.40, y: height * 0.42, r: 70 },
        { x: width * 0.52, y: height * 0.44, r: 75 },
        { x: width * 0.64, y: height * 0.46, r: 68 },
        { x: width * 0.75, y: height * 0.50, r: 58 },

        // Top Canopy Fillers
        { x: width * 0.40, y: height * 0.10, r: 60 },
        { x: width * 0.50, y: height * 0.08, r: 65 },
        { x: width * 0.60, y: height * 0.12, r: 55 },
      ];

      canopyClouds.forEach((c) => {
        // Soft Glowing Pink Ambient Aura
        const auraGrad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r * 1.5);
        auraGrad.addColorStop(0, 'rgba(228, 180, 195, 0.45)');
        auraGrad.addColorStop(0.5, 'rgba(245, 214, 223, 0.25)');
        auraGrad.addColorStop(1, 'rgba(232, 165, 184, 0)');
        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Dense Overlapping Petals for Voluminous Cloud Effect
        const petalCount = 18;
        for (let i = 0; i < petalCount; i++) {
          const angle = (i * Math.PI * 2) / petalCount + Math.sin(i);
          const dist = Math.random() * (c.r * 0.7);
          const px = c.x + Math.cos(angle) * dist;
          const py = c.y + Math.sin(angle) * dist;
          const pSize = Math.random() * 12 + 10;

          const pGrad = ctx.createRadialGradient(px, py, 0, px, py, pSize);
          pGrad.addColorStop(0, '#FFFFFF');
          pGrad.addColorStop(0.4, '#e4b4c3');
          pGrad.addColorStop(0.85, '#F5D6DF');
          pGrad.addColorStop(1, '#E8A5B8');

          ctx.fillStyle = pGrad;
          ctx.beginPath();
          ctx.arc(px, py, pSize, 0, Math.PI * 2);
          ctx.fill();
        }

        // Gold Center Stamens
        ctx.fillStyle = '#e4b4c3';
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r * 0.12, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();
    };

    // Draw Calm Meditative Liquid Ocean Surface with Canopy Reflections
    const drawCalmLiquidOcean = (ctx: CanvasRenderingContext2D, time: number) => {
      const waterTopY = height * 0.65;

      ctx.save();

      // Liquid Water Surface Wave Path (Slow Meditative Rhythm)
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(0, waterTopY);

      for (let x = 0; x <= width; x += 25) {
        const wave1 = Math.sin(x * 0.004 + time * 0.0005) * 11;
        const wave2 = Math.cos(x * 0.007 - time * 0.0003) * 5;
        const y = waterTopY + wave1 + wave2;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(width, height);
      ctx.closePath();

      // Deep Ocean Volume Gradient
      const oceanGrad = ctx.createLinearGradient(0, waterTopY, 0, height);
      oceanGrad.addColorStop(0, 'rgba(18, 43, 83, 0.94)');
      oceanGrad.addColorStop(0.45, 'rgba(10, 25, 48, 0.98)');
      oceanGrad.addColorStop(1, '#060D1A');
      ctx.fillStyle = oceanGrad;
      ctx.fill();

      // Shimmering Pink Blossom Canopy Reflections on Water
      ctx.globalCompositeOperation = 'screen';
      for (let x = width * 0.2; x <= width * 0.85; x += 90) {
        const reflY = waterTopY + 30 + Math.sin(x * 0.01 + time * 0.001) * 10;
        const reflGrad = ctx.createRadialGradient(x, reflY, 0, x, reflY, 80);
        reflGrad.addColorStop(0, 'rgba(228, 180, 195, 0.35)');
        reflGrad.addColorStop(0.5, 'rgba(245, 214, 223, 0.2)');
        reflGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = reflGrad;
        ctx.beginPath();
        ctx.ellipse(x, reflY, 65, 14, Math.sin(time * 0.0008) * 0.15, 0, Math.PI * 2);
        ctx.fill();
      }

      // Bioluminescent Cyan Wave Crest Glow (#4A90E2)
      ctx.globalCompositeOperation = 'source-over';
      ctx.beginPath();
      for (let x = 0; x <= width; x += 25) {
        const wave1 = Math.sin(x * 0.004 + time * 0.0005) * 11;
        const wave2 = Math.cos(x * 0.007 - time * 0.0003) * 5;
        const y = waterTopY + wave1 + wave2;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = '#4A90E2';
      ctx.lineWidth = 2.2;
      ctx.shadowColor = 'rgba(112, 181, 255, 0.75)';
      ctx.shadowBlur = 12;
      ctx.stroke();

      ctx.restore();
    };

    const waterTopY = height * 0.65;

    const render = () => {
      time += 16;
      ctx.clearRect(0, 0, width, height);

      // Render Full-Bloom Sakura / Apple Tree
      drawMajesticTree(ctx);

      // Render Calm Liquid Ocean with Tree Reflections
      drawCalmLiquidOcean(ctx, time);

      // Render Expanding Liquid Water Ripples on Impact
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        ctx.save();

        ctx.beginPath();
        ctx.ellipse(r.x, r.y, r.radius * 1.5, r.radius * 0.45, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(112, 181, 255, ${r.opacity})`;
        ctx.lineWidth = 1.6;
        ctx.shadowColor = 'rgba(112, 181, 255, 0.7)';
        ctx.shadowBlur = 8;
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(r.x, r.y, r.radius * 0.9, r.radius * 0.25, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(228, 180, 195, ${r.opacity * 0.8})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.restore();

        r.radius += 0.38;
        r.opacity -= 0.009;

        if (r.opacity <= 0 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
        }
      }

      // Render & Update Meditative Falling Petals
      petals.forEach((p) => {
        if (!p.floatingOnWater) {
          p.y += p.speedY;
          p.rotation += p.rotationSpeed;
          p.x = p.initialX + Math.sin(p.y * p.swayFrequency) * p.swayAmplitude;

          // Touch Water Surface Check
          if (p.y >= waterTopY + Math.sin(p.x * 0.004 + time * 0.0005) * 11) {
            p.floatingOnWater = true;
            p.floatTimer = 0;

            if (ripples.length < 10) {
              ripples.push({
                id: Date.now() + Math.random(),
                x: p.x,
                y: p.y,
                radius: 2.5,
                maxRadius: Math.random() * 18 + 14,
                opacity: 0.85,
              });
            }
          }
        } else {
          p.floatTimer += 16;
          p.opacity -= 0.009;
        }

        if (p.y > height + 40 || p.opacity <= 0) {
          Object.assign(p, createPetal(p.id));
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);

        const pGrad = ctx.createLinearGradient(0, -p.size, 0, p.size);
        pGrad.addColorStop(0, `rgba(255, 255, 255, ${p.opacity})`);
        pGrad.addColorStop(0.4, `rgba(228, 180, 195, ${p.opacity * 0.95})`);
        pGrad.addColorStop(0.85, `rgba(245, 214, 223, ${p.opacity * 0.9})`);
        pGrad.addColorStop(1, `rgba(232, 165, 184, ${p.opacity * 0.8})`);

        ctx.fillStyle = pGrad;
        ctx.shadowColor = 'rgba(228, 180, 195, 0.5)';
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
      {/* HTML5 Canvas Rendering Majestic Blooming Tree & Liquid Ocean */}
      <canvas ref={canvasRef} className="absolute inset-0 z-2" />

      {/* Dark Vignette Mask behind Typography for 100% Legibility & WCAG AAA Contrast (z-index 5) */}
      <div className="absolute inset-0 bg-radial from-[#060D1A]/80 via-[#060D1A]/50 to-transparent z-5 pointer-events-none" />
    </div>
  );
}



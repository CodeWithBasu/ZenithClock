'use client';

import { useEffect, useRef } from 'react';

interface DynamicBackgroundProps {
  theme?: string;
}

export default function DynamicBackground({ theme = 'cyber' }: DynamicBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationFrameId: number;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle system
    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.6 + 0.2,
    }));

    let step = 0;

    const render = () => {
      step += 0.008;
      ctx.clearRect(0, 0, width, height);

      // Theme background base
      let grad1 = '#090d16';
      let grad2 = '#04060a';
      let particleColor = '0, 243, 255'; // Cyan neon

      if (theme === 'aurora') {
        grad1 = '#051b14';
        grad2 = '#020b08';
        particleColor = '16, 185, 129'; // Emerald
      } else if (theme === 'obsidian') {
        grad1 = '#121218';
        grad2 = '#08080a';
        particleColor = '168, 85, 247'; // Purple
      } else if (theme === 'minimal') {
        grad1 = '#0f172a';
        grad2 = '#020617';
        particleColor = '148, 163, 184'; // Slate
      } else if (theme === 'sunburst') {
        grad1 = '#1f0d03';
        grad2 = '#0d0400';
        particleColor = '245, 158, 11'; // Gold
      }

      // Draw background gradient
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        100,
        width / 2,
        height / 2,
        Math.max(width, height)
      );
      bgGrad.addColorStop(0, grad1);
      bgGrad.addColorStop(1, grad2);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Animated glowing orb
      const orbX = width / 2 + Math.sin(step * 0.8) * (width * 0.2);
      const orbY = height / 2 + Math.cos(step * 0.6) * (height * 0.15);
      const orbGrad = ctx.createRadialGradient(orbX, orbY, 10, orbX, orbY, 350);
      orbGrad.addColorStop(0, `rgba(${particleColor}, 0.15)`);
      orbGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = orbGrad;
      ctx.beginPath();
      ctx.arc(orbX, orbY, 350, 0, Math.PI * 2);
      ctx.fill();

      // Render floating particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particleColor}, ${p.alpha})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = `rgba(${particleColor}, 0.8)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-10 w-full h-full transition-opacity duration-1000"
    />
  );
}

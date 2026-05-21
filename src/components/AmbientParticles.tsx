import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

type AmbientParticlesProps = {
  active: boolean;
};

type Particle = {
  x: number;
  y: number;
  baseX: number;
  size: number;
  speed: number;
  sway: number;
  period: number;
  phase: number;
  pulseDuration: number;
  color: string;
  sparkUntil: number;
  sparkStart: number;
};

const palette = [
  '139,120,221',
  '139,120,221',
  '139,120,221',
  '139,120,221',
  '99,140,221',
  '99,140,221',
  '99,140,221',
  '221,200,120',
  '221,200,120',
  '255,255,255',
];

const createParticle = (width: number, height: number, y = Math.random() * height): Particle => {
  const x = Math.random() * width;
  return {
    x,
    y,
    baseX: x,
    size: 1 + Math.random() * 1.5,
    speed: 8 + Math.random() * 12,
    sway: 15,
    period: 6000 + Math.random() * 4000,
    phase: Math.random() * Math.PI * 2,
    pulseDuration: 4000 + Math.random() * 4000,
    color: palette[Math.floor(Math.random() * palette.length)],
    sparkUntil: 0,
    sparkStart: 0,
  };
};

export function AmbientParticles({ active }: AmbientParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context || !active) return;

    let width = 0;
    let height = 0;
    let frameId = 0;
    let lastTime = performance.now();
    let nextSparkAt = lastTime + 4000 + Math.random() * 4000;
    let particles: Particle[] = [];

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = width < 768 ? 20 : 40;
      particles = Array.from({ length: count }, () => createParticle(width, height));
    };

    const draw = (now: number) => {
      context.clearRect(0, 0, width, height);
      particles.forEach((particle) => {
        const pulse = (Math.sin((now / particle.pulseDuration) * Math.PI * 2 + particle.phase) + 1) / 2;
        let alpha = 0.3 + pulse * 0.5;
        let size = particle.size;

        if (particle.sparkUntil > now) {
          const elapsed = now - particle.sparkStart;
          const progress = Math.min(1, elapsed / 600);
          const ease = 1 - Math.pow(1 - progress, 3);
          const sparkStrength = 1 - ease;
          alpha = Math.max(alpha, 0.55 + sparkStrength * 0.45);
          size = particle.size * (1 + sparkStrength * 2);
          const glow = context.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, 8);
          glow.addColorStop(0, `rgba(${particle.color}, ${0.3 * sparkStrength})`);
          glow.addColorStop(1, `rgba(${particle.color}, 0)`);
          context.fillStyle = glow;
          context.beginPath();
          context.arc(particle.x, particle.y, 8, 0, Math.PI * 2);
          context.fill();
        }

        context.fillStyle = `rgba(${particle.color}, ${alpha * 0.4})`;
        context.beginPath();
        context.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        context.fill();
      });
    };

    const tick = (now: number) => {
      const delta = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      particles.forEach((particle) => {
        particle.y -= particle.speed * delta;
        particle.x = particle.baseX + Math.sin(now / particle.period + particle.phase) * particle.sway;
        if (particle.y < -12) {
          Object.assign(particle, createParticle(width, height, height + 12));
        }
      });

      if (now > nextSparkAt) {
        const visible = particles.filter((particle) => particle.y > 0 && particle.y < height);
        const spark = visible[Math.floor(Math.random() * visible.length)];
        if (spark) {
          spark.sparkStart = now;
          spark.sparkUntil = now + 600;
        }
        nextSparkAt = now + 4000 + Math.random() * 4000;
      }

      draw(now);
      frameId = window.requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener('resize', resize);

    if (reduceMotion) {
      draw(performance.now());
    } else {
      frameId = window.requestAnimationFrame(tick);
    }

    return () => {
      window.removeEventListener('resize', resize);
      window.cancelAnimationFrame(frameId);
      context.clearRect(0, 0, width, height);
    };
  }, [active, reduceMotion]);

  return <canvas ref={canvasRef} className="ambient-particles" aria-hidden="true" data-active={active ? 'true' : 'false'} />;
}

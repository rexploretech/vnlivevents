'use client';

import { useMemo } from 'react';

interface ParticleSystemProps {
  colors?: string[];
}

interface Particle {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
  color: string;
  opacity: number;
}

function hashSeed(input: string) {
  let hash = 0;

  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash) + 1;
}

function seededRandom(seed: number) {
  const value = Math.sin(seed) * 10000;
  return value - Math.floor(value);
}

export default function ParticleSystem({ colors = ['#C9A84C', '#F0D080', '#C2637A'] }: ParticleSystemProps) {
  const particles = useMemo<Particle[]>(() => {
    const palette = colors.length > 0 ? colors : ['#C9A84C', '#F0D080', '#C2637A'];
    const paletteSeed = palette.join('|');

    return Array.from({ length: 18 }, (_, i) => {
      const seedBase = hashSeed(`${paletteSeed}-${i}`);
      const colorIndex = Math.floor(seededRandom(seedBase + 5) * palette.length);

      return {
        id: i,
        x: seededRandom(seedBase + 1) * 100,
        size: seededRandom(seedBase + 2) * 4 + 4,
        delay: seededRandom(seedBase + 3) * 12,
        duration: seededRandom(seedBase + 4) * 8 + 18,
        color: palette[colorIndex],
        opacity: seededRandom(seedBase + 6) * 0.35 + 0.2,
      };
    });
  }, [colors]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute particle-float"
          style={{
            left: `${p.x}%`,
            width: `${p.size}px`,
            height: `${p.size * 1.4}px`, // Elongated like a petal
            backgroundColor: p.color,
            opacity: p.opacity,
            borderRadius: '40% 70% 40% 70%', // Asymmetric petal shape
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: 'translate3d(0, 0, 0)',
          }}
        />
      ))}
    </div>
  );
}

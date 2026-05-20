'use client';

import { useState } from 'react';

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

export default function ParticleSystem({ colors = ['#C9A84C', '#F0D080', '#C2637A'] }: ParticleSystemProps) {
  const [particles] = useState<Particle[]>(() =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: Math.random() * 4 + 4,
        delay: Math.random() * 12,
        duration: Math.random() * 8 + 18,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.35 + 0.2,
      }))
  );

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
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </div>
  );
}

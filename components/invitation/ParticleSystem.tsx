'use client';

import { useEffect, useState } from 'react';

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
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generated: Particle[] = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 6 + 4, // Slightly larger for "petals"
      delay: Math.random() * 15, // Longer spread for falling
      duration: Math.random() * 10 + 15, // Slower fall
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.5 + 0.2,
    }));
    setParticles(generated);
  }, [colors]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
            filter: 'blur(0.5px)',
          }}
        />
      ))}
    </div>
  );
}

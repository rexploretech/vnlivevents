'use client';

import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  targetDate: string;
  accentColor?: string;
  accentColorRgb?: string;
}

export default function CountdownTimer({
  targetDate,
  accentColor = '#C9A84C',
  accentColorRgb = '201, 168, 76',
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!targetDate) return;

    const calcTimeLeft = () => {
      // Parse date and treat as IST (Indian Standard Time, UTC+5:30)
      let targetDateStr = targetDate;
      
      // If no timezone, add IST
      if (!targetDateStr.endsWith('Z') && !targetDateStr.includes('+')) {
        targetDateStr = targetDateStr + '+05:30';
      }
      
      const target = new Date(targetDateStr);
      
      if (isNaN(target.getTime())) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      
      const diff = target.getTime() - Date.now();
      
      if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };

    setTimeLeft(calcTimeLeft());
    const timer = setInterval(() => setTimeLeft(calcTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const fmt = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="grid grid-flow-col gap-5 text-center auto-cols-max animate-fade-slide-up" style={{ animationDelay: '1s' }}>
      <div 
        className="flex flex-col p-3 md:p-4 rounded-box text-neutral-content backdrop-blur-[6px] shadow-2xl"
        style={{
          background: `linear-gradient(145deg, rgba(${accentColorRgb}, 0.2), rgba(0,0,0,0.6))`,
          border: `1px solid rgba(${accentColorRgb}, 0.25)`,
          boxShadow: `0 8px 32px rgba(0,0,0,0.5)`,
        }}
      >
        <span className="font-cinzel text-4xl md:text-5xl" style={{ color: accentColor, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
          {fmt(timeLeft.days)}
        </span>
        <span className="text-[10px] md:text-xs uppercase font-sans tracking-[0.3em] mt-3 opacity-90 text-cream font-bold drop-shadow-md">Days</span>
      </div>
      
      <div 
        className="flex flex-col p-3 md:p-4 rounded-box text-neutral-content backdrop-blur-[6px] shadow-2xl"
        style={{
          background: `linear-gradient(145deg, rgba(${accentColorRgb}, 0.2), rgba(0,0,0,0.6))`,
          border: `1px solid rgba(${accentColorRgb}, 0.25)`,
          boxShadow: `0 8px 32px rgba(0,0,0,0.5)`,
        }}
      >
        <span className="font-cinzel text-4xl md:text-5xl" style={{ color: accentColor, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
          {fmt(timeLeft.hours)}
        </span>
        <span className="text-[10px] md:text-xs uppercase font-sans tracking-[0.3em] mt-3 opacity-90 text-cream font-bold drop-shadow-md">Hours</span>
      </div>
      
      <div 
        className="flex flex-col p-3 md:p-4 rounded-box text-neutral-content backdrop-blur-[6px] shadow-2xl"
        style={{
          background: `linear-gradient(145deg, rgba(${accentColorRgb}, 0.2), rgba(0,0,0,0.6))`,
          border: `1px solid rgba(${accentColorRgb}, 0.25)`,
          boxShadow: `0 8px 32px rgba(0,0,0,0.5)`,
        }}
      >
        <span className="font-cinzel text-4xl md:text-5xl" style={{ color: accentColor, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
          {fmt(timeLeft.minutes)}
        </span>
        <span className="text-[10px] md:text-xs uppercase font-sans tracking-[0.3em] mt-3 opacity-90 text-cream font-bold drop-shadow-md">Min</span>
      </div>
      
      <div 
        className="flex flex-col p-3 md:p-4 rounded-box text-neutral-content backdrop-blur-[6px] shadow-2xl"
        style={{
          background: `linear-gradient(145deg, rgba(${accentColorRgb}, 0.2), rgba(0,0,0,0.6))`,
          border: `1px solid rgba(${accentColorRgb}, 0.25)`,
          boxShadow: `0 8px 32px rgba(0,0,0,0.5)`,
        }}
      >
        <span className="font-cinzel text-4xl md:text-5xl" style={{ color: accentColor, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
          {fmt(timeLeft.seconds)}
        </span>
        <span className="text-[10px] md:text-xs uppercase font-sans tracking-[0.3em] mt-3 opacity-90 text-cream font-bold drop-shadow-md">Sec</span>
      </div>
    </div>
  );
}

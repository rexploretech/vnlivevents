'use client';

import { useEffect, useState } from 'react';
import Counter from './Counter';

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
      let targetDateStr = targetDate;
      
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

  return (
    <div className="grid grid-flow-col gap-3 md:gap-4 text-center auto-cols-max">
      <div className="flex flex-col items-center p-2 md:p-3 rounded-lg bg-black/50 border border-amber-500/30">
        <Counter value={timeLeft.days} places={[100, 10, 1]} fontSize={48} textColor={accentColor} gap={2} />
        <span className="text-xs md:text-sm uppercase tracking-widest mt-1 text-amber-200/80">Days</span>
      </div>
      <div className="flex flex-col items-center p-2 md:p-3 rounded-lg bg-black/50 border border-amber-500/30">
        <Counter value={timeLeft.hours} places={[10, 1]} fontSize={48} textColor={accentColor} gap={2} />
        <span className="text-xs md:text-sm uppercase tracking-widest mt-1 text-amber-200/80">Hours</span>
      </div>
      <div className="flex flex-col items-center p-2 md:p-3 rounded-lg bg-black/50 border border-amber-500/30">
        <Counter value={timeLeft.minutes} places={[10, 1]} fontSize={48} textColor={accentColor} gap={2} />
        <span className="text-xs md:text-sm uppercase tracking-widest mt-1 text-amber-200/80">Min</span>
      </div>
      <div className="flex flex-col items-center p-2 md:p-3 rounded-lg bg-black/50 border border-amber-500/30">
        <Counter value={timeLeft.seconds} places={[10, 1]} fontSize={48} textColor={accentColor} gap={2} />
        <span className="text-xs md:text-sm uppercase tracking-widest mt-1 text-amber-200/80">Sec</span>
      </div>
    </div>
  );
}
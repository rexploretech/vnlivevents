'use client';

import { useEffect, useState } from 'react';
import Counter from './Counter';

interface CountdownTimerProps {
  targetDate: string;
  accentColor?: string;
  accentColorRgb?: string;
}

function useResponsiveFontSize() {
  const [fontSize, setFontSize] = useState(48);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 380) {
        setFontSize(32);
      } else if (window.innerWidth < 640) {
        setFontSize(40);
      } else {
        setFontSize(48);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return fontSize;
}

export default function CountdownTimer({
  targetDate,
  accentColor = '#C9A84C',
  accentColorRgb = '201, 168, 76',
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const fontSize = useResponsiveFontSize();

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
    <div className="grid grid-flow-col gap-2 sm:gap-3 md:gap-4 text-center auto-cols-max">
      <div className="flex flex-col items-center p-2 sm:p-2 md:p-3 rounded-lg bg-black/40 backdrop-blur-sm border" style={{ borderColor: `rgba(${accentColorRgb}, 0.2)` }}>
        <Counter value={timeLeft.days} places={[100, 10, 1]} fontSize={fontSize} textColor={accentColor} gap={fontSize > 40 ? 4 : 2} horizontalPadding={fontSize > 40 ? 8 : 4} />
        <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] mt-2 opacity-60 text-cream">Days</span>
      </div>
      <div className="flex flex-col items-center p-2 sm:p-2 md:p-3 rounded-lg bg-black/40 backdrop-blur-sm border" style={{ borderColor: `rgba(${accentColorRgb}, 0.2)` }}>
        <Counter value={timeLeft.hours} places={[10, 1]} fontSize={fontSize} textColor={accentColor} gap={fontSize > 40 ? 4 : 2} horizontalPadding={fontSize > 40 ? 8 : 4} />
        <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] mt-2 opacity-60 text-cream">Hours</span>
      </div>
      <div className="flex flex-col items-center p-2 sm:p-2 md:p-3 rounded-lg bg-black/40 backdrop-blur-sm border" style={{ borderColor: `rgba(${accentColorRgb}, 0.2)` }}>
        <Counter value={timeLeft.minutes} places={[10, 1]} fontSize={fontSize} textColor={accentColor} gap={fontSize > 40 ? 4 : 2} horizontalPadding={fontSize > 40 ? 8 : 4} />
        <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] mt-2 opacity-60 text-cream">Min</span>
      </div>
      <div className="flex flex-col items-center p-2 sm:p-2 md:p-3 rounded-lg bg-black/40 backdrop-blur-sm border" style={{ borderColor: `rgba(${accentColorRgb}, 0.2)` }}>
        <Counter value={timeLeft.seconds} places={[10, 1]} fontSize={fontSize} textColor={accentColor} gap={fontSize > 40 ? 4 : 2} horizontalPadding={fontSize > 40 ? 8 : 4} />
        <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] mt-2 opacity-60 text-cream">Sec</span>
      </div>
    </div>
  );
}
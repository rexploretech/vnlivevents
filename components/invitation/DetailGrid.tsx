'use client';

import { MapPin } from 'lucide-react';

interface DetailGridProps {
  venue: string;
  city: string;
  photographerName?: string;
  streamPlatform?: string;
  accentColor?: string;
  accentColorRgb?: string;
}

export default function DetailGrid({
  venue,
  city,
  accentColor = '#C9A84C',
  accentColorRgb = '201, 168, 76',
}: DetailGridProps) {
  if (!venue && !city) return null;

  return (
    <div className="w-full max-w-xl mx-auto animate-fade-slide-up" style={{ animationDelay: '1.45s' }}>
      <div
        className="flex flex-col items-center p-6 md:p-8 rounded-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]"
        style={{
          backgroundColor: `rgba(${accentColorRgb}, 0.05)`,
          border: `1px solid rgba(${accentColorRgb}, 0.15)`,
        }}
      >
        <MapPin size={28} className="mb-3" style={{ color: `rgba(${accentColorRgb}, 0.8)` }} />
        <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-cream/40 mb-2">Venue</span>
        <h3 className="font-cinzel font-bold drop-shadow-lg text-xl md:text-2xl text-cream text-center leading-snug" style={{ textShadow: `0 2px 8px rgba(0,0,0,0.6)` }}>
          {venue}
        </h3>
        <p className="font-cinzel font-bold drop-shadow-md text-lg md:text-xl text-cream/90 text-center mt-1" style={{ textShadow: `0 2px 8px rgba(0,0,0,0.6)` }}>
          {city}
        </p>
      </div>
    </div>
  );
}

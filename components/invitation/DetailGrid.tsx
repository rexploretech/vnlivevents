'use client';

import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      className="w-full max-w-xl mx-auto px-4"
    >
      <div
        className="relative group overflow-hidden flex flex-col items-center p-8 md:p-12 rounded-2xl backdrop-blur-xl transition-all duration-500 shadow-2xl"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.4)', // Darker background for better contrast
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: `0 0 40px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(${accentColorRgb}, 0.05)`,
        }}
      >
        {/* Inner Glow/Accent Border */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${accentColor}33 0%, transparent 80%)`
          }}
        />

        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center mb-6 shadow-xl"
          style={{ 
            backgroundColor: `rgba(${accentColorRgb}, 0.1)`,
            border: `1px solid rgba(${accentColorRgb}, 0.2)`
          }}
        >
          <MapPin size={24} style={{ color: accentColor }} />
        </div>

        <span className="font-sans text-[11px] uppercase tracking-[0.4em] text-cream/40 mb-4 font-bold">The Venue</span>
        
        <h3 className="font-serif italic font-bold text-2xl md:text-4xl text-cream text-center leading-snug mb-2" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
          {venue}
        </h3>
        
        <p className="font-cinzel text-lg md:text-xl tracking-[0.2em] text-cream/80 text-center uppercase" style={{ color: accentColor }}>
          {city}
        </p>

        {/* Decorative corner accent */}
        <div 
          className="absolute top-0 right-0 w-16 h-16 opacity-20"
          style={{
            background: `linear-gradient(135deg, transparent 50%, ${accentColor} 100%)`,
            clipPath: 'polygon(100% 0, 100% 100%, 0 0)'
          }}
        />
      </div>
    </motion.div>
  );
}

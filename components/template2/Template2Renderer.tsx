'use client';

import React from 'react';
import { type EventData } from '@/lib/occasionPresets';
import { Home, BookOpen, CalendarDays, Camera, Phone } from 'lucide-react';

export default function Template2Renderer({ event }: { event: EventData }) {
  const themeVars = {
    '--theme-accent': event.accentColor || '#C9A84C',
    '--theme-accent-rgb': event.accentColorRgb || '201, 168, 76',
    '--theme-secondary': event.secondaryColor || '#C2637A',
    '--theme-secondary-rgb': event.secondaryColorRgb || '194, 99, 122',
  } as React.CSSProperties;

  // The 5 sections in Telugu
  const sections = [
    { id: 'home', icon: <Home size={18} />, telugu: 'హోమ్', english: 'Home' },
    { id: 'story', icon: <BookOpen size={18} />, telugu: 'మన కథ', english: 'Our Story' },
    { id: 'program', icon: <CalendarDays size={18} />, telugu: 'కార్యక్రమం', english: 'Program' },
    { id: 'gallery', icon: <Camera size={18} />, telugu: 'గ్యాలరీ', english: 'Gallery' },
    { id: 'contact', icon: <Phone size={18} />, telugu: 'సంప్రదించండి', english: 'Contact' },
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#fdfaf5] text-[#333] font-sans pb-24 overflow-x-hidden" style={themeVars}>
      
      {/* ── HEADER ── */}
      <header className="sticky top-0 z-40 bg-[#fdfaf5]/90 backdrop-blur-md shadow-sm py-3 px-4 flex justify-between items-center border-b border-[#eaddc4]">
        <div className="flex items-center gap-2">
          <span className="text-xl">🪔</span>
          <h1 className="font-bold text-[#b4562c] text-lg tracking-wide">{event.occasionTitle || 'శుభవివాహం'}</h1>
        </div>
        <div className="text-sm font-semibold text-[#8c3d1c]">
          {event.timeFormatted || '12:25 PM'}
        </div>
      </header>

      {/* ── SECTIONS ── */}
      <main className="w-full max-w-lg mx-auto p-4 space-y-12">
        
        {/* Home / Hero */}
        <section id="home" className="space-y-6 pt-4">
          <div className="text-center space-y-2">
            <div className="flex justify-center gap-3 mb-6">
              <span className="text-3xl">ॐ</span>
              <span className="text-3xl">🪷</span>
              <span className="text-3xl">ॐ</span>
            </div>
            
            {event.heroSubtitle && (
              <div className="flex items-center justify-center gap-3">
                <div className="h-px w-8 bg-[#cba37b]" />
                <p className="text-sm font-semibold text-[#8a4a2b] tracking-widest">{event.heroSubtitle}</p>
                <div className="h-px w-8 bg-[#cba37b]" />
              </div>
            )}
            
            <h2 className="text-3xl font-bold text-[#cba37b] mt-4 mb-1">{event.title}</h2>
            {event.tagline && <p className="text-sm text-gray-500">{event.tagline}</p>}
          </div>

          <div className="bg-white rounded-3xl p-1 shadow-xl overflow-hidden border-2 border-[#f4ead2]">
            <img 
              src={event.backgroundUrl || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2000&auto=format&fit=crop'} 
              alt="Hero" 
              className="w-full h-auto rounded-2xl object-cover"
            />
          </div>
        </section>

        {/* Our Story (మన కథ) */}
        <section id="story" className="space-y-6">
          <div className="bg-[#f9f1e1] rounded-2xl p-6 shadow-sm border border-[#f0e2c8]">
            <p className="text-[#555] leading-loose text-center text-sm font-medium whitespace-pre-wrap">
              {event.coupleStory || 'మా అనుబంధం పెద్దల ఆశీర్వాదంతో మొదలైన ఒక పవిత్రమైన బంధం...'}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#fcf8f0] rounded-2xl p-5 text-center shadow-sm border border-[#f4ead2]">
              <div className="text-4xl mb-2">🤵</div>
              <p className="text-[10px] font-bold text-[#b4562c] tracking-widest uppercase mb-1">వరుడు • GROOM</p>
              <p className="font-bold text-gray-800 text-sm">{event.groomDetails?.name || 'వంశీ రాజు'}</p>
              {event.groomDetails?.village && <p className="text-xs text-gray-500 mt-1">{event.groomDetails.village}</p>}
            </div>
            <div className="bg-[#fcf8f0] rounded-2xl p-5 text-center shadow-sm border border-[#f4ead2]">
              <div className="text-4xl mb-2">👰</div>
              <p className="text-[10px] font-bold text-[#b4562c] tracking-widest uppercase mb-1">వధువు • BRIDE</p>
              <p className="font-bold text-gray-800 text-sm">{event.brideDetails?.name || 'దివ్య భారతి'}</p>
              {event.brideDetails?.village && <p className="text-xs text-gray-500 mt-1">{event.brideDetails.village}</p>}
            </div>
          </div>
        </section>

        {/* Occasion / Program (కార్యక్రమం) */}
        <section id="program" className="space-y-6 pt-6 border-t border-[#ebdabc]">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-8 bg-[#cba37b]" />
              <p className="text-xs font-bold text-[#b4562c] tracking-widest">వివాహ కార్యక్రమం</p>
              <div className="h-px w-8 bg-[#cba37b]" />
            </div>
            <h2 className="text-2xl font-bold text-[#cba37b]">{event.occasionTitle || 'శుభ కార్యక్రమాలు'}</h2>
            <p className="text-xs text-gray-500 uppercase tracking-widest">{event.occasionSubtitle || 'Wedding Schedule'}</p>
          </div>

          <div className="bg-gradient-to-br from-[#fcf8f0] to-[#f4ead2] rounded-2xl p-6 shadow-md border border-[#ebdabc] text-center">
             <p className="text-xs font-bold text-[#b4562c] tracking-widest uppercase mb-3">✨ శుభ ముహూర్తం • AUSPICIOUS TIME ✨</p>
             <h3 className="text-4xl font-bold text-[#2a5b3a] mb-2">{event.timeFormatted || '10:33 AM'}</h3>
             <p className="text-sm font-semibold text-[#555]">{event.dateFormatted || 'మే 10, 2026'} {event.weddingDayLabel && `• ${event.weddingDayLabel}`}</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f4ead2] space-y-4 text-left">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="bg-[#f9f1e1] p-2 rounded-full text-lg">💒</div>
              <div>
                <p className="font-bold text-[#b4562c] text-sm">శుభ వివాహం</p>
                <p className="text-xs text-gray-400">The Sacred Wedding Ceremony</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-gray-50 p-2 rounded-full text-lg">🏛️</div>
              <div>
                <p className="text-[10px] uppercase text-gray-400 tracking-wider">వేదిక • VENUE</p>
                <p className="font-semibold text-sm text-gray-800">{event.venue}</p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{event.venueAddress}</p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ── BOTTOM NAV (foter.jpg) ── */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-[#fdfaf5] shadow-[0_-5px_20px_rgba(0,0,0,0.05)] border-t-2 border-[#ebdabc]">
        <div className="flex justify-between items-center px-2 py-2 max-w-lg mx-auto">
          {sections.map(s => (
            <a key={s.id} href={`#${s.id}`} className="flex flex-col items-center p-2 text-gray-400 hover:text-[#b4562c] transition-colors">
              <span className="mb-1">{s.icon}</span>
              <span className="text-[9px] font-bold">{s.telugu}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

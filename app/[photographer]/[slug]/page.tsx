'use client';

import { useState } from 'react';
import Head from 'next/head';
import { Share2 } from 'lucide-react';
import ParticleSystem from '@/components/invitation/ParticleSystem';
import CountdownTimer from '@/components/invitation/CountdownTimer';
import WatchLiveModal from '@/components/invitation/WatchLiveModal';
import DetailGrid from '@/components/invitation/DetailGrid';

// Mock event data
const mockEvent = {
  photographerName: 'Aryan Sharma',
  photographerRole: 'Professional Cinematographer',
  photographerInitials: 'AS',
  title: 'Ravi & Meera',
  eventType: 'Wedding Ceremony',
  dateRaw: '2026-05-15T09:00:00Z',
  dateFormatted: '15 MAY 2026',
  timeFormatted: '09:00 AM IST',
  tagline: 'Two souls, one beautiful journey.',
  bodyMessage: 'We solicit your gracious virtual presence as we embark on this beautiful journey of togetherness. Rejoin us from wherever you are to celebrate our love and bless us.',
  venue: 'Lotus Garden Banquet Hall',
  city: 'Mumbai, Maharashtra',
  streamPlatform: 'YouTube Live',
  streamEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  backgroundUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2000&auto=format&fit=crop', // Romantic wedding placeholder
};

export default function InvitationPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2600);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-near-black">
      {/* Background System */}
      <div className="fixed inset-0 z-0">
        <img 
          src={mockEvent.backgroundUrl} 
          alt="Event Background" 
          className="absolute inset-0 w-full h-full object-cover animate-zoom-bg invitation-bg-layer-1"
        />
        <div className="absolute inset-0 invitation-bg-layer-2" />
        <div className="invitation-grain pointer-events-none" />
        <ParticleSystem />
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 flex items-center justify-between px-6 py-4 transition-all duration-300 bg-[#0d0008]/75 backdrop-blur-md border-b border-gold/20">
        <span className="font-cinzel text-[13px] text-gold tracking-[0.2em] uppercase">
          {mockEvent.photographerName}
        </span>
        <div className="flex items-center space-x-2">
          <div className="animate-live-pulse live-pulse-dot" />
          <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-cream">
            Live Now
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-24 pb-32 text-center">
        
        {/* Event Identity Block */}
        <div className="flex flex-col items-center mb-8 animate-fade-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="w-16 h-[1px] bg-gold-light/40 mb-4" />
          <p className="font-sans text-[10px] uppercase text-warm-gray tracking-[0.3em] mb-4">
            You Are Cordially Invited
          </p>
        </div>

        <h1 className="font-serif italic font-light text-6xl md:text-8xl lg:text-[96px] text-gold-light leading-none mb-4 animate-fade-slide-up" style={{ animationDelay: '0.5s' }}>
          {mockEvent.title}
        </h1>

        <p className="font-serif italic text-xl md:text-2xl text-cream/90 mb-10 animate-fade-slide-up" style={{ animationDelay: '0.7s' }}>
          {mockEvent.tagline}
        </p>

        {/* Date & Time Strip */}
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 mb-10 animate-fade-slide-up" style={{ animationDelay: '0.85s' }}>
          <span className="font-cinzel text-lg md:text-xl text-cream tracking-widest">{mockEvent.dateFormatted}</span>
          <span className="hidden md:inline text-gold/30">|</span>
          <span className="font-cinzel text-lg md:text-xl text-cream tracking-widest">{mockEvent.timeFormatted}</span>
        </div>

        {/* Countdown */}
        <div className="mb-12">
          <CountdownTimer targetDate={mockEvent.dateRaw} />
        </div>

        {/* Watch Live CTA */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary rounded-sm px-8 py-4 flex items-center space-x-3 mb-16 animate-fade-slide-up"
          style={{ animationDelay: '1.15s' }}
        >
          <div className="w-2 h-2 rounded-full bg-red-600 animate-live-pulse" />
          <span className="font-cinzel text-[13px] uppercase tracking-[0.22em] font-semibold">
            Watch Live Stream
          </span>
        </button>

        <div className="w-px h-16 bg-gradient-to-b from-gold/30 to-transparent mb-8 animate-fade-slide-up" style={{ animationDelay: '1.3s' }} />

        {/* Details Grid */}
        <DetailGrid 
          venue={mockEvent.venue}
          city={mockEvent.city}
          photographerName={mockEvent.photographerName}
          streamPlatform={mockEvent.streamPlatform}
        />

        {/* Invitation Message */}
        <div className="max-w-2xl mt-16 animate-fade-slide-up" style={{ animationDelay: '1.6s' }}>
          <p className="font-serif italic text-lg md:text-xl text-cream/80 leading-relaxed text-center">
            "{mockEvent.bodyMessage}"
          </p>
        </div>

        {/* Share Section */}
        <div className="mt-12 flex space-x-4 animate-fade-slide-up" style={{ animationDelay: '1.75s' }}>
          <button 
            onClick={handleCopyLink}
            className="flex items-center space-x-2 px-6 py-3 border border-gold/20 rounded-sm hover:bg-gold/10 transition-colors"
          >
            <Share2 size={16} className="text-gold" />
            <span className="font-cinzel text-xs text-cream uppercase tracking-widest">
              {copied ? 'Link Copied' : 'Copy Link'}
            </span>
          </button>
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-gold/10 bg-near-black/50 py-10 px-4 animate-fade-slide-up" style={{ animationDelay: '1.9s' }}>
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between opacity-80 hover:opacity-100 transition-opacity">
          
          <div className="flex items-center space-x-4 mb-6 md:mb-0">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold/40 to-rose/40 border border-gold flex items-center justify-center">
              <span className="font-cinzel text-cream text-sm tracking-wider">{mockEvent.photographerInitials}</span>
            </div>
            <div>
              <p className="font-cinzel text-sm text-gold-light tracking-[0.15em] uppercase">{mockEvent.photographerName}</p>
              <p className="font-sans text-[9px] text-gold/60 uppercase tracking-wider">{mockEvent.photographerRole}</p>
            </div>
          </div>

          <div className="text-center md:text-right">
            <p className="font-sans text-[11px] text-cream/35 hover:text-gold transition-colors mb-2">
              contact@aryansharma.com • +91 98765 43210
            </p>
            <p className="font-sans text-[9px] text-white/15 uppercase tracking-widest mt-4">
              Powered by LiveFrame
            </p>
          </div>
          
        </div>
      </footer>

      {/* Stream Modal */}
      <WatchLiveModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        streamEmbedUrl={mockEvent.streamEmbedUrl} 
      />
    </div>
  );
}

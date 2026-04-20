'use client';

import { useState, useEffect } from 'react';
import { Share2 } from 'lucide-react';
import ParticleSystem from '@/components/invitation/ParticleSystem';
import CountdownTimer from '@/components/invitation/CountdownTimer';
import WatchLiveModal from '@/components/invitation/WatchLiveModal';
import DetailGrid from '@/components/invitation/DetailGrid';
import { OCCASION_PRESETS, type EventData } from '@/lib/occasionPresets';

// Mock event data — will eventually come from Firebase
const mockEvent: EventData = {
  occasionType: 'wedding',
  photographerName: 'Aryan Sharma',
  photographerRole: 'Professional Cinematographer',
  photographerInitials: 'AS',
  title: 'Ravi & Meera',
  eventType: 'Wedding Ceremony',
  dateRaw: '2026-05-15T09:00:00Z',
  dateFormatted: '15 MAY 2026',
  timeFormatted: '09:00 AM IST',
  tagline: 'Two souls, one beautiful journey.',
  bodyMessage: 'We solicit your gracious virtual presence as we embark on this beautiful journey of togetherness. Join us from wherever you are to celebrate our love and bless us.',
  venue: 'Lotus Garden Banquet Hall',
  city: 'Mumbai, Maharashtra',
  streamPlatform: 'YouTube Live',
  streamEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  slug: 'ravi-weds-meera',
  backgroundUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2000&auto=format&fit=crop',
  contactEmail: 'contact@aryansharma.com',
  contactPhone: '+91 98765 43210',
  // Theme (from preset)
  accentColor: '#C9A84C',
  accentColorRgb: '201, 168, 76',
  secondaryColor: '#C2637A',
  secondaryColorRgb: '194, 99, 122',
  particleColors: ['#C9A84C', '#F0D080', '#C2637A'],
  overlayGradient: 'radial-gradient(ellipse at top, rgba(201,168,76,0.15) 0%, transparent 60%), radial-gradient(ellipse at bottom left, rgba(194,99,122,0.2) 0%, transparent 50%)',
};

export default function HomeInvitationPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [event, setEvent] = useState<EventData>(mockEvent);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const loadEvent = () => {
      const storedData = localStorage.getItem('liveframe_mock_event');
      if (storedData) {
        try {
          const parsed = JSON.parse(storedData) as EventData;
          setEvent(parsed);
        } catch (err) {
          console.error('Failed to parse simulated event', err);
        }
      }
    };

    // Initial load
    loadEvent();

    // Re-sync whenever admin publishes (works cross-tab via storage event)
    window.addEventListener('storage', loadEvent);
    return () => window.removeEventListener('storage', loadEvent);
  }, []);

  // Dynamically update the browser tab title, defeating Next.js strict Metadata hydration
  useEffect(() => {
    if (event.title) {
      const newTitle = `${event.title} | ${event.eventType || 'Invitation'}`;
      document.title = newTitle;
      const timeoutId = setTimeout(() => {
        document.title = newTitle;
      }, 150);
      return () => clearTimeout(timeoutId);
    }
  }, [event.title, event.eventType]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2600);
  };

  // Dynamic CSS custom properties driven by the event's theme
  const themeVars = {
    '--theme-accent': event.accentColor,
    '--theme-accent-rgb': event.accentColorRgb,
    '--theme-secondary': event.secondaryColor,
    '--theme-secondary-rgb': event.secondaryColorRgb,
  } as React.CSSProperties;

  // Fallback if local storage payload lacks formatted string
  let displayDate = event.dateFormatted;
  if (!displayDate && event.dateRaw) {
    const d = new Date(event.dateRaw);
    if (!isNaN(d.getTime())) {
      displayDate = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
    }
  }

  if (!isMounted) return null; // Avoid hydration mismatch on dynamic content

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-near-black" style={themeVars}>
      {/* Background System */}
      <div className="fixed inset-0 z-0 bg-[#0d0008]">
        {/* Full Screen Image Coverage */}
        <img
          src={event.backgroundUrl}
          alt="Event Background"
          className="absolute inset-0 w-full h-full object-cover object-center animate-zoom-bg opacity-90"
        />
        
        {/* Layer 3: Legibility Dimming (Decreased severity drastically from 90% combined dim to ~40%) */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Layer 4: Occasion-driven gentle gradient overlay focusing only on styling, dropping the heavy bottom blackout fade to a very soft anchor fade */}
        <div
          className="absolute inset-0"
          style={{
            background: `${event.overlayGradient}, linear-gradient(to bottom, transparent 0%, transparent 60%, rgba(13,0,8,0.7) 100%)`,
          }}
        />
        
        <div className="invitation-grain pointer-events-none opacity-40" />
        <ParticleSystem colors={event.particleColors} />
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-24 pb-32 text-center">

        {/* Event Type Badge */}
        <div className="flex flex-col items-center mb-8 animate-fade-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="w-16 h-[1px] mb-4" style={{ backgroundColor: `rgba(${event.accentColorRgb}, 0.4)` }} />
          <p className="font-sans font-bold text-[10px] uppercase text-warm-gray tracking-[0.3em] mb-1 drop-shadow-sm">
            You Are Cordially Invited
          </p>
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.25em] mt-1 drop-shadow-md" style={{ color: `rgba(${event.accentColorRgb}, 0.8)` }}>
            {event.eventType}
          </p>
        </div>

        <h1 className="font-serif italic font-bold text-5xl sm:text-6xl md:text-8xl lg:text-[96px] leading-[1.1] mb-4 animate-fade-slide-up max-w-[90vw] mx-auto break-words drop-shadow-2xl" style={{ animationDelay: '0.5s', color: `rgba(${event.accentColorRgb}, 0.95)`, textShadow: `0 4px 20px rgba(0,0,0,0.5)` }}>
          {event.title}
        </h1>

        <p className="font-serif italic font-bold text-lg sm:text-xl md:text-2xl text-cream/95 mb-10 animate-fade-slide-up max-w-[90vw] mx-auto drop-shadow-xl" style={{ animationDelay: '0.7s', textShadow: `0 2px 10px rgba(0,0,0,0.6)` }}>
          {event.tagline}
        </p>

        {/* Date & Time */}
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 mb-10 animate-fade-slide-up" style={{ animationDelay: '0.85s' }}>
          <span className="font-cinzel font-bold text-lg md:text-xl text-cream tracking-widest drop-shadow-lg" style={{ textShadow: `0 2px 10px rgba(0,0,0,0.6)` }}>{displayDate}</span>
          <span className="hidden md:inline" style={{ color: `rgba(${event.accentColorRgb}, 0.5)` }}>|</span>
          <span className="font-cinzel font-bold text-lg md:text-xl text-cream tracking-widest drop-shadow-lg" style={{ textShadow: `0 2px 10px rgba(0,0,0,0.6)` }}>{event.timeFormatted}</span>
        </div>

        {/* Countdown */}
        <div className="mb-12">
          <CountdownTimer targetDate={event.dateRaw} accentColor={event.accentColor} accentColorRgb={event.accentColorRgb} />
        </div>

        {/* Watch Live CTA — themed */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-full px-10 py-5 md:px-12 md:py-6 flex items-center shadow-xl border-2 space-x-3 md:space-x-4 mb-16 animate-fade-slide-up relative overflow-hidden transition-all duration-300 hover:scale-105"
          style={{
            animationDelay: '1.15s',
            background: `linear-gradient(135deg, ${event.accentColor}, ${event.secondaryColor})`,
            borderColor: 'rgba(255,255,255,0.2)',
            boxShadow: `0 0 30px rgba(${event.accentColorRgb}, 0.5)`,
            animation: 'buttonFocus 2.5s infinite ease-in-out',
          }}
        >
          <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-600 animate-live-pulse shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
          <span className="font-sans font-bold text-[14px] md:text-[16px] uppercase tracking-[0.25em] text-white drop-shadow-md">
            Watch Live Stream
          </span>
        </button>

        <div className="w-px h-16 mb-8 animate-fade-slide-up" style={{ animationDelay: '1.3s', background: `linear-gradient(to bottom, rgba(${event.accentColorRgb}, 0.3), transparent)` }} />

        {/* Details Grid */}
        <DetailGrid
          venue={event.venue}
          city={event.city}
          photographerName={event.photographerName}
          streamPlatform={event.streamPlatform}
          accentColor={event.accentColor}
          accentColorRgb={event.accentColorRgb}
        />

        {/* Invitation Message */}
        <div className="max-w-2xl mt-16 animate-fade-slide-up" style={{ animationDelay: '1.6s' }}>
          <p className="font-serif italic text-lg md:text-xl text-cream/80 leading-relaxed text-center">
            &ldquo;{event.bodyMessage}&rdquo;
          </p>
        </div>

        {/* Share */}
        <div className="mt-12 flex space-x-4 animate-fade-slide-up" style={{ animationDelay: '1.75s' }}>
          <button
            onClick={handleCopyLink}
            className="flex items-center space-x-2 px-6 py-3 rounded-sm hover:bg-white/5 transition-colors"
            style={{ border: `1px solid rgba(${event.accentColorRgb}, 0.2)` }}
          >
            <Share2 size={16} style={{ color: event.accentColor }} />
            <span className="font-cinzel text-xs text-cream uppercase tracking-widest">
              {copied ? 'Link Copied' : 'Copy Link'}
            </span>
          </button>
        </div>

      </main>



      {/* Stream Modal */}
      <WatchLiveModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        streamEmbedUrl={event.streamEmbedUrl}
      />
    </div>
  );
}

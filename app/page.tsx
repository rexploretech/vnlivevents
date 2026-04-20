'use client';

import { useState, useEffect } from 'react';
import { Share2, MessageSquare, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ParticleSystem from '@/components/invitation/ParticleSystem';
import CountdownTimer from '@/components/invitation/CountdownTimer';
import DetailGrid from '@/components/invitation/DetailGrid';
import AddToCalendar from '@/components/invitation/AddToCalendar';
import AmbientAudio from '@/components/invitation/AmbientAudio';
import { type EventData } from '@/lib/occasionPresets';

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
  accentColor: '#C9A84C',
  accentColorRgb: '201, 168, 76',
  secondaryColor: '#C2637A',
  secondaryColorRgb: '194, 99, 122',
  particleColors: ['#C9A84C', '#F0D080', '#C2637A'],
  overlayGradient: 'radial-gradient(ellipse at top, rgba(201,168,76,0.15) 0%, transparent 60%), radial-gradient(ellipse at bottom left, rgba(194,99,122,0.2) 0%, transparent 50%)',
};

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: "easeOut" }
};

export default function HomeInvitationPage() {
  const [copied, setCopied] = useState(false);
  const [event, setEvent] = useState<EventData>(mockEvent);
  const [guestMessage, setGuestMessage] = useState('');
  const [showGuestbook, setShowGuestbook] = useState(false);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const loadEvent = () => {
      const storedData = localStorage.getItem('liveframe_mock_event');
      if (storedData) {
        try {
          const parsed = JSON.parse(storedData) as EventData;
          setEvent(parsed);
          
          // Check if already live based on initial load
          const target = new Date(parsed.dateRaw);
          if (target.getTime() <= Date.now()) {
            setIsLive(true);
          }
        } catch (err) {
          console.error('Failed to parse simulated event', err);
        }
      } else {
        // Initial load check for default mockEvent
        const target = new Date(mockEvent.dateRaw);
        if (target.getTime() <= Date.now()) {
          setIsLive(true);
        }
      }
    };
    loadEvent();
    window.addEventListener('storage', loadEvent);
    return () => window.removeEventListener('storage', loadEvent);
  }, []);

  useEffect(() => {
    if (event.title) {
      document.title = `${event.title} | ${event.eventType || 'Special Event'}`;
    }
  }, [event.title, event.eventType]);

  const handleShareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: `Join us for the live stream of ${event.title}'s ${event.eventType}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2600);
    }
  };

  const themeVars = {
    '--theme-accent': event.accentColor,
    '--theme-accent-rgb': event.accentColorRgb,
    '--theme-secondary': event.secondaryColor,
    '--theme-secondary-rgb': event.secondaryColorRgb,
  } as React.CSSProperties;

  let displayDate = event.dateFormatted;
  if (!displayDate && event.dateRaw) {
    const d = new Date(event.dateRaw);
    if (!isNaN(d.getTime())) {
      displayDate = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-near-black" style={themeVars}>
      <AmbientAudio accentColor={event.accentColor} />
      
      {/* Background System */}
      <div className="fixed inset-0 z-0 bg-[#0d0008]">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
          src={event.backgroundUrl}
          alt="Event Background"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-80"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div
          className="absolute inset-0"
          style={{
            background: `${event.overlayGradient}, linear-gradient(to bottom, transparent 0%, transparent 60%, rgba(13,0,8,0.7) 100%)`,
          }}
        />
        <div className="invitation-grain pointer-events-none opacity-40" />
        {event.showPetals && <ParticleSystem colors={event.particleColors} />}
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-24 pb-32 text-center">

        {/* Event Type Badge */}
        <motion.div {...fadeInUp} className="flex flex-col items-center mb-8">
          <div className="w-12 h-[2px] mb-6 shadow-[0_0_10px_rgba(var(--theme-accent-rgb),0.5)]" style={{ backgroundColor: `rgba(${event.accentColorRgb}, 0.8)` }} />
          <p className="font-sans font-bold text-[11px] uppercase text-cream tracking-[0.4em] mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            You Are Cordially Invited
          </p>
          <p className="font-sans font-bold text-[12px] uppercase tracking-[0.25em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]" style={{ color: event.accentColor }}>
            {event.eventType}
          </p>
        </motion.div>

        <motion.h1 
          {...fadeInUp}
          transition={{ ...fadeInUp.transition, delay: 0.2 }}
          className="font-serif italic font-bold text-5xl sm:text-6xl md:text-8xl lg:text-[96px] leading-[1.1] mb-4 max-w-[90vw] mx-auto break-words" 
          style={{ color: `rgba(${event.accentColorRgb}, 0.95)`, textShadow: `0 4px 20px rgba(0,0,0,0.5)` }}
        >
          {event.title}
        </motion.h1>

        <motion.p 
          {...fadeInUp}
          transition={{ ...fadeInUp.transition, delay: 0.4 }}
          className="font-serif italic font-bold text-lg sm:text-xl md:text-2xl text-cream/95 mb-10 max-w-[90vw] mx-auto"
        >
          {event.tagline}
        </motion.p>

        {/* Date & Time */}
        <motion.div 
          {...fadeInUp}
          transition={{ ...fadeInUp.transition, delay: 0.5 }}
          className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 mb-10"
        >
          <span className="font-cinzel font-bold text-lg md:text-xl text-cream tracking-widest">{displayDate}</span>
          <span className="hidden md:inline" style={{ color: `rgba(${event.accentColorRgb}, 0.5)` }}>|</span>
          <span className="font-cinzel font-bold text-lg md:text-xl text-cream tracking-widest">{event.timeFormatted}</span>
        </motion.div>

        {/* Countdown */}
        <motion.div 
          {...fadeInUp}
          transition={{ ...fadeInUp.transition, delay: 0.6 }}
          className="mb-12"
        >
          <CountdownTimer 
            targetDate={event.dateRaw} 
            accentColor={event.accentColor} 
            accentColorRgb={event.accentColorRgb}
            onComplete={() => setIsLive(true)} 
          />
        </motion.div>

        {/* Watch Live CTA */}
        <AnimatePresence>
          {isLive && (
            <motion.a
              key="live-button"
              href={event.streamEmbedUrl.includes('youtube.com/embed/') 
                ? event.streamEmbedUrl.replace('youtube.com/embed/', 'youtube.com/watch?v=')
                : event.streamEmbedUrl
              }
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 20 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-full px-8 py-4 md:px-10 md:py-5 flex items-center shadow-xl border-2 space-x-2 md:space-x-3 mb-12 relative overflow-hidden transition-all duration-300 no-underline"
              style={{
                background: `linear-gradient(135deg, ${event.accentColor}, ${event.secondaryColor})`,
                borderColor: 'rgba(255,255,255,0.2)',
                boxShadow: `0 0 30px rgba(${event.accentColorRgb}, 0.5)`,
              }}
            >
              <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-red-600 animate-live-pulse shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
              <span className="font-sans font-bold text-[12px] md:text-[14px] uppercase tracking-[0.25em] text-white drop-shadow-md">
                Watch Live Stream
              </span>
            </motion.a>
          )}
        </AnimatePresence>

        {/* Details Grid */}
        <DetailGrid
          venue={event.venue}
          city={event.city}
          accentColor={event.accentColor}
          accentColorRgb={event.accentColorRgb}
        />

        {/* Invitation Message */}
        <motion.div {...fadeInUp} className="max-w-2xl mt-16">
          <p className="font-serif italic text-lg md:text-xl text-cream/80 leading-relaxed text-center">
            &ldquo;{event.bodyMessage}&rdquo;
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div {...fadeInUp} className="mt-12 flex flex-wrap justify-center gap-4">
          <AddToCalendar 
            title={event.title}
            description={event.tagline}
            location={event.venue}
            startTime={event.dateRaw}
            accentColor={event.accentColor}
          />
          
          <button
            onClick={handleShareLink}
            className="flex items-center space-x-2 px-6 py-3 rounded-sm hover:bg-white/5 transition-colors"
            style={{ border: `1px solid rgba(${event.accentColorRgb}, 0.2)` }}
          >
            <Share2 size={16} style={{ color: event.accentColor }} />
            <span className="font-cinzel text-xs text-cream uppercase tracking-widest">
              {copied ? 'Link Copied' : 'Share Link'}
            </span>
          </button>

          <button
            onClick={() => setShowGuestbook(!showGuestbook)}
            className="flex items-center space-x-2 px-6 py-3 rounded-sm hover:bg-white/5 transition-colors"
            style={{ border: `1px solid rgba(${event.accentColorRgb}, 0.2)` }}
          >
            <MessageSquare size={16} style={{ color: event.accentColor }} />
            <span className="font-cinzel text-xs text-cream uppercase tracking-widest">
              Leave a Blessing
            </span>
          </button>
        </motion.div>

        {/* Guestbook Section (Mock) */}
        <AnimatePresence>
          {showGuestbook && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full max-w-lg mt-12 overflow-hidden"
            >
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-sm">
                <h4 className="font-cinzel text-sm text-gold-light mb-4 uppercase tracking-widest">Guestbook</h4>
                <div className="relative">
                  <textarea
                    value={guestMessage}
                    onChange={(e) => setGuestMessage(e.target.value)}
                    placeholder="Write your blessings here..."
                    className="w-full bg-black/30 border border-white/10 rounded-sm p-4 text-cream text-sm focus:border-gold outline-none h-32 resize-none"
                  />
                  <button 
                    onClick={() => {
                      alert("Blessing sent! (Mock)");
                      setGuestMessage('');
                      setShowGuestbook(false);
                    }}
                    className="absolute bottom-4 right-4 p-2 rounded-full hover:bg-white/5"
                  >
                    <Send size={18} style={{ color: event.accentColor }} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}

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
import { db } from '@/lib/firebase/config';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

// Mock event data — will eventually come from Firebase
const mockEvent: EventData = {
  occasionType: 'wedding',
  photographerName: 'Aryan Sharma',
  photographerRole: 'Professional Cinematographer',
  photographerInitials: 'AS',
  title: 'Mr Bean LIVE 🔴',
  eventType: 'Watch All Episodes - Animated Mr Bean',
  // Uncomment the line below and comment the static date to test the countdown:
  // dateRaw: new Date(Date.now() + 10000).toISOString(),
  dateRaw: '2020-05-15T09:00:00Z',
  dateFormatted: 'LIVE NOW',
  timeFormatted: '24/7',
  tagline: 'എല്ലാ എപ്പിസോഡുകളും കാണൂ',
  bodyMessage: 'Welcome to the 24/7 Mr Bean Live Stream! Enjoy all episodes of Animated Mr Bean.',
  venue: 'YouTube',
  city: 'Global',
  streamPlatform: 'YouTube Live',
  streamEmbedUrl: 'https://www.youtube.com/embed/06dm2HAebC0',
  slug: 'mr-bean-live',
  backgroundUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2000&auto=format&fit=crop',
  contactEmail: 'contact@example.com',
  contactPhone: '+91 98765 43210',
  accentColor: '#C9A84C',
  accentColorRgb: '201, 168, 76',
  secondaryColor: '#C2637A',
  secondaryColorRgb: '194, 99, 122',
  particleColors: ['#C9A84C', '#F0D080', '#C2637A'],
  overlayGradient: 'radial-gradient(ellipse at top, rgba(201,168,76,0.15) 0%, transparent 60%), radial-gradient(ellipse at bottom left, rgba(194,99,122,0.2) 0%, transparent 50%)',
  showPetals: true,
  useCustomThumbnail: false,
};

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: "easeOut" as const }
};

export default function HomeInvitationPage() {
  const [copied, setCopied] = useState(false);
  const [event, setEvent] = useState<EventData>(mockEvent);
  const [guestMessage, setGuestMessage] = useState('');
  const [showGuestbook, setShowGuestbook] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const getEmbedUrlInfo = (inputUrl: string) => {
    let videoId = '';
    let embedUrl = inputUrl;
    
    try {
      // If user pasted an entire iframe string, extract the src attribute
      if (inputUrl.includes('<iframe')) {
        const srcMatch = inputUrl.match(/src=["'](.*?)["']/);
        if (srcMatch && srcMatch[1]) {
          embedUrl = srcMatch[1];
        }
      }

      // Robust YouTube ID extraction
      const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/;
      const match = embedUrl.match(ytRegex);
      
      if (match && match[1]) {
        videoId = match[1];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
    } catch (err) {
      console.error("Error parsing YouTube URL:", err);
    }
    
    // Always return a clean embed URL if we have a videoId
    const finalEmbedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : embedUrl;
    const watchUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : embedUrl;

    return { embedUrl: finalEmbedUrl, videoId, watchUrl };
  };

  const { embedUrl: safeEmbedUrl, videoId, watchUrl } = getEmbedUrlInfo(event.streamEmbedUrl);
  const ytThumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : 'https://images.unsplash.com/photo-1540656041793-27083161304f?w=800&q=80';
  const displayThumbnail = event.useCustomThumbnail ? event.backgroundUrl : ytThumbnail;

  useEffect(() => {
    const fetchLatestEvent = async () => {
      try {
        // Since we didn't have createdAt on some old tests, we'll try to query without orderBy if it fails, or just fetch all and pick one
        // But let's try with orderBy first.
        let q = query(collection(db, 'events'), orderBy('createdAt', 'desc'), limit(1));
        let querySnapshot;
        try {
          querySnapshot = await getDocs(q);
        } catch {
          // If index is missing or query fails, just get any event
          q = query(collection(db, 'events'), limit(1));
          querySnapshot = await getDocs(q);
        }
        
        if (!querySnapshot.empty) {
          const latestEvent = querySnapshot.docs[0].data() as EventData;
          setEvent(latestEvent);
          const target = new Date(latestEvent.dateRaw);
          if (target.getTime() <= Date.now()) {
            setIsLive(true);
          }
        } else {
          // Fallback to mockEvent if no events in DB
          const target = new Date(mockEvent.dateRaw);
          if (target.getTime() <= Date.now()) {
            setIsLive(true);
          }
        }
      } catch (e) {
        console.error("Failed to load latest event:", e);
        // Fallback to mockEvent
        const target = new Date(mockEvent.dateRaw);
        if (target.getTime() <= Date.now()) {
          setIsLive(true);
        }
      }
      setIsLoading(false);
    };

    fetchLatestEvent();
  }, []);

  useEffect(() => {
    if (event.title) {
      document.title = `${event.title} | ${event.eventType || 'Special Event'}`;
    }
  }, [event.title, event.eventType]);

  const eventPermalink = `https://vnlivevents.vercel.app/events/${event.slug}`;

  const handleShareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: `Join us for the live stream of ${event.title}'s ${event.eventType}`,
          url: eventPermalink,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(eventPermalink);
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
        {!isLoading && (
          <motion.img
            initial={{ scale: 1.04, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.72 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            src={event.backgroundUrl}
            alt="Event Background"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div
          className="absolute inset-0"
          style={{
            background: `${event.overlayGradient}, linear-gradient(to bottom, transparent 0%, transparent 60%, rgba(13,0,8,0.7) 100%)`,
          }}
        />
        <div className="invitation-grain pointer-events-none opacity-40" />
        {!isLoading && event.showPetals && <ParticleSystem colors={event.particleColors} />}
      </div>

      {/* Main Content */}
      <AnimatePresence>
        {!isLoading && (
          <motion.main 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-24 pb-32 text-center"
          >

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
          className="font-serif italic font-bold text-5xl sm:text-6xl md:text-8xl lg:text-[96px] leading-[1.1] mb-4 max-w-[90vw] mx-auto wrap-break-word" 
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

        {/* Countdown or Video Player Section */}
        <motion.div 
          {...fadeInUp}
          transition={{ ...fadeInUp.transition, delay: 0.6 }}
          className="mb-12 w-full flex flex-col items-center"
        >
          <AnimatePresence mode="wait">
            {!isLive ? (
              <motion.div
                key="countdown"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
              >
                <CountdownTimer 
                  targetDate={event.dateRaw} 
                  accentColor={event.accentColor} 
                  accentColorRgb={event.accentColorRgb}
                  onComplete={() => {
                    setIsLive(true);
                    setIsPlaying(true);
                  }} 
                />
              </motion.div>
            ) : (
              <motion.div
                key="player"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", duration: 0.8, bounce: 0.3 }}
                className="w-full max-w-4xl mx-auto space-y-4"
              >
                {/* Live Badge */}
                <div className="flex items-center justify-center mb-2">
                  <div className="flex items-center space-x-2 bg-red-600/20 border border-red-500/30 px-4 py-1.5 rounded-full shadow-lg">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-live-pulse" />
                    <span className="text-xs uppercase font-bold tracking-[0.2em] text-red-500">Live Now</span>
                  </div>
                </div>

                {/* Video Preview */}
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 bg-black/60 backdrop-blur-xl group mb-8">
                  {!isPlaying ? (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center cursor-pointer group" onClick={() => setIsPlaying(true)}>
                      <img 
                        src={displayThumbnail} 
                        alt="Video Thumbnail" 
                        className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540656041793-27083161304f?w=800&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500" />
                      
                      {/* Play Button */}
                      <div className="relative z-20 w-20 h-20 bg-red-600/90 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.5)] group-hover:scale-110 group-hover:bg-red-500 transition-all overflow-hidden border border-red-400/30">
                        <svg className="w-10 h-10 text-white ml-2 drop-shadow-md" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      </div>
                    </div>
                  ) : (
                    <iframe
                      src={`${safeEmbedUrl}${safeEmbedUrl.includes('?') ? '&' : '?'}autoplay=1&mute=0&rel=0`}
                      title="Live Stream"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full border-0 animate-in fade-in duration-500 bg-black"
                    />
                  )}
                </div>
                
                {/* External Player Action */}
                <div className="flex flex-wrap justify-center gap-4 pt-4">
                  <motion.a
                    href={watchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="rounded-full px-8 py-4 flex items-center shadow-2xl border border-white/20 space-x-3 transition-all duration-300 no-underline"
                    style={{
                      background: `linear-gradient(135deg, ${event.accentColor}, ${event.secondaryColor})`,
                      boxShadow: `0 10px 30px rgba(${event.accentColorRgb}, 0.4)`,
                    }}
                  >
                    <Share2 size={16} className="text-white" />
                    <span className="font-sans font-bold text-xs uppercase tracking-[0.2em] text-white">
                      Open External Player
                    </span>
                  </motion.a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

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

          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}

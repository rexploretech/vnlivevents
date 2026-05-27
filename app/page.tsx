'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Radio, ArrowRight, Share2, Play, ExternalLink, Camera, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/firebase/config';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { type EventData } from '@/lib/occasionPresets';

interface EventWithId extends EventData {
  id: string;
}

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: 'easeOut' as const },
};

// ── Typing effect hook ──────────────────────────────────────────────
function useTypingEffect(words: string[], speed = 90, pause = 1600) {
  const [display, setDisplay] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplay(current.slice(0, charIdx + 1));
        if (charIdx + 1 === current.length) {
          setTimeout(() => setDeleting(true), pause);
        } else {
          setCharIdx(c => c + 1);
        }
      } else {
        setDisplay(current.slice(0, charIdx - 1));
        if (charIdx - 1 === 0) {
          setDeleting(false);
          setWordIdx(w => (w + 1) % words.length);
          setCharIdx(0);
        } else {
          setCharIdx(c => c - 1);
        }
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return display;
}

export default function HomePage() {
  const [events, setEvents] = useState<EventWithId[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [now, setNow] = useState(Date.now());

  const typedWord = useTypingEffect([
    'Weddings',
    'Half Sarees',
    'Birthdays',
    'Engagements',
    'Baby Showers',
    'Anniversaries',
  ]);

  // Tick every second for live badge accuracy
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        let snap;
        try {
          snap = await getDocs(query(collection(db, 'events'), orderBy('createdAt', 'desc')));
        } catch {
          snap = await getDocs(collection(db, 'events'));
        }
        const list: EventWithId[] = snap.docs.map(d => ({ id: d.id, ...(d.data() as EventData) }));
        setEvents(list);
      } catch (e) {
        console.error('Failed to load events:', e);
      }
      setEventsLoading(false);
    };
    fetchEvents();
  }, []);

  const liveEvents = events.filter(e => new Date(e.dateRaw).getTime() <= now);
  const upcomingEvents = events.filter(e => new Date(e.dateRaw).getTime() > now);

  return (
    <div className="min-h-screen bg-[#0d0008] text-[#FDF6E3] font-sans overflow-x-hidden">

      {/* ── NAV ──────────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-12 h-16 bg-[#0d0008]/80 backdrop-blur-md border-b border-white/5">
        <span className="font-cinzel text-[#C9A84C] text-lg tracking-widest uppercase">VNLIVEVENTS</span>
        <div className="hidden md:flex items-center space-x-8 text-xs uppercase tracking-widest text-white/50">
          <a href="#lives" className="hover:text-[#C9A84C] transition-colors">Lives</a>
          <a href="#portfolio" className="hover:text-[#C9A84C] transition-colors">Portfolio</a>
          <a href="#contact" className="hover:text-[#C9A84C] transition-colors">Contact</a>
        </div>
        <Link
          href="/admin/events/new"
          className="text-xs uppercase tracking-widest border border-[#C9A84C]/30 text-[#C9A84C] px-4 py-2 rounded-sm hover:bg-[#C9A84C]/10 transition-colors"
        >
          Admin
        </Link>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-6 overflow-hidden">
        {/* Background glow blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#C9A84C]/8 blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#C2637A]/6 blur-[100px]" />
        </div>

        {/* Thin top rule */}
        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 0.2 }}
          className="w-24 h-px bg-[#C9A84C]/60 mb-10"
        />

        <motion.p
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.1 }}
          className="text-xs uppercase tracking-[0.4em] text-[#C9A84C] mb-5"
        >
          Cinematic Photography & Live Streaming
        </motion.p>

        <motion.h1
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.2 }}
          className="font-serif italic text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.08] mb-6 text-[#FDF6E3]"
          style={{ textShadow: '0 4px 30px rgba(201,168,76,0.2)' }}
        >
          Capturing your<br />
          <span style={{ color: '#C9A84C' }}>{typedWord}</span>
          <span className="inline-block w-[2px] h-[0.85em] bg-[#C9A84C] ml-1 align-middle animate-pulse" />
        </motion.h1>

        <motion.p
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.35 }}
          className="max-w-xl text-white/50 text-base md:text-lg leading-relaxed mb-12"
        >
          Professional cinematography with real-time live streaming — so every family member, near or far, feels present.
        </motion.p>

        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <a
            href="#lives"
            className="flex items-center space-x-2 px-7 py-3.5 rounded-sm text-sm font-semibold uppercase tracking-widest transition-all"
            style={{ background: 'linear-gradient(135deg,#C9A84C,#C2637A)', color: '#0d0008' }}
          >
            <Radio size={15} />
            <span>View Live Events</span>
          </a>
          <a
            href="#portfolio"
            className="flex items-center space-x-2 px-7 py-3.5 rounded-sm text-sm font-semibold uppercase tracking-widest border border-white/15 text-white/70 hover:border-[#C9A84C]/50 hover:text-[#C9A84C] transition-all"
          >
            <Camera size={15} />
            <span>Portfolio</span>
          </a>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 flex flex-col items-center text-white/20"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] mb-2">Scroll</span>
          <ChevronDown size={16} className="animate-bounce" />
        </motion.div>
      </section>

      {/* ── LIVE EVENTS ──────────────────────────────────────────── */}
      <section id="lives" className="relative px-6 md:px-12 py-24 max-w-6xl mx-auto">
        <SectionHeading eyebrow="Live Streams" title="Events" />

        {eventsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-56 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="mt-12 text-center border border-white/5 rounded-xl p-16 text-white/30">
            <Radio size={40} className="mx-auto mb-4 opacity-30" />
            <p className="font-cinzel uppercase tracking-widest text-sm">No events yet</p>
          </div>
        ) : (
          <div className="mt-12 space-y-10">
            {/* Live Now */}
            {liveEvents.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-red-400 flex items-center gap-2 mb-5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block" />
                  Live Now
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {liveEvents.map(event => (
                    <EventCard key={event.id} event={event} isLive />
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming */}
            {upcomingEvents.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#C9A84C]/70 flex items-center gap-2 mb-5">
                  <Calendar size={12} />
                  Upcoming
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {upcomingEvents.map(event => (
                    <EventCard key={event.id} event={event} isLive={false} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── PORTFOLIO ────────────────────────────────────────────── */}
      <section id="portfolio" className="relative px-6 md:px-12 py-24 max-w-6xl mx-auto">
        <SectionHeading eyebrow="Our Work" title="Portfolio" />

        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {PORTFOLIO_ITEMS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className={`relative overflow-hidden rounded-xl group cursor-pointer ${item.tall ? 'row-span-2' : ''}`}
              style={{ aspectRatio: item.tall ? undefined : '4/3' }}
            >
              <img
                src={item.src}
                alt={item.label}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#C9A84C]">{item.type}</p>
                  <p className="text-sm font-semibold text-white">{item.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── ABOUT STRIP ──────────────────────────────────────────── */}
      <section className="border-y border-white/5 py-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-xs uppercase tracking-[0.35em] text-[#C9A84C] mb-4">About Us</p>
            <h2 className="font-serif italic text-4xl md:text-5xl font-bold text-[#FDF6E3] mb-6 leading-tight">
              Every frame tells<br />a story
            </h2>
            <p className="text-white/50 leading-relaxed mb-6">
              We are a dedicated team of cinematographers based in Kerala, specialising in weddings, ceremonies, and family celebrations. With over 500 events captured, we bring cinematic quality and live streaming technology together so no moment goes unseen.
            </p>
            <div className="grid grid-cols-3 gap-6">
              {[['500+', 'Events'], ['10+', 'Years'], ['50K+', 'Viewers']].map(([num, label]) => (
                <div key={label}>
                  <p className="font-cinzel text-2xl text-[#C9A84C]">{num}</p>
                  <p className="text-xs uppercase tracking-widest text-white/40 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative rounded-2xl overflow-hidden"
            style={{ aspectRatio: '4/3' }}
          >
            <img
              src="https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1200&auto=format&fit=crop"
              alt="Photographer at work"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#C9A84C]/20 via-transparent to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* ── CONTACT / FOOTER ─────────────────────────────────────── */}
      <footer id="contact" className="px-6 md:px-12 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.35em] text-[#C9A84C] mb-4">Get In Touch</p>
          <h2 className="font-serif italic text-4xl md:text-5xl font-bold text-[#FDF6E3] mb-6">Book Your Event</h2>
          <p className="text-white/40 max-w-md mx-auto mb-6">
            Planning a wedding, ceremony, or celebration? Let&apos;s create something beautiful together.
          </p>

          {/* Phone / WhatsApp number */}
          <a
            href="tel:+919963948386"
            className="inline-flex items-center gap-2 mb-8 text-[#C9A84C] hover:text-[#FDF6E3] transition-colors text-lg font-semibold tracking-wide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.63 3.37 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 5.63 5.63l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            +91 9963948386
          </a>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/919963948386"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-8 py-4 rounded-sm text-sm font-semibold uppercase tracking-widest transition-all"
              style={{ background: 'linear-gradient(135deg,#25D366,#128C7E)', color: '#fff' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              <span>WhatsApp Us</span>
            </a>
            <a
              href="mailto:contact@vnliveevents.com"
              className="inline-flex items-center space-x-2 px-8 py-4 rounded-sm text-sm font-semibold uppercase tracking-widest border border-white/15 text-white/70 hover:border-[#C9A84C]/50 hover:text-[#C9A84C] transition-all"
            >
              <span>Send Email</span>
              <ArrowRight size={15} />
            </a>
          </div>
        </div>

        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="font-cinzel text-[#C9A84C] text-lg tracking-widest uppercase">VNLIVEVENTS</span>
          <div className="flex items-center space-x-6">
            <a href="#" aria-label="Instagram" className="text-white/30 hover:text-[#C9A84C] transition-colors"><Share2 size={18} /></a>
            <a href="#" className="text-white/30 hover:text-[#C9A84C] transition-colors"><Play size={18} /></a>
          </div>
          <p className="text-xs text-white/20 uppercase tracking-widest">© 2026 VNLIVEVENTS</p>
        </div>
      </footer>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
    >
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-[#C9A84C] mb-2">{eyebrow}</p>
        <h2 className="font-serif italic text-4xl md:text-5xl font-bold text-[#FDF6E3]">{title}</h2>
      </div>
      <Link
        href="/admin/events"
        className="hidden sm:flex items-center space-x-2 text-xs uppercase tracking-widest text-white/30 hover:text-[#C9A84C] transition-colors"
      >
        <span>Manage</span>
        <ArrowRight size={12} />
      </Link>
    </motion.div>
  );
}

function EventCard({ event, isLive }: { event: EventWithId; isLive: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative rounded-xl overflow-hidden border border-white/8 bg-white/3 hover:border-white/15 transition-all duration-300"
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video overflow-hidden">
        <img
          src={event.backgroundUrl || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop'}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70"
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0008] via-[#0d0008]/20 to-transparent" />

        {/* Live / upcoming pill */}
        <div className="absolute top-3 left-3">
          {isLive ? (
            <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-red-400 bg-red-500/15 border border-red-500/30 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Live
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full border"
              style={{ color: event.accentColor || '#C9A84C', borderColor: `${event.accentColor || '#C9A84C'}40`, backgroundColor: `${event.accentColor || '#C9A84C'}12` }}>
              <Calendar size={9} />
              Upcoming
            </span>
          )}
        </div>

        {/* Play icon overlay */}
        <Link href={`/${event.slug}`} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          </div>
        </Link>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: event.accentColor || '#C9A84C' }}>{event.occasionType}</p>
        <h3 className="font-serif italic text-lg font-semibold text-[#FDF6E3] leading-tight mb-1 line-clamp-1">{event.title}</h3>
        <p className="text-xs text-white/40 mb-4">{event.dateFormatted} · {event.venue}</p>
        <Link
          href={`/${event.slug}`}
          className="flex items-center space-x-1.5 text-[11px] uppercase tracking-widest font-semibold transition-colors"
          style={{ color: event.accentColor || '#C9A84C' }}
        >
          <span>{isLive ? 'Watch Now' : 'View Invite'}</span>
          <ExternalLink size={10} />
        </Link>
      </div>
    </motion.div>
  );
}

// ── Static portfolio items (using free Unsplash images) ─────────────
const PORTFOLIO_ITEMS = [
  { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop', label: 'Ananya & Rohan', type: 'Wedding', tall: false },
  { src: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=800&auto=format&fit=crop', label: 'Bridal Ceremony', type: 'Wedding', tall: true },
  { src: 'https://images.unsplash.com/photo-1601979031925-424e53b6caaa?q=80&w=800&auto=format&fit=crop', label: "Priya's Half Saree", type: 'Half Saree', tall: false },
  { src: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800&auto=format&fit=crop', label: 'Little Star Celebration', type: 'Birthday', tall: false },
  { src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop', label: 'Kiran & Priya', type: 'Engagement', tall: false },
  { src: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop', label: 'New Beginnings', type: 'Housewarming', tall: false },
];

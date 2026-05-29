'use client';

import { useState } from 'react';
import {
  Upload, Eye, Plus, Trash2, Globe, Video, Image as ImageIcon,
  Users, BookOpen, CalendarDays, Camera, Phone, Home, LayoutGrid, MapPin,
} from 'lucide-react';
import Link from 'next/link';
import { db, storage } from '@/lib/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import Template2Renderer from '@/components/template2/Template2Renderer';
import { type EventData } from '@/lib/occasionPresets';

// ── helpers ────────────────────────────────────────────────────────────────
function hexToRgbStr(hex: string) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? `${parseInt(r[1], 16)}, ${parseInt(r[2], 16)}, ${parseInt(r[3], 16)}` : '201, 168, 76';
}
function randomSlug(len = 7) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

// Journey milestones (మన యాత్ర — Our Journey) from "my story" screen
interface JourneyItem { icon: string; teluguTitle: string; englishTitle: string; description: string; }

// ── component ──────────────────────────────────────────────────────────────
export default function NewEventTemplate2Page() {
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // ── images ──────────────────────────────────────────────────────────────
  type ImgState = { file: File | null; preview: string | null; url: string };
  const initImg = (): ImgState => ({ file: null, preview: null, url: '' });

  const [heroBg,    setHeroBg]    = useState<ImgState>(initImg());
  const [brideImg,  setBrideImg]  = useState<ImgState>(initImg());
  const [groomImg,  setGroomImg]  = useState<ImgState>(initImg());
  const [coupleImg, setCoupleImg] = useState<ImgState>(initImg()); // "my story" couple photo


  // gallery photos
  const [gallerySlots, setGallerySlots] = useState<ImgState[]>([initImg(), initImg(), initImg()]);

  // ── form state ───────────────────────────────────────────────────────────
  // ★ Fields are entered ONCE and reused across sections that share them
  const [form, setForm] = useState({
    // ─ Shared: shown in Home hero, My Story header, Contact header
    coupleNames: '',          // e.g. "వంశీ రాజు & దివ్య భారతి"
    coupleNamesEn: '',        // English fallback
    slug: '',
    accentColor: '#C9A84C',
    secondaryColor: '#C2637A',
    showPetals: true,

    // ─ Shared: shown in Occasion (large time) + Contact header + Home
    weddingDate: '',          // YYYY-MM-DD
    muhurthamTime: '',        // HH:MM  — shown big on Occasion page

    // ─ Shared: shown in Occasion card + Contact venue card
    venueName: '',            // e.g. "SS కన్వెన్షన్ ఫంక్షన్ హాల్"
    venueAddress: '',         // full address — used in Occasion & Contact Google Maps card
    venueMapLink: '',         // Google Maps URL (🗺 button)

    // ─ Groom's Residence (only on Occasion screen — వరుడి స్వగ్రహం)
    groomResidenceName: '',   // e.g. "Santhosham Nilayam"
    groomResidenceAddress: '',
    groomResidenceMapLink: '',

    // ─ Shared: Groom card in My Story + Contact
    groomName: '',            // e.g. "వంశీ రాజు"
    groomVillage: '',         // e.g. "Kondaparva Village"
    groomParents: '',         // e.g. "S/o అడిమేళ్లి వర్రుప్రసాద్"
    groomFatherName: '',
    groomMotherName: '',
    groomFatherPhone: '',

    // ─ Shared: Bride card in My Story + Contact
    brideName: '',            // e.g. "దివ్య భారతి"
    brideVillage: '',         // e.g. "T.Gokavaram Village"
    brideParents: '',
    brideGrandfatherName: '', // తాత
    brideGrandmotherName: '', // నాన్నమ్మ

    // ─ My Story only
    coupleStory: '',          // story paragraph text
    heroSubtitle: '',         // "మన అనుబంధం" style subtitle
    tagline: '',              // italic caption under section title

    // ─ Occasion only
    occasionTitle: 'శుభ కార్యక్రమాలు',
    occasionSubtitle: 'Wedding Schedule',

    // ─ Contact only
    contactPhone: '',
    contactWhatsapp: '',
    contactEmail: '',
    additionalContact1Name: '', additionalContact1Role: '', additionalContact1Phone: '',
    additionalContact2Name: '', additionalContact2Role: '', additionalContact2Phone: '',

    // ─ Live Stream (used on Home / Occasion tab)
    streamPlatform: 'YouTube Live',
    streamEmbedUrl: '',
  });

  const up = (k: string, v: unknown) => setForm(p => ({ ...p, [k]: v }));

  // Journey milestones (మన యాత్ర) — My Story section
  const [journeyItems, setJourneyItems] = useState<JourneyItem[]>([
    { icon: '🔔', teluguTitle: 'మొదటి కలయిక', englishTitle: 'First Meeting',  description: '' },
    { icon: '🌸', teluguTitle: 'నిశ్చితార్థం', englishTitle: 'Engagement',      description: '' },
    { icon: '🔥', teluguTitle: 'శుభవివాహం',   englishTitle: 'The Wedding',      description: '' },
  ]);
  const updateJourney = (i: number, k: keyof JourneyItem, v: string) =>
    setJourneyItems(p => p.map((x, idx) => idx === i ? { ...x, [k]: v } : x));
  const addJourney    = () => setJourneyItems(p => [...p, { icon: '🌺', teluguTitle: '', englishTitle: '', description: '' }]);
  const removeJourney = (i: number) => setJourneyItems(p => p.filter((_, idx) => idx !== i));

  // Program events
  interface ProgEvent { name: string; date: string; time: string; venue: string; description: string; }
  const [programEvents, setProgramEvents] = useState<ProgEvent[]>([
    { name: 'శుభ వివాహం', date: '', time: '', venue: '', description: 'The Sacred Wedding Ceremony' },
  ]);
  const updateProg = (i: number, k: keyof ProgEvent, v: string) =>
    setProgramEvents(p => p.map((x, idx) => idx === i ? { ...x, [k]: v } : x));
  const addProg    = () => setProgramEvents(p => [...p, { name: '', date: '', time: '', venue: '', description: '' }]);
  const removeProg = (i: number) => setProgramEvents(p => p.filter((_, idx) => idx !== i));

  // ── image state helpers ──────────────────────────────────────────────────
  const setImgFile = (setter: (s: ImgState) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setter({ file, url: '', preview: reader.result as string });
    reader.readAsDataURL(file);
  };
  const setImgUrl = (setter: (s: ImgState) => void) => (url: string) =>
    setter({ file: null, url, preview: url || null });


  // gallery
  const setGalleryFile = (i: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setGallerySlots(p => p.map((s, idx) => idx === i ? { file, url: '', preview: reader.result as string } : s));
    reader.readAsDataURL(file);
  };
  const setGalleryUrl = (i: number, url: string) =>
    setGallerySlots(p => p.map((s, idx) => idx === i ? { file: null, url, preview: url || null } : s));

  // ── upload helper ─────────────────────────────────────────────────────────
  async function uploadImg(s: ImgState, prefix: string): Promise<string> {
    if (s.url) return s.url;
    if (s.file) {
      const r = ref(storage, `events/${Date.now()}_${prefix}_${s.file.name}`);
      await uploadBytes(r, s.file);
      return getDownloadURL(r);
    }
    return '';
  }

  // ── publish ───────────────────────────────────────────────────────────────
  const handlePublish = async () => {
    if (!form.coupleNames) { alert('Please enter the couple names.'); return; }
    setIsPublishing(true);
    try {
      const accentRgb    = hexToRgbStr(form.accentColor);
      const secondaryRgb = hexToRgbStr(form.secondaryColor);
      let dateFormatted = '';
      if (form.weddingDate) {
        const [y, m, d] = form.weddingDate.split('-');
        const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
        dateFormatted = `${d} ${months[parseInt(m) - 1]} ${y}`;
      }
      const slug = form.slug || randomSlug();

      // Upload all images
      const [bgFinal, brideFinal, groomFinal, coupleFinal] = await Promise.all([
        uploadImg(heroBg, 'bg'),
        uploadImg(brideImg, 'bride'), uploadImg(groomImg, 'groom'), uploadImg(coupleImg, 'couple'),
      ]);

      const galleryUrls = (await Promise.all(gallerySlots.map((s, i) => uploadImg(s, `gallery${i}`)))).filter(Boolean);

      const doc = {
        templateType: 'template2',
        occasionType: 'wedding',
        // Shared fields (used in multiple sections)
        title: form.coupleNames,
        coupleNamesEn: form.coupleNamesEn,
        slug,
        heroSubtitle: form.heroSubtitle,
        tagline: form.tagline,
        dateRaw: form.weddingDate ? `${form.weddingDate}T${form.muhurthamTime || '00:00'}:00` : '',
        dateFormatted,
        timeFormatted: form.muhurthamTime,
        venue: form.venueName,
        venueAddress: form.venueAddress,
        venueMapLink: form.venueMapLink,
        groomResidence: {
          name:    form.groomResidenceName,
          address: form.groomResidenceAddress,
          mapLink: form.groomResidenceMapLink,
        },
        // Occasion
        occasionTitle:    form.occasionTitle,
        occasionSubtitle: form.occasionSubtitle,
        programEvents,
        // My Story
        coupleStory: form.coupleStory,
        bodyMessage:  form.coupleStory,
        journeyItems,
        couplePhotoUrl: coupleFinal,
        // People
        brideDetails: {
          name: form.brideName, village: form.brideVillage,
          parentNames: form.brideParents, photoUrl: brideFinal,
          grandfatherName: form.brideGrandfatherName,
          grandmotherName: form.brideGrandmotherName,
        },
        groomDetails: {
          name: form.groomName, village: form.groomVillage,
          parentNames: form.groomParents, photoUrl: groomFinal,
          fatherName: form.groomFatherName, motherName: form.groomMotherName,
          fatherPhone: form.groomFatherPhone,
        },
        // Gallery
        galleryUrls,
        // Stream
        streamPlatform: form.streamPlatform,
        streamEmbedUrl: form.streamEmbedUrl,
        eventType: 'Wedding Ceremony',
        // Contact
        contactPhone: form.contactPhone,
        contactWhatsapp: form.contactWhatsapp,
        contactEmail: form.contactEmail,
        additionalContacts: [
          { name: form.additionalContact1Name, role: form.additionalContact1Role, phone: form.additionalContact1Phone },
          { name: form.additionalContact2Name, role: form.additionalContact2Role, phone: form.additionalContact2Phone },
        ].filter(c => c.name || c.phone),
        // Visuals
        backgroundUrl: bgFinal || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2000&auto=format&fit=crop',
        accentColor: form.accentColor, accentColorRgb: accentRgb,
        secondaryColor: form.secondaryColor, secondaryColorRgb: secondaryRgb,
        particleColors: [form.accentColor, form.secondaryColor, '#ffffff'],
        overlayGradient: `radial-gradient(ellipse at top, rgba(${accentRgb},0.18) 0%, transparent 60%), radial-gradient(ellipse at bottom left, rgba(${secondaryRgb},0.15) 0%, transparent 50%)`,
        showPetals: form.showPetals,
        photographerName: '', photographerRole: '', photographerInitials: '',
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'events'), doc);
      alert('✅ Template 2 event published!');
      router.push('/admin/events');
    } catch (e: unknown) {
      const err = e as { code?: string };
      alert(err.code === 'permission-denied'
        ? 'Publish failed — permission denied. Check Firebase Security Rules.'
        : 'Publish failed. Check console for details.');
      console.error(e);
    } finally {
      setIsPublishing(false);
    }
  };

  // ── shared styles ─────────────────────────────────────────────────────────
  const inp  = 'w-full bg-[#0d0008] border border-gold/20 rounded-sm p-3 text-cream focus:border-gold outline-none transition-colors text-sm';
  const lbl  = 'text-xs uppercase tracking-wider text-warm-gray block mb-1';
  const card = 'bg-[#1a0a14] border border-gold/10 p-6 rounded-sm';

  // ── reusable image widget ──────────────────────────────────────────────────
  function ImgField({ label: fl, state, onUrl, onFile, hint, compact }:
    { label: string; state: ImgState; onUrl: (v: string) => void; onFile: (e: React.ChangeEvent<HTMLInputElement>) => void; hint?: string; compact?: boolean }) {
    return (
      <div className="space-y-2">
        <p className={lbl}>{fl}</p>
        {hint && <p className="text-[10px] text-cream/35 -mt-1">{hint}</p>}
        <input type="url" placeholder="Paste image URL…" value={state.url} onChange={e => onUrl(e.target.value)} className={inp} />
        <div className="flex items-center gap-2"><div className="flex-1 h-px bg-gold/10"/><span className="text-[9px] text-cream/25 uppercase">or upload</span><div className="flex-1 h-px bg-gold/10"/></div>
        <div className={`relative border-2 border-dashed border-gold/20 rounded-sm ${compact ? 'h-20' : 'h-28'} flex flex-col items-center justify-center cursor-pointer hover:bg-gold/5 hover:border-gold/35 transition-colors overflow-hidden`}>
          <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30" onChange={onFile} />
          {state.preview && <img src={state.preview} alt="" className="absolute inset-0 w-full h-full object-cover opacity-100 z-0" />}
          <div className="relative z-10 flex flex-col items-center bg-black/60 px-3 py-1.5 rounded-sm backdrop-blur-sm">
            <Upload className="text-gold mb-1" size={16} />
            <p className="text-[10px] text-cream font-medium drop-shadow-md">{state.preview ? 'Replace Image' : 'Click or drop'}</p>
          </div>
        </div>
      </div>
    );
  }

  // ── section badge ────────────────────────────────────────────────────────
  function SectionNote({ used }: { used: string[] }) {
    return (
      <p className="text-[10px] text-cream/30 flex flex-wrap gap-1 mt-1">
        <span className="text-cream/20">Used in:</span>
        {used.map(u => <span key={u} className="bg-gold/10 text-gold/60 px-1.5 py-0.5 rounded text-[9px] font-cinzel uppercase tracking-widest">{u}</span>)}
      </p>
    );
  }

  const checklist: [string, boolean][] = [
    ['Couple Names',     !!form.coupleNames],
    ['Wedding Date',     !!form.weddingDate],
    ['Muhurtham Time',   !!form.muhurthamTime],
    ['Venue Name',       !!form.venueName],
    ['Venue Address',    !!form.venueAddress],
    ['Bride Name',       !!form.brideName],
    ['Groom Name',       !!form.groomName],
    ['Couple Story',     !!form.coupleStory],
    ['Journey (≥1)',     journeyItems.some(j => j.description)],
    ['Program (≥1)',     programEvents.some(e => e.name)],
    ['Gallery (≥1)',     gallerySlots.some(s => s.preview)],
    ['WhatsApp / Call',  !!(form.contactWhatsapp || form.contactPhone)],
  ];

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Template Selector */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-cream/40 mb-3">Choose Invitation Template</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/admin/events/new/template1"
            className="flex items-start gap-4 p-4 rounded-lg border-2 border-gold/15 bg-[#0d0008] hover:border-gold/40 hover:bg-gold/5 transition-all group">
            <div className="w-10 h-10 rounded-md bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-gold/10 transition-colors">
              <Video size={20} className="text-cream/40 group-hover:text-gold transition-colors" />
            </div>
            <div>
              <p className="font-cinzel text-sm text-cream/50 group-hover:text-gold uppercase tracking-wider mb-0.5 transition-colors">Template 1</p>
              <p className="font-sans text-xs text-cream/40 leading-snug">Cinematic live-stream invitation with countdown &amp; particles.</p>
            </div>
          </Link>
          <div className="relative flex items-start gap-4 p-4 rounded-lg border-2 border-gold bg-gold/10 shadow-[0_0_24px_rgba(201,168,76,0.2)] cursor-default">
            <div className="w-10 h-10 rounded-md bg-gold/20 flex items-center justify-center shrink-0"><Globe size={20} className="text-gold" /></div>
            <div>
              <p className="font-cinzel text-sm text-gold uppercase tracking-wider mb-0.5">Template 2</p>
              <p className="font-sans text-xs text-cream/60 leading-snug">Telugu multi-section wedding website.</p>
            </div>
            <span className="absolute top-3 right-3 text-[9px] uppercase tracking-widest font-bold bg-gold text-[#1a0a14] px-2 py-0.5 rounded-full">Active</span>
          </div>
        </div>
      </div>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h2 className="font-cinzel text-2xl md:text-3xl text-gold-light mb-1">Create Telugu Wedding Site</h2>
          <p className="font-sans text-sm text-cream/60">Fields shared across sections are entered once.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowPreview(true)} className="flex items-center gap-2 border border-gold/20 px-4 py-2.5 rounded-sm hover:bg-gold/10 transition-colors">
            <Eye size={16} className="text-gold" /><span className="font-sans text-cream text-sm">Live Preview</span>
          </button>
          <button onClick={handlePublish} disabled={isPublishing}
            className="bg-gold text-[#1a0a14] font-cinzel px-6 py-2.5 rounded-sm uppercase tracking-wider text-sm hover:bg-gold-light transition-colors disabled:opacity-50">
            {isPublishing ? 'Publishing…' : 'Publish Event'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ══════════════════════════════════════════
            LEFT — 2/3 Form
        ══════════════════════════════════════════ */}
        <div className="lg:col-span-2 space-y-6">

          {/* ────────────────────────────────────────
              SHARED DETAILS (entered once, shown everywhere)
          ──────────────────────────────────────── */}
          <div className={`${card} space-y-5`}>
            <div className="flex items-center gap-2 border-b border-gold/10 pb-2">
              <Users size={16} className="text-gold" />
              <div>
                <h3 className="font-cinzel text-lg text-gold">Shared Details</h3>
                <p className="text-[10px] text-cream/35">These fields appear across multiple sections — enter once.</p>
              </div>
            </div>

            {/* Couple names */}
            <div className="space-y-1">
              <label className={lbl}>Couple Names (Telugu)</label>
              <SectionNote used={['Home', 'My Story', 'Contact']} />
              <input type="text" placeholder="వంశీ రాజు &amp; దివ్య భారతి" className={inp}
                value={form.coupleNames} onChange={e => up('coupleNames', e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className={lbl}>Couple Names (English, optional)</label>
              <input type="text" placeholder="Vamsi Raju &amp; Divya Bharathi" className={inp}
                value={form.coupleNamesEn} onChange={e => up('coupleNamesEn', e.target.value)} />
            </div>

            {/* Date + Time + Day */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className={lbl}>Wedding Date</label>
                <SectionNote used={['Home', 'Occasion', 'Contact']} />
                <input type="date" className={inp} value={form.weddingDate} onChange={e => up('weddingDate', e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className={lbl}>Muhurtham Time</label>
                <SectionNote used={['Occasion big display', 'Contact']} />
                <input type="time" className={inp} value={form.muhurthamTime} onChange={e => up('muhurthamTime', e.target.value)} />
              </div>
            </div>

            {/* Venue (shared: Occasion card + Contact venue card) */}
            <div className="space-y-3 bg-[#0d0008] border border-gold/10 rounded-sm p-4">
              <p className="font-cinzel text-xs text-gold/70 uppercase tracking-wider">📍 Venue &amp; Location</p>
              <SectionNote used={['Occasion', 'Contact']} />
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className={lbl}>Venue / Mandapam Name</label>
                  <input type="text" placeholder="SS కన్వెన్షన్ ఫంక్షన్ హాల్" className={inp}
                    value={form.venueName} onChange={e => up('venueName', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className={lbl}>Full Address</label>
                  <textarea rows={2} placeholder="Kondaparva Village (Chittapur Road), Vissannapeta Mandal, NTR Dist 521213"
                    className={`${inp} resize-none`} value={form.venueAddress} onChange={e => up('venueAddress', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className={lbl}>Google Maps Link (🗺 button)</label>
                  <input type="url" placeholder="https://maps.google.com/…" className={inp}
                    value={form.venueMapLink} onChange={e => up('venueMapLink', e.target.value)} />
                </div>
              </div>
            </div>

            {/* Custom slug */}
            <div className="space-y-1">
              <label className={lbl}>Custom URL Slug (optional)</label>
              <input type="text" placeholder="vamsi-weds-divya" className={inp}
                value={form.slug} onChange={e => up('slug', e.target.value)} />
            </div>
          </div>

          {/* ────────────────────────────────────────
              BRIDE & GROOM  (My Story cards + Contact cards)
          ──────────────────────────────────────── */}
          <div className={`${card} space-y-5`}>
            <div className="flex items-center gap-2 border-b border-gold/10 pb-2">
              <Users size={16} className="text-gold" />
              <div>
                <h3 className="font-cinzel text-lg text-gold">Bride &amp; Groom</h3>
                <SectionNote used={['My Story', 'Contact']} />
              </div>
            </div>

            {/* Groom */}
            <div className="bg-[#0d0008] border border-gold/10 rounded-sm p-4 space-y-3">
              <p className="font-cinzel text-xs text-gold/70 uppercase tracking-wider">🤵 వరుడు — Groom</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className={lbl}>Groom Name (Telugu)</label>
                  <input type="text" placeholder="వంశీ రాజు" className={inp} value={form.groomName} onChange={e => up('groomName', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className={lbl}>Village / Place</label>
                  <input type="text" placeholder="Kondaparva Village" className={inp} value={form.groomVillage} onChange={e => up('groomVillage', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className={lbl}>Father Name</label>
                  <input type="text" placeholder="అడిమేళ్లి వర్రుప్రసాద్" className={inp} value={form.groomFatherName} onChange={e => up('groomFatherName', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className={lbl}>Father Phone</label>
                  <input type="tel" placeholder="+91 91820 41743" className={inp} value={form.groomFatherPhone} onChange={e => up('groomFatherPhone', e.target.value)} />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className={lbl}>Mother Name</label>
                  <input type="text" placeholder="అడిమేళ్లి అరుణ కుమారి" className={inp} value={form.groomMotherName} onChange={e => up('groomMotherName', e.target.value)} />
                </div>
              </div>
              <ImgField label="Groom Photo" state={groomImg}
                onUrl={setImgUrl(setGroomImg)} onFile={setImgFile(setGroomImg)}
                hint="Portrait / square crop" compact />
            </div>

            {/* Bride */}
            <div className="bg-[#0d0008] border border-gold/10 rounded-sm p-4 space-y-3">
              <p className="font-cinzel text-xs text-gold/70 uppercase tracking-wider">👰 వధువు — Bride</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className={lbl}>Bride Name (Telugu)</label>
                  <input type="text" placeholder="దివ్య భారతి" className={inp} value={form.brideName} onChange={e => up('brideName', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className={lbl}>Village / Place</label>
                  <input type="text" placeholder="T.Gokavaram Village" className={inp} value={form.brideVillage} onChange={e => up('brideVillage', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className={lbl}>Grandfather (తాత)</label>
                  <input type="text" placeholder="తాతపూడి లింగాధరరావు" className={inp} value={form.brideGrandfatherName} onChange={e => up('brideGrandfatherName', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className={lbl}>Grandmother (నాన్నమ్మ)</label>
                  <input type="text" placeholder="తాతపూడి మంగమ్మ" className={inp} value={form.brideGrandmotherName} onChange={e => up('brideGrandmotherName', e.target.value)} />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className={lbl}>Parent Names</label>
                  <input type="text" placeholder="D/o …" className={inp} value={form.brideParents} onChange={e => up('brideParents', e.target.value)} />
                </div>
              </div>
              <ImgField label="Bride Photo" state={brideImg}
                onUrl={setImgUrl(setBrideImg)} onFile={setImgFile(setBrideImg)}
                hint="Portrait / square crop" compact />
            </div>
          </div>

          {/* ────────────────────────────────────────
              ❤️ MY STORY — మా కథ
          ──────────────────────────────────────── */}
          <div className={`${card} space-y-5`}>
            <div className="flex items-center gap-2 border-b border-gold/10 pb-2">
              <BookOpen size={16} className="text-gold" />
              <div>
                <h3 className="font-cinzel text-lg text-gold">మా కథ — My Story</h3>
                <SectionNote used={['My Story tab']} />
              </div>
            </div>

            <div className="space-y-1">
              <label className={lbl}>Section Subtitle (e.g. మన అనుబంధం)</label>
              <input type="text" placeholder="మన అనుబంధం" className={inp} value={form.heroSubtitle} onChange={e => up('heroSubtitle', e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className={lbl}>Tagline (under "మా కథ")</label>
              <input type="text" placeholder="Our Story" className={inp} value={form.tagline} onChange={e => up('tagline', e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className={lbl}>Story Paragraph</label>
              <textarea rows={5} placeholder="మా అనుబంధం పెద్దల ఆశీర్వాదంతో మొదలైన ఒక పవిత్రమైన బంధం…"
                className={`${inp} resize-none`} value={form.coupleStory} onChange={e => up('coupleStory', e.target.value)} />
            </div>

            {/* Couple photo (the large photo on My Story page) */}
            <ImgField label="Couple Photo (shown on My Story page)"
              state={coupleImg} onUrl={setImgUrl(setCoupleImg)} onFile={setImgFile(setCoupleImg)}
              hint="Wide / landscape — displayed as the hero image in the Our Story section" />

            {/* Journey milestones — మన యాత్ర */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-cinzel text-sm text-gold/80 uppercase tracking-wider">మన యాత్ర — Our Journey</p>
                <button onClick={addJourney}
                  className="flex items-center gap-1 text-xs text-gold border border-gold/20 px-3 py-1.5 rounded-sm hover:bg-gold/10 transition-colors">
                  <Plus size={12} /> Add Milestone
                </button>
              </div>
              <p className="text-xs text-cream/35">First Meeting → Engagement → Wedding (add as many as needed)</p>

              {journeyItems.map((j, i) => (
                <div key={i} className="bg-[#0d0008] border border-gold/10 rounded-sm p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gold/50 font-cinzel uppercase tracking-wider">Milestone {i + 1}</span>
                    {journeyItems.length > 1 && (
                      <button onClick={() => removeJourney(i)} className="text-red-400/60 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className={lbl}>Icon (emoji)</label>
                      <input type="text" placeholder="🔔" className={inp} value={j.icon} onChange={e => updateJourney(i, 'icon', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <label className={lbl}>Telugu Title</label>
                      <input type="text" placeholder="మొదటి కలయిక" className={inp} value={j.teluguTitle} onChange={e => updateJourney(i, 'teluguTitle', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <label className={lbl}>English Title</label>
                      <input type="text" placeholder="First Meeting" className={inp} value={j.englishTitle} onChange={e => updateJourney(i, 'englishTitle', e.target.value)} />
                    </div>
                    <div className="space-y-1 md:col-span-3">
                      <label className={lbl}>Description (Telugu / English)</label>
                      <textarea rows={2} placeholder="Story of this milestone…" className={`${inp} resize-none`}
                        value={j.description} onChange={e => updateJourney(i, 'description', e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ────────────────────────────────────────
              ⛪ OCCASION — కార్యక్రమం
          ──────────────────────────────────────── */}
          <div className={`${card} space-y-5`}>
            <div className="flex items-center gap-2 border-b border-gold/10 pb-2">
              <CalendarDays size={16} className="text-gold" />
              <div>
                <h3 className="font-cinzel text-lg text-gold">కార్యక్రమం — Occasion</h3>
                <SectionNote used={['Occasion tab']} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className={lbl}>Section Title (Telugu)</label>
                <input type="text" placeholder="శుభ కార్యక్రమాలు" className={inp}
                  value={form.occasionTitle} onChange={e => up('occasionTitle', e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className={lbl}>Section Subtitle (English)</label>
                <input type="text" placeholder="Wedding Schedule" className={inp}
                  value={form.occasionSubtitle} onChange={e => up('occasionSubtitle', e.target.value)} />
              </div>
            </div>

            {/* ★ Date/Time/Venue already captured in Shared — show reminder */}
            <div className="flex items-center gap-2 bg-gold/5 border border-gold/15 rounded-sm px-4 py-3">
              <span className="text-gold text-sm">ℹ️</span>
              <p className="text-xs text-cream/50">
                <span className="text-gold/70 font-medium">Date, Muhurtham Time &amp; Venue</span> are already entered in <span className="text-gold/70 font-medium">Shared Details</span> above — they will be shown on this section automatically.
              </p>
            </div>

            {/* Groom's Residence (only on Occasion — వరుడి స్వగ్రహం) */}
            <div className="bg-[#0d0008] border border-gold/10 rounded-sm p-4 space-y-3">
              <p className="font-cinzel text-xs text-gold/70 uppercase tracking-wider">🏡 వరుడి స్వగ్రహం — Groom&apos;s Residence</p>
              <p className="text-[10px] text-cream/30">Shown as a second location card on the Occasion page.</p>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className={lbl}>Residence Name</label>
                  <input type="text" placeholder="Santhosham Nilayam" className={inp}
                    value={form.groomResidenceName} onChange={e => up('groomResidenceName', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className={lbl}>Address</label>
                  <textarea rows={2} placeholder="Kondaparva East, Kondaparva Village, Vissannapeta Mandal, NTR Dist. 521213"
                    className={`${inp} resize-none`} value={form.groomResidenceAddress} onChange={e => up('groomResidenceAddress', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className={lbl}>Google Maps Link</label>
                  <input type="url" placeholder="https://maps.google.com/…" className={inp}
                    value={form.groomResidenceMapLink} onChange={e => up('groomResidenceMapLink', e.target.value)} />
                </div>
              </div>
            </div>

            {/* Program events list */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-cinzel text-sm text-gold/80 uppercase tracking-wider">Program Events</p>
                <button onClick={addProg}
                  className="flex items-center gap-1 text-xs text-gold border border-gold/20 px-3 py-1.5 rounded-sm hover:bg-gold/10 transition-colors">
                  <Plus size={12} /> Add Event
                </button>
              </div>
              {programEvents.map((ev, i) => (
                <div key={i} className="bg-[#0d0008] border border-gold/10 rounded-sm p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gold/50 font-cinzel uppercase tracking-wider">Event {i + 1}</span>
                    {programEvents.length > 1 && (
                      <button onClick={() => removeProg(i)} className="text-red-400/60 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className={lbl}>Event Name</label>
                      <input type="text" placeholder="శుభ వివాహం" className={inp} value={ev.name} onChange={e => updateProg(i, 'name', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <label className={lbl}>Description</label>
                      <input type="text" placeholder="The Sacred Wedding Ceremony" className={inp} value={ev.description} onChange={e => updateProg(i, 'description', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <label className={lbl}>Date</label>
                      <input type="date" className={inp} value={ev.date} onChange={e => updateProg(i, 'date', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <label className={lbl}>Time</label>
                      <input type="time" className={inp} value={ev.time} onChange={e => updateProg(i, 'time', e.target.value)} />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className={lbl}>Venue (if different from main venue)</label>
                      <input type="text" placeholder="Leave blank to use main venue" className={inp} value={ev.venue} onChange={e => updateProg(i, 'venue', e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Stream */}
            <div className="bg-[#0d0008] border border-gold/10 rounded-sm p-4 space-y-3">
              <p className="font-cinzel text-xs text-gold/70 uppercase tracking-wider">📡 Live Stream</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className={lbl}>Platform</label>
                  <select className={inp} value={form.streamPlatform} onChange={e => up('streamPlatform', e.target.value)}>
                    <option>YouTube Live</option><option>Facebook Live</option><option>Instagram Live</option><option>Zoom</option><option>Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className={lbl}>Embed / Watch URL</label>
                  <input type="url" placeholder="https://youtube.com/embed/…" className={inp} value={form.streamEmbedUrl} onChange={e => up('streamEmbedUrl', e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          {/* ────────────────────────────────────────
              📷 GALLERY
          ──────────────────────────────────────── */}
          <div className={`${card} space-y-5`}>
            <div className="flex items-center justify-between border-b border-gold/10 pb-2">
              <div className="flex items-center gap-2">
                <Camera size={16} className="text-gold" />
                <div>
                  <h3 className="font-cinzel text-lg text-gold">గ్యాలరీ — Gallery</h3>
                  <SectionNote used={['Gallery tab']} />
                </div>
              </div>
              <button onClick={() => setGallerySlots(p => [...p, initImg()])}
                className="flex items-center gap-1 text-xs text-gold border border-gold/20 px-3 py-1.5 rounded-sm hover:bg-gold/10 transition-colors">
                <Plus size={12} /> Add Photo
              </button>
            </div>
            <p className="text-xs text-cream/35">Pre-wedding, Mehndi, or candid photos.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {gallerySlots.map((s, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-cream/35 uppercase tracking-wider">Photo {i + 1}</span>
                    {gallerySlots.length > 1 && (
                      <button onClick={() => setGallerySlots(p => p.filter((_, x) => x !== i))} className="text-red-400/50 hover:text-red-400"><Trash2 size={11} /></button>
                    )}
                  </div>
                  <div className="relative border-2 border-dashed border-gold/20 rounded-sm h-24 flex flex-col items-center justify-center cursor-pointer hover:bg-gold/5 hover:border-gold/35 transition-colors overflow-hidden">
                    <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30" onChange={setGalleryFile(i)} />
                    {s.preview && <img src={s.preview} alt="" className="absolute inset-0 w-full h-full object-cover opacity-100 z-0" />}
                    <div className="relative z-10 flex flex-col items-center bg-black/60 px-3 py-1.5 rounded-sm backdrop-blur-sm">
                      <ImageIcon className="text-gold" size={14} />
                      <p className="text-[9px] text-cream font-medium mt-1 drop-shadow-md">{s.preview ? 'Replace' : 'Upload'}</p>
                    </div>
                  </div>
                  <input type="url" placeholder="or paste URL…" value={s.url}
                    onChange={e => setGalleryUrl(i, e.target.value)}
                    className="w-full bg-[#0d0008] border border-gold/20 rounded-sm p-2 text-cream text-xs focus:border-gold outline-none transition-colors" />
                </div>
              ))}
            </div>
          </div>

          {/* ────────────────────────────────────────
              📞 CONTACT — సంప్రదించండి
          ──────────────────────────────────────── */}
          <div className={`${card} space-y-5`}>
            <div className="flex items-center gap-2 border-b border-gold/10 pb-2">
              <Phone size={16} className="text-gold" />
              <div>
                <h3 className="font-cinzel text-lg text-gold">సంప్రదించండి — Contact</h3>
                <SectionNote used={['Contact tab']} />
              </div>
            </div>

            {/* ★ Couple names / date / venue already in Shared */}
            <div className="flex items-center gap-2 bg-gold/5 border border-gold/15 rounded-sm px-4 py-3">
              <span className="text-sm">ℹ️</span>
              <p className="text-xs text-cream/50">
                <span className="text-gold/70 font-medium">Couple names, Date, Venue &amp; Address</span> from <span className="text-gold/70 font-medium">Shared Details</span> are automatically shown on the Contact page.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="bg-[#0d0008] border border-gold/10 rounded-sm p-4 space-y-3">
              <p className="font-cinzel text-xs text-gold/70 uppercase tracking-wider">📱 Call-to-Action Buttons</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className={lbl}>WhatsApp Number</label>
                  <input type="tel" placeholder="+91 98765 43210" className={inp} value={form.contactWhatsapp} onChange={e => up('contactWhatsapp', e.target.value)} />
                  <p className="text-[10px] text-cream/30">🟢 WhatsApp button shown to guests</p>
                </div>
                <div className="space-y-1">
                  <label className={lbl}>Call Number</label>
                  <input type="tel" placeholder="+91 98765 43210" className={inp} value={form.contactPhone} onChange={e => up('contactPhone', e.target.value)} />
                  <p className="text-[10px] text-cream/30">🟡 Call Now button shown to guests</p>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className={lbl}>Email (optional)</label>
                  <input type="email" placeholder="family@example.com" className={inp} value={form.contactEmail} onChange={e => up('contactEmail', e.target.value)} />
                </div>
              </div>
            </div>

            {/* Additional contacts list */}
            <div className="bg-[#0d0008] border border-gold/10 rounded-sm p-4 space-y-4">
              <p className="font-cinzel text-xs text-gold/70 uppercase tracking-wider">📋 Additional Contacts</p>
              {[1, 2].map(n => (
                <div key={n} className="space-y-2">
                  <p className="text-[10px] text-cream/35 uppercase tracking-wider">Contact {n}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className={lbl}>Name</label>
                      <input type="text" placeholder={n === 1 ? 'అడిమేళ్లి వర్రుప్రసాద్' : 'అడిమేళ్లి వెంకటేష్'} className={inp}
                        value={n === 1 ? form.additionalContact1Name : form.additionalContact2Name}
                        onChange={e => up(n === 1 ? 'additionalContact1Name' : 'additionalContact2Name', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <label className={lbl}>Role / Relation</label>
                      <input type="text" placeholder={n === 1 ? "వరుడు తండ్రి · Groom's Father" : "వరుడు సోదరుడు · Groom's Brother"} className={inp}
                        value={n === 1 ? form.additionalContact1Role : form.additionalContact2Role}
                        onChange={e => up(n === 1 ? 'additionalContact1Role' : 'additionalContact2Role', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <label className={lbl}>Phone</label>
                      <input type="tel" placeholder={n === 1 ? '+91 90001 13595' : '+91 96409 68921'} className={inp}
                        value={n === 1 ? form.additionalContact1Phone : form.additionalContact2Phone}
                        onChange={e => up(n === 1 ? 'additionalContact1Phone' : 'additionalContact2Phone', e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ══════════════════════════════════════════
            RIGHT — Sidebar (1/3)
        ══════════════════════════════════════════ */}
        <div className="space-y-6">

          {/* Hero Background */}
          <div className={card}>
            <h3 className="font-cinzel text-lg text-gold border-b border-gold/10 pb-2 mb-4">Hero Background</h3>
            <ImgField label="Background Image" state={heroBg}
              onUrl={setImgUrl(setHeroBg)} onFile={setImgFile(setHeroBg)}
              hint="High-res landscape — used as main background" />
          </div>


          {/* Theme Colors */}
          <div className={card}>
            <h3 className="font-cinzel text-lg text-gold border-b border-gold/10 pb-2 mb-4">Theme Colors</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div><label className={lbl}>Accent Color</label><span className="text-xs text-cream/40 font-mono">{form.accentColor}</span></div>
                <input type="color" value={form.accentColor} onChange={e => up('accentColor', e.target.value)} className="w-10 h-10 p-1 bg-[#0d0008] border border-gold/20 rounded-sm cursor-pointer" />
              </div>
              <div className="flex items-center justify-between">
                <div><label className={lbl}>Secondary Color</label><span className="text-xs text-cream/40 font-mono">{form.secondaryColor}</span></div>
                <input type="color" value={form.secondaryColor} onChange={e => up('secondaryColor', e.target.value)} className="w-10 h-10 p-1 bg-[#0d0008] border border-gold/20 rounded-sm cursor-pointer" />
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gold/10">
                <div><label className={lbl}>Petal Rain</label><span className="text-[10px] text-cream/35">Falling flower petals</span></div>
                <input type="checkbox" checked={form.showPetals} onChange={e => up('showPetals', e.target.checked)} className="w-5 h-5 accent-gold cursor-pointer" />
              </div>
              <div className="pt-1">
                <span className="text-[10px] uppercase tracking-wider text-warm-gray mb-2 block">Preview</span>
                <div className="h-10 rounded-sm border border-white/5"
                  style={{ background: `radial-gradient(ellipse at top, rgba(${hexToRgbStr(form.accentColor)},0.22) 0%, transparent 60%), radial-gradient(ellipse at bottom left, rgba(${hexToRgbStr(form.secondaryColor)},0.2) 0%, transparent 50%), #0d0008` }} />
              </div>
            </div>
          </div>

          {/* Publish Checklist */}
          <div className={`${card} space-y-3`}>
            <h3 className="font-cinzel text-sm text-gold/80 uppercase tracking-wider border-b border-gold/10 pb-2">Publish Checklist</h3>
            <ul className="space-y-1.5">
              {checklist.map(([l, ok]) => (
                <li key={l} className="flex items-center gap-2 text-xs text-cream/60">
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold shrink-0 ${ok ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/20'}`}>
                    {ok ? '✓' : '○'}
                  </span>
                  {l}
                </li>
              ))}
            </ul>
            <button onClick={handlePublish} disabled={isPublishing}
              className="w-full mt-2 bg-gold text-[#1a0a14] font-cinzel py-2.5 rounded-sm uppercase tracking-wider text-xs hover:bg-gold-light transition-colors disabled:opacity-50">
              {isPublishing ? 'Publishing…' : 'Publish Template 2'}
            </button>
          </div>

        </div>
      </div>

      {/* ── LIVE PREVIEW MODAL ── */}
      {showPreview && (
        <div className="fixed inset-0 z-100 flex bg-black/90 backdrop-blur-sm p-4 md:p-8">
          <div className="flex-1 max-w-7xl mx-auto flex flex-col bg-[#1a0a14] border border-gold/20 rounded-xl overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-4 border-b border-gold/10 bg-black/50">
              <h3 className="text-gold font-cinzel text-lg flex items-center gap-2"><Eye size={18} /> Live Preview Mode</h3>
              <button onClick={() => setShowPreview(false)} className="text-cream hover:text-red-400 bg-white/5 px-4 py-2 rounded-sm text-sm uppercase tracking-wider font-bold transition-colors">
                Close Preview
              </button>
            </div>
            <div className="flex-1 overflow-y-auto bg-black flex justify-center p-4 md:p-8">
              {/* Mobile Device Mockup */}
              <div className="w-[414px] max-w-full h-fit min-h-[800px] border-8 border-zinc-800 rounded-[3rem] overflow-hidden shadow-2xl relative bg-white">
                <div className="absolute top-0 inset-x-0 h-6 bg-black z-50 flex justify-center rounded-b-xl max-w-[150px] mx-auto" />
                <Template2Renderer event={{
                  templateType: 'template2', occasionType: 'wedding',
                  title: form.coupleNames || 'Title', coupleNamesEn: form.coupleNamesEn,
                  heroSubtitle: form.heroSubtitle, tagline: form.tagline,
                  dateRaw: form.weddingDate ? `${form.weddingDate}T${form.muhurthamTime || '00:00'}:00` : '',
                  dateFormatted: form.weddingDate, timeFormatted: form.muhurthamTime,
                  venue: form.venueName, venueAddress: form.venueAddress,
                  occasionTitle: form.occasionTitle, occasionSubtitle: form.occasionSubtitle,
                  programEvents, coupleStory: form.coupleStory, bodyMessage: form.coupleStory, journeyItems,
                  brideDetails: { name: form.brideName, village: form.brideVillage, parentNames: form.brideParents, grandfatherName: form.brideGrandfatherName, grandmotherName: form.brideGrandmotherName },
                  groomDetails: { name: form.groomName, village: form.groomVillage, parentNames: form.groomParents, fatherName: form.groomFatherName, motherName: form.groomMotherName, fatherPhone: form.groomFatherPhone },
                  backgroundUrl: heroBg.preview || heroBg.url || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2000&auto=format&fit=crop',
                  accentColor: form.accentColor, secondaryColor: form.secondaryColor, showPetals: form.showPetals
                } as any} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

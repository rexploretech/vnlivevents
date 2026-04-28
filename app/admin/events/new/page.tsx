'use client';

import { useState, useEffect } from 'react';
import { Upload, Eye, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { OCCASION_PRESETS, type OccasionType, type OccasionPreset } from '@/lib/occasionPresets';

function hexToRgbStr(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result 
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` 
    : '201, 168, 76';
}

export default function NewEventPage() {
  const [occasionType, setOccasionType] = useState<OccasionType>('wedding');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const preset: OccasionPreset = OCCASION_PRESETS[occasionType];

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    eventType: preset.defaultEventType,
    dateRaw: '',
    timeFormatted: '',
    venue: '',
    city: '',
    streamPlatform: 'YouTube Live',
    streamEmbedUrl: '',
    tagline: preset.defaultTagline,
    bodyMessage: preset.defaultInviteText,
    photographerName: '',
    photographerRole: '',
    contactEmail: '',
    contactPhone: '',
    accentColor: preset.accentColor,
    secondaryColor: preset.secondaryColor,
    showPetals: true,
  });

  useEffect(() => {
    const saved = localStorage.getItem('liveframe_mock_event');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed) {
          if (parsed.occasionType) setOccasionType(parsed.occasionType);
          if (parsed.backgroundUrl && !parsed.backgroundUrl.includes('unsplash.com')) {
            setPreviewImage(parsed.backgroundUrl);
          }
          setFormData({
            title: parsed.title || '',
            slug: parsed.slug || '',
            eventType: parsed.eventType || '',
            dateRaw: parsed.dateRaw || '',
            timeFormatted: parsed.timeFormatted || '',
            venue: parsed.venue || '',
            city: parsed.city || '',
            streamPlatform: parsed.streamPlatform || 'YouTube Live',
            streamEmbedUrl: parsed.streamEmbedUrl || '',
            tagline: parsed.tagline || '',
            bodyMessage: parsed.bodyMessage || '',
            photographerName: parsed.photographerName || '',
            photographerRole: parsed.photographerRole || '',
            contactEmail: parsed.contactEmail || '',
            contactPhone: parsed.contactPhone || '',
            accentColor: parsed.accentColor || OCCASION_PRESETS[parsed.occasionType as OccasionType || 'wedding'].accentColor,
            secondaryColor: parsed.secondaryColor || OCCASION_PRESETS[parsed.occasionType as OccasionType || 'wedding'].secondaryColor,
            showPetals: parsed.showPetals !== undefined ? parsed.showPetals : true,
          });
        }
      } catch (e) {
        console.error('Failed to parse saved admin mock data.');
      }
    }
  }, []);

  const handleOccasionChange = (type: OccasionType) => {
    setOccasionType(type);
    const newPreset = OCCASION_PRESETS[type];
    setFormData(prev => ({
      ...prev,
      eventType: newPreset.defaultEventType,
      tagline: newPreset.defaultTagline,
      bodyMessage: newPreset.defaultInviteText,
      accentColor: newPreset.accentColor,
      secondaryColor: newPreset.secondaryColor,
    }));
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = () => {
    const accentRgb = hexToRgbStr(formData.accentColor);
    const secondaryRgb = hexToRgbStr(formData.secondaryColor);

    // Format date string beautifully like "15 MAY 2026"
    // Parse it directly from the raw string to avoid UTC timezone shifting
    let dateFormatted = '';
    if (formData.dateRaw) {
      // dateRaw from datetime-local is "YYYY-MM-DDTHH:mm" — safe to split directly
      const datePart = formData.dateRaw.split('T')[0]; // "YYYY-MM-DD"
      const [year, month, day] = datePart.split('-');
      const monthNames = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
      const monthName = monthNames[parseInt(month, 10) - 1] || month;
      dateFormatted = `${day} ${monthName} ${year}`;
    }

    // Prepare initials
    const initials = formData.photographerName
      ? formData.photographerName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
      : '';

    // Combine date and time for countdown
    let dateTimeForCountdown = '';
    if (formData.dateRaw && formData.timeFormatted) {
      dateTimeForCountdown = `${formData.dateRaw}T${formData.timeFormatted}:00`;
    } else if (formData.dateRaw) {
      dateTimeForCountdown = `${formData.dateRaw}T00:00:00`;
    }

    const fullEvent = {
      ...formData,
      dateRaw: dateTimeForCountdown, // Store combined datetime for countdown
      dateFormatted,
      photographerInitials: initials,
      occasionType,
      backgroundUrl: previewImage || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2000&auto=format&fit=crop',
      accentColorRgb: accentRgb,
      secondaryColorRgb: secondaryRgb,
      // Dynamic overlay based on custom chosen colors
      overlayGradient: `radial-gradient(ellipse at top, rgba(${accentRgb},0.18) 0%, transparent 60%), radial-gradient(ellipse at bottom left, rgba(${secondaryRgb},0.15) 0%, transparent 50%)`,
      particleColors: [formData.accentColor, formData.secondaryColor, preset.particleColors[2] || '#ffffff'],
    };

    try {
      localStorage.setItem('liveframe_mock_event', JSON.stringify(fullEvent));
      alert('Success! Event published to Local Storage. Click "Preview" to see your custom site!');
    } catch (e) {
      alert('Publish failed. Your background image might be too large for offline preview mode (Local Storage 5MB limit). Try a smaller image.');
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h2 className="font-cinzel text-2xl md:text-3xl text-gold-light mb-1">Create New Event</h2>
          <p className="font-sans text-sm md:text-base text-cream/60">Select occasion, fill details, and publish.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/"
            target="_blank"
            className="flex-1 md:flex-none flex items-center justify-center space-x-2 border border-gold/20 px-4 md:px-5 py-2.5 rounded-sm hover:bg-gold/10 transition-colors"
          >
            <Eye size={16} className="text-gold" />
            <span className="font-sans text-cream text-sm">Preview</span>
          </Link>
          <button 
            onClick={handlePublish}
            className="flex-1 md:flex-none bg-gold text-[#1a0a14] font-cinzel px-4 md:px-6 py-2.5 rounded-sm uppercase tracking-wider text-xs md:text-sm hover:bg-gold-light transition-colors"
          >
            Publish Event
          </button>
        </div>
      </div>

      {/* ── Occasion Type Selector ── */}
      <div className="bg-[#1a0a14] border border-gold/10 p-6 rounded-sm mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles size={18} className="text-gold" />
          <h3 className="font-cinzel text-xl text-gold">Choose Occasion Template</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3">
          {(Object.keys(OCCASION_PRESETS) as OccasionType[]).map((key) => {
            const p = OCCASION_PRESETS[key];
            const isActive = occasionType === key;
            return (
              <button
                key={key}
                onClick={() => handleOccasionChange(key)}
                className={`
                  relative flex flex-col items-center justify-center p-4 rounded-md border-2 transition-all duration-200 cursor-pointer
                  ${isActive
                    ? 'border-gold bg-gold/10 shadow-[0_0_20px_rgba(201,168,76,0.25)]'
                    : 'border-gold/10 bg-[#0d0008] hover:border-gold/30 hover:bg-gold/5'
                  }
                `}
                style={isActive ? { borderColor: formData.accentColor, boxShadow: `0 0 20px ${formData.accentColor}30` } : {}}
              >
                <span className="text-2xl mb-2">{p.icon}</span>
                <span className={`font-sans text-xs uppercase tracking-wider ${isActive ? 'text-cream' : 'text-cream/50'}`}>
                  {p.label}
                </span>
                {isActive && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full shadow-md" style={{ backgroundColor: formData.accentColor }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Main Form ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Event Details */}
          <div className="bg-[#1a0a14] border border-gold/10 p-6 rounded-sm space-y-6">
            <h3 className="font-cinzel text-xl text-gold border-b border-gold/10 pb-2">Event Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs uppercase tracking-wider text-warm-gray">{preset.titleLabel}</label>
                <input
                  type="text"
                  placeholder={preset.titlePlaceholder}
                  className="w-full bg-[#0d0008] border border-gold/20 rounded-sm p-3 text-cream focus:border-gold outline-none transition-colors"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                />
              </div>

              <div className="space-y-1 col-span-2">
                <label className="text-xs uppercase tracking-wider text-warm-gray">Event Type / Sub-title</label>
                <input
                  type="text"
                  placeholder={preset.defaultEventType}
                  className="w-full bg-[#0d0008] border border-gold/20 rounded-sm p-3 text-cream focus:border-gold outline-none transition-colors"
                  value={formData.eventType}
                  onChange={(e) => updateField('eventType', e.target.value)}
                />
              </div>



              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-warm-gray">Date</label>
                <input
                  type="date"
                  className="w-full bg-[#0d0008] border border-gold/20 rounded-sm p-3 text-cream focus:border-gold outline-none transition-colors"
                  value={formData.dateRaw}
                  onChange={(e) => updateField('dateRaw', e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-warm-gray">Time</label>
                <input
                  type="time"
                  className="w-full bg-[#0d0008] border border-gold/20 rounded-sm p-3 text-cream focus:border-gold outline-none transition-colors"
                  value={formData.timeFormatted}
                  onChange={(e) => updateField('timeFormatted', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Location & Stream */}
          <div className="bg-[#1a0a14] border border-gold/10 p-6 rounded-sm space-y-6">
            <h3 className="font-cinzel text-xl text-gold border-b border-gold/10 pb-2">Location & Stream</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-warm-gray">Venue Name</label>
                <input
                  type="text"
                  placeholder="Lotus Garden Banquet Hall"
                  className="w-full bg-[#0d0008] border border-gold/20 rounded-sm p-3 text-cream focus:border-gold outline-none transition-colors"
                  value={formData.venue}
                  onChange={(e) => updateField('venue', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-warm-gray">City</label>
                <input
                  type="text"
                  placeholder="Mumbai, Maharashtra"
                  className="w-full bg-[#0d0008] border border-gold/20 rounded-sm p-3 text-cream focus:border-gold outline-none transition-colors"
                  value={formData.city}
                  onChange={(e) => updateField('city', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-warm-gray">Stream Platform</label>
                <select
                  className="w-full bg-[#0d0008] border border-gold/20 rounded-sm p-3 text-cream focus:border-gold outline-none transition-colors"
                  value={formData.streamPlatform}
                  onChange={(e) => updateField('streamPlatform', e.target.value)}
                >
                  <option>YouTube Live</option>
                  <option>Facebook Live</option>
                  <option>Instagram Live</option>
                  <option>Zoom</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs uppercase tracking-wider text-warm-gray">Embed / Watch URL</label>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/embed/..."
                  className="w-full bg-[#0d0008] border border-gold/20 rounded-sm p-3 text-cream focus:border-gold outline-none transition-colors"
                  value={formData.streamEmbedUrl}
                  onChange={(e) => updateField('streamEmbedUrl', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-[#1a0a14] border border-gold/10 p-6 rounded-sm space-y-6">
            <h3 className="font-cinzel text-xl text-gold border-b border-gold/10 pb-2">Content & Message</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-warm-gray">Tagline</label>
                <input
                  type="text"
                  placeholder={preset.defaultTagline}
                  className="w-full bg-[#0d0008] border border-gold/20 rounded-sm p-3 text-cream focus:border-gold outline-none transition-colors"
                  value={formData.tagline}
                  onChange={(e) => updateField('tagline', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-warm-gray">Invitation Message</label>
                <textarea
                  rows={4}
                  placeholder={preset.defaultInviteText}
                  className="w-full bg-[#0d0008] border border-gold/20 rounded-sm p-3 text-cream focus:border-gold outline-none resize-none transition-colors"
                  value={formData.bodyMessage}
                  onChange={(e) => updateField('bodyMessage', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-6">

          {/* Background Image Upload */}
          <div className="bg-[#1a0a14] border border-gold/10 p-6 rounded-sm">
            <h3 className="font-cinzel text-xl text-gold border-b border-gold/10 pb-2 mb-4">Background Image</h3>
            <div className="relative border-2 border-dashed border-gold/20 rounded-sm p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gold/5 hover:border-gold/50 transition-colors overflow-hidden h-48">
              
              <input 
                type="file" 
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                onChange={handleImageChange}
              />

              {previewImage && (
                <img 
                  src={previewImage} 
                  alt="Preview" 
                  className="absolute inset-0 w-full h-full object-cover opacity-50 z-0" 
                />
              )}

              <div className="relative z-10 flex flex-col items-center">
                <Upload className="text-gold/50 mb-3" size={32} />
                <p className="text-sm text-cream/80 mb-1 font-semibold drop-shadow-md">
                  {previewImage ? 'Click to replace image' : 'Click or drop to upload'}
                </p>
                <p className="text-xs text-warm-gray drop-shadow-md">
                  High-res landscape. Max 2MB.
                </p>
              </div>

            </div>
          </div>

          {/* Custom Theme Colors */}
          <div className="bg-[#1a0a14] border border-gold/10 p-6 rounded-sm">
            <h3 className="font-cinzel text-xl text-gold border-b border-gold/10 pb-2 mb-4">Theme Settings</h3>
            
            <p className="text-xs text-cream/50 mb-4">You can manually override the preset colors here. The changes will reflect seamlessly across the invitations.</p>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs uppercase tracking-wider text-warm-gray block mb-1">Accent Color</label>
                  <span className="text-xs text-cream/50 font-mono">{formData.accentColor}</span>
                </div>
                <input 
                  type="color" 
                  value={formData.accentColor}
                  onChange={(e) => updateField('accentColor', e.target.value)}
                  className="w-10 h-10 p-1 bg-[#0d0008] border border-gold/20 rounded-sm cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs uppercase tracking-wider text-warm-gray block mb-1">Secondary Color</label>
                  <span className="text-xs text-cream/50 font-mono">{formData.secondaryColor}</span>
                </div>
                <input 
                  type="color" 
                  value={formData.secondaryColor}
                  onChange={(e) => updateField('secondaryColor', e.target.value)}
                  className="w-10 h-10 p-1 bg-[#0d0008] border border-gold/20 rounded-sm cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gold/10">
                <div>
                  <label className="text-xs uppercase tracking-wider text-warm-gray block mb-1">Petal Rain</label>
                  <span className="text-[10px] text-cream/40">Enable falling flower petals</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={formData.showPetals}
                  onChange={(e) => updateField('showPetals', e.target.checked)}
                  className="w-5 h-5 accent-gold cursor-pointer"
                />
              </div>

              {/* Dynamic gradient preview based on chosen colors */}
              <div className="pt-2">
                <span className="text-[10px] uppercase tracking-wider text-warm-gray mb-2 block">Overlay Gradient Preview</span>
                <div 
                  className="h-12 rounded-sm border border-white/5" 
                  style={{ 
                    background: `
                      radial-gradient(ellipse at top, rgba(${hexToRgbStr(formData.accentColor)},0.2) 0%, transparent 60%),
                      radial-gradient(ellipse at bottom left, rgba(${hexToRgbStr(formData.secondaryColor)},0.2) 0%, transparent 50%),
                      #0d0008
                    ` 
                  }} 
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

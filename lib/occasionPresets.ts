export type OccasionType = 
  | 'wedding'
  | 'half-saree'
  | 'birthday'
  | 'engagement'
  | 'baby-shower'
  | 'housewarming'
  | 'anniversary'
  | 'custom';

export interface OccasionPreset {
  label: string;
  icon: string;
  titleLabel: string;
  titlePlaceholder: string;
  defaultTagline: string;
  defaultInviteText: string;
  defaultEventType: string;
  accentColor: string;       // Primary accent (used for buttons, glow, headings)
  accentColorRgb: string;    // RGB values for translucent layers
  secondaryColor: string;    // Secondary accent for gradients
  secondaryColorRgb: string;
  particleColors: string[];  // Hex codes for floating particles
  overlayGradient: string;   // CSS gradient for the overlay layer
}

export const OCCASION_PRESETS: Record<OccasionType, OccasionPreset> = {
  wedding: {
    label: 'Wedding',
    icon: '💍',
    titleLabel: 'Couple Names',
    titlePlaceholder: 'Ravi & Meera',
    defaultTagline: 'Two souls, one beautiful journey.',
    defaultInviteText: 'We solicit your gracious virtual presence as we embark on this beautiful journey of togetherness. Join us from wherever you are to celebrate our love and bless us.',
    defaultEventType: 'Wedding Ceremony',
    accentColor: '#C9A84C',
    accentColorRgb: '201, 168, 76',
    secondaryColor: '#C2637A',
    secondaryColorRgb: '194, 99, 122',
    particleColors: ['#C9A84C', '#F0D080', '#C2637A'],
    overlayGradient: 'radial-gradient(ellipse at top, rgba(201,168,76,0.15) 0%, transparent 60%), radial-gradient(ellipse at bottom left, rgba(194,99,122,0.2) 0%, transparent 50%)',
  },
  'half-saree': {
    label: 'Half Saree Ceremony',
    icon: '🌺',
    titleLabel: 'Celebrant Name',
    titlePlaceholder: 'Ananya',
    defaultTagline: 'Blossoming into grace and tradition.',
    defaultInviteText: 'With immense joy and love, we invite you to virtually witness the Half Saree ceremony of our beloved daughter, as she steps into a beautiful new chapter of her life.',
    defaultEventType: 'Half Saree Ceremony',
    accentColor: '#E8567F',
    accentColorRgb: '232, 86, 127',
    secondaryColor: '#F5A623',
    secondaryColorRgb: '245, 166, 35',
    particleColors: ['#E8567F', '#F5A623', '#FFD700'],
    overlayGradient: 'radial-gradient(ellipse at top, rgba(232,86,127,0.18) 0%, transparent 60%), radial-gradient(ellipse at bottom left, rgba(245,166,35,0.15) 0%, transparent 50%)',
  },
  birthday: {
    label: 'Birthday',
    icon: '🎂',
    titleLabel: 'Birthday Person',
    titlePlaceholder: 'Arjun',
    defaultTagline: 'Another year of making beautiful memories.',
    defaultInviteText: 'You are warmly invited to join us virtually as we celebrate a very special day filled with love, laughter, and unforgettable moments.',
    defaultEventType: 'Birthday Celebration',
    accentColor: '#7C5CFC',
    accentColorRgb: '124, 92, 252',
    secondaryColor: '#FF6B9D',
    secondaryColorRgb: '255, 107, 157',
    particleColors: ['#7C5CFC', '#FF6B9D', '#FFD93D'],
    overlayGradient: 'radial-gradient(ellipse at top, rgba(124,92,252,0.18) 0%, transparent 60%), radial-gradient(ellipse at bottom left, rgba(255,107,157,0.15) 0%, transparent 50%)',
  },
  engagement: {
    label: 'Engagement',
    icon: '💎',
    titleLabel: 'Couple Names',
    titlePlaceholder: 'Kiran & Priya',
    defaultTagline: 'A promise of forever begins today.',
    defaultInviteText: 'With hearts full of joy, we invite you to be a part of our engagement ceremony. Your virtual presence will make this moment even more memorable.',
    defaultEventType: 'Engagement Ceremony',
    accentColor: '#E0B0FF',
    accentColorRgb: '224, 176, 255',
    secondaryColor: '#C9A84C',
    secondaryColorRgb: '201, 168, 76',
    particleColors: ['#E0B0FF', '#C9A84C', '#FFD700'],
    overlayGradient: 'radial-gradient(ellipse at top, rgba(224,176,255,0.18) 0%, transparent 60%), radial-gradient(ellipse at bottom left, rgba(201,168,76,0.15) 0%, transparent 50%)',
  },
  'baby-shower': {
    label: 'Baby Shower',
    icon: '🍼',
    titleLabel: 'Parents / Baby Name',
    titlePlaceholder: 'Ravi & Meera\'s Little One',
    defaultTagline: 'A tiny miracle is on the way!',
    defaultInviteText: 'Join us virtually as we celebrate the upcoming arrival of a bundle of joy. Your blessings and warm wishes mean the world to us.',
    defaultEventType: 'Baby Shower',
    accentColor: '#5BC0EB',
    accentColorRgb: '91, 192, 235',
    secondaryColor: '#FDE74C',
    secondaryColorRgb: '253, 231, 76',
    particleColors: ['#5BC0EB', '#FDE74C', '#9BC53D'],
    overlayGradient: 'radial-gradient(ellipse at top, rgba(91,192,235,0.18) 0%, transparent 60%), radial-gradient(ellipse at bottom left, rgba(253,231,76,0.12) 0%, transparent 50%)',
  },
  housewarming: {
    label: 'Housewarming',
    icon: '🏡',
    titleLabel: 'Family Name',
    titlePlaceholder: 'The Sharma Family',
    defaultTagline: 'New home, new beginnings.',
    defaultInviteText: 'We are thrilled to welcome you to witness the blessing of our new home. Join us virtually for this auspicious occasion filled with love and gratitude.',
    defaultEventType: 'Griha Pravesh',
    accentColor: '#E07A5F',
    accentColorRgb: '224, 122, 95',
    secondaryColor: '#81B29A',
    secondaryColorRgb: '129, 178, 154',
    particleColors: ['#E07A5F', '#81B29A', '#F2CC8F'],
    overlayGradient: 'radial-gradient(ellipse at top, rgba(224,122,95,0.18) 0%, transparent 60%), radial-gradient(ellipse at bottom left, rgba(129,178,154,0.15) 0%, transparent 50%)',
  },
  anniversary: {
    label: 'Anniversary',
    icon: '❤️',
    titleLabel: 'Couple Names',
    titlePlaceholder: 'Ravi & Meera',
    defaultTagline: 'Celebrating years of love and togetherness.',
    defaultInviteText: 'Join us virtually as we celebrate another beautiful milestone in our journey together. Your presence and blessings make this celebration complete.',
    defaultEventType: 'Wedding Anniversary',
    accentColor: '#D4AF37',
    accentColorRgb: '212, 175, 55',
    secondaryColor: '#B22222',
    secondaryColorRgb: '178, 34, 34',
    particleColors: ['#D4AF37', '#B22222', '#FFD700'],
    overlayGradient: 'radial-gradient(ellipse at top, rgba(212,175,55,0.18) 0%, transparent 60%), radial-gradient(ellipse at bottom left, rgba(178,34,34,0.15) 0%, transparent 50%)',
  },
  custom: {
    label: 'Custom Event',
    icon: '✨',
    titleLabel: 'Event Title',
    titlePlaceholder: 'Your Event Title',
    defaultTagline: 'A special occasion awaits.',
    defaultInviteText: 'You are warmly invited to join us for this special celebration. Your virtual presence will make this event truly memorable.',
    defaultEventType: 'Special Event',
    accentColor: '#C9A84C',
    accentColorRgb: '201, 168, 76',
    secondaryColor: '#C2637A',
    secondaryColorRgb: '194, 99, 122',
    particleColors: ['#C9A84C', '#F0D080', '#C2637A'],
    overlayGradient: 'radial-gradient(ellipse at top, rgba(201,168,76,0.15) 0%, transparent 60%), radial-gradient(ellipse at bottom left, rgba(194,99,122,0.2) 0%, transparent 50%)',
  },
};

// Full event data shape that gets stored in Firebase / used by the invitation page
export interface EventData {
  occasionType: OccasionType;
  title: string;
  slug: string;
  eventType: string;
  dateRaw: string;
  dateFormatted: string;
  timeFormatted: string;
  tagline: string;
  bodyMessage: string;
  venue: string;
  venueAddress?: string;
  city: string;
  streamPlatform: string;
  streamEmbedUrl: string;
  backgroundUrl: string;
  photographerName: string;
  photographerRole: string;
  photographerInitials: string;
  contactEmail: string;
  contactPhone: string;
  // Theme overrides (auto-populated from preset, editable by admin)
  accentColor: string;
  accentColorRgb: string;
  secondaryColor: string;
  secondaryColorRgb: string;
  particleColors: string[];
  overlayGradient: string;
  showPetals: boolean;
  useCustomThumbnail?: boolean;
  bottomImageUrl?: string;
  // ── Template identification ──────────────────────────────────────────
  templateType?: 'template1' | 'template2';
  // ── Template 2 specific fields ───────────────────────────────────────
  coupleNamesEn?: string;          // English couple names fallback
  occasionTitle?: string;            // E.g., శుభ కార్యక్రమాలు
  occasionSubtitle?: string;         // E.g., Wedding Schedule
  coupleStory?: string;              // "Our Story" section narrative
  journeyItems?: Array<{
    icon: string;
    teluguTitle: string;
    englishTitle: string;
    description: string;
  }>;
  brideDetails?: {                   // Bride profile
    name: string;
    village?: string;
    parentNames: string;
    grandfatherName?: string;
    grandmotherName?: string;
    photoUrl: string;
  };
  groomDetails?: {                   // Groom profile
    name: string;
    village?: string;
    parentNames: string;
    fatherName?: string;
    motherName?: string;
    fatherPhone?: string;
    photoUrl: string;
  };
  programEvents?: Array<{            // "కార్యక్రమం" – schedule items
    name: string;
    date: string;
    time: string;
    venue: string;
    description: string;
  }>;
  galleryUrls?: string[];            // "గ్యాలరీ" – gallery image URLs
  contactWhatsapp?: string;          // WhatsApp number for RSVP
  heroSubtitle?: string;             // Telugu sub-caption below couple name
}

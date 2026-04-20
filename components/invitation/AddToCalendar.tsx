'use client';

import { Calendar } from 'lucide-react';

interface AddToCalendarProps {
  title: string;
  description: string;
  location: string;
  startTime: string; // ISO string
  accentColor: string;
}

export default function AddToCalendar({ title, description, location, startTime, accentColor }: AddToCalendarProps) {
  const handleAddToCalendar = () => {
    const startDate = new Date(startTime);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // Default 2 hours

    const formatISO = (date: Date) => date.toISOString().replace(/-|:|\.\d+/g, '');

    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatISO(startDate)}/${formatISO(endDate)}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;
    
    // Simple way to offer options: open Google Calendar for now
    // A more advanced version would generate an .ics file
    window.open(googleUrl, '_blank');
  };

  return (
    <button
      onClick={handleAddToCalendar}
      className="flex items-center space-x-2 px-6 py-3 rounded-sm hover:bg-white/5 transition-colors"
      style={{ border: `1px solid ${accentColor}33` }}
    >
      <Calendar size={16} style={{ color: accentColor }} />
      <span className="font-cinzel text-xs text-cream uppercase tracking-widest">
        Add to Calendar
      </span>
    </button>
  );
}

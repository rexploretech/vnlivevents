'use client';

import { useState, useEffect } from 'react';
import { Edit2, Eye, Trash2, ExternalLink, Calendar, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import { type EventData } from '@/lib/occasionPresets';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

interface EventWithId extends EventData {
  id: string;
}

export default function EventsListPage() {
  const [events, setEvents] = useState<EventWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);


  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'events'));
        const eventsList: EventWithId[] = [];
        querySnapshot.forEach((doc) => {
          eventsList.push({ id: doc.id, ...doc.data() } as EventWithId);
        });
        setEvents(eventsList);
      } catch (error) {
        console.error("Error fetching events: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const deleteEvent = async (id: string) => {
    if (confirm('Are you sure you want to delete this event? This cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'events', id));
        setEvents(events.filter(e => e.id !== id));
      } catch (error) {
        console.error("Error deleting event: ", error);
        alert("Failed to delete event.");
      }
    }
  };

  const copyToClipboard = (slug: string, id: string) => {
    const url = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return <div className="text-gold font-cinzel text-center py-12">Loading events...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-cinzel text-3xl text-gold-light mb-1">Your Events</h2>
        <p className="font-sans text-cream/60">Manage and track all your cinematic invitations.</p>
      </div>

      {events.length === 0 ? (
        <div className="bg-[#1a0a14] border border-gold/10 p-12 rounded-sm text-center">
          <Calendar size={48} className="text-gold/20 mx-auto mb-4" />
          <h3 className="font-cinzel text-xl text-gold/60 mb-2">No events found</h3>
          <p className="text-cream/40 mb-6">Start by creating your first premium invitation.</p>
          <Link 
            href="/admin/events/new"
            className="bg-gold text-[#1a0a14] font-cinzel px-8 py-3 rounded-sm uppercase tracking-wider text-sm hover:bg-gold-light transition-colors inline-block"
          >
            Create Event
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {events.map((event) => (
            <div 
              key={event.id}
              className="bg-[#1a0a14] border border-gold/10 p-6 rounded-sm flex flex-col md:flex-row items-center justify-between group hover:border-gold/30 transition-all"
            >
              <div className="flex items-center space-x-6 mb-4 md:mb-0">
                <div className="w-20 h-20 rounded-sm overflow-hidden border border-gold/20 relative shrink-0">
                  <img src={event.backgroundUrl} alt="" className="w-full h-full object-cover opacity-60" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
                </div>
                <div>
                  <h3 className="font-cinzel text-lg text-gold group-hover:text-gold-light transition-colors">{event.title}</h3>
                  <p className="text-xs text-cream/50 uppercase tracking-widest">{event.eventType} • {event.dateFormatted}</p>
                  <div className="flex items-center mt-2 space-x-3">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20 uppercase tracking-tighter">
                      {event.occasionType}
                    </span>
                    <span className="text-[10px] text-cream/30 flex items-center">
                      <ExternalLink size={10} className="mr-1" />
                      /{event.slug}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => copyToClipboard(event.slug, event.id)}
                  className="p-3 rounded-sm border border-gold/10 transition-all flex items-center space-x-2"
                  style={{ 
                    backgroundColor: copiedId === event.id ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
                    color: copiedId === event.id ? '#22c55e' : 'rgba(255, 253, 240, 0.6)'
                  }}
                  title="Copy Link"
                >
                  {copiedId === event.id ? <Check size={18} /> : <Copy size={18} />}
                  {copiedId === event.id && <span className="text-[10px] font-cinzel uppercase tracking-widest">Copied</span>}
                </button>
                <Link 
                  href={`/${event.slug}`} 
                  target="_blank"
                  className="p-3 rounded-sm border border-gold/10 text-cream/60 hover:text-gold hover:bg-gold/5 transition-all"
                  title="View Live"
                >
                  <Eye size={18} />
                </Link>

                <Link 
                  href={`/admin/events/edit/${event.id}`}
                  className="p-3 rounded-sm border border-gold/10 text-cream/60 hover:text-gold hover:bg-gold/5 transition-all"
                  title="Edit"
                >
                  <Edit2 size={18} />
                </Link>
                <button 
                  onClick={() => deleteEvent(event.id)}
                  className="p-3 rounded-sm border border-gold/10 text-cream/60 hover:text-red-400 hover:bg-red-400/5 transition-all"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

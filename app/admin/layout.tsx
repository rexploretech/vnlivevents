import { Settings, Plus } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#120a10]">
      {/* Sidebar */}
      <aside className="w-64 bg-near-black border-r border-gold/10 p-6 flex flex-col">
        <h1 className="font-cinzel text-gold text-2xl mb-12 uppercase tracking-wide">LiveFrame</h1>
        
        <nav className="flex-1 space-y-2">
          <Link href="/admin/events" className="flex items-center space-x-3 p-3 rounded-md hover:bg-gold/10 text-cream/70 hover:text-gold transition-colors">
            <Settings size={18} />
            <span className="font-sans text-sm tracking-wide">All Events</span>
          </Link>
          <Link href="/admin/events/new" className="flex items-center space-x-3 p-3 rounded-md bg-gold/10 text-gold hover:bg-gold/20 transition-colors">
            <Plus size={18} />
            <span className="font-sans text-sm tracking-wide">Create Event</span>
          </Link>
        </nav>
        
        <div className="mt-auto border-t border-gold/10 pt-6">
          <button className="flex items-center space-x-3 p-3 rounded-md hover:bg-gold/10 text-cream/70 hover:text-gold transition-colors w-full text-left">
            <Settings size={18} />
            <span className="font-sans text-sm tracking-wide">Global Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

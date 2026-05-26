'use client';

import { Settings, Plus, Menu, X, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/lib/hooks/useAuth';
import { usePathname, useRouter } from 'next/navigation';

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, loading, logOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#120a10] text-gold">Loading...</div>;
  }

  // If unauthenticated and on login page, just show the login page without sidebar
  if (!user || pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#120a10]">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-near-black border-b border-gold/10 z-50 flex items-center justify-between px-6">
        <h1 className="font-cinzel text-gold text-xl uppercase tracking-wide">VNLIVEVENTS</h1>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-gold hover:bg-gold/10 rounded-md transition-colors"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 w-64 bg-near-black border-r border-gold/10 p-6 flex flex-col z-50 transition-transform duration-300 transform
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <h1 className="hidden lg:block font-cinzel text-gold text-2xl mb-12 uppercase tracking-wide">VNLIVEVENTS</h1>
        
        <nav className="flex-1 space-y-2 mt-16 lg:mt-0">
          <Link 
            href="/admin/events" 
            onClick={() => setIsSidebarOpen(false)}
            className="flex items-center space-x-3 p-3 rounded-md hover:bg-gold/10 text-cream/70 hover:text-gold transition-colors"
          >
            <Settings size={18} />
            <span className="font-sans text-sm tracking-wide">All Events</span>
          </Link>
          <Link 
            href="/admin/events/new" 
            onClick={() => setIsSidebarOpen(false)}
            className="flex items-center space-x-3 p-3 rounded-md bg-gold/10 text-gold hover:bg-gold/20 transition-colors"
          >
            <Plus size={18} />
            <span className="font-sans text-sm tracking-wide">Create Event</span>
          </Link>
        </nav>
        
        <div className="mt-auto border-t border-gold/10 pt-6">
          <button className="flex items-center space-x-3 p-3 rounded-md hover:bg-gold/10 text-cream/70 hover:text-gold transition-colors w-full text-left mb-2">
            <Settings size={18} />
            <span className="font-sans text-sm tracking-wide">Global Settings</span>
          </button>
          <button onClick={logOut} className="flex items-center space-x-3 p-3 rounded-md hover:bg-red-900/30 text-cream/70 hover:text-red-400 transition-colors w-full text-left">
            <LogOut size={18} />
            <span className="font-sans text-sm tracking-wide">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10 pt-20 lg:pt-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AuthProvider>
  );
}

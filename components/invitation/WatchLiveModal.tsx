'use client';

import { X, Copy } from 'lucide-react';
import { useState } from 'react';

interface WatchLiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  streamEmbedUrl: string;
}

export default function WatchLiveModal({ isOpen, onClose, streamEmbedUrl }: WatchLiveModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(streamEmbedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2600);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#0d0008]/90 backdrop-blur-xl transition-opacity duration-400"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-[420px] bg-[#1a0a14]/95 border border-gold/40 rounded-sm shadow-2xl animate-fade-slide-up" style={{ animationDelay: '0s' }}>
        <button 
          onClick={onClose}
          className="absolute -top-10 right-0 text-cream/60 hover:text-gold transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-1">
          <div className="aspect-video w-full bg-black">
            <iframe 
              src={streamEmbedUrl} 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>
        </div>

        <div className="p-4 border-t border-gold/10">
          <p className="font-sans text-xs text-cream/60 mb-2 uppercase tracking-wide">Stream URL</p>
          <div className="flex bg-black/40 border border-gold/20 rounded-sm">
            <input 
              type="text" 
              readOnly 
              value={streamEmbedUrl}
              className="flex-1 bg-transparent text-cream/70 text-sm px-3 py-2 outline-none"
            />
            <button 
              onClick={handleCopy}
              className="flex items-center space-x-1 px-4 bg-gold/10 text-gold hover:bg-gold/20 transition-colors border-l border-gold/20"
            >
              <Copy size={14} />
              <span className="font-cinzel text-xs">{copied ? 'COPIED' : 'COPY'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

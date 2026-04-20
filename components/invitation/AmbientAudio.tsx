'use client';

import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AmbientAudioProps {
  audioUrl?: string;
  accentColor: string;
}

export default function AmbientAudio({ audioUrl, accentColor }: AmbientAudioProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Use a soft instrumental placeholder if none provided
  const source = audioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Autoplay blocked:", e));
    }
    setIsPlaying(!isPlaying);
    setShowPrompt(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowPrompt(false), 5000);
    return () => clearTimeout(timer);
  }, [isPlaying]);

  return (
    <div className="fixed bottom-8 left-8 z-50 flex items-center space-x-4">
      <AnimatePresence>
        {showPrompt && !isPlaying && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full pointer-events-none"
          >
            <span className="font-cinzel text-[10px] text-cream/70 uppercase tracking-[0.2em]">
              Enable Ambient Sound
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={togglePlay}
        className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-500"
        style={{ 
          backgroundColor: isPlaying ? `${accentColor}20` : 'rgba(0,0,0,0.3)',
          borderColor: isPlaying ? accentColor : 'rgba(255,255,255,0.1)',
          boxShadow: isPlaying ? `0 0 15px ${accentColor}40` : 'none'
        }}
      >
        {isPlaying ? (
          <Volume2 size={18} style={{ color: accentColor }} className="animate-pulse" />
        ) : (
          <VolumeX size={18} className="text-cream/50" />
        )}
      </motion.button>

      <audio ref={audioRef} loop src={source} />
    </div>
  );
}

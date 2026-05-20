'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);

  // Mouse coords for the dot (immediate)
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const rafRef = useRef<number | null>(null);
  const latestPointerRef = useRef({ x: -100, y: -100 });

  // Spring settings for the outer ring (smooth trailing effect)
  const springConfig = { damping: 25, stiffness: 600, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Immediate dot position using a fast spring
  const dotSpringConfig = { damping: 40, stiffness: 800, mass: 0.1 };
  const dotX = useSpring(cursorX, dotSpringConfig);
  const dotY = useSpring(cursorY, dotSpringConfig);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse), (prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const mouseMove = (e: MouseEvent) => {
      latestPointerRef.current = {
        x: e.clientX - 16,
        y: e.clientY - 16,
      };

      if (rafRef.current !== null) {
        return;
      }

      rafRef.current = window.requestAnimationFrame(() => {
        cursorX.set(latestPointerRef.current.x);
        cursorY.set(latestPointerRef.current.y);
        rafRef.current = null;
      });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.closest('button') ||
        target.closest('a')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-gold/70 pointer-events-none z-[9998] mix-blend-difference hidden md:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
        animate={{
          scale: isHovering ? 2.5 : 1,
          backgroundColor: isHovering ? 'rgba(201, 168, 76, 0.15)' : 'transparent',
          borderColor: isHovering ? 'rgba(201, 168, 76, 0)' : 'rgba(201, 168, 76, 0.7)',
        }}
        transition={{ duration: 0.2 }}
      />
      {/* Inner Dot (Offset by 12px to center inside the 32px ring, since ring is offset by 16px) */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-gold rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        style={{
          x: dotX,
          y: dotY,
          translateX: 12, // Offset to center 2px dot inside 32px ring calculation
          translateY: 12,
        }}
        animate={{
          scale: isHovering ? 0 : 1, // Shrink dot on hover 
          opacity: isHovering ? 0 : 1
        }}
        transition={{ duration: 0.15 }}
      />
    </>
  );
}

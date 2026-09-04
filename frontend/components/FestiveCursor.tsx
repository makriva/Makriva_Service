'use client';

// Sitewide Janmashtami cursor — a spinning bansuri that follows the pointer
// on every page. Temporary, safe to delete along with its usage in
// layout.tsx once the campaign ends.

import { useEffect, useRef } from 'react';
import { Bansuri } from './JanmashtamiMotifs';

export default function FestiveCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    document.body.classList.add('festive-cursor-active');
    const el = dotRef.current;

    const move = (e: MouseEvent) => {
      if (el) el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };
    window.addEventListener('mousemove', move);

    return () => {
      window.removeEventListener('mousemove', move);
      document.body.classList.remove('festive-cursor-active');
    };
  }, []);

  return (
    <div ref={dotRef} className="festive-cursor-dot" aria-hidden="true">
      <Bansuri size={40} className="festive-cursor-spin" />
    </div>
  );
}

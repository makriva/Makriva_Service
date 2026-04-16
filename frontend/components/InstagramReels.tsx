'use client';

import { useState, useEffect, useRef } from 'react';
import { FiInstagram, FiChevronLeft, FiChevronRight, FiVolume2, FiVolumeX } from 'react-icons/fi';
import { getReels } from '@/lib/api';

type Reel = { id: string; url: string; video_url?: string };

function ReelCard({ reel }: { reel: Reel }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !muted;
    setMuted(m => !m);
  };

  const openInstagram = () => {
    window.open(reel.url, '_blank', 'noopener,noreferrer');
  };

  if (!reel.video_url) return null;

  return (
    <div
      className="relative shrink-0 rounded-2xl overflow-hidden cursor-pointer group bg-black"
      style={{ width: 300, height: 533 }}
      onClick={openInstagram}
    >
      <video
        ref={videoRef}
        src={reel.video_url}
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover"
      />

      {/* Gradient overlay at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

      {/* Instagram icon — top right, shown on hover */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="bg-black/50 backdrop-blur-sm rounded-full p-1.5">
          <FiInstagram size={15} className="text-white" />
        </div>
      </div>

      {/* Mute/unmute — bottom right */}
      <button
        onClick={toggleMute}
        className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm rounded-full p-2 transition-all duration-200 hover:bg-black/70 z-10"
        title={muted ? 'Unmute' : 'Mute'}
      >
        {muted
          ? <FiVolumeX size={15} className="text-white" />
          : <FiVolume2 size={15} className="text-white" />
        }
      </button>
    </div>
  );
}

export default function InstagramReels() {
  const [reels, setReels] = useState<Reel[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getReels()
      .then((data: any[]) => setReels((data || []).filter((r: Reel) => r.video_url)))
      .catch(() => {});
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'right' ? 324 : -324, behavior: 'smooth' });
  };

  if (reels.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-brand mb-1">Social</p>
            <h2 className="text-2xl font-extrabold text-[#1C1C1C]">
              <span className="inline-flex items-center gap-2">
                <FiInstagram className="text-brand" size={22} />
                Follow us on Instagram
              </span>
            </h2>
            <div className="w-10 h-1 bg-brand rounded-full mt-2" />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-9 h-9 rounded-xl border border-[#E9E9EB] flex items-center justify-center text-[#686B78] hover:text-brand hover:border-brand transition-all"
            >
              <FiChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-9 h-9 rounded-xl border border-[#E9E9EB] flex items-center justify-center text-[#686B78] hover:text-brand hover:border-brand transition-all"
            >
              <FiChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Scrolling reels */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide items-start"
          style={{ scrollbarWidth: 'none' }}
        >
          {reels.map(reel => (
            <ReelCard key={reel.id} reel={reel} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <a
            href="https://www.instagram.com/makrivamakhana/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand hover:underline transition-all"
          >
            <FiInstagram size={16} /> @makrivamakhana
          </a>
        </div>

      </div>
    </section>
  );
}

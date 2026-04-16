'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiClock, FiStar, FiShield, FiArrowRight } from 'react-icons/fi';

const slides = [
  {
    image: '/images/makriva-gourmet-banner.png',
    tag: '🌾 100% Natural',
    title: 'Premium snacks,\nshipped to you',
    subtitle: 'Handpicked premium makhana from the farms of Bihar — crunchy, healthy & guilt-free.',
    cta: 'Order Now',
    ctaHref: '/products',
    accent: '#FF5200',
  },
  {
    image: '/images/makriva-kheer.png',
    tag: '💪 High Protein',
    title: 'Snack smart,\nlive better',
    subtitle: 'High protein, low calorie — the perfect anytime snack packed with flavour & nutrients.',
    cta: 'Shop Now',
    ctaHref: '/products',
    accent: '#FF6B35',
  },
  {
    image: '/images/makriva-three-combo.png',
    tag: '✨ Premium Quality',
    title: 'Pure origins,\npremium taste',
    subtitle: 'Sourced directly from farmers. Zero additives. Maximum nutrition in every bite.',
    cta: 'Our Story',
    ctaHref: '/about',
    accent: '#FF5200',
  },
];

const stats = [
  { icon: <FiClock size={18} />,  value: 'Pan-India', label: 'Delivery' },
  { icon: <FiStar size={18} />,   value: '4.8★',      label: 'Average Rating' },
  { icon: <FiShield size={18} />, value: '100%',      label: 'Natural & Pure' },
];

export default function HeroSection() {
  const [current, setCurrent]       = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrent(c => (c + 1) % slides.length), 5500);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section className="relative min-h-[88vh] flex flex-col justify-center overflow-hidden pt-16">
      {/* ── Background slide ────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9 }}
          className="absolute inset-0"
        >
          <Image src={slide.image} alt="" fill className="object-cover" priority />
          {/* Gradient overlay — left heavy for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />
          {/* Bottom gradient so stats row reads cleanly */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* ── Content ─────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center py-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="max-w-xl"
          >
            {/* Tag */}
            <motion.span
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-white mb-5 border border-white/30 backdrop-blur-sm"
              style={{ background: 'rgba(255,82,0,0.75)' }}
            >
              {slide.tag}
            </motion.span>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-5 leading-tight tracking-tight">
              {slide.title.split('\n').map((line, i) => (
                <span key={i} className={`block ${i === 1 ? 'text-transparent bg-clip-text' : ''}`}
                  style={i === 1 ? { backgroundImage: 'linear-gradient(90deg, #FF8C00, #FFD166)' } : {}}>
                  {line}
                </span>
              ))}
            </h1>

            <p className="text-white/80 text-base sm:text-lg mb-8 leading-relaxed max-w-md">
              {slide.subtitle}
            </p>

            {/* ── Search bar ─────────────────────────────────── */}
            <div className="flex gap-0 mb-8 max-w-md">
              <div className="flex-1 relative">
                <FiSearch size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#93959F]" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder='Try "Rock Salt Makhana"…'
                  className="w-full pl-11 pr-4 py-4 rounded-l-2xl bg-white text-[#1C1C1C] text-sm font-medium outline-none placeholder:text-[#93959F] transition-all"
                />
              </div>
              <Link
                href={searchQuery ? `/products?q=${encodeURIComponent(searchQuery)}` : '/products'}
                className="px-6 py-4 rounded-r-2xl font-bold text-sm text-white flex items-center gap-2 transition-all active:scale-95"
                style={{ background: 'linear-gradient(135deg, #FF5200, #FF8C00)' }}
              >
                Search <FiArrowRight size={16} />
              </Link>
            </div>

            {/* CTA buttons */}
            <div className="flex items-center gap-4 flex-wrap">
              <Link
                href={slide.ctaHref}
                className="btn-gold px-8 py-3.5 text-sm shadow-lg"
              >
                {slide.cta}
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white transition-colors"
              >
                Learn More <FiArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Stats row ───────────────────────────────────────── */}
      <div className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <div className="flex gap-6 sm:gap-10">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ background: 'rgba(255,82,0,0.80)', backdropFilter: 'blur(8px)' }}>
                  {s.icon}
                </div>
                <div>
                  <p className="text-white font-extrabold text-base leading-none">{s.value}</p>
                  <p className="text-white/60 text-xs mt-0.5">{s.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Slide indicators ────────────────────────────────── */}
      <div className="absolute bottom-6 right-6 sm:right-10 flex items-center gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current ? 'w-6 h-2.5 bg-brand' : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    image: '/images/makriva-hero-background.png',
    tag: 'Premium Quality',
    title: 'Nature\'s Finest\nFox Nuts',
    subtitle: 'Handpicked from the pristine lakes of Bihar — pure, healthy & delicious.',
    cta: 'Shop Now',
    ctaHref: '/products',
  },
  {
    image: '/images/banner-healthy-life.jpg',
    tag: 'Healthy Snacking',
    title: 'Snack Smart,\nLive Better',
    subtitle: 'High protein, low calorie — the perfect guilt-free snack for every occasion.',
    cta: 'Explore Range',
    ctaHref: '/products',
  },
  {
    image: '/images/banner-why-makriva.png',
    tag: 'Why MakRiva',
    title: 'Premium Grades,\nPure Origins',
    subtitle: 'Sourced directly from farmers. Zero additives. Maximum nutrition.',
    cta: 'Our Story',
    ctaHref: '/about',
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent(c => (c + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
      {/* Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <Image src={slide.image} alt="" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl"
          >
            <span className="inline-block text-xs font-bold tracking-[0.3em] uppercase text-[#D4AF37] mb-4 px-3 py-1 border border-[#D4AF37]/30">
              {slide.tag}
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
              {slide.title.split('\n').map((line, i) => (
                <span key={i} className={i === 1 ? 'text-gold-gradient block' : 'block'}>{line}</span>
              ))}
            </h1>
            <p className="text-gray-300 text-lg mb-8 max-w-lg leading-relaxed">{slide.subtitle}</p>
            <div className="flex gap-4 flex-wrap">
              <Link href={slide.ctaHref} className="btn-gold">{slide.cta}</Link>
              <Link href="/about" className="btn-outline-gold">Learn More</Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`h-0.5 transition-all duration-300 ${i === current ? 'w-8 bg-[#D4AF37]' : 'w-4 bg-white/30'}`} />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-8 flex flex-col items-center gap-2 text-gray-400 text-xs tracking-widest z-10">
        <div className="w-px h-12 bg-gradient-to-b from-[#D4AF37] to-transparent" />
        <span style={{ writingMode: 'vertical-rl' }}>SCROLL</span>
      </div>
    </section>
  );
}

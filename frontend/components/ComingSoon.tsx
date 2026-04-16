'use client';

import { useState } from 'react';
import { FiBell } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ComingSoon() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    toast.success('You\'re on the list! We\'ll notify you first.');
    setEmail('');
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA] relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full opacity-5"
          style={{ background: 'radial-gradient(ellipse, #FF5200 0%, transparent 70%)' }} />
      </div>

      <div className="max-w-3xl mx-auto text-center relative z-10">
        {/* Pulsing badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand/30 bg-brand/10 mb-8">
          <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
          <span className="text-brand text-xs font-semibold uppercase tracking-widest">Coming Soon</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C1C1C] mb-4 leading-tight">
          Something <span className="text-brand">Exciting</span> is on the Way
        </h2>

        <p className="text-[#686B78] text-base sm:text-lg mb-10 leading-relaxed max-w-xl mx-auto">
          We're crafting something special for you. New flavours, new experiences — you'll want to be the first to know.
        </p>

        {/* Email notify form */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="input-food flex-1 text-sm"
            />
            <button type="submit" className="btn-gold gap-2 whitespace-nowrap">
              <FiBell size={15} /> Notify Me
            </button>
          </form>
        ) : (
          <div className="inline-flex items-center gap-2 text-green-700 text-sm font-semibold border border-green-200 bg-green-50 px-5 py-3 rounded-xl">
            <span>✓</span> You're on the list — stay tuned!
          </div>
        )}

        {/* Decorative dots */}
        <div className="flex justify-center gap-2 mt-10">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-brand opacity-40"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

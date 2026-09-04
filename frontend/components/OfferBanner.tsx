'use client';

// Janmashtami campaign strip — temporary, safe to delete this file (and its
// <OfferBanner /> usage in Navbar.tsx) once the festival offer ends.

import { useState, useEffect } from 'react';
import { getActiveDiscounts } from '@/lib/api';
import { FiCopy } from 'react-icons/fi';
import { PeacockFeather, DiyaFlame } from './JanmashtamiMotifs';
import toast from 'react-hot-toast';

interface ActiveDiscount {
  code: string;
  description?: string | null;
  discount_type: 'percentage' | 'fixed';
  value: number;
}

export default function OfferBanner() {
  const [discount, setDiscount] = useState<ActiveDiscount | null>(null);

  useEffect(() => {
    getActiveDiscounts()
      .then((discounts: ActiveDiscount[]) => setDiscount(discounts?.[0] ?? null))
      .catch(() => {});
  }, []);

  const copyCode = () => {
    if (!discount) return;
    navigator.clipboard.writeText(discount.code);
    toast.success('Coupon code copied!');
  };

  return (
    <div className="festive-banner fixed top-0 left-0 right-0 z-[60] h-10 flex items-center justify-center px-3 text-white overflow-hidden border-b border-white/10">
      <div className="festive-banner-shine" />
      <div className="relative flex items-center gap-2.5 text-[11px] sm:text-sm font-semibold whitespace-nowrap overflow-x-auto scrollbar-hide max-w-full">
        <PeacockFeather size={16} className="shrink-0 -mb-1" />
        <span className="tracking-wide">Janmashtami Special</span>
        {discount && (
          <>
            <span className="text-white/40">•</span>
            <span className="text-festive-gold font-bold">Use code</span>
            <button
              onClick={copyCode}
              className="inline-flex items-center gap-1.5 pl-2.5 pr-2 py-1 rounded-full bg-white/15 hover:bg-white/25 border border-festive-gold/40 transition-colors font-mono tracking-wider shrink-0"
            >
              {discount.code} <FiCopy size={11} />
            </button>
          </>
        )}
        <DiyaFlame size={16} className="shrink-0 hidden sm:block" />
      </div>
    </div>
  );
}

'use client';

// Hand-drawn festive icon set for the Janmashtami campaign — symbolic motifs
// (feather, flute, pot) rather than a deity figure, the standard convention
// for Indian festive marketing. Safe to delete with the rest of the campaign.

import { useId } from 'react';

export function PeacockFeather({ size = 28, className = '' }: { size?: number; className?: string }) {
  const id = useId();
  return (
    <svg width={size} height={size * 1.7} viewBox="0 0 40 68" fill="none" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={`eye-${id}`} cx="50%" cy="38%" r="62%">
          <stop offset="0%" stopColor="#FFD97A" />
          <stop offset="42%" stopColor="#12B79C" />
          <stop offset="78%" stopColor="#6B2FA0" />
          <stop offset="100%" stopColor="#2A1746" />
        </radialGradient>
      </defs>
      <path d="M20 68 C20 42 20 20 20 6" stroke="#12B79C" strokeWidth="1.4" opacity="0.85" />
      <path d="M20 52 Q6 47 4 33" stroke="#12B79C" strokeWidth="1" fill="none" opacity="0.55" />
      <path d="M20 52 Q34 47 36 33" stroke="#12B79C" strokeWidth="1" fill="none" opacity="0.55" />
      <path d="M20 41 Q9 35 7 23" stroke="#12B79C" strokeWidth="1" fill="none" opacity="0.4" />
      <path d="M20 41 Q31 35 33 23" stroke="#12B79C" strokeWidth="1" fill="none" opacity="0.4" />
      <ellipse cx="20" cy="15" rx="13.5" ry="16.5" fill={`url(#eye-${id})`} />
      <ellipse cx="20" cy="15" rx="13.5" ry="16.5" fill="none" stroke="#FFD97A" strokeWidth="0.75" opacity="0.7" />
      <circle cx="20" cy="13" r="3.4" fill="#1B1035" />
      <circle cx="18.8" cy="11.6" r="1" fill="#FFD97A" opacity="0.8" />
    </svg>
  );
}

export function Bansuri({ size = 64, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size * 0.36} viewBox="0 0 120 42" fill="none" className={className} aria-hidden="true">
      <g transform="rotate(-10 60 21)">
        <rect x="4" y="15" width="112" height="11" rx="5.5" fill="#D9A441" />
        <rect x="4" y="15" width="112" height="11" rx="5.5" fill="none" stroke="#8A611E" strokeWidth="0.6" opacity="0.6" />
        <rect x="4" y="15" width="112" height="3.5" rx="1.75" fill="#F0C878" opacity="0.7" />
        {[22, 42, 62, 82, 100].map((x, i) => (
          <circle key={i} cx={x} cy="20.5" r="2.3" fill="#3B2A0E" />
        ))}
      </g>
      <circle cx="9" cy="10" r="3" fill="#8C3FC7" />
      <path d="M9 13 L7 22 M9 13 L9 23 M9 13 L11 22" stroke="#8C3FC7" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function Matki({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <path d="M14 19 Q24 11 34 19 L31 40 Q24 44.5 17 40 Z" fill="#C17A3A" />
      <path d="M14 19 Q24 11 34 19 L31.2 23.5 Q24 28 16.8 23.5 Z" fill="#96551D" />
      <ellipse cx="24" cy="19" rx="10.2" ry="3.2" fill="#E0954D" />
      <ellipse cx="24" cy="14.5" rx="6.2" ry="4" fill="#FFEBB8" />
      <path d="M19 31 h10 M19 35.5 h10" stroke="#7A4210" strokeWidth="1" opacity="0.45" strokeLinecap="round" />
    </svg>
  );
}

export function MusicNote({ size = 16, className = '', color = '#FFC44D' }: { size?: number; className?: string; color?: string }) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 20 28" fill="none" className={className} aria-hidden="true">
      <ellipse cx="6" cy="22" rx="5" ry="4" fill={color} transform="rotate(-15 6 22)" />
      <rect x="10" y="3" width="2.2" height="20" fill={color} />
      <path d="M12.2 3c4.8 1 5.8 5 5.8 8l-2.2-0.8c0-2.2-0.8-4.7-3.6-5.2Z" fill={color} />
    </svg>
  );
}

export function ButterDollop({ size = 22, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <path d="M16 5c4 3 9 7 9 13a9 9 0 1 1-18 0c0-6 5-10 9-13Z" fill="#FFE9A8" />
      <path d="M16 8c-3 2-6 7-8.4 13.2A9 9 0 0 1 7 18c0-6 5-10 9-13 1.5 1.1 3.2 2.5 4.7 4.1C18.4 8.4 17.1 8 16 8Z" fill="#FFF3D2" opacity="0.75" />
      <ellipse cx="12.5" cy="14" rx="2.4" ry="1.6" fill="#FFFDF5" opacity="0.9" />
    </svg>
  );
}

export function DiyaFlame({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 3c1.4 2.6 3 4.7 3 7a3 3 0 1 1-6 0c0-2.3 1.6-4.4 3-7Z" fill="#FFC44D" />
      <path d="M12 8.5c.7 1.1 1.3 2 1.3 3.1a1.3 1.3 0 1 1-2.6 0c0-1.1.6-2 1.3-3.1Z" fill="#FF7A3D" />
      <path d="M4 18c2.5-1.6 5.2-2.4 8-2.4s5.5.8 8 2.4c-2 1.6-4.8 2.4-8 2.4s-6-.8-8-2.4Z" fill="#B5651D" />
      <ellipse cx="12" cy="18" rx="6" ry="1.6" fill="#E0954D" />
    </svg>
  );
}

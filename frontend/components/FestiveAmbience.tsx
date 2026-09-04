'use client';

// Ambient drifting motifs for the Janmashtami hero — temporary, delete with
// the rest of the campaign. Positions/timings are preset (not randomized at
// render time) to avoid SSR/client hydration mismatches.

import { PeacockFeather, MusicNote, DiyaFlame } from './JanmashtamiMotifs';

const PARTICLES: { Icon: any; left: string; top: string; size: number; duration: number; delay: number; dx: number }[] = [
  { Icon: PeacockFeather, left: '6%',  top: '22%', size: 14, duration: 8,   delay: 0,   dx: 14 },
  { Icon: MusicNote,      left: '16%', top: '60%', size: 13, duration: 6.5, delay: 1.1, dx: -10 },
  { Icon: DiyaFlame,      left: '27%', top: '38%', size: 15, duration: 9,   delay: 2.3, dx: 10 },
  { Icon: MusicNote,      left: '38%', top: '18%', size: 12, duration: 7.2, delay: 0.6, dx: -12 },
  { Icon: PeacockFeather, left: '52%', top: '65%', size: 13, duration: 8.6, delay: 1.8, dx: 12 },
  { Icon: DiyaFlame,      left: '63%', top: '30%', size: 14, duration: 7.8, delay: 0.3, dx: -8 },
  { Icon: MusicNote,      left: '90%', top: '48%', size: 12, duration: 6.8, delay: 2.6, dx: 10 },
  { Icon: PeacockFeather, left: '78%', top: '20%', size: 12, duration: 9.4, delay: 1.4, dx: -14 },
];

export default function FestiveAmbience() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="absolute festive-drift"
          style={{
            left: p.left,
            top: p.top,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            ['--drift-dx' as any]: `${p.dx}px`,
          }}
        >
          <p.Icon size={p.size} />
        </div>
      ))}
    </div>
  );
}

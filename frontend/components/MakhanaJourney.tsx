'use client';

import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

type P = MotionValue<number>;

const stations = [
  { icon: '🌊', label: 'From the pond' },
  { icon: '💧', label: 'Washed & dried' },
  { icon: '🔥', label: 'Roasted' },
  { icon: '🔨', label: 'Popped' },
];
const N = stations.length;
const HIT = 0.86; // scroll progress at which the mallet lands
const BOX = 128; // seed box size in px

// Vertical position inside the rail for scroll progress v (top of rail → bottom, keeping the box on screen).
const top = (v: number, plus = 0) => `calc(${v * 100}% - ${v * BOX - plus}px)`;

function Station({ p, i }: { p: P; i: number }) {
  const mid = (i + 0.5) / N;
  const opacity = useTransform(p, [mid - 0.18, mid - 0.08], [0.35, 1]);
  const label = useTransform(p, [mid - 0.2, mid - 0.1, mid + 0.1, mid + 0.18], [0, 1, 1, 0]);
  return (
    <motion.div className="absolute right-[84px] hidden lg:flex items-center gap-1.5 -translate-y-1/2 whitespace-nowrap" style={{ top: top(mid, BOX / 2), opacity }}>
      <motion.span className="text-[11px] font-semibold text-[#1C1C1C] bg-white/90 rounded-full px-2 py-0.5 shadow-sm" style={{ opacity: label }}>{stations[i].label}</motion.span>
      <span className="text-base">{stations[i].icon}</span>
    </motion.div>
  );
}

function Puff({ x = 0, y = 0, s = 1 }: { x?: number; y?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx="-8" cy="-3" r="10" fill="#F7EEDC" stroke="#E4D3B2" strokeWidth="1.5" />
      <circle cx="8" cy="-4" r="10" fill="#F7EEDC" stroke="#E4D3B2" strokeWidth="1.5" />
      <circle cx="0" cy="4" r="12" fill="#FBF4E6" stroke="#E4D3B2" strokeWidth="1.5" />
      <ellipse cx="4" cy="-1" rx="3.5" ry="2.5" fill="#8B5A2B" opacity=".5" />
      <ellipse cx="-7" cy="6" rx="2" ry="1.5" fill="#8B5A2B" opacity=".4" />
    </g>
  );
}

function Drop({ p, i }: { p: P; i: number }) {
  const y = useTransform(p, v => ((v * 28 + i / 3) % 1) * 26);
  const opacity = useTransform(p, v => 1 - ((v * 28 + i / 3) % 1));
  return <motion.path d={`M${-9 + i * 9} 14 q-3 5 0 7 q3 -2 0 -7z`} fill="#6FB7D6" style={{ y, opacity }} />;
}

function Flame({ p, x, i }: { p: P; x: number; i: number }) {
  const scaleY = useTransform(p, v => 0.75 + 0.3 * Math.sin(v * 220 + i * 2));
  return (
    <motion.g style={{ scaleY, originY: 1 }}>
      <path d={`M${x} 34 Q${x - 7} 26 ${x} 16 Q${x + 7} 26 ${x} 34Z`} fill="#FF5200" />
      <path d={`M${x} 34 Q${x - 3.5} 29 ${x} 23 Q${x + 3.5} 29 ${x} 34Z`} fill="#FFC14D" />
    </motion.g>
  );
}

function Shard({ p, dx, dy }: { p: P; dx: number; dy: number }) {
  const x = useTransform(p, [HIT, HIT + 0.05], [0, dx]);
  const y = useTransform(p, [HIT, HIT + 0.025, HIT + 0.05], [0, dy, dy + 18]);
  const opacity = useTransform(p, [HIT - 0.001, HIT, HIT + 0.05], [0, 1, 0]);
  return <motion.path d="M-3 -2 L4 -4 L1 4Z" fill="#1E140E" style={{ x, y, opacity }} />;
}

function Seed({ p }: { p: P }) {
  const fill = useTransform(p, [0.2, 0.45, 0.55, 0.8], ['#6B5640', '#1E140E', '#1E140E', '#5A220C']);
  const roll = useTransform(p, [0, HIT], [0, 1080]);
  const jiggle = useTransform(p, v => (v > 0.55 && v < HIT ? Math.sin(v * 400) * 2 : 0));
  const seed = useTransform(p, [HIT - 0.002, HIT + 0.002], [1, 0]);
  const ripple = useTransform(p, v => (v * 30) % 1);
  const rippleScale = useTransform(ripple, [0, 1], [0.5, 1.5]);
  const rippleOpacity = useTransform(ripple, [0, 1], [0.9, 0]);
  const pond = useTransform(p, [0.18, 0.25], [1, 0]);
  const wash = useTransform(p, [0.24, 0.28, 0.46, 0.5], [0, 1, 1, 0]);
  const heat = useTransform(p, [0.5, 0.55, HIT - 0.04, HIT], [0, 1, 1, 0]);
  const flash = useTransform(p, [HIT, HIT + 0.01, HIT + 0.05], [0, 1, 0]);
  const ring = useTransform(p, [HIT, HIT + 0.05], [0.4, 1.8]);
  const puff = useTransform(p, [HIT, HIT + 0.03, HIT + 0.05], [0.3, 1.35, 1.15]);
  const puffIn = useTransform(p, [HIT - 0.002, HIT + 0.002], [0, 1]);
  const more = useTransform(p, [HIT + 0.05, HIT + 0.1], [0, 1]);

  return (
    <svg viewBox="-48 -48 96 96" className="w-full h-full overflow-visible">
      <defs>
        <radialGradient id="mj-glow">
          <stop offset="0" stopColor="#FF8C00" stopOpacity=".9" />
          <stop offset="1" stopColor="#FF5200" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle r="27" fill="#fff" opacity=".92" />
      <motion.g style={{ opacity: pond }}>
        <ellipse cx="0" cy="14" rx="30" ry="8" fill="#4E8F3A" stroke="#3B6E2C" strokeWidth="1.5" />
        <path d="M0 14 L22 9 L24 15Z" fill="#FFF8F5" />
        <motion.ellipse cx="0" cy="16" rx="34" ry="9" fill="none" stroke="#4FA3B8" strokeWidth="1.5" style={{ scale: rippleScale, opacity: rippleOpacity }} />
      </motion.g>

      <motion.g style={{ opacity: heat }}>
        <circle r="34" fill="url(#mj-glow)" />
        {[-12, 0, 12].map((x, i) => <Flame key={x} p={p} x={x} i={i} />)}
      </motion.g>

      <motion.g style={{ opacity: seed, x: jiggle }}>
        <motion.g style={{ rotate: roll }}>
          <motion.circle r="14" style={{ fill }} />
          <ellipse cx="-5" cy="-6" rx="4" ry="2.5" fill="#fff" opacity=".35" />
          <circle cx="6" cy="5" r="1.5" fill="#000" opacity=".3" />
        </motion.g>
      </motion.g>

      <motion.g style={{ opacity: wash }}>
        {[0, 1, 2].map(i => <Drop key={i} p={p} i={i} />)}
      </motion.g>

      <motion.circle r="20" fill="none" stroke="#FFB347" strokeWidth="2.5" style={{ opacity: flash, scale: ring }} />
      {[[-26, -20], [-14, -30], [16, -28], [28, -14], [4, -34]].map(([dx, dy]) => <Shard key={dx} p={p} dx={dx} dy={dy} />)}
      <motion.g style={{ opacity: more }}>
        <Puff x={-24} y={22} s={0.6} />
        <Puff x={22} y={24} s={0.55} />
      </motion.g>
      <motion.g style={{ opacity: puffIn, scale: puff }}>
        <Puff />
      </motion.g>
    </svg>
  );
}

function Mallet({ p }: { p: P }) {
  const rotate = useTransform(p, [0.76, HIT - 0.04, HIT, HIT + 0.04, 1], [70, 85, 0, 35, 35]);
  const opacity = useTransform(p, [0.74, 0.78, 0.96, 1], [0, 1, 1, 0]);
  return (
    <motion.div className="absolute left-[58px] -top-[18px] w-[86px] h-[86px]" style={{ rotate, opacity, originX: 1, originY: 0 }}>
      <svg viewBox="0 0 64 64" className="w-full h-full overflow-visible">
        <line x1="62" y1="2" x2="24" y2="40" stroke="#B07A45" strokeWidth="6" strokeLinecap="round" />
        <rect x="4" y="36" width="30" height="16" rx="4" fill="#8B5A2B" stroke="#6B421E" strokeWidth="2" transform="rotate(45 19 44)" />
      </svg>
    </motion.div>
  );
}

// Decorative: a makhana seed that travels down the right edge with the page scroll — pond, wash, roast, pop.
export default function MakhanaJourney() {
  const { scrollYProgress: p } = useScroll();
  const seedTop = useTransform(p, v => top(v));
  const sway = useTransform(p, v => Math.sin(v * Math.PI * 6) * 6);

  return (
    <div aria-hidden="true" className="fixed z-30 right-0 top-[76px] bottom-2 w-24 lg:w-32 pointer-events-none">
      <div className="absolute right-[47px] lg:right-[63px] top-[64px] bottom-[64px] w-0.5 bg-[#FF5200]/15 rounded-full">
        <motion.div className="w-full h-full bg-[#FF5200]/60 origin-top" style={{ scaleY: p }} />
      </div>
      {stations.map((_, i) => <Station key={i} p={p} i={i} />)}
      <motion.div className="absolute right-0 w-32 h-32" style={{ top: seedTop, x: sway }}>
        <div className="relative w-full h-full scale-75 lg:scale-100 origin-right">
          <Seed p={p} />
          <Mallet p={p} />
        </div>
      </motion.div>
    </div>
  );
}

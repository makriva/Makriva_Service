'use client';

const BENEFITS = [
  { icon: '🧠', label: 'Clarity' },
  { icon: '💪', label: 'Rich in Protein' },
  { icon: '🔥', label: 'Low Calorie' },
  { icon: '❤️', label: 'Heart Healthy' },
  { icon: '✨', label: 'Anti-Aging' },
  { icon: '🌾', label: 'Gluten Free' },
  { icon: '🦴', label: 'Bone Strength' },
  { icon: '😌', label: 'Stress Relief' },
  { icon: '🌿', label: 'Digestion Aid' },
  { icon: '⚡', label: 'Iron Rich' },
  { icon: '🫘', label: 'Kidney Health' },
  { icon: '😴', label: 'Sleep Aid' },
];

// Duplicate for seamless infinite loop
const ITEMS = [...BENEFITS, ...BENEFITS];

export default function HealthBenefits() {
  return (
    <section className="py-20 overflow-hidden">
      <div className="text-center mb-12 px-4">
        <p className="section-subtitle">Why Makhana?</p>
        <h2 className="section-title">Health Benefits</h2>
        <div className="gold-line" />
        <p className="text-gray-500 text-sm mt-2">Click to learn more about each benefit</p>
      </div>

      {/* Scrolling strip */}
      <div
        className="relative w-full overflow-hidden group/strip"
        style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}
      >
        <div className="flex gap-5 w-max health-scroll group-hover/strip:[animation-play-state:paused]">
          {ITEMS.map((benefit, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-3 cursor-pointer select-none
                         w-32 flex-shrink-0 p-4 border border-[#1E1E1E] bg-[#0D0D0D]
                         transition-all duration-300
                         hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/5
                         hover:scale-110 hover:shadow-[0_8px_30px_rgba(212,175,55,0.2)]
                         hover:[animation-play-state:paused]"
            >
              <div className="w-16 h-16 rounded-full border border-[#D4AF37]/30 flex items-center justify-center text-3xl bg-[#111]">
                {benefit.icon}
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 text-center leading-tight">
                {benefit.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

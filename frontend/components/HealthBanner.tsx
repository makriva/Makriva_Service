'use client';

const ITEMS = [
  '🌿 Rich in Antioxidants',
  '💪 High in Plant Protein',
  '🫀 Good for Heart Health',
  '⚡ Low Glycemic Index',
  '🦴 Calcium & Magnesium Rich',
  '🧠 Supports Brain Function',
  '🌾 100% Natural & Gluten-Free',
  '🔥 Low in Calories',
  '💊 Iron & Zinc Packed',
  '😴 Promotes Better Sleep',
];

export default function HealthBanner() {
  const track = [...ITEMS, ...ITEMS];

  return (
    <div className="bg-[#1a1a2e] overflow-hidden py-2.5 select-none">
      <div className="flex animate-marquee whitespace-nowrap">
        {track.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-2 text-xs font-semibold text-[#D4AF37] mx-6">
            {item}
            <span className="text-[#D4AF37]/40 text-[10px]">✦</span>
          </span>
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}

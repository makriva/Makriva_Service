import Image from 'next/image';

const benefits = [
  { icon: '🌿', title: 'Naturally Healthy', desc: 'High protein, low calorie — a superfood packed with antioxidants and essential minerals.' },
  { icon: '🏆', title: 'Premium Grades', desc: 'Carefully graded (small, medium, large) to ensure consistent size and superior texture.' },
  { icon: '🌾', title: 'Farm-to-Pack', desc: 'Sourced directly from Bihar\'s farmers. No middlemen, maximum freshness guaranteed.' },
  { icon: '✅', title: 'Zero Additives', desc: 'No artificial flavours, no preservatives. Just pure, natural makhana goodness.' },
  { icon: '🔥', title: 'Expertly Roasted', desc: 'Slow-roasted to perfection for that signature crisp texture without any compromise.' },
  { icon: '📦', title: 'Freshness Sealed', desc: 'Nitrogen-flushed packaging keeps every batch as fresh as day one.' },
];

export default function WhyMakriva() {
  return (
    <section className="py-20 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image src="/images/banner-about-us.png" alt="Why MakRiva" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            {/* Stats overlay */}
            <div className="absolute -bottom-6 -right-6 bg-[#111] border border-[#D4AF37]/30 p-6 max-w-[180px]">
              <div className="text-4xl font-bold text-gold-gradient mb-1">100%</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">Natural & Pure</div>
            </div>
          </div>

          {/* Content */}
          <div>
            <p className="section-subtitle">Why Choose Us</p>
            <h2 className="section-title text-left mb-4">The MakRiva Difference</h2>
            <div className="gold-line mx-0 mb-8" />
            <p className="text-gray-400 mb-10 leading-relaxed">
              At MakRiva, we believe healthy snacking should never compromise on taste. Every batch of our makhana goes through rigorous quality checks before reaching you.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {benefits.map(b => (
                <div key={b.title} className="flex gap-4">
                  <span className="text-2xl flex-shrink-0 mt-0.5">{b.icon}</span>
                  <div>
                    <h4 className="font-semibold text-sm text-white mb-1">{b.title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

const stats = [
  { value: '2,000+', label: 'Happy Customers', icon: '😊' },
  { value: '6+',     label: 'Product Variants', icon: '🛍️' },
  { value: '100%',   label: 'Natural & Pure',   icon: '🌿' },
  { value: '500+',   label: 'Cities Delivered',  icon: '🚚' },
];

export default function StatsSection() {
  return (
    <section className="py-12 bg-white border-y border-[#F0F0F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center group">
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className="text-3xl md:text-4xl font-extrabold text-brand mb-1">{s.value}</div>
              <div className="text-sm text-[#686B78] font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const facts = [
  { value: '~100',   unit: 'kcal',  label: 'Per 30g Serving',   color: 'bg-orange-50 border-orange-100', textColor: 'text-brand' },
  { value: '4.5g',   unit: 'protein', label: 'Per Serving',     color: 'bg-green-50 border-green-100',  textColor: 'text-green-700' },
  { value: '0g',     unit: 'oil',    label: 'Dry Roasted',       color: 'bg-blue-50 border-blue-100',    textColor: 'text-blue-700' },
  { value: 'Zero',   unit: '',       label: 'Preservatives',     color: 'bg-purple-50 border-purple-100', textColor: 'text-purple-700' },
];

export default function NutritionHighlight() {
  return (
    <section className="py-16 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-brand text-xs font-bold tracking-[0.2em] uppercase mb-2">Clean Label</p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#1C1C1C] mb-3">Nutrition at a Glance</h2>
          <div className="gold-line" />
          <p className="text-[#686B78] text-sm mt-4 max-w-md mx-auto">
            Makhana is one of nature's best superfoods. Here's why it belongs in every healthy diet.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {facts.map(f => (
            <div key={f.label} className={`rounded-2xl border p-5 text-center ${f.color}`}>
              <div className={`text-3xl font-extrabold mb-0.5 ${f.textColor}`}>{f.value}</div>
              {f.unit && <div className={`text-xs font-bold uppercase tracking-wider ${f.textColor} opacity-70`}>{f.unit}</div>}
              <div className="text-xs text-[#686B78] mt-1">{f.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: '🧬',
              title: 'Rich in Minerals',
              desc: 'Loaded with calcium, magnesium, potassium, and phosphorus — essential for bone health and muscle function.',
            },
            {
              icon: '🫀',
              title: 'Heart Friendly',
              desc: 'Low in saturated fat and sodium with natural anti-inflammatory properties. Supports a healthy heart.',
            },
            {
              icon: '⚖️',
              title: 'Weight Management',
              desc: 'High satiety index keeps you fuller for longer. Swap chips for makhana and notice the difference.',
            },
          ].map(b => (
            <div key={b.title} className="bg-white rounded-2xl border border-[#F0F0F0] p-6 flex gap-4">
              <span className="text-3xl shrink-0">{b.icon}</span>
              <div>
                <h3 className="font-bold text-[#1C1C1C] mb-1.5">{b.title}</h3>
                <p className="text-sm text-[#686B78] leading-relaxed">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

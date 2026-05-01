'use client';

import { useEffect, useRef, useState } from 'react';

const testimonials = [
  { name: 'Priya S.',   city: 'Mumbai',    text: 'The large grade makhana is absolutely divine! Perfect for evening snacking — crispy, light, and so satisfying. Will definitely reorder!', rating: 5, initial: 'P' },
  { name: 'Rahul K.',   city: 'Delhi',     text: 'Been ordering Makriva for 3 months now. The quality is incredibly consistent and the packaging keeps them fresh for weeks. Highly recommend.', rating: 5, initial: 'R' },
  { name: 'Anita M.',   city: 'Bangalore', text: 'The dry roasted variant is perfect for my fitness goals. High protein, low carb, and actually delicious. Love that there are no artificial additives!', rating: 5, initial: 'A' },
  { name: 'Vikram T.',  city: 'Hyderabad', text: 'Gifted a combo pack to my parents and they absolutely love it. The presentation is premium and the quality speaks for itself.', rating: 5, initial: 'V' },
  { name: 'Kavya R.',   city: 'Pune',      text: 'Rock salt & pepper flavour is my new addiction! The packaging is very premium, makes it a great gift. Fast delivery too!', rating: 5, initial: 'K' },
  { name: 'Deepak N.',  city: 'Chennai',   text: 'Switched from regular chips to Makriva and never looked back. My whole family loves it — kids, parents, everyone!', rating: 5, initial: 'D' },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    timer.current = setInterval(() => setActive(a => (a + 1) % testimonials.length), 4000);
  };
  const stop = () => { if (timer.current) clearInterval(timer.current); };

  useEffect(() => { start(); return stop; }, []);

  const t = testimonials[active];

  return (
    <section className="py-20 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-brand text-xs font-bold tracking-[0.2em] uppercase mb-2">Customer Love</p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#1C1C1C] mb-3">What Our Customers Say</h2>
          <div className="gold-line" />
          <p className="text-[#686B78] text-sm mt-4">Trusted by 2,000+ happy snackers across India</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-center">

          {/* Rating summary */}
          <div className="flex flex-col items-center bg-white rounded-2xl border border-[#F0F0F0] px-8 py-8 shadow-sm shrink-0 w-full lg:w-56">
            <div className="text-6xl font-extrabold text-[#1C1C1C]">4.8</div>
            <div className="flex gap-1 mt-2">
              {[1,2,3,4,5].map(s => <span key={s} className="text-[#FFB800] text-xl">★</span>)}
            </div>
            <p className="text-xs text-[#686B78] mt-1 mb-5">Overall Rating</p>
            <div className="space-y-2 w-full">
              {[5,4,3,2,1].map((star, i) => (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-xs text-[#686B78] w-3">{star}</span>
                  <span className="text-[#FFB800] text-xs">★</span>
                  <div className="flex-1 h-1.5 bg-[#F0F0F0] rounded-full overflow-hidden">
                    <div className="h-full bg-[#FFB800] rounded-full" style={{ width: ['88%','8%','2%','1%','1%'][i] }} />
                  </div>
                  <span className="text-xs text-[#93959F] w-8">{['88%','8%','2%','1%','1%'][i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Active card + nav */}
          <div className="flex-1 w-full" onMouseEnter={stop} onMouseLeave={start}>
            {/* Big card */}
            <div className="bg-white rounded-2xl border border-[#F0F0F0] p-8 shadow-sm min-h-[220px] flex flex-col justify-between transition-all duration-300">
              <div>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, s) => <span key={s} className="text-[#FFB800] text-lg">★</span>)}
                </div>
                <blockquote className="text-[#1C1C1C] text-base leading-relaxed">
                  &ldquo;{t.text}&rdquo;
                </blockquote>
              </div>
              <div className="flex items-center gap-3 pt-5 mt-5 border-t border-[#F0F0F0]">
                <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-white font-bold shrink-0">
                  {t.initial}
                </div>
                <div>
                  <p className="font-bold text-[#1C1C1C] text-sm">{t.name}</p>
                  <p className="text-xs text-[#686B78]">{t.city} · Verified Buyer</p>
                </div>
                <span className="ml-auto text-xs bg-green-50 text-green-700 font-semibold px-2.5 py-1 rounded-full border border-green-100">✓ Verified</span>
              </div>
            </div>

            {/* Dot + thumbnail row */}
            <div className="flex items-center gap-3 mt-5 justify-center">
              {testimonials.map((item, i) => (
                <button
                  key={i}
                  onClick={() => { stop(); setActive(i); start(); }}
                  className={`flex items-center justify-center rounded-full font-bold text-xs transition-all duration-300 border-2 ${
                    i === active
                      ? 'w-10 h-10 border-brand text-brand bg-brand/10 scale-110'
                      : 'w-8 h-8 border-[#E0E0E0] text-[#BDBDBD] bg-white hover:border-brand/50'
                  }`}
                >
                  {item.initial}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

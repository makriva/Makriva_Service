'use client';

import { useState } from 'react';

const testimonials = [
  { name: 'Priya S.', city: 'Mumbai', text: 'The large grade makhana is absolutely divine! Perfect for evening snacking — crispy, light, and so satisfying. Will definitely reorder!', rating: 5, initial: 'P' },
  { name: 'Rahul K.', city: 'Delhi', text: 'Been ordering MakRiva for 3 months now. The quality is incredibly consistent and the packaging keeps them fresh for weeks. Highly recommend.', rating: 5, initial: 'R' },
  { name: 'Anita M.', city: 'Bangalore', text: 'The dry roasted variant is perfect for my fitness goals. High protein, low carb, and actually delicious. Love that there are no artificial additives!', rating: 5, initial: 'A' },
  { name: 'Vikram T.', city: 'Hyderabad', text: 'Gifted a combo pack to my parents and they absolutely love it. The presentation is premium and the quality speaks for itself.', rating: 5, initial: 'V' },
  { name: 'Kavya R.', city: 'Pune', text: 'Rock salt & pepper flavour is my new addiction! The packaging is also very premium, makes it a great gift. Fast delivery too!', rating: 5, initial: 'K' },
  { name: 'Deepak N.', city: 'Chennai', text: 'Switched from regular chips to MakRiva and never looked back. My whole family loves it — kids, parents, everyone!', rating: 5, initial: 'D' },
];

export default function Testimonials() {
  const [page, setPage] = useState(0);
  const perPage = 3;
  const totalPages = Math.ceil(testimonials.length / perPage);
  const visible = testimonials.slice(page * perPage, page * perPage + perPage);

  return (
    <section className="py-20 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-brand text-xs font-bold tracking-[0.2em] uppercase mb-2">Customer Love</p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#1C1C1C] mb-3">What Our Customers Say</h2>
          <div className="gold-line" />
          <p className="text-[#686B78] text-sm mt-4">Trusted by 2,000+ happy snackers across India</p>
        </div>

        {/* Rating summary bar */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12 bg-white rounded-2xl border border-[#F0F0F0] px-8 py-6 max-w-xl mx-auto shadow-sm">
          <div className="text-center">
            <div className="text-5xl font-extrabold text-[#1C1C1C]">4.8</div>
            <div className="flex gap-1 justify-center mt-1">
              {[1,2,3,4,5].map(s => <span key={s} className="text-[#FFB800] text-lg">★</span>)}
            </div>
            <p className="text-xs text-[#686B78] mt-1">Overall Rating</p>
          </div>
          <div className="hidden sm:block w-px h-16 bg-[#F0F0F0]" />
          <div className="space-y-1.5 flex-1 min-w-[180px]">
            {[5,4,3,2,1].map((star, i) => (
              <div key={star} className="flex items-center gap-2">
                <span className="text-xs text-[#686B78] w-3">{star}</span>
                <span className="text-[#FFB800] text-xs">★</span>
                <div className="flex-1 h-1.5 bg-[#F0F0F0] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#FFB800] rounded-full"
                    style={{ width: ['88%', '8%', '2%', '1%', '1%'][i] }}
                  />
                </div>
                <span className="text-xs text-[#93959F] w-8">{['88%', '8%', '2%', '1%', '1%'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial cards grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {visible.map((t, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#F0F0F0] p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, s) => (
                  <span key={s} className="text-[#FFB800] text-base">★</span>
                ))}
              </div>
              {/* Quote */}
              <blockquote className="text-[#1C1C1C] text-sm leading-relaxed flex-1 mb-5">
                "{t.text}"
              </blockquote>
              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#F0F0F0]">
                <div className="w-9 h-9 rounded-full bg-brand flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {t.initial}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1C1C1C]">{t.name}</p>
                  <p className="text-xs text-[#686B78]">{t.city} · Verified Buyer</p>
                </div>
                <span className="ml-auto text-xs bg-green-50 text-green-700 font-semibold px-2 py-0.5 rounded-full border border-green-100">✓ Verified</span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination dots */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === page ? 'w-8 bg-brand' : 'w-2 bg-[#E0E0E0] hover:bg-[#CCC]'}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

'use client';

import { useState } from 'react';
import { FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const testimonials = [
  { name: 'Priya S.', city: 'Mumbai', text: 'The large grade makhana is absolutely divine! Perfect for evening snacking — crispy, light, and so satisfying. Will definitely reorder!', rating: 5 },
  { name: 'Rahul K.', city: 'Delhi', text: 'Been ordering MakRiva for 3 months now. The quality is incredibly consistent and the packaging keeps them fresh for weeks. Highly recommend.', rating: 5 },
  { name: 'Anita M.', city: 'Bangalore', text: 'The dry roasted variant is perfect for my fitness goals. High protein, low carb, and actually delicious. Love that there are no artificial additives!', rating: 5 },
  { name: 'Vikram T.', city: 'Hyderabad', text: 'Gifted a combo pack to my parents and they absolutely love it. The presentation is premium and the quality speaks for itself.', rating: 5 },
  { name: 'Kavya R.', city: 'Pune', text: 'Rock salt & pepper flavour is my new addiction! The packaging is also very premium, makes it a great gift. Fast delivery too!', rating: 5 },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent(c => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent(c => (c + 1) % testimonials.length);

  const t = testimonials[current];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <p className="section-subtitle">Customer Love</p>
        <h2 className="section-title">What Our Customers Say</h2>
        <div className="gold-line" />

        <div className="relative mt-8">
          <div className="bg-[#0D0D0D] border border-[#1E1E1E] p-8 md:p-12">
            {/* Stars */}
            <div className="flex justify-center gap-1 mb-6">
              {Array.from({ length: t.rating }).map((_, i) => (
                <FiStar key={i} size={18} className="text-[#D4AF37] fill-current" />
              ))}
            </div>
            <blockquote className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8 italic" style={{ fontFamily: 'Playfair Display, serif' }}>
              "{t.text}"
            </blockquote>
            <div>
              <div className="font-bold text-white">{t.name}</div>
              <div className="text-sm text-gray-500">{t.city}</div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <button onClick={prev} className="w-10 h-10 border border-[#222] flex items-center justify-center text-gray-400 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors">
              <FiChevronLeft size={18} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)}
                  className={`h-0.5 transition-all duration-300 ${i === current ? 'w-8 bg-[#D4AF37]' : 'w-4 bg-[#333]'}`} />
              ))}
            </div>
            <button onClick={next} className="w-10 h-10 border border-[#222] flex items-center justify-center text-gray-400 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors">
              <FiChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

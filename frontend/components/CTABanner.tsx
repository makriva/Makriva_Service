import Link from 'next/link';
import Image from 'next/image';

export default function CTABanner() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0">
        <Image src="/images/banner-medium-grade.jpg" alt="" fill className="object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#D4AF37] mb-4">Limited Time Offer</p>
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
          Free Shipping on Orders<br /><span className="text-gold-gradient">Above ₹499</span>
        </h2>
        <p className="text-gray-200 mb-8 max-w-lg mx-auto">Stock up on your favourite MakRiva makhana and enjoy free delivery straight to your doorstep across India.</p>
        <Link href="/products" className="btn-gold px-10 py-4 text-base">Shop Now</Link>
      </div>
    </section>
  );
}

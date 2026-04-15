import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <div className="relative h-64 md:h-96 overflow-hidden">
          <Image src="/images/banner-about-us.png" alt="About MakRiva" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="text-center">
              <p className="section-subtitle">Our Story</p>
              <h1 className="section-title text-5xl">About MakRiva</h1>
              <div className="gold-line" />
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <p className="section-subtitle">Who We Are</p>
              <h2 className="section-title text-left mb-4">Premium Makhana,<br />Pure Origins</h2>
              <div className="gold-line mx-0 mb-6" />
              <div className="space-y-4 text-gray-400 leading-relaxed">
                <p>MakRiva was born from a simple belief — that healthy snacking should never mean compromising on taste or quality. We source the finest fox nuts (makhana) directly from the fertile wetlands of Bihar and Madhya Pradesh, working hand-in-hand with local farmers.</p>
                <p>Every batch is carefully graded, cleaned, and processed in our state-of-the-art facility before being slow-roasted or flavoured with natural seasonings. No artificial additives, no preservatives — just pure makhana goodness.</p>
                <p>From our farm-to-pack promise to our zero-waste packaging initiative, everything we do reflects our commitment to quality, sustainability, and your health.</p>
              </div>
            </div>
            <div className="relative">
              <Image src="/images/makhana-origins-bg.png" alt="Makhana Origins" width={600} height={500} className="object-cover" />
            </div>
          </div>

          {/* Values */}
          <div className="text-center mb-12">
            <h2 className="section-title">Our Values</h2>
            <div className="gold-line" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '🌿', title: 'Natural First', desc: 'Every ingredient is 100% natural. No artificial flavors, colors, or preservatives — ever.' },
              { icon: '🤝', title: 'Farmer Partnership', desc: 'We partner directly with Bihar farmers, ensuring fair prices and sustainable harvesting.' },
              { icon: '✨', title: 'Uncompromising Quality', desc: 'Rigorous grading and quality checks at every stage — from farm to your doorstep.' },
            ].map(v => (
              <div key={v.title} className="bg-[#0D0D0D] border border-[#1E1E1E] p-8 text-center hover:border-[#D4AF37]/30 transition-colors">
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="font-bold text-lg mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

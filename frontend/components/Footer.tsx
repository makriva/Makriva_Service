import Link from 'next/link';
import Image from 'next/image';
import { IMG } from '@/lib/staticImages';
import { FiInstagram, FiFacebook, FiYoutube, FiMail, FiPhone, FiMapPin, FiArrowRight } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#F0F0F0] mt-16">

      {/* ── CTA band ────────────────────────────────────────── */}
      <div className="border-b border-[#F0F0F0]" style={{ background: 'linear-gradient(135deg, #FF5200 0%, #FF8C00 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-extrabold text-white mb-1">Craving something crunchy?</h3>
            <p className="text-white/80 text-sm">Order now and get premium makhana delivered to your door.</p>
          </div>
          <Link href="/products" className="flex items-center gap-2 bg-white text-brand font-extrabold px-7 py-3.5 rounded-xl hover:bg-brand-50 transition-colors shrink-0 shadow-lg">
            Order Now <FiArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* ── Main footer grid ─────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">

          {/* Brand — full width on mobile, 1 col on lg */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-brand-50 flex items-center justify-center">
                <Image src={IMG.makrivaLogo} alt="MakRiva" width={40} height={40} className="object-contain" />
              </div>
              <span className="font-extrabold text-xl text-brand tracking-tight">MakRiva</span>
            </div>
            <p className="text-[#686B78] text-sm leading-relaxed mb-4">
              Premium makhana (fox nuts) sourced directly from Bihar's farms. Naturally healthy, irresistibly delicious.
            </p>
            <div className="inline-flex items-center gap-2 bg-brand-50 rounded-xl px-4 py-2 mb-5">
              <span className="text-[#FFB800] text-sm">★★★★★</span>
              <span className="text-sm font-bold text-[#1C1C1C]">4.8</span>
              <span className="text-xs text-[#686B78]">· 2,000+ customers</span>
            </div>
            <div className="flex gap-3">
              {[
                { href: 'https://www.instagram.com/makrivamakhana/', icon: <FiInstagram size={17} />, label: 'Instagram' },
                { href: 'https://www.facebook.com/profile.php?id=61583943211780', icon: <FiFacebook size={17} />, label: 'Facebook' },
                { href: 'https://youtube.com', icon: <FiYoutube size={17} />, label: 'YouTube' },
              ].map(({ href, icon, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-[#686B78] hover:text-brand hover:bg-brand-50 border border-[#E9E9EB] transition-all duration-200">
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Pages */}
          <div>
            <h4 className="font-extrabold text-xs text-[#1C1C1C] uppercase tracking-widest mb-5">Pages</h4>
            <ul className="space-y-3">
              {[
                ['Home', '/'],
                ['Products', '/products'],
                ['About Us', '/about'],
                ['Contact', '/contact'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="flex items-center gap-2 text-[#686B78] text-sm hover:text-brand transition-colors group">
                    <FiArrowRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity text-brand" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* My Account */}
          <div>
            <h4 className="font-extrabold text-xs text-[#1C1C1C] uppercase tracking-widest mb-5">My Account</h4>
            <ul className="space-y-3">
              {[
                ['Login', '/login'],
                ['Sign Up', '/signup'],
                ['My Orders', '/orders'],
                ['My Profile', '/profile'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="flex items-center gap-2 text-[#686B78] text-sm hover:text-brand transition-colors group">
                    <FiArrowRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity text-brand" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="font-extrabold text-xs text-[#1C1C1C] uppercase tracking-widest mb-5">Policies</h4>
            <ul className="space-y-3">
              {[
                ['Privacy Policy', '/privacy'],
                ['Shipping Policy', '/shipping-policy'],
                ['Return Policy', '/return-policy'],
                ['Terms & Conditions', '/terms'],
                ['Cancellation Policy', '/cancellation-policy'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="flex items-center gap-2 text-[#686B78] text-sm hover:text-brand transition-colors group">
                    <FiArrowRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity text-brand" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-extrabold text-xs text-[#1C1C1C] uppercase tracking-widest mb-5">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-[#686B78]">
                <div className="w-8 h-8 rounded-xl bg-brand-50 flex items-center justify-center shrink-0 mt-0.5">
                  <FiMapPin size={14} className="text-brand" />
                </div>
                <a href="https://www.google.com/maps/place/MakRiva+Traders" target="_blank" rel="noopener noreferrer"
                  className="hover:text-brand transition-colors leading-snug text-xs">
                  Jawahar Nagar, Safidon Road, Near Deep Palace Hotel, Jind, Haryana 126102
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-[#686B78]">
                <div className="w-8 h-8 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                  <FiMail size={14} className="text-brand" />
                </div>
                <a href="mailto:makrivatraders@gmail.com" className="hover:text-brand transition-colors text-xs">
                  makrivatraders@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-[#686B78]">
                <div className="w-8 h-8 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                  <FiPhone size={14} className="text-brand" />
                </div>
                <a href="tel:+918398030577" className="hover:text-brand transition-colors text-xs">
                  +91 83980 30577
                </a>
              </li>
            </ul>
            <div className="mt-5 p-3 bg-[#F8F8F8] rounded-xl border border-[#F0F0F0]">
              <p className="text-xs font-bold text-[#1C1C1C] mb-0.5">🚚 Pan-India Delivery</p>
              <p className="text-xs text-[#686B78]">Free delivery on orders above ₹499</p>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ───────────────────────────────────────── */}
        <div className="border-t border-[#F0F0F0] pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[#93959F] text-xs">
            © {new Date().getFullYear()} MakRiva Traders. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-[#93959F]">
            <span>Secure payments via</span>
            <span className="font-bold text-brand">Instamojo</span>
            <span className="text-[#E9E9EB]">|</span>
            <span>🔒 SSL secured</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

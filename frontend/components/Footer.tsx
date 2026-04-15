import Link from 'next/link';
import Image from 'next/image';
import { FiInstagram, FiFacebook, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-[#080808] border-t border-[#1E1E1E] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <Image src="/images/makriva-logo.png" alt="MakRiva" width={40} height={40} className="object-contain" />
              <span className="font-bold text-xl tracking-widest text-gold-gradient">MAKRIVA</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-5">
              Premium quality makhana (fox nuts) sourced directly from the farms of Bihar. Naturally healthy, deliciously flavoured.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#D4AF37] transition-colors"><FiInstagram size={18} /></a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#D4AF37] transition-colors"><FiFacebook size={18} /></a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#D4AF37] transition-colors"><FiYoutube size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest text-white mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {[['Shop', '/products'], ['About Us', '/about'], ['Contact', '/contact'], ['Privacy Policy', '/privacy']].map(([label, href]) => (
                <li key={href}><Link href={href} className="text-gray-500 text-sm hover:text-[#D4AF37] transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest text-white mb-5">Our Products</h4>
            <ul className="space-y-3">
              {['Premium Dry Roasted', 'Large Grade Makhana', 'Medium Grade Makhana', 'Rock Salt & Pepper', 'Pudina Fresh', 'Chilli Cheese'].map(p => (
                <li key={p}><Link href="/products" className="text-gray-500 text-sm hover:text-[#D4AF37] transition-colors">{p}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest text-white mb-5">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-gray-500">
                <FiMapPin size={15} className="mt-0.5 flex-shrink-0 text-[#D4AF37]" />
                <a href="https://www.google.com/maps/place/MakRiva+Traders/@29.3245682,76.3501392,860m/data=!3m2!1e3!4b1!4m6!3m5!1s0x391205608b63d11b:0xdd30b1c691b84a7a!8m2!3d29.3245635!4d76.3527141!16s%2Fg%2F11mlyj2py2?entry=ttu&g_ep=EgoyMDI2MDQxMi4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37] transition-colors">Jawahar Nagar, Safidon Road, Near Deep Palace Hotel, Jind, Haryana, 126102</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-500">
                <FiMail size={15} className="flex-shrink-0 text-[#D4AF37]" />
                <a href="mailto:makrivatraders@gmail.com" className="hover:text-[#D4AF37] transition-colors">makrivatraders@gmail.com</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-500">
                <FiPhone size={15} className="flex-shrink-0 text-[#D4AF37]" />
                <a href="tel:+918398030577" className="hover:text-[#D4AF37] transition-colors">+91 83980 30577</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1E1E1E] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-xs">© {new Date().getFullYear()} MakRiva. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <span>Payments secured by</span>
            <span className="text-[#D4AF37] font-semibold">Instamojo</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const LOGO_URL = 'https://res.cloudinary.com/dsqzdclae/image/upload/f_auto,q_auto/v1776442607/makriva-v2/makriva-logo.png';

interface PolicySection {
  title: string;
  body: string | string[];
}

interface PolicyLayoutProps {
  title: string;
  subtitle?: string;
  effectiveDate: string;
  lastUpdated: string;
  approvedBy?: string;
  sections: PolicySection[];
}

export default function PolicyLayout({
  title,
  subtitle,
  effectiveDate,
  lastUpdated,
  approvedBy = 'MakRiva Management Team',
  sections,
}: PolicyLayoutProps) {
  return (
    <>
      <Navbar />
      <main className="bg-[#FAFAFA] min-h-screen pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Official document header */}
          <div className="bg-white rounded-2xl border border-[#E8E8E8] shadow-sm overflow-hidden">

            {/* Top brand bar */}
            <div className="bg-[#080808] px-8 py-6 flex items-center justify-between">
              <Image
                src={LOGO_URL}
                alt="MakRiva"
                width={120}
                height={40}
                className="h-10 w-auto object-contain"
              />
              <span className="text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase">
                Official Document
              </span>
            </div>

            {/* Title block */}
            <div className="px-8 pt-8 pb-6 border-b border-[#F0F0F0]">
              <p className="text-[#FF5200] text-xs font-bold tracking-[0.2em] uppercase mb-2">MakRiva Policy</p>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#1C1C1C] mb-1">{title}</h1>
              {subtitle && <p className="text-[#686B78] text-sm mt-1">{subtitle}</p>}

              {/* Meta info row */}
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#686B78]">
                <span><span className="font-semibold text-[#1C1C1C]">Effective Date:</span> {effectiveDate}</span>
                <span><span className="font-semibold text-[#1C1C1C]">Last Updated:</span> {lastUpdated}</span>
                <span><span className="font-semibold text-[#1C1C1C]">Approved by:</span> {approvedBy}</span>
              </div>
            </div>

            {/* Policy body */}
            <div className="px-8 py-8 space-y-7">
              {sections.map((s, i) => (
                <div key={i}>
                  <h2 className="text-base font-bold text-[#1C1C1C] mb-2 flex items-start gap-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#FF5200] text-white text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {s.title}
                  </h2>
                  <div className="pl-8">
                    {Array.isArray(s.body) ? (
                      <ul className="space-y-1.5">
                        {s.body.map((item, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-[#686B78] leading-relaxed">
                            <span className="text-[#D4AF37] mt-1 shrink-0">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-[#686B78] leading-relaxed">{s.body}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Stamp / Footer */}
            <div className="px-8 py-6 bg-[#FAFAFA] border-t border-[#F0F0F0] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* Stamp circle */}
                <div className="relative w-16 h-16 shrink-0">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#D4AF37] flex items-center justify-center bg-white">
                    <Image
                      src={LOGO_URL}
                      alt="MakRiva Seal"
                      width={40}
                      height={40}
                      className="w-9 h-9 object-contain opacity-70"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1C1C1C]">MakRiva Traders</p>
                  <p className="text-[10px] text-[#686B78]">Jind, Haryana · India</p>
                  <p className="text-[10px] text-[#686B78]">team@makriva.in</p>
                </div>
              </div>
              <p className="text-[10px] text-[#93959F] text-center sm:text-right max-w-xs">
                This policy is subject to change. Continued use of MakRiva services after updates constitutes acceptance of the revised policy.
              </p>
            </div>
          </div>

          {/* Contact prompt */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[#686B78]">
              Questions about this policy?{' '}
              <a href="mailto:team@makriva.in" className="text-brand font-semibold hover:underline">
                team@makriva.in
              </a>
              {' '}or call{' '}
              <a href="tel:+918398030577" className="text-brand font-semibold hover:underline">
                +91 83980 30577
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

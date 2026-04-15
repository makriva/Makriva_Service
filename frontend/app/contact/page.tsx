'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success('Message sent! We\'ll reply within 24 hours.');
    setForm({ name: '', email: '', subject: '', message: '' });
    setSending(false);
  };

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-subtitle">Get in Touch</p>
            <h1 className="section-title">Contact Us</h1>
            <div className="gold-line" />
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <p className="text-gray-400 leading-relaxed mb-8">Have a question about our products or your order? We'd love to hear from you. Reach out and we'll respond as soon as possible.</p>
              <div className="space-y-6">
                {[
                  { icon: FiMail, label: 'Email', value: 'makrivatraders@gmail.com', href: 'mailto:makrivatraders@gmail.com' },
                  { icon: FiPhone, label: 'Phone', value: '+91 83980 30577', href: 'tel:+918398030577' },
                  { icon: FiMapPin, label: 'Location', value: 'Jawahar Nagar, Safidon Road, Near Deep Palace Hotel, Jind, Haryana, 126102', href: 'https://www.google.com/maps/place/MakRiva+Traders/@29.3245682,76.3501392,860m/data=!3m2!1e3!4b1!4m6!3m5!1s0x391205608b63d11b:0xdd30b1c691b84a7a!8m2!3d29.3245635!4d76.3527141!16s%2Fg%2F11mlyj2py2?entry=ttu&g_ep=EgoyMDI2MDQxMi4wIKXMDSoASAFQAw%3D%3D' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center border border-[#D4AF37]/30" style={{ background: 'rgba(212,175,55,0.05)' }}>
                      <item.icon size={18} className="text-[#D4AF37]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">{item.label}</p>
                      <a href={item.href} className="text-white hover:text-[#D4AF37] transition-colors">{item.value}</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-[#0D0D0D] border border-[#1E1E1E] p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: 'name', label: 'Name', type: 'text', required: true },
                  { key: 'email', label: 'Email', type: 'email', required: true },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1">{f.label}</label>
                    <input type={f.type} required={f.required} value={(form as any)[f.key]} onChange={e => setForm(ff => ({ ...ff, [f.key]: e.target.value }))} className="input-dark" />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Subject</label>
                <input type="text" required value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} className="input-dark" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Message</label>
                <textarea rows={5} required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} className="input-dark resize-none" />
              </div>
              <button type="submit" disabled={sending} className="btn-gold gap-2">
                <FiSend size={15} /> {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

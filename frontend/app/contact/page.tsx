'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { submitContact } from '@/lib/api';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await submitContact(form);
      toast.success('Message sent! We\'ll reply within 24 hours.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      toast.error('Failed to send. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="bg-[#FAFAFA] min-h-screen pt-[68px] pb-20">

        {/* Header band */}
        <div className="bg-white border-b border-[#F0F0F0] py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-bold tracking-widest uppercase text-brand mb-1">Support</p>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#1C1C1C]">Contact Us</h1>
            <p className="text-[#686B78] text-sm mt-1">We'd love to hear from you. Reach out and we'll respond within 24 hours.</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid lg:grid-cols-2 gap-10">

            {/* Contact Info */}
            <div>
              <p className="text-[#686B78] leading-relaxed mb-8">Have a question about our products or your order? We'd love to hear from you.</p>
              <div className="space-y-5">
                {[
                  { icon: FiMail, label: 'Email', value: 'team@makriva.in', href: 'mailto:team@makriva.in' },
                  { icon: FiPhone, label: 'Phone', value: '+91 83980 30577', href: 'tel:+918398030577' },
                  { icon: FiMapPin, label: 'Location', value: 'Jawahar Nagar, Safidon Road, Near Deep Palace Hotel, Jind, Haryana, 126102', href: 'https://www.google.com/maps/place/MakRiva+Traders/@29.3245682,76.3501392,860m/data=!3m2!1e3!4b1!4m6!3m5!1s0x391205608b63d11b:0xdd30b1c691b84a7a!8m2!3d29.3245635!4d76.3527141!16s%2Fg%2F11mlyj2py2?entry=ttu&g_ep=EgoyMDI2MDQxMi4wIKXMDSoASAFQAw%3D%3D' },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                      <item.icon size={17} className="text-brand" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#686B78] uppercase tracking-wider mb-0.5">{item.label}</p>
                      <a href={item.href} className="text-[#1C1C1C] hover:text-brand transition-colors text-sm leading-snug">{item.value}</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white border border-[#F0F0F0] rounded-2xl p-6 shadow-card space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: 'name', label: 'Name', type: 'text', required: true },
                  { key: 'email', label: 'Email', type: 'email', required: true },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-bold text-[#686B78] uppercase tracking-wider mb-1.5">{f.label}</label>
                    <input type={f.type} required={f.required} value={(form as any)[f.key]} onChange={e => setForm(ff => ({ ...ff, [f.key]: e.target.value }))} className="input-food" />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-bold text-[#686B78] uppercase tracking-wider mb-1.5">Subject</label>
                <input type="text" required value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} className="input-food" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#686B78] uppercase tracking-wider mb-1.5">Message</label>
                <textarea rows={5} required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} className="input-food resize-none" />
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

'use client';

import { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '@/lib/api';
import { FiSettings, FiSave, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

type Settings = {
  store_name: string;
  store_email: string;
  store_phone: string;
  store_address: string;
  shipping_charge: number;
  free_shipping_above: number;
  tax_percentage: number;
};

const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-300 mb-1.5">{label}</label>
    {hint && <p className="text-xs text-gray-500 mb-2">{hint}</p>}
    {children}
  </div>
);

export default function SettingsPage() {
  const [form, setForm] = useState<Settings>({
    store_name: '', store_email: '', store_phone: '', store_address: '',
    shipping_charge: 50, free_shipping_above: 499, tax_percentage: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSettings()
      .then(d => setForm(f => ({ ...f, ...d })))
      .catch(() => toast.error('Failed to load settings'))
      .finally(() => setLoading(false));
  }, []);

  const set = (key: keyof Settings, val: string | number) =>
    setForm(f => ({ ...f, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings(form);
      toast.success('Settings saved');
    } catch {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-32">
      <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-6 md:p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><FiSettings size={22}/> Store Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Manage shipping, taxes, and store details</p>
      </div>

      <div className="space-y-6">

        {/* Shipping */}
        <div className="bg-[#111] border border-[#1E1E1E] rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-[#D4AF37] uppercase tracking-widest">Shipping</h2>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Shipping Charge (₹)" hint="Flat fee for orders below free-shipping threshold">
              <input
                type="number" min={0} value={form.shipping_charge}
                onChange={e => set('shipping_charge', parseFloat(e.target.value) || 0)}
                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
              />
            </Field>
            <Field label="Free Shipping Above (₹)" hint="Orders at or above this get free shipping">
              <input
                type="number" min={0} value={form.free_shipping_above}
                onChange={e => set('free_shipping_above', parseFloat(e.target.value) || 0)}
                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
              />
            </Field>
          </div>

          <div className="bg-[#1A1A1A] rounded-lg px-4 py-3 text-xs text-gray-400">
            Preview: Orders below <span className="text-white font-semibold">₹{form.free_shipping_above}</span> pay <span className="text-white font-semibold">₹{form.shipping_charge}</span> shipping. Orders at or above get <span className="text-green-400 font-semibold">FREE</span> shipping.
          </div>
        </div>

        {/* Tax */}
        <div className="bg-[#111] border border-[#1E1E1E] rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-[#D4AF37] uppercase tracking-widest">Tax</h2>
          <Field label="Tax Percentage (%)" hint="Set 0 to disable tax">
            <input
              type="number" min={0} max={100} value={form.tax_percentage}
              onChange={e => set('tax_percentage', parseFloat(e.target.value) || 0)}
              className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
            />
          </Field>
        </div>

        {/* Store info */}
        <div className="bg-[#111] border border-[#1E1E1E] rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-[#D4AF37] uppercase tracking-widest">Store Info</h2>
          <Field label="Store Name">
            <input value={form.store_name} onChange={e => set('store_name', e.target.value)}
              className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]" />
          </Field>
          <Field label="Contact Email">
            <input value={form.store_email} onChange={e => set('store_email', e.target.value)}
              className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]" />
          </Field>
          <Field label="Phone">
            <input value={form.store_phone} onChange={e => set('store_phone', e.target.value)}
              className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]" />
          </Field>
          <Field label="Address">
            <textarea value={form.store_address} onChange={e => set('store_address', e.target.value)} rows={3}
              className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37] resize-none" />
          </Field>
        </div>

        <button
          onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-black transition-opacity disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg,#D4AF37,#F0D060)' }}
        >
          {saving ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"/> : <FiSave size={16}/>}
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { updateProfile } from '@/lib/api';
import { FiUser, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [form, setForm] = useState({ full_name: '', phone: '', address_line1: '', address_line2: '', city: '', state: '', pincode: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/login?redirect=/profile');
    if (user) setForm({ full_name: user.full_name || '', phone: '', address_line1: '', address_line2: '', city: '', state: '', pincode: '' });
  }, [user, loading]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(form);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
      <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 bg-[#FAFAFA] min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Avatar + name */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-brand/10 border-2 border-brand/20 flex items-center justify-center">
              <FiUser size={28} className="text-brand" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1C1C1C]">{user?.full_name || 'My Profile'}</h1>
              <p className="text-[#686B78] text-sm">{user?.email}</p>
            </div>
          </div>

          <form
            onSubmit={handleSave}
            className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
          >
            <h2 className="font-bold text-xs text-[#93959F] uppercase tracking-wider">Personal Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'full_name', label: 'Full Name', type: 'text' },
                { key: 'phone', label: 'Phone', type: 'tel' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs text-[#686B78] uppercase tracking-wider mb-1">{f.label}</label>
                  <input
                    type={f.type}
                    value={(form as any)[f.key]}
                    onChange={e => setForm(ff => ({ ...ff, [f.key]: e.target.value }))}
                    className="input-food"
                  />
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4">
              <h2 className="font-bold text-xs text-[#93959F] uppercase tracking-wider mb-4">Default Shipping Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'address_line1', label: 'Address Line 1', span: true },
                  { key: 'address_line2', label: 'Address Line 2', span: true },
                  { key: 'city', label: 'City' },
                  { key: 'state', label: 'State' },
                  { key: 'pincode', label: 'PIN Code' },
                ].map(f => (
                  <div key={f.key} className={(f as any).span ? 'sm:col-span-2' : ''}>
                    <label className="block text-xs text-[#686B78] uppercase tracking-wider mb-1">{f.label}</label>
                    <input
                      type="text"
                      value={(form as any)[f.key]}
                      onChange={e => setForm(ff => ({ ...ff, [f.key]: e.target.value }))}
                      className="input-food"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" disabled={saving} className="btn-gold flex items-center gap-2">
              <FiSave size={16} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>

        </div>
      </main>
      <Footer />
    </>
  );
}

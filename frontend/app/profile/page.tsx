'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { updateProfile } from '@/lib/api';
import { FiUser, FiSave, FiPackage, FiMapPin, FiMail, FiPhone, FiLogOut, FiChevronRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [form, setForm] = useState({
    full_name: '', phone: '',
    address_line1: '', address_line2: '', city: '', state: '', pincode: '',
  });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'address'>('info');

  useEffect(() => {
    if (!loading && !user) { router.push('/login?redirect=/profile'); return; }
    if (user) {
      setForm({
        full_name:    user.full_name    || '',
        phone:        user.phone        || '',
        address_line1: user.address_line1 || '',
        address_line2: user.address_line2 || '',
        city:         user.city         || '',
        state:        user.state        || '',
        pincode:      user.pincode      || '',
      });
    }
  }, [user, loading]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(form);
      toast.success('Profile updated successfully!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || 'U';

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
      <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <>
      <Navbar />
      <main className="pt-20 pb-20 bg-[#FAFAFA] min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Profile hero card */}
          <div className="bg-white rounded-2xl border border-[#F0F0F0] shadow-sm overflow-hidden mb-6">
            <div className="h-20 bg-gradient-to-r from-[#FF5200] to-[#FF8C00]" />
            <div className="px-6 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10 mb-5">
                <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-md flex items-center justify-center overflow-hidden bg-brand shrink-0">
                  {user?.avatar_url ? (
                    <Image src={user.avatar_url} alt={user.full_name || 'Profile'} width={80} height={80} className="object-cover w-full h-full" />
                  ) : (
                    <span className="text-2xl font-extrabold text-white">{initials}</span>
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-xl font-extrabold text-[#1C1C1C]">{user?.full_name || 'My Account'}</h1>
                  <p className="text-sm text-[#686B78] flex items-center gap-1 mt-0.5">
                    <FiMail size={12} /> {user?.email}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm text-[#686B78] hover:text-red-600 border border-[#F0F0F0] hover:border-red-200 px-4 py-2 rounded-xl transition-colors"
                >
                  <FiLogOut size={14} /> Sign Out
                </button>
              </div>

              {/* Quick stats / links */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <Link href="/orders" className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-[#F0F0F0] hover:border-brand/30 hover:bg-orange-50/50 transition-all group">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                      <FiPackage size={15} className="text-brand" />
                    </div>
                    <span className="text-sm font-semibold text-[#1C1C1C]">My Orders</span>
                  </div>
                  <FiChevronRight size={14} className="text-[#93959F] group-hover:text-brand transition-colors" />
                </Link>
                <button
                  onClick={() => setActiveTab('address')}
                  className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-[#F0F0F0] hover:border-brand/30 hover:bg-orange-50/50 transition-all group text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                      <FiMapPin size={15} className="text-brand" />
                    </div>
                    <span className="text-sm font-semibold text-[#1C1C1C]">Addresses</span>
                  </div>
                  <FiChevronRight size={14} className="text-[#93959F] group-hover:text-brand transition-colors" />
                </button>
                <div className="flex items-center gap-2.5 p-3.5 rounded-xl border border-[#F0F0F0]">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                    <FiPhone size={15} className="text-brand" />
                  </div>
                  <span className="text-sm text-[#686B78]">{user?.phone || 'No phone saved'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-white border border-[#F0F0F0] rounded-xl p-1 mb-4 w-fit">
            {(['info', 'address'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === tab
                    ? 'bg-brand text-white shadow-sm'
                    : 'text-[#686B78] hover:text-[#1C1C1C]'
                }`}
              >
                {tab === 'info' ? 'Personal Info' : 'Shipping Address'}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="bg-white border border-[#F0F0F0] rounded-2xl shadow-sm p-6 space-y-5">

            {activeTab === 'info' && (
              <>
                <h2 className="text-xs font-bold text-[#93959F] uppercase tracking-wider">Personal Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#686B78] uppercase tracking-wider mb-1.5">Full Name</label>
                    <div className="relative">
                      <FiUser size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#93959F]" />
                      <input
                        type="text"
                        value={form.full_name}
                        onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                        placeholder="Your full name"
                        className="input-food pl-9 w-full"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-[#686B78] uppercase tracking-wider mb-1.5">Phone Number</label>
                    <div className="relative">
                      <FiPhone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#93959F]" />
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        placeholder="+91 XXXXX XXXXX"
                        className="input-food pl-9 w-full"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-[#686B78] uppercase tracking-wider mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="input-food w-full opacity-60 cursor-not-allowed bg-[#F8F8F8]"
                  />
                  <p className="text-[10px] text-[#93959F] mt-1">Email cannot be changed. Contact support if needed.</p>
                </div>
              </>
            )}

            {activeTab === 'address' && (
              <>
                <h2 className="text-xs font-bold text-[#93959F] uppercase tracking-wider">Default Shipping Address</h2>
                <p className="text-xs text-[#686B78]">This address will be pre-filled at checkout and used for the delivery location button in the header.</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-[#686B78] uppercase tracking-wider mb-1.5">Address Line 1</label>
                    <input
                      type="text"
                      value={form.address_line1}
                      onChange={e => setForm(f => ({ ...f, address_line1: e.target.value }))}
                      placeholder="House / Flat / Building No., Street"
                      className="input-food w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#686B78] uppercase tracking-wider mb-1.5">Address Line 2 <span className="normal-case text-[#93959F]">(optional)</span></label>
                    <input
                      type="text"
                      value={form.address_line2}
                      onChange={e => setForm(f => ({ ...f, address_line2: e.target.value }))}
                      placeholder="Landmark, Area, Colony"
                      className="input-food w-full"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-[#686B78] uppercase tracking-wider mb-1.5">City</label>
                      <input
                        type="text"
                        value={form.city}
                        onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                        placeholder="e.g. Delhi"
                        className="input-food w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#686B78] uppercase tracking-wider mb-1.5">State</label>
                      <input
                        type="text"
                        value={form.state}
                        onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
                        placeholder="e.g. Haryana"
                        className="input-food w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#686B78] uppercase tracking-wider mb-1.5">PIN Code</label>
                      <input
                        type="text"
                        value={form.pincode}
                        onChange={e => setForm(f => ({ ...f, pincode: e.target.value }))}
                        placeholder="6-digit PIN"
                        maxLength={6}
                        className="input-food w-full"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="pt-2 flex items-center gap-3">
              <button type="submit" disabled={saving} className="btn-gold flex items-center gap-2 px-6">
                <FiSave size={15} /> {saving ? 'Saving…' : 'Save Changes'}
              </button>
              {!saving && (
                <p className="text-xs text-[#93959F]">Changes are saved to your account immediately.</p>
              )}
            </div>
          </form>

        </div>
      </main>
      <Footer />
    </>
  );
}

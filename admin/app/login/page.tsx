'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { adminLogin } from '@/lib/api';
import { FiMail, FiLock } from 'react-icons/fi';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await adminLogin(email, password);
      if (!data.user.is_admin) { toast.error('Not an admin account'); return; }
      Cookies.set('admin_token', data.access_token, { expires: 7, sameSite: 'lax' });
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full border border-[#D4AF37]/30 flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.05)' }}>
            <span className="text-2xl">👑</span>
          </div>
          <h1 className="text-2xl font-bold">MakRiva Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to manage your store</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 bg-[#0D0D0D] border border-[#1E1E1E] p-6">
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="input-admin pl-9" placeholder="admin@makriva.in" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="input-admin pl-9" placeholder="••••••••" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 mt-2">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

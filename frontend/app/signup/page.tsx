'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { register as apiRegister } from '@/lib/api';
import { FiMail, FiLock, FiUser, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { BsFacebook } from 'react-icons/bs';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', full_name: '', phone: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const data = await apiRegister({ email: form.email, full_name: form.full_name, phone: form.phone, password: form.password });
      login(data.access_token, data.user);
      toast.success('Account created! Welcome to MakRiva!');
      router.push('/');
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image src="/images/makriva-holding-packets.png" alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 flex flex-col justify-center px-16">
          <Image src="/images/makriva-logo.png" alt="MakRiva" width={60} height={60} className="object-contain mb-6" />
          <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Join the<br /><span className="text-gold-gradient">MakRiva Family</span>
          </h2>
          <p className="text-gray-400 leading-relaxed">Create your account and start enjoying premium makhana delivered to your door.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#FAFAFA]">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-[#1C1C1C] mb-2">Create an account</h1>
          <p className="text-[#686B78] text-sm mb-8">Already have one? <Link href="/login" className="text-brand hover:underline font-semibold">Sign in</Link></p>

          <div className="space-y-3 mb-6">
            <a href={`${API_URL}/api/auth/google`} className="flex items-center justify-center gap-3 w-full py-3 border border-gray-200 bg-white hover:border-brand hover:shadow-sm transition-all text-sm font-medium text-[#1C1C1C] rounded-xl">
              <FcGoogle size={20} /> Sign up with Google
            </a>
            <a href={`${API_URL}/api/auth/facebook`} className="flex items-center justify-center gap-3 w-full py-3 border border-gray-200 bg-white hover:border-blue-400 hover:shadow-sm transition-all text-sm font-medium text-[#1C1C1C] rounded-xl">
              <BsFacebook size={18} className="text-blue-500" /> Sign up with Facebook
            </a>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-[#93959F] uppercase tracking-wider">Or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: 'full_name', label: 'Full Name', type: 'text', icon: FiUser, placeholder: 'Your name' },
              { key: 'email', label: 'Email', type: 'email', icon: FiMail, placeholder: 'you@email.com' },
              { key: 'phone', label: 'Phone (optional)', type: 'tel', icon: FiPhone, placeholder: '+91 98765 43210' },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-xs text-[#686B78] uppercase tracking-wider mb-1">{field.label}</label>
                <div className="relative">
                  <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#93959F]" size={15} />
                  <input type={field.type} required={field.key !== 'phone'} value={(form as any)[field.key]} onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))} className="input-food pl-10" placeholder={field.placeholder} />
                </div>
              </div>
            ))}
            {['password', 'confirm'].map(key => (
              <div key={key}>
                <label className="block text-xs text-[#686B78] uppercase tracking-wider mb-1">{key === 'password' ? 'Password' : 'Confirm Password'}</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#93959F]" size={15} />
                  <input type={showPw ? 'text' : 'password'} required value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="input-food pl-10 pr-10" placeholder="••••••••" />
                  {key === 'password' && (
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#93959F] hover:text-[#1C1C1C] transition-colors">
                      {showPw ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button type="submit" disabled={loading} className="btn-gold w-full py-3 mt-2">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

'use client';

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { login as apiLogin } from '@/lib/api';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { BsFacebook } from 'react-icons/bs';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle OAuth token from URL
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      import('@/lib/api').then(({ getMe }) => {
        getMe().then(u => {
          login(token, u);
          router.push(searchParams.get('redirect') || '/');
        });
      });
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) router.push(searchParams.get('redirect') || '/');
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiLogin({ email, password });
      login(data.access_token, data.user);
      toast.success('Welcome back!');
      router.push(searchParams.get('redirect') || '/');
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-10 lg:hidden">
        <Image src="/images/makriva-logo.png" alt="MakRiva" width={48} height={48} className="object-contain mx-auto mb-4" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Sign in to your account</h1>
      <p className="text-gray-500 text-sm mb-8">Don&apos;t have an account? <Link href="/signup" className="text-[#D4AF37] hover:underline">Sign up</Link></p>

      {/* OAuth buttons */}
      <div className="space-y-3 mb-6">
        <a href={`${API_URL}/api/auth/google`} className="flex items-center justify-center gap-3 w-full py-3 border border-[#222] bg-[#111] hover:border-[#D4AF37] transition-colors text-sm font-medium">
          <FcGoogle size={20} /> Continue with Google
        </a>
        <a href={`${API_URL}/api/auth/facebook`} className="flex items-center justify-center gap-3 w-full py-3 border border-[#222] bg-[#111] hover:border-[#D4AF37] transition-colors text-sm font-medium">
          <BsFacebook size={18} className="text-blue-500" /> Continue with Facebook
        </a>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-[#1E1E1E]" />
        <span className="text-xs text-gray-600 uppercase tracking-wider">Or</span>
        <div className="flex-1 h-px bg-[#1E1E1E]" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Email</label>
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={15} />
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="input-dark pl-10" placeholder="you@email.com" />
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Password</label>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={15} />
            <input type={showPw ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} className="input-dark pl-10 pr-10" placeholder="••••••••" />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
              {showPw ? <FiEyeOff size={15} /> : <FiEye size={15} />}
            </button>
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-gold w-full py-3 mt-2">
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image src="/images/banner-healthy-life.jpg" alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 flex flex-col justify-center px-16">
          <Image src="/images/makriva-logo.png" alt="MakRiva" width={60} height={60} className="object-contain mb-6" />
          <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Welcome Back to<br /><span className="text-gold-gradient">MakRiva</span>
          </h2>
          <p className="text-gray-400 leading-relaxed">India&apos;s finest premium makhana, delivered fresh to your doorstep.</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#0A0A0A]">
        <Suspense fallback={<div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}

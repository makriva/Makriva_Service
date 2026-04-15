'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function Root() {
  const router = useRouter();
  useEffect(() => {
    const token = Cookies.get('admin_token');
    router.replace(token ? '/dashboard' : '/login');
  }, []);
  return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" /></div>;
}

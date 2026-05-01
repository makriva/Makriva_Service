'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiHome, FiPackage, FiShoppingBag, FiTag, FiUsers, FiGrid, FiLogOut, FiMenu, FiX, FiMessageSquare, FiInstagram, FiSettings, FiSend } from 'react-icons/fi';
import Cookies from 'js-cookie';
import { useState } from 'react';

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: FiHome },
  { href: '/dashboard/products', label: 'Products', icon: FiPackage },
  { href: '/dashboard/orders', label: 'Orders', icon: FiShoppingBag },
  { href: '/dashboard/discounts', label: 'Discounts', icon: FiTag },
  { href: '/dashboard/users', label: 'Users', icon: FiUsers },
  { href: '/dashboard/categories', label: 'Categories', icon: FiGrid },
  { href: '/dashboard/queries', label: 'Queries & Email', icon: FiMessageSquare },
  { href: '/dashboard/reels', label: 'Reels', icon: FiInstagram },
  { href: '/dashboard/settings', label: 'Settings', icon: FiSettings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const logout = () => {
    Cookies.remove('admin_token');
    router.push('/login');
  };

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#1E1E1E] flex items-center gap-3">
        <div className="w-8 h-8 flex items-center justify-center rounded-sm" style={{ background: 'linear-gradient(135deg,#D4AF37,#F0D060)' }}>
          <span className="text-black font-bold text-sm">M</span>
        </div>
        <div>
          <div className="font-bold text-sm tracking-wider">MAKRIVA</div>
          <div className="text-xs text-gray-500">Admin Portal</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(item => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-150 ${active
                ? 'text-black'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              style={active ? { background: 'linear-gradient(135deg,#D4AF37,#F0D060)' } : {}}>
              <item.icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-4 border-t border-[#1E1E1E] pt-4">
        <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-400 hover:text-red-400 w-full transition-colors">
          <FiLogOut size={16} /> Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-[#0D0D0D] border-r border-[#1E1E1E] fixed h-full z-30">
        <NavContent />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-[#0D0D0D] border-b border-[#1E1E1E] flex items-center justify-between px-4 h-14">
        <div className="font-bold text-sm tracking-wider">MAKRIVA ADMIN</div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-gray-400">
          {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div className="md:hidden fixed inset-0 bg-black/60 z-40" onClick={() => setMobileOpen(false)} />
          <aside className="md:hidden fixed top-0 left-0 h-full w-56 bg-[#0D0D0D] border-r border-[#1E1E1E] z-50 flex flex-col">
            <NavContent />
          </aside>
        </>
      )}
    </>
  );
}

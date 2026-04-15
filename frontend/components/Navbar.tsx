'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiSearch } from 'react-icons/fi';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Shop' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/95 backdrop-blur-md border-b border-[#1E1E1E]' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <Image src="/images/makriva-logo.png" alt="MakRiva" width={40} height={40} className="object-contain" />
              <span className="font-bold text-xl tracking-wider text-gold-gradient hidden sm:block">MAKRIVA</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} className="text-sm font-medium text-gray-300 hover:text-[#D4AF37] tracking-wider uppercase transition-colors duration-200">
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-4">
              {/* Cart */}
              <button onClick={() => setCartOpen(true)} className="relative text-gray-300 hover:text-[#D4AF37] transition-colors">
                <FiShoppingCart size={22} />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-black" style={{ background: 'linear-gradient(135deg,#D4AF37,#F0D060)' }}>
                    {itemCount}
                  </span>
                )}
              </button>

              {/* User */}
              {user ? (
                <div className="relative">
                  <button onClick={() => setUserMenu(!userMenu)} className="flex items-center gap-2 text-gray-300 hover:text-[#D4AF37] transition-colors">
                    {user.avatar_url
                      ? <Image src={user.avatar_url} alt="" width={32} height={32} className="rounded-full object-cover" />
                      : <FiUser size={22} />}
                  </button>
                  {userMenu && (
                    <div className="absolute right-0 top-12 w-48 bg-[#111] border border-[#222] py-1 z-50">
                      <Link href="/profile" onClick={() => setUserMenu(false)} className="block px-4 py-2 text-sm text-gray-300 hover:text-[#D4AF37] hover:bg-[#1a1a1a]">Profile</Link>
                      <Link href="/orders" onClick={() => setUserMenu(false)} className="block px-4 py-2 text-sm text-gray-300 hover:text-[#D4AF37] hover:bg-[#1a1a1a]">My Orders</Link>
                      {user.is_admin && (
                        <a href="http://localhost:3001" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-[#D4AF37] hover:bg-[#1a1a1a]">Admin Portal</a>
                      )}
                      <hr className="border-[#222] my-1" />
                      <button onClick={() => { logout(); setUserMenu(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-400 hover:text-red-400 hover:bg-[#1a1a1a]">Logout</button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login" className="text-gray-300 hover:text-[#D4AF37] transition-colors">
                  <FiUser size={22} />
                </Link>
              )}

              {/* Mobile menu button */}
              <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-gray-300 hover:text-[#D4AF37]">
                {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-black border-t border-[#1E1E1E] px-4 py-6">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                className="block py-3 text-gray-300 hover:text-[#D4AF37] tracking-wider uppercase text-sm border-b border-[#111]">
                {link.label}
              </Link>
            ))}
            {!user && (
              <div className="mt-4 flex gap-3">
                <Link href="/login" onClick={() => setMenuOpen(false)} className="btn-outline-gold flex-1 text-center py-2">Login</Link>
                <Link href="/signup" onClick={() => setMenuOpen(false)} className="btn-gold flex-1 text-center py-2">Sign Up</Link>
              </div>
            )}
          </div>
        )}
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IMG } from '@/lib/staticImages';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { updateProfile } from '@/lib/api';
import {
  FiShoppingCart, FiUser, FiMenu, FiX,
  FiSearch, FiMapPin, FiChevronDown, FiPackage, FiLogOut, FiCheck,
} from 'react-icons/fi';
import CartDrawer from './CartDrawer';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const [scrolled, setScrolled]         = useState(false);
  const [menuOpen, setMenuOpen]         = useState(false);
  const [cartOpen, setCartOpen]         = useState(false);
  const [userMenu, setUserMenu]         = useState(false);
  const [cartPulse, setCartPulse]       = useState(false);
  const [deliveryOpen, setDeliveryOpen] = useState(false);
  const [deliverySaving, setDeliverySaving] = useState(false);
  const [deliveryForm, setDeliveryForm] = useState({ line1: '', city: '', state: '', pincode: '' });
  const deliveryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Pre-fill delivery form from user profile or localStorage
  useEffect(() => {
    if (user?.city) {
      setDeliveryForm({
        line1:   (user as any).address_line1 || '',
        city:    (user as any).city || '',
        state:   (user as any).state || '',
        pincode: (user as any).pincode || '',
      });
    } else if (typeof window !== 'undefined') {
      try {
        const saved = JSON.parse(localStorage.getItem('deliveryAddress') || '{}');
        if (saved.city) setDeliveryForm(saved);
      } catch {}
    }
  }, [user]);

  // Close delivery dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (deliveryRef.current && !deliveryRef.current.contains(e.target as Node)) {
        setDeliveryOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSaveDelivery = async () => {
    if (!deliveryForm.city) { toast.error('Please enter a city'); return; }
    setDeliverySaving(true);
    try {
      if (user) {
        await updateProfile({ address_line1: deliveryForm.line1, city: deliveryForm.city, state: deliveryForm.state, pincode: deliveryForm.pincode });
      } else {
        localStorage.setItem('deliveryAddress', JSON.stringify(deliveryForm));
      }
      toast.success('Delivery address saved!');
      setDeliveryOpen(false);
    } catch {
      toast.error('Failed to save address');
    } finally {
      setDeliverySaving(false);
    }
  };

  // Pulse the cart badge whenever itemCount changes
  useEffect(() => {
    if (itemCount > 0) {
      setCartPulse(true);
      const t = setTimeout(() => setCartPulse(false), 450);
      return () => clearTimeout(t);
    }
  }, [itemCount]);

  const navLinks = [
    { href: '/',         label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/about',    label: 'About' },
    { href: '/contact',  label: 'Contact' },
  ];

  return (
    <>
      {/* ── Main Navbar ──────────────────────────────────────── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300 ${
          scrolled ? 'shadow-nav' : 'border-b border-[#F0F0F0]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-[68px] gap-4">

            {/* ── Logo ──────────────────────────────── */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden bg-brand-50">
                <Image
                  src={IMG.makrivaLogo}
                  alt="MakRiva"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <span
                className="font-extrabold text-lg tracking-tight hidden sm:block text-brand-gradient"
                style={{ letterSpacing: '-0.01em' }}
              >
                MakRiva
              </span>
            </Link>

            {/* ── Delivery location (desktop) ────────── */}
            <div className="hidden md:block relative shrink-0" ref={deliveryRef}>
              <button
                onClick={() => setDeliveryOpen(!deliveryOpen)}
                className="flex items-center gap-1.5 text-sm font-medium text-[#686B78] hover:text-brand transition-colors max-w-[200px]"
              >
                <FiMapPin size={15} className="text-brand shrink-0" />
                <span className="truncate">
                  {deliveryForm.city ? `Deliver to ${deliveryForm.city}` : 'Deliver to my location'}
                </span>
                <FiChevronDown size={13} className={`shrink-0 transition-transform ${deliveryOpen ? 'rotate-180' : ''}`} />
              </button>

              {deliveryOpen && (
                <div className="absolute top-[calc(100%+12px)] left-0 w-80 bg-white border border-[#E9E9EB] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-5 z-50 animate-fade-in">
                  <h3 className="font-extrabold text-sm text-[#1C1C1C] mb-4 flex items-center gap-2">
                    <FiMapPin size={15} className="text-brand" /> Set Delivery Address
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="House/Flat no., Street name"
                      value={deliveryForm.line1}
                      onChange={e => setDeliveryForm(f => ({ ...f, line1: e.target.value }))}
                      className="input-food text-sm py-2.5"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="City *"
                        value={deliveryForm.city}
                        onChange={e => setDeliveryForm(f => ({ ...f, city: e.target.value }))}
                        className="input-food text-sm py-2.5"
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={deliveryForm.state}
                        onChange={e => setDeliveryForm(f => ({ ...f, state: e.target.value }))}
                        className="input-food text-sm py-2.5"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="PIN Code"
                      value={deliveryForm.pincode}
                      onChange={e => setDeliveryForm(f => ({ ...f, pincode: e.target.value }))}
                      className="input-food text-sm py-2.5"
                    />
                  </div>
                  {!user && (
                    <p className="text-xs text-[#93959F] mt-2 flex items-center gap-1">
                      <FiUser size={11} />
                      <Link href="/login" className="text-brand hover:underline">Login</Link> to permanently save your address
                    </p>
                  )}
                  <button
                    onClick={handleSaveDelivery}
                    disabled={deliverySaving}
                    className="btn-gold w-full mt-3 py-2.5 text-sm gap-2"
                  >
                    {deliverySaving ? 'Saving…' : <><FiCheck size={14} /> Save Address</>}
                  </button>
                </div>
              )}
            </div>

            {/* ── Search bar (desktop) ───────────────── */}
            <div className="hidden md:flex flex-1 max-w-md relative">
              <FiSearch
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#93959F] pointer-events-none"
              />
              <input
                type="text"
                placeholder='Search "makhana snacks"'
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8F8F8] border border-transparent text-sm text-[#1C1C1C] placeholder:text-[#93959F] outline-none focus:border-brand focus:bg-white focus:shadow-[0_0_0_3px_rgba(255,82,0,0.10)] transition-all duration-200"
                onFocus={e => (e.currentTarget.placeholder = 'Search products…')}
                onBlur={e => (e.currentTarget.placeholder = 'Search "makhana snacks"')}
              />
            </div>

            {/* ── Desktop nav links ──────────────────── */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-semibold text-[#686B78] hover:text-brand transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* ── Right actions ──────────────────────── */}
            <div className="flex items-center gap-2">

              {/* Cart button */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-brand text-white hover:bg-brand-dark active:scale-95 transition-all duration-200 shadow-sm"
                aria-label="Open cart"
              >
                <FiShoppingCart size={18} />
                {itemCount > 0 && (
                  <span
                    className={`font-bold text-sm ${cartPulse ? 'animate-cart-bounce' : ''}`}
                  >
                    {itemCount}
                  </span>
                )}
                <span className="hidden sm:inline text-sm font-semibold">Cart</span>
              </button>

              {/* User menu */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenu(!userMenu)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#F8F8F8] transition-colors border border-[#E9E9EB]"
                  >
                    {user.avatar_url ? (
                      <Image
                        src={user.avatar_url}
                        alt=""
                        width={28}
                        height={28}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center">
                        <FiUser size={14} className="text-brand" />
                      </div>
                    )}
                    <FiChevronDown size={13} className="text-[#686B78] hidden sm:block" />
                  </button>

                  {userMenu && (
                    <div className="absolute right-0 top-[calc(100%+8px)] w-52 bg-white border border-[#E9E9EB] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] py-2 z-50 animate-fade-in">
                      <div className="px-4 py-2 border-b border-[#F0F0F0] mb-1">
                        <p className="text-xs font-semibold text-[#1C1C1C] truncate">{user.full_name || 'My Account'}</p>
                        <p className="text-xs text-[#93959F] truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#1C1C1C] hover:bg-[#FFF3EE] hover:text-brand transition-colors"
                      >
                        <FiUser size={14} /> Profile
                      </Link>
                      <Link
                        href="/orders"
                        onClick={() => setUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#1C1C1C] hover:bg-[#FFF3EE] hover:text-brand transition-colors"
                      >
                        <FiPackage size={14} /> My Orders
                      </Link>
                      {user.is_admin && (
                        <a
                          href="http://localhost:3001"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand hover:bg-[#FFF3EE] transition-colors"
                        >
                          Admin Portal
                        </a>
                      )}
                      <hr className="border-[#F0F0F0] my-1" />
                      <button
                        onClick={() => { logout(); setUserMenu(false); }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <FiLogOut size={14} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E9E9EB] text-sm font-semibold text-[#1C1C1C] hover:border-brand hover:text-brand transition-colors"
                >
                  <FiUser size={15} /> Login
                </Link>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 rounded-xl text-[#686B78] hover:bg-[#F8F8F8] transition-colors"
                aria-label="Toggle menu"
              >
                {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile menu ──────────────────────────────────────── */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-[#F0F0F0] px-4 py-4 animate-fade-in">
            {/* Mobile search */}
            <div className="relative mb-4">
              <FiSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#93959F]" />
              <input
                type="text"
                placeholder="Search products…"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8F8F8] border border-transparent text-sm text-[#1C1C1C] placeholder:text-[#93959F] outline-none focus:border-brand transition-all"
              />
            </div>

            {/* Mobile location */}
            <button
              onClick={() => { setMenuOpen(false); setDeliveryOpen(true); }}
              className="flex items-center gap-2 text-sm text-[#686B78] mb-4 hover:text-brand transition-colors"
            >
              <FiMapPin size={14} className="text-brand" />
              {deliveryForm.city ? `Deliver to ${deliveryForm.city}` : 'Set delivery location'}
            </button>

            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center py-3 text-[#1C1C1C] font-semibold text-sm border-b border-[#F5F5F5] last:border-0 hover:text-brand transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {!user && (
              <div className="mt-4 flex gap-3">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="btn-outline-gold flex-1 text-center py-2.5 text-sm"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="btn-gold flex-1 text-center py-2.5 text-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

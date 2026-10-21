'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { createOrder, applyDiscount, getPublicSettings, getLastOrderAddress } from '@/lib/api';
import { FiTag, FiArrowRight, FiCheck, FiShoppingBag, FiUser, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import toast from 'react-hot-toast';

const STEPS = ['Delivery', 'Summary', 'Confirm'];

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { items, total, clearCart }    = useCart();

  const [loading, setLoading]               = useState(false);
  const [step, setStep]                     = useState(0);
  const [discountCode, setDiscountCode]     = useState('');
  const [discountResult, setDiscountResult] = useState<any>(null);
  const [shippingCharge, setShippingCharge] = useState(50);
  const [freeShippingAbove, setFreeShippingAbove] = useState(499);

  const [form, setForm] = useState({
    shipping_name:    user?.full_name || '',
    shipping_email:   user?.email || '',
    shipping_phone:   '',
    shipping_address: '',
    shipping_city:    '',
    shipping_state:   '',
    shipping_pincode: '',
    notes:            '',
  });

  useEffect(() => {
    if (!authLoading && !user) router.push('/login?redirect=/checkout');
  }, [user, authLoading, router]);

  useEffect(() => {
    getPublicSettings()
      .then(s => {
        setShippingCharge(s.shipping_charge);
        setFreeShippingAbove(s.free_shipping_above);
      })
      .catch(() => {});
  }, []);

  // Pre-fill shipping details from last order
  useEffect(() => {
    if (!user) return;
    getLastOrderAddress()
      .then(addr => {
        if (!addr) return;
        setForm(f => ({
          ...f,
          shipping_name:    addr.shipping_name    || f.shipping_name,
          shipping_email:   addr.shipping_email   || f.shipping_email,
          shipping_phone:   addr.shipping_phone   || f.shipping_phone,
          shipping_address: addr.shipping_address || f.shipping_address,
          shipping_city:    addr.shipping_city    || f.shipping_city,
          shipping_state:   addr.shipping_state   || f.shipping_state,
          shipping_pincode: addr.shipping_pincode || f.shipping_pincode,
        }));
      })
      .catch(() => {});
  }, [user]);

  if (authLoading || !user) return null;

  const displayItems = items.map(i => ({
    product_id: i.product_id,
    name:       i.product.name,
    price:      i.product.price,
    quantity:   i.quantity,
    image:      i.product.thumbnail_url,
  }));

  const shipping       = total >= freeShippingAbove ? 0 : shippingCharge;
  const discountAmount = discountResult?.discount_amount || 0;
  const finalTotal     = total - discountAmount + shipping;

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;
    try {
      const result = await applyDiscount(discountCode, total);
      setDiscountResult(result);
      toast.success(`Saved ₹${result.discount_amount}!`);
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Invalid code');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (displayItems.length === 0) { toast.error('Your cart is empty'); return; }
    setLoading(true);
    try {
      const order = await createOrder({
        ...form,
        payment_method: 'cod',
        discount_code:  discountCode || undefined,
        items:          displayItems.map(i => ({ product_id: i.product_id, quantity: i.quantity })),
      });
      try { await clearCart(); } catch {}
      toast.success('Order placed! Pay on delivery.');
      router.push(`/orders?placed=${order.order_number}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const field = (key: keyof typeof form, value: string) =>
    setForm(f => ({ ...f, [key]: value }));

  return (
    <>
      <Navbar />
      <main className="bg-[#FAFAFA] min-h-screen pt-[68px] pb-20">

        {/* ── Header ───────────────────────────────────────────── */}
        <div className="bg-white border-b border-[#F0F0F0] py-6">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-5">
              <FiShoppingBag size={20} className="text-brand" />
              <h1 className="text-xl font-extrabold text-[#1C1C1C]">Checkout</h1>
            </div>

            {/* Progress bar */}
            <div className="flex items-center gap-0">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center">
                  <div className={`flex items-center gap-2 text-sm font-bold transition-colors ${
                    i <= step ? 'text-brand' : 'text-[#93959F]'
                  }`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold transition-all ${
                      i < step
                        ? 'bg-brand text-white'
                        : i === step
                          ? 'bg-brand text-white ring-4 ring-brand-100'
                          : 'bg-[#F0F0F0] text-[#93959F]'
                    }`}>
                      {i < step ? <FiCheck size={13} /> : i + 1}
                    </div>
                    <span className="hidden sm:inline">{s}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`h-0.5 w-12 sm:w-20 mx-2 rounded-full transition-colors ${
                      i < step ? 'bg-brand' : 'bg-[#E9E9EB]'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Body ─────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid lg:grid-cols-5 gap-8">

              {/* ── Shipping form ─────────────────────────────── */}
              <div className="lg:col-span-3 space-y-5">
                <div className="bg-white rounded-2xl border border-[#F0F0F0] shadow-card p-6">
                  <h2 className="font-extrabold text-[#1C1C1C] mb-5 flex items-center gap-2">
                    <FiMapPin size={18} className="text-brand" /> Delivery Details
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="sm:col-span-1">
                      <label className="block text-xs font-bold text-[#686B78] uppercase tracking-wider mb-1.5">
                        Full Name *
                      </label>
                      <div className="relative">
                        <FiUser size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#93959F]" />
                        <input
                          type="text" required
                          placeholder="Your full name"
                          value={form.shipping_name}
                          onChange={e => field('shipping_name', e.target.value)}
                          className="input-food pl-10"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-bold text-[#686B78] uppercase tracking-wider mb-1.5">
                        Phone *
                      </label>
                      <div className="relative">
                        <FiPhone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#93959F]" />
                        <input
                          type="tel" required
                          placeholder="+91 98765 43210"
                          value={form.shipping_phone}
                          onChange={e => field('shipping_phone', e.target.value)}
                          className="input-food pl-10"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-[#686B78] uppercase tracking-wider mb-1.5">
                        Email *
                      </label>
                      <div className="relative">
                        <FiMail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#93959F]" />
                        <input
                          type="email" required
                          placeholder="your@email.com"
                          value={form.shipping_email}
                          onChange={e => field('shipping_email', e.target.value)}
                          className="input-food pl-10"
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-[#686B78] uppercase tracking-wider mb-1.5">
                        Address *
                      </label>
                      <input
                        type="text" required
                        placeholder="House/Flat no., Street name"
                        value={form.shipping_address}
                        onChange={e => field('shipping_address', e.target.value)}
                        className="input-food"
                      />
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-xs font-bold text-[#686B78] uppercase tracking-wider mb-1.5">
                        City *
                      </label>
                      <input
                        type="text" required
                        placeholder="e.g., New Delhi"
                        value={form.shipping_city}
                        onChange={e => field('shipping_city', e.target.value)}
                        className="input-food"
                      />
                    </div>

                    {/* State */}
                    <div>
                      <label className="block text-xs font-bold text-[#686B78] uppercase tracking-wider mb-1.5">
                        State *
                      </label>
                      <input
                        type="text" required
                        placeholder="e.g., Delhi"
                        value={form.shipping_state}
                        onChange={e => field('shipping_state', e.target.value)}
                        className="input-food"
                      />
                    </div>

                    {/* PIN */}
                    <div>
                      <label className="block text-xs font-bold text-[#686B78] uppercase tracking-wider mb-1.5">
                        PIN Code *
                      </label>
                      <input
                        type="text" required
                        placeholder="e.g., 110001"
                        value={form.shipping_pincode}
                        onChange={e => field('shipping_pincode', e.target.value)}
                        className="input-food"
                      />
                    </div>

                    {/* Notes */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-[#686B78] uppercase tracking-wider mb-1.5">
                        Order Notes <span className="font-normal normal-case text-[#93959F]">(optional)</span>
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Special delivery instructions…"
                        value={form.notes}
                        onChange={e => field('notes', e.target.value)}
                        className="input-food resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment method card */}
                <div className="bg-white rounded-2xl border border-[#F0F0F0] shadow-card p-6">
                  <h2 className="font-extrabold text-[#1C1C1C] mb-4">Payment Method</h2>
                  <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-brand bg-brand-50">
                    <div className="w-5 h-5 rounded-full border-2 border-brand flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-brand" />
                    </div>
                    <div>
                      <p className="font-bold text-[#1C1C1C] text-sm">Cash on Delivery</p>
                      <p className="text-xs text-[#686B78]">Pay when your order arrives. No card needed.</p>
                    </div>
                    <span className="ml-auto text-2xl">💵</span>
                  </div>
                </div>
              </div>

              {/* ── Order summary sidebar ─────────────────────── */}
              <div className="lg:col-span-2 space-y-5">
                {/* Items */}
                <div className="bg-white rounded-2xl border border-[#F0F0F0] shadow-card p-6">
                  <h2 className="font-extrabold text-[#1C1C1C] mb-4">
                    Order Summary ({displayItems.length} item{displayItems.length !== 1 ? 's' : ''})
                  </h2>

                  <div className="space-y-3 mb-4 max-h-52 overflow-y-auto pr-1">
                    {displayItems.map((item, i) => (
                      <div key={i} className="flex justify-between items-start text-sm gap-2">
                        <span className="text-[#686B78] truncate flex-1">
                          {item.name}
                          <span className="text-[#93959F]"> ×{item.quantity}</span>
                        </span>
                        <span className="font-bold text-[#1C1C1C] shrink-0">
                          ₹{(item.price * item.quantity).toFixed(0)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-[#F0F0F0] pt-4 space-y-2 text-sm">
                    <div className="flex justify-between text-[#686B78]">
                      <span>Subtotal</span>
                      <span className="font-semibold text-[#1C1C1C]">₹{total.toFixed(2)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-green-600 font-semibold">
                        <span>Discount</span>
                        <span>-₹{discountAmount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-[#686B78]">
                      <span>Delivery</span>
                      <span className={`font-semibold ${shipping === 0 ? 'text-green-600' : 'text-[#1C1C1C]'}`}>
                        {shipping === 0 ? 'FREE' : `₹${shipping}`}
                      </span>
                    </div>
                    {shipping > 0 && (
                      <p className="text-xs text-[#93959F] bg-brand-50 rounded-lg px-3 py-2">
                        Add ₹{(freeShippingAbove - total).toFixed(0)} more for free delivery
                      </p>
                    )}
                  </div>

                  <div className="border-t border-[#F0F0F0] mt-4 pt-4 flex justify-between font-extrabold">
                    <span className="text-[#1C1C1C]">Total to Pay</span>
                    <span className="text-xl text-brand">₹{finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Promo code */}
                <div className="bg-white rounded-2xl border border-[#F0F0F0] shadow-card p-5">
                  <p className="text-sm font-bold text-[#1C1C1C] mb-3">Have a promo code?</p>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <FiTag size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#93959F]" />
                      <input
                        type="text"
                        placeholder="Enter code"
                        value={discountCode}
                        onChange={e => setDiscountCode(e.target.value.toUpperCase())}
                        className="input-food pl-8 py-2.5 text-sm uppercase tracking-wider"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyDiscount}
                      className="px-4 py-2.5 rounded-xl border-2 border-brand text-brand text-sm font-bold hover:bg-brand hover:text-white transition-all duration-200"
                    >
                      Apply
                    </button>
                  </div>
                  {discountResult && (
                    <p className="text-xs text-green-600 font-semibold mt-2 flex items-center gap-1">
                      <FiCheck size={12} /> Saved ₹{discountResult.discount_amount}!
                    </p>
                  )}
                </div>

                {/* Place order */}
                <button
                  type="submit"
                  disabled={loading || displayItems.length === 0}
                  className="btn-gold w-full flex items-center justify-center gap-2 py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Placing Order…
                    </span>
                  ) : (
                    <>
                      Place Order <FiArrowRight size={17} />
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-[#93959F]">
                  🔒 Secure & safe checkout. Pay cash when delivered.
                </p>
              </div>
            </div>
          </div>
        </form>
      </main>
      <Footer />
    </>
  );
}

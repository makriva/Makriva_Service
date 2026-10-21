'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { applyDiscount } from '@/lib/api';
import { FiMinus, FiPlus, FiTrash2, FiTag, FiArrowRight, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';
import toast from 'react-hot-toast';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function CartPage() {
  const { user } = useAuth();
  const { items, total, updateItem, removeItem, localItems, updateLocal, removeLocal } = useCart();
  const [discountCode, setDiscountCode]     = useState('');
  const [discountResult, setDiscountResult] = useState<any>(null);
  const [applying, setApplying]             = useState(false);
  const [freeAbove, setFreeAbove]           = useState(499);
  const [shipCharge, setShipCharge]         = useState(50);

  useEffect(() => {
    fetch(`${API}/api/settings/public`)
      .then(r => r.json())
      .then(d => { setFreeAbove(d.free_shipping_above ?? 499); setShipCharge(d.shipping_charge ?? 50); })
      .catch(() => {});
  }, []);

  const displayItems = user
    ? items.map(i => ({
        id:       i.id,
        name:     i.product.name,
        price:    i.product.price,
        quantity: i.quantity,
        image:    i.product.thumbnail_url,
        weight:   i.product.weight,
      }))
    : localItems.map(i => ({
        id:       i.product_id,
        name:     i.name,
        price:    i.price,
        quantity: i.quantity,
        image:    i.thumbnail_url,
        weight:   i.weight,
      }));

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;
    setApplying(true);
    try {
      const result = await applyDiscount(discountCode, total);
      setDiscountResult(result);
      toast.success(`Discount applied! You save ₹${result.discount_amount}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Invalid discount code');
      setDiscountResult(null);
    } finally {
      setApplying(false);
    }
  };

  const shipping   = total >= freeAbove ? 0 : shipCharge;
  const finalTotal = (discountResult ? discountResult.final_amount : total) + shipping;

  // ── Empty state ──────────────────────────────────────────────
  if (displayItems.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#FAFAFA] pt-[68px] flex flex-col items-center justify-center gap-6 px-4">
          <div className="w-24 h-24 rounded-3xl bg-brand-50 flex items-center justify-center text-5xl">🛒</div>
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-[#1C1C1C] mb-2">Your cart is empty</h2>
            <p className="text-[#686B78] text-sm">Browse our premium makhana range and add some snacks!</p>
          </div>
          <Link href="/products" className="btn-gold px-10 py-3.5 text-base">
            Browse Products
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="bg-[#FAFAFA] min-h-screen pt-[68px] pb-20">

        {/* ── Page header ──────────────────────────────────────── */}
        <div className="bg-white border-b border-[#F0F0F0] py-6">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <FiShoppingBag size={22} className="text-brand" />
              <h1 className="text-2xl font-extrabold text-[#1C1C1C]">Shopping Cart</h1>
              <span className="text-[#686B78] text-sm font-medium">({displayItems.length} item{displayItems.length !== 1 ? 's' : ''})</span>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* ── Cart items ───────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-3">
              {displayItems.map(item => (
                <div
                  key={item.id}
                  className="flex gap-4 bg-white rounded-2xl p-4 border border-[#F0F0F0] shadow-card hover:shadow-card-hover transition-shadow duration-200"
                >
                  {/* Image */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-[#F8F8F8] flex-shrink-0">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} width={112} height={112} className="object-cover w-full h-full" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">🌾</div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h3 className="font-bold text-[#1C1C1C] text-sm sm:text-base leading-snug">{item.name}</h3>
                        {item.weight && (
                          <p className="text-xs text-[#93959F] mt-0.5">{item.weight}</p>
                        )}
                      </div>
                      <button
                        onClick={() => user ? removeItem(item.id) : removeLocal(item.id)}
                        className="text-[#93959F] hover:text-red-500 transition-colors p-1 shrink-0"
                        aria-label="Remove"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Qty controls */}
                      <div className="flex items-center border border-[#E9E9EB] rounded-xl overflow-hidden">
                        <button
                          onClick={() => user ? updateItem(item.id, item.quantity - 1) : updateLocal(item.id, item.quantity - 1)}
                          className="w-9 h-9 flex items-center justify-center text-[#686B78] hover:bg-brand hover:text-white transition-colors"
                        >
                          <FiMinus size={13} />
                        </button>
                        <span className="w-10 text-center text-sm font-bold text-[#1C1C1C]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => user ? updateItem(item.id, item.quantity + 1) : updateLocal(item.id, item.quantity + 1)}
                          className="w-9 h-9 flex items-center justify-center text-[#686B78] hover:bg-brand hover:text-white transition-colors"
                        >
                          <FiPlus size={13} />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="text-base font-extrabold text-brand">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              <Link
                href="/products"
                className="flex items-center gap-2 text-sm font-semibold text-brand hover:underline mt-2 w-fit"
              >
                <FiArrowLeft size={14} /> Continue Shopping
              </Link>
            </div>

            {/* ── Order summary ────────────────────────────────── */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-[#F0F0F0] shadow-card p-6 sticky top-24 space-y-5">
                <h2 className="font-extrabold text-[#1C1C1C] text-lg">Order Summary</h2>

                {/* Line items */}
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between text-[#686B78]">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#1C1C1C]">₹{total.toFixed(2)}</span>
                  </div>
                  {discountResult && (
                    <div className="flex justify-between text-green-600 font-semibold">
                      <span>Discount ({discountResult.code})</span>
                      <span>-₹{discountResult.discount_amount}</span>
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
                      Add ₹{(freeAbove - total).toFixed(0)} more to unlock free delivery
                    </p>
                  )}
                </div>

                {/* Total */}
                <div className="border-t border-[#F0F0F0] pt-4 flex justify-between font-extrabold text-[#1C1C1C]">
                  <span className="text-base">Total</span>
                  <span className="text-xl text-brand">₹{finalTotal.toFixed(2)}</span>
                </div>

                {/* Discount code */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <FiTag size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#93959F]" />
                    <input
                      type="text"
                      placeholder="Promo code"
                      value={discountCode}
                      onChange={e => setDiscountCode(e.target.value.toUpperCase())}
                      className="input-food pl-9 py-2.5 text-sm"
                    />
                  </div>
                  <button
                    onClick={handleApplyDiscount}
                    disabled={applying}
                    className="px-4 py-2.5 rounded-xl border-2 border-brand text-brand text-sm font-bold hover:bg-brand hover:text-white transition-all duration-200 disabled:opacity-50"
                  >
                    {applying ? '…' : 'Apply'}
                  </button>
                </div>

                {/* Checkout CTA */}
                <Link
                  href="/checkout"
                  className="btn-gold w-full flex items-center justify-center gap-2 py-4 text-base"
                >
                  Proceed to Checkout <FiArrowRight size={16} />
                </Link>

                {/* Trust badge */}
                <p className="text-center text-xs text-[#93959F]">
                  🔒 Secure checkout · Pay on delivery
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

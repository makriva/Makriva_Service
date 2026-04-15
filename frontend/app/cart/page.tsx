'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { applyDiscount } from '@/lib/api';
import { FiMinus, FiPlus, FiTrash2, FiTag } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { user } = useAuth();
  const { items, total, updateItem, removeItem, localItems, updateLocal, removeLocal } = useCart();
  const [discountCode, setDiscountCode] = useState('');
  const [discountResult, setDiscountResult] = useState<any>(null);
  const [applying, setApplying] = useState(false);

  const displayItems = user
    ? items.map(i => ({ id: i.id, name: i.product.name, price: i.product.price, quantity: i.quantity, image: i.product.thumbnail_url, weight: i.product.weight }))
    : localItems.map(i => ({ id: i.product_id, name: i.name, price: i.price, quantity: i.quantity, image: i.thumbnail_url, weight: i.weight }));

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

  const shipping = total >= 499 ? 0 : 50;
  const finalTotal = (discountResult ? discountResult.final_amount : total) + shipping;

  if (displayItems.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center gap-6">
          <div className="text-6xl">🛒</div>
          <h2 className="text-2xl font-bold">Your cart is empty</h2>
          <p className="text-gray-400">Discover our premium makhana range</p>
          <Link href="/products" className="btn-gold">Shop Now</Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="section-title mb-2">Shopping Cart</h1>
          <div className="gold-line mx-0 mb-8" />

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {displayItems.map(item => (
                <div key={item.id} className="flex gap-4 bg-[#0D0D0D] border border-[#1E1E1E] p-4">
                  <div className="w-24 h-24 bg-[#1a1a1a] flex-shrink-0 overflow-hidden">
                    {item.image ? <Image src={item.image} alt={item.name} width={96} height={96} className="object-cover w-full h-full" /> : <div className="w-full h-full flex items-center justify-center text-3xl">🌾</div>}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-sm">{item.name}</h3>
                        {item.weight && <p className="text-xs text-gray-500 mt-0.5">{item.weight}</p>}
                      </div>
                      <button onClick={() => user ? removeItem(item.id) : removeLocal(item.id)} className="text-gray-500 hover:text-red-400 transition-colors ml-2">
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-[#222]">
                        <button onClick={() => user ? updateItem(item.id, item.quantity - 1) : updateLocal(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#D4AF37]"><FiMinus size={12} /></button>
                        <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                        <button onClick={() => user ? updateItem(item.id, item.quantity + 1) : updateLocal(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#D4AF37]"><FiPlus size={12} /></button>
                      </div>
                      <span className="font-bold text-[#D4AF37]">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-[#0D0D0D] border border-[#1E1E1E] p-6 h-fit space-y-4">
              <h2 className="font-bold text-lg uppercase tracking-wider">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-400"><span>Subtotal</span><span className="text-white">₹{total.toFixed(2)}</span></div>
                {discountResult && <div className="flex justify-between text-green-400"><span>Discount ({discountResult.code})</span><span>-₹{discountResult.discount_amount}</span></div>}
                <div className="flex justify-between text-gray-400"><span>Shipping</span><span className={shipping === 0 ? 'text-green-400' : 'text-white'}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
                {shipping > 0 && <p className="text-xs text-gray-600">Add ₹{(499 - total).toFixed(0)} more for free shipping</p>}
              </div>
              <div className="border-t border-[#1E1E1E] pt-3 flex justify-between font-bold">
                <span>Total</span><span className="text-[#D4AF37] text-lg">₹{finalTotal.toFixed(2)}</span>
              </div>

              {/* Discount code */}
              <div className="pt-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                    <input type="text" placeholder="Discount code" value={discountCode} onChange={e => setDiscountCode(e.target.value.toUpperCase())} className="input-dark pl-9 text-sm pr-2" />
                  </div>
                  <button onClick={handleApplyDiscount} disabled={applying} className="btn-outline-gold px-4 py-2 text-xs">
                    {applying ? '...' : 'Apply'}
                  </button>
                </div>
              </div>

              <Link href="/checkout" className="btn-gold w-full block text-center">Proceed to Checkout</Link>
              <Link href="/products" className="block text-center text-sm text-gray-500 hover:text-[#D4AF37] transition-colors">Continue Shopping</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

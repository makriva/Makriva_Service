'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { createOrder, applyDiscount, getPublicSettings } from '@/lib/api';
import { FiTag } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { items, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountResult, setDiscountResult] = useState<any>(null);
  const [shippingCharge, setShippingCharge] = useState(50);
  const [freeShippingAbove, setFreeShippingAbove] = useState(499);
  const [form, setForm] = useState({
    shipping_name: user?.full_name || '',
    shipping_email: user?.email || '',
    shipping_phone: '',
    shipping_address: '',
    shipping_city: '',
    shipping_state: '',
    shipping_pincode: '',
    notes: '',
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/checkout');
    }
  }, [user, authLoading, router]);

  // Fetch settings on component mount
  useEffect(() => {
    getPublicSettings()
      .then(s => { setShippingCharge(s.shipping_charge); setFreeShippingAbove(s.free_shipping_above); })
      .catch(() => {});
  }, []);

  if (authLoading || !user) return null;

  const displayItems = items.map(i => ({
    product_id: i.product_id,
    name: i.product.name,
    price: i.product.price,
    quantity: i.quantity,
  }));

  const shipping = total >= freeShippingAbove ? 0 : shippingCharge;
  const discountAmount = discountResult?.discount_amount || 0;
  const finalTotal = total - discountAmount + shipping;

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
      const orderData = {
        ...form,
        payment_method: 'cod',
        discount_code: discountCode || undefined,
        items: displayItems.map(i => ({ product_id: i.product_id, quantity: i.quantity })),
      };
      
      const order = await createOrder(orderData);
      
      // Clear cart after successful order creation
      try {
        await clearCart();
      } catch (clearError) {
        console.error('Cart clearing error (non-critical):', clearError);
        // Continue even if cart clear fails
      }
      
      toast.success('Order placed successfully! Pay on delivery.');
      router.push(`/orders?placed=${order.order_number}`);
    } catch (err: any) {
      console.error('Order creation error:', err);
      toast.error(err?.response?.data?.detail || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="section-title mb-2">Checkout</h1>
          <div className="gold-line mx-0 mb-8" />

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Shipping */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-[#0D0D0D] border border-[#1E1E1E] p-6">
                  <h2 className="font-bold text-sm uppercase tracking-wider mb-5">Shipping Information</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { key: 'shipping_name', label: 'Full Name', type: 'text', required: true, placeholder: 'Enter your full name' },
                      { key: 'shipping_email', label: 'Email', type: 'email', required: true, placeholder: 'your@email.com' },
                      { key: 'shipping_phone', label: 'Phone', type: 'tel', required: true, placeholder: '+91 98765 43210' },
                      { key: 'shipping_pincode', label: 'PIN Code', type: 'text', required: true, placeholder: 'e.g., 110001' },
                    ].map(field => (
                      <div key={field.key}>
                        <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1">{field.label}</label>
                        <input type={field.type} required={field.required} value={(form as any)[field.key]}
                          onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                          placeholder={(field as any).placeholder}
                          className="input-dark" />
                      </div>
                    ))}
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Address</label>
                      <input type="text" required value={form.shipping_address} onChange={e => setForm(f => ({ ...f, shipping_address: e.target.value }))} placeholder="123 Main Street" className="input-dark" />
                    </div>
                    {[
                      { key: 'shipping_city', label: 'City', placeholder: 'e.g., New Delhi' },
                      { key: 'shipping_state', label: 'State', placeholder: 'e.g., Delhi' },
                    ].map(field => (
                      <div key={field.key}>
                        <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1">{field.label}</label>
                        <input type="text" required value={(form as any)[field.key]} onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))} placeholder={field.placeholder} className="input-dark" />
                      </div>
                    ))}
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Order Notes (optional)</label>
                      <textarea rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Add any special instructions..." className="input-dark resize-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-4">
                <div className="bg-[#0D0D0D] border border-[#1E1E1E] p-6">
                  <h2 className="font-bold text-sm uppercase tracking-wider mb-4">Order Summary</h2>
                  <div className="space-y-2 text-sm mb-4">
                    {displayItems.map((item, i) => (
                      <div key={i} className="flex justify-between text-gray-400">
                        <span className="truncate max-w-[60%]">{item.name} ×{item.quantity}</span>
                        <span className="text-white">₹{(item.price * item.quantity).toFixed(0)}</span>
                      </div>
                    ))}
                    <div className="border-t border-[#1E1E1E] pt-2 mt-2">
                      <div className="flex justify-between text-gray-400"><span>Subtotal</span><span className="text-white">₹{total.toFixed(2)}</span></div>
                      {discountAmount > 0 && <div className="flex justify-between text-green-400"><span>Discount</span><span>-₹{discountAmount}</span></div>}
                      <div className="flex justify-between text-gray-400"><span>Shipping</span><span className={shipping === 0 ? 'text-green-400' : 'text-white'}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
                    </div>
                    <div className="border-t border-[#1E1E1E] pt-2 flex justify-between font-bold text-base">
                      <span>Total</span><span className="text-[#D4AF37]">₹{finalTotal.toFixed(2)}</span>
                    </div>
                    
                    {/* Free shipping threshold message */}
                    {shipping > 0 && (
                      <div className="border-t border-[#1E1E1E] pt-2">
                        <p className="text-xs text-gray-600">
                          Add ₹{(freeShippingAbove - total).toFixed(0)} more for free shipping
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mb-4">
                    <div className="relative flex-1">
                      <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={12} />
                      <input type="text" placeholder="Promo code" value={discountCode} onChange={e => setDiscountCode(e.target.value.toUpperCase())} className="input-dark pl-8 text-xs py-2 pr-2" />
                    </div>
                    <button type="button" onClick={handleApplyDiscount} className="btn-outline-gold px-3 py-2 text-xs">Apply</button>
                  </div>

                  <button type="submit" disabled={loading} className="btn-gold w-full py-4">
                    {loading ? 'Placing Order...' : 'Place Order — Cash on Delivery'}
                  </button>
                  <p className="text-xs text-gray-600 text-center mt-3">Pay when your order arrives. No online payment required.</p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}

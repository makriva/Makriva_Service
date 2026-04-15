'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { getOrder } from '@/lib/api';
import { FiArrowLeft, FiPackage, FiExternalLink, FiTruck } from 'react-icons/fi';

const STATUS_COLORS: Record<string, string> = {
  pending: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  confirmed: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  processing: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  shipped: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  delivered: 'text-green-400 bg-green-400/10 border-green-400/20',
  cancelled: 'text-red-400 bg-red-400/10 border-red-400/20',
  refunded: 'text-gray-400 bg-gray-400/10 border-gray-400/20',
};

const PAYMENT_COLORS: Record<string, string> = {
  pending: 'text-yellow-400',
  paid: 'text-green-400',
  failed: 'text-red-400',
  refunded: 'text-gray-400',
};

const STATUS_STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/orders');
      return;
    }
    if (user && id) {
      getOrder(id)
        .then(setOrder)
        .catch(() => router.push('/orders'))
        .finally(() => setFetching(false));
    }
  }, [user, authLoading, id]);

  if (authLoading || fetching) {
    return (
      <>
        <Navbar />
        <main className="pt-24 pb-20 flex justify-center">
          <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mt-20" />
        </main>
        <Footer />
      </>
    );
  }

  if (!order) return null;

  const currentStep = STATUS_STEPS.indexOf(order.status);
  const isCancelled = order.status === 'cancelled' || order.status === 'refunded';

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back */}
          <Link href="/orders" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors">
            <FiArrowLeft size={14} /> Back to Orders
          </Link>

          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl font-bold font-mono">{order.order_number}</h1>
              <p className="text-gray-500 text-sm mt-1">
                Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <span className={`text-xs font-semibold px-3 py-1.5 border uppercase tracking-wider ${STATUS_COLORS[order.status] || 'text-gray-400'}`}>
              {order.status}
            </span>
          </div>

          {/* Progress tracker (only for non-cancelled) */}
          {!isCancelled && (
            <div className="bg-[#0D0D0D] border border-[#1E1E1E] p-5 mb-4">
              <div className="flex items-center justify-between relative">
                <div className="absolute left-0 right-0 top-4 h-px bg-[#1E1E1E] z-0" />
                {STATUS_STEPS.map((step, i) => (
                  <div key={step} className="flex flex-col items-center gap-1.5 z-10">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                      i < currentStep ? 'bg-[#D4AF37] border-[#D4AF37] text-black' :
                      i === currentStep ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]' :
                      'bg-[#0D0D0D] border-[#333] text-gray-600'
                    }`}>
                      {i < currentStep ? '✓' : i + 1}
                    </div>
                    <span className={`text-xs capitalize hidden sm:block ${i <= currentStep ? 'text-white' : 'text-gray-600'}`}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tracking info */}
          {(order.tracking_number || order.tracking_url) && (
            <div className="bg-[#0D0D0D] border border-[#1E1E1E] p-4 mb-4 flex items-start gap-3">
              <FiTruck size={18} className="text-[#D4AF37] flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white mb-0.5">Tracking Information</p>
                {order.tracking_number && (
                  <p className="text-xs text-gray-400">Tracking #: <span className="font-mono text-white">{order.tracking_number}</span></p>
                )}
                {order.tracking_url && (
                  <a
                    href={order.tracking_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-1.5 text-xs text-[#D4AF37] hover:text-[#F0D060] transition-colors"
                  >
                    Track your shipment <FiExternalLink size={11} />
                  </a>
                )}
              </div>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            {/* Shipping address */}
            <div className="bg-[#0D0D0D] border border-[#1E1E1E] p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Shipping Address</p>
              <p className="text-sm font-semibold">{order.shipping_name}</p>
              <p className="text-sm text-gray-400 mt-0.5">{order.shipping_address}</p>
              <p className="text-sm text-gray-400">{order.shipping_city}, {order.shipping_state} — {order.shipping_pincode}</p>
              <p className="text-sm text-gray-400 mt-1">{order.shipping_phone}</p>
              <p className="text-sm text-gray-400">{order.shipping_email}</p>
            </div>

            {/* Payment info */}
            <div className="bg-[#0D0D0D] border border-[#1E1E1E] p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Payment</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Method</span>
                  <span className="font-medium">Cash on Delivery</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className={`font-medium capitalize ${PAYMENT_COLORS[order.payment_status] || 'text-white'}`}>
                    {order.payment_status}
                  </span>
                </div>
                {order.notes && (
                  <div className="pt-2 border-t border-[#1E1E1E]">
                    <p className="text-xs text-gray-500 mb-1">Notes</p>
                    <p className="text-xs text-gray-300">{order.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-[#0D0D0D] border border-[#1E1E1E] p-5 mb-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">Items Ordered</p>
            <div className="space-y-3">
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-[#111] border border-[#1E1E1E] flex-shrink-0 overflow-hidden">
                    {item.product_image
                      ? <Image src={item.product_image} alt={item.product_name} width={56} height={56} className="object-cover w-full h-full" />
                      : <div className="w-full h-full flex items-center justify-center"><FiPackage size={20} className="text-gray-600" /></div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.product_name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">₹{item.price} × {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-[#D4AF37] flex-shrink-0">₹{item.subtotal}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bill Summary */}
          <div className="bg-[#0D0D0D] border border-[#1E1E1E] p-5">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">Bill Summary</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal ({order.items?.length} item{order.items?.length !== 1 ? 's' : ''})</span>
                <span className="text-white">₹{order.subtotal?.toFixed(2)}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Discount {order.discount_code && <span className="font-mono text-xs">({order.discount_code})</span>}</span>
                  <span>−₹{order.discount_amount?.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span className={order.shipping_charge === 0 ? 'text-green-400' : 'text-white'}>
                  {order.shipping_charge === 0 ? 'FREE' : `₹${order.shipping_charge?.toFixed(2)}`}
                </span>
              </div>
              <div className="border-t border-[#1E1E1E] pt-3 flex justify-between font-bold text-base">
                <span>Total</span>
                <span className="text-[#D4AF37]">₹{order.total?.toFixed(2)}</span>
              </div>
              {order.payment_status !== 'paid' && (
                <p className="text-xs text-gray-500 pt-1">Pay ₹{order.total?.toFixed(2)} when your order arrives.</p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

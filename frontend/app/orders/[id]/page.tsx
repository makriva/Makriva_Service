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
import InvoiceDownloadButton from '@/components/InvoiceDownloadButton';

const STATUS_COLORS: Record<string, string> = {
  pending:    'text-amber-700 bg-amber-50 border-amber-200',
  confirmed:  'text-blue-700 bg-blue-50 border-blue-200',
  processing: 'text-purple-700 bg-purple-50 border-purple-200',
  shipped:    'text-orange-700 bg-orange-50 border-orange-200',
  delivered:  'text-green-700 bg-green-50 border-green-200',
  cancelled:  'text-red-700 bg-red-50 border-red-200',
  refunded:   'text-gray-600 bg-gray-100 border-gray-200',
};

const PAYMENT_COLORS: Record<string, string> = {
  pending:  'text-amber-600',
  paid:     'text-green-600',
  failed:   'text-red-600',
  refunded: 'text-gray-500',
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
        <main className="pt-24 pb-20 flex justify-center bg-[#FAFAFA] min-h-screen">
          <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin mt-20" />
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
      <main className="pt-24 pb-20 bg-[#FAFAFA] min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Back */}
          <Link href="/orders" className="inline-flex items-center gap-2 text-[#686B78] hover:text-[#1C1C1C] text-sm mb-6 transition-colors font-medium">
            <FiArrowLeft size={14} /> Back to Orders
          </Link>

          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl font-bold font-mono text-[#1C1C1C]">{order.order_number}</h1>
              <p className="text-[#686B78] text-sm mt-1">
                Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`text-xs font-bold px-3 py-1.5 border rounded-full uppercase tracking-wider ${STATUS_COLORS[order.status] || 'text-gray-600 bg-gray-100 border-gray-200'}`}>
                {order.status}
              </span>
              <InvoiceDownloadButton order={order} />
            </div>
          </div>

          {/* Progress tracker */}
          {!isCancelled && (
            <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-4" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div className="flex items-center justify-between relative">
                <div className="absolute left-0 right-0 top-4 h-px bg-gray-200 z-0" />
                {STATUS_STEPS.map((step, i) => (
                  <div key={step} className="flex flex-col items-center gap-1.5 z-10">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                      i < currentStep  ? 'bg-brand border-brand text-white' :
                      i === currentStep ? 'bg-brand/10 border-brand text-brand' :
                      'bg-white border-gray-200 text-[#93959F]'
                    }`}>
                      {i < currentStep ? '✓' : i + 1}
                    </div>
                    <span className={`text-xs capitalize hidden sm:block ${i <= currentStep ? 'text-[#1C1C1C] font-medium' : 'text-[#93959F]'}`}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tracking info */}
          {(order.tracking_number || order.tracking_url) && (
            <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-4 flex items-start gap-3" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <FiTruck size={18} className="text-brand flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1C1C1C] mb-0.5">Tracking Information</p>
                {order.tracking_number && (
                  <p className="text-xs text-[#686B78]">Tracking #: <span className="font-mono font-bold text-[#1C1C1C]">{order.tracking_number}</span></p>
                )}
                {order.tracking_url && (
                  <a
                    href={order.tracking_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-1.5 text-xs text-brand hover:underline font-semibold transition-colors"
                  >
                    Track your shipment <FiExternalLink size={11} />
                  </a>
                )}
              </div>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            {/* Shipping address */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <p className="text-xs text-[#93959F] uppercase tracking-wider font-bold mb-3">Shipping Address</p>
              <p className="text-sm font-bold text-[#1C1C1C]">{order.shipping_name}</p>
              <p className="text-sm text-[#686B78] mt-0.5">{order.shipping_address}</p>
              <p className="text-sm text-[#686B78]">{order.shipping_city}, {order.shipping_state} — {order.shipping_pincode}</p>
              <p className="text-sm text-[#686B78] mt-1">{order.shipping_phone}</p>
              <p className="text-sm text-[#686B78]">{order.shipping_email}</p>
            </div>

            {/* Payment info */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <p className="text-xs text-[#93959F] uppercase tracking-wider font-bold mb-3">Payment</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#686B78]">Method</span>
                  <span className="font-semibold text-[#1C1C1C]">Cash on Delivery</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#686B78]">Status</span>
                  <span className={`font-semibold capitalize ${PAYMENT_COLORS[order.payment_status] || 'text-[#1C1C1C]'}`}>
                    {order.payment_status}
                  </span>
                </div>
                {order.notes && (
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-[#93959F] mb-1">Notes</p>
                    <p className="text-xs text-[#686B78]">{order.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-4" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <p className="text-xs text-[#93959F] uppercase tracking-wider font-bold mb-4">Items Ordered</p>
            <div className="space-y-3">
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-xl flex-shrink-0 overflow-hidden">
                    {item.product_image
                      ? <Image src={item.product_image} alt={item.product_name} width={56} height={56} className="object-cover w-full h-full" />
                      : <div className="w-full h-full flex items-center justify-center"><FiPackage size={20} className="text-gray-300" /></div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1C1C1C] truncate">{item.product_name}</p>
                    <p className="text-xs text-[#93959F] mt-0.5">₹{item.price} × {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-[#1C1C1C] flex-shrink-0">₹{item.subtotal}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bill Summary */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <p className="text-xs text-[#93959F] uppercase tracking-wider font-bold mb-4">Bill Summary</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-[#686B78]">
                <span>Subtotal ({order.items?.length} item{order.items?.length !== 1 ? 's' : ''})</span>
                <span className="text-[#1C1C1C] font-medium">₹{order.subtotal?.toFixed(2)}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount {order.discount_code && <span className="font-mono text-xs">({order.discount_code})</span>}</span>
                  <span className="font-medium">−₹{order.discount_amount?.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#686B78]">
                <span>Shipping</span>
                <span className={`font-medium ${order.shipping_charge === 0 ? 'text-green-600' : 'text-[#1C1C1C]'}`}>
                  {order.shipping_charge === 0 ? 'FREE' : `₹${order.shipping_charge?.toFixed(2)}`}
                </span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-base">
                <span className="text-[#686B78]">Total</span>
                <span className="text-brand">₹{order.total?.toFixed(2)}</span>
              </div>
              {order.payment_status !== 'paid' && (
                <p className="text-xs text-[#93959F] pt-1">Pay ₹{order.total?.toFixed(2)} when your order arrives.</p>
              )}
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}

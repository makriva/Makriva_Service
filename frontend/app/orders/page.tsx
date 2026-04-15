'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { getMyOrders } from '@/lib/api';
import { FiPackage, FiCheckCircle, FiArrowRight } from 'react-icons/fi';

const STATUS_COLORS: Record<string, string> = {
  pending: 'text-yellow-400 bg-yellow-400/10',
  confirmed: 'text-blue-400 bg-blue-400/10',
  processing: 'text-purple-400 bg-purple-400/10',
  shipped: 'text-orange-400 bg-orange-400/10',
  delivered: 'text-green-400 bg-green-400/10',
  cancelled: 'text-red-400 bg-red-400/10',
  refunded: 'text-gray-400 bg-gray-400/10',
};

function OrdersContent() {
  const router = useRouter();
  const params = useSearchParams();
  const placed = params.get('placed');
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/orders');
      return;
    }
    if (user) {
      getMyOrders()
        .then(setOrders)
        .catch(() => {})
        .finally(() => setFetching(false));
    }
  }, [user, loading]);

  if (loading) {
    return (
      <main className="pt-24 pb-20 flex justify-center">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mt-20" />
      </main>
    );
  }

  return (
    <main className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {placed && (
          <div className="mb-6 flex items-start gap-3 bg-green-900/20 border border-green-500/30 p-4">
            <FiCheckCircle size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-green-400 font-semibold text-sm">Order placed successfully!</p>
              <p className="text-gray-400 text-xs mt-0.5">
                Order <span className="text-white font-mono">{placed}</span> confirmed. Pay when your order arrives.
              </p>
            </div>
          </div>
        )}

        <h1 className="section-title mb-2">My Orders</h1>
        <div className="gold-line mx-0 mb-8" />

        {fetching ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <FiPackage size={48} className="text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl text-gray-400 mb-4">No orders yet</h2>
            <Link href="/products" className="btn-gold">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block bg-[#0D0D0D] border border-[#1E1E1E] p-5 hover:border-[#D4AF37]/40 transition-colors group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                      <span className="text-sm font-mono font-semibold">{order.order_number}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${STATUS_COLORS[order.status] || 'text-gray-400 bg-gray-400/10'}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      {' · '}{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                      {' · '}{order.shipping_city}
                    </p>
                    {order.tracking_number && (
                      <p className="text-xs text-[#D4AF37] mt-1">Tracking: {order.tracking_number}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="font-bold text-[#D4AF37]">₹{order.total}</span>
                    <FiArrowRight size={14} className="text-gray-600 group-hover:text-[#D4AF37] transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default function OrdersPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <main className="pt-24 pb-20 flex justify-center">
          <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mt-20" />
        </main>
      }>
        <OrdersContent />
      </Suspense>
      <Footer />
    </>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { getOrders, getProducts, getUsers } from '@/lib/api';
import { FiShoppingBag, FiPackage, FiUsers, FiTrendingUp, FiAlertCircle } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function buildMonthlyRevenue(orders: any[]) {
  const map: Record<string, number> = {};
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  orders.forEach(o => {
    if (o.payment_status === 'paid' || o.payment_status === 'pending') {
      const d = new Date(o.created_at);
      const key = months[d.getMonth()];
      map[key] = (map[key] || 0) + o.total;
    }
  });
  // Last 6 months
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const key = months[d.getMonth()];
    return { month: key, revenue: Math.round(map[key] || 0) };
  });
}

export default function DashboardPage() {
  const [stats, setStats] = useState({ orders: 0, products: 0, users: 0, revenue: 0, pending: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getOrders({ limit: 200 }), getProducts({ limit: 200 }), getUsers({ limit: 200 })])
      .then(([orders, products, users]) => {
        const revenue = orders.reduce((s: number, o: any) => s + (o.payment_status === 'paid' ? o.total : 0), 0);
        const pending = orders.filter((o: any) => o.status === 'pending').length;
        setStats({ orders: orders.length, products: products.length, users: users.length, revenue, pending });
        setRecentOrders(orders.slice(0, 8));
        setChartData(buildMonthlyRevenue(orders));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const STAT_CARDS = [
    { label: 'Total Orders', value: stats.orders, icon: FiShoppingBag, color: '#D4AF37' },
    { label: 'Revenue (Paid)', value: `₹${stats.revenue.toLocaleString('en-IN')}`, icon: FiTrendingUp, color: '#22c55e' },
    { label: 'Products', value: stats.products, icon: FiPackage, color: '#3b82f6' },
    { label: 'Users', value: stats.users, icon: FiUsers, color: '#a855f7' },
    { label: 'Pending Orders', value: stats.pending, icon: FiAlertCircle, color: '#ef4444' },
  ];

  const STATUS_COLORS: Record<string, string> = {
    pending: '#eab308', confirmed: '#3b82f6', processing: '#a855f7',
    shipped: '#f97316', delivered: '#22c55e', cancelled: '#ef4444',
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back to MakRiva Admin</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {STAT_CARDS.map(card => (
          <div key={card.label} className="bg-[#111] border border-[#1E1E1E] p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 flex items-center justify-center rounded-sm" style={{ background: `${card.color}15` }}>
                <card.icon size={17} style={{ color: card.color }} />
              </div>
            </div>
            <div className="text-xl font-bold">{loading ? '—' : card.value}</div>
            <div className="text-xs text-gray-500 mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart - real data */}
        <div className="lg:col-span-2 bg-[#111] border border-[#1E1E1E] p-5">
          <h2 className="font-semibold text-sm uppercase tracking-wider mb-5">Revenue — Last 6 Months</h2>
          {loading ? (
            <div className="h-[220px] flex items-center justify-center text-gray-500 text-sm">Loading...</div>
          ) : chartData.every(d => d.revenue === 0) ? (
            <div className="h-[220px] flex items-center justify-center text-gray-500 text-sm">No paid orders yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E1E1E" />
                <XAxis dataKey="month" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}`} />
                <Tooltip
                  contentStyle={{ background: '#111', border: '1px solid #222', borderRadius: 0 }}
                  formatter={(v: any) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#D4AF37" radius={[2,2,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-[#111] border border-[#1E1E1E] p-5">
          <h2 className="font-semibold text-sm uppercase tracking-wider mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-8 text-gray-600 text-sm">Loading...</div>
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-600 text-sm">No orders yet</div>
            ) : (
              recentOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-[#1a1a1a] last:border-0">
                  <div>
                    <p className="text-xs font-medium">{order.order_number}</p>
                    <p className="text-xs text-gray-500">{order.shipping_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-[#D4AF37]">₹{order.total}</p>
                    <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ color: STATUS_COLORS[order.status] || '#888', background: `${STATUS_COLORS[order.status] || '#888'}15` }}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

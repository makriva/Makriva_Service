'use client';

import { useState, useEffect, useCallback } from 'react';
import { getOrders, updateOrderStatus } from '@/lib/api';
import { FiEye, FiX, FiDownload, FiSearch, FiChevronLeft, FiChevronRight, FiExternalLink } from 'react-icons/fi';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['pending','confirmed','processing','shipped','delivered','cancelled','refunded'];
const PAYMENT_STATUS = ['pending','paid','failed','refunded'];
const STATUS_COLORS: Record<string, string> = {
  pending: '#eab308', confirmed: '#3b82f6', processing: '#a855f7',
  shipped: '#f97316', delivered: '#22c55e', cancelled: '#ef4444', refunded: '#6b7280',
};
const PAGE_SIZE = 50;

function exportCSV(orders: any[]) {
  const headers = ['Order #','Date','Customer','Email','Phone','Address','City','State','Pincode','Items','Subtotal','Discount','Shipping','Total','Status','Payment Status','Tracking #','Tracking URL'];
  const rows = orders.map(o => {
    const itemsSummary = o.items?.map((i: any) => `${i.product_name} x${i.quantity}`).join(' | ') || '';
    return [
      o.order_number,
      new Date(o.created_at).toLocaleDateString('en-IN'),
      o.shipping_name,
      o.shipping_email,
      o.shipping_phone,
      `"${o.shipping_address}"`,
      o.shipping_city,
      o.shipping_state,
      o.shipping_pincode,
      `"${itemsSummary}"`,
      o.subtotal ?? '',
      o.discount_amount ?? 0,
      o.shipping_charge ?? '',
      o.total,
      o.status,
      o.payment_status,
      o.tracking_number || '',
      o.tracking_url || '',
    ].join(',');
  });
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `orders-${new Date().toISOString().slice(0,10)}.csv`; a.click();
  URL.revokeObjectURL(url);
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState<any>(null);
  const [statusForm, setStatusForm] = useState<any>({});
  const [updating, setUpdating] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    getOrders({ limit: 500 })
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [statusFilter, searchText]);

  // Client-side filter
  const filtered = orders.filter(o => {
    const matchStatus = !statusFilter || o.status === statusFilter;
    const q = searchText.toLowerCase();
    const matchSearch = !q ||
      o.order_number?.toLowerCase().includes(q) ||
      o.shipping_name?.toLowerCase().includes(q) ||
      o.shipping_email?.toLowerCase().includes(q) ||
      o.shipping_phone?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleStatusUpdate = async (orderId: string) => {
    setUpdating(true);
    try {
      await updateOrderStatus(orderId, statusForm);
      toast.success('Order updated!');
      setViewing(null); load();
    } catch { toast.error('Error updating order'); }
    finally { setUpdating(false); }
  };

  return (
    <div className="p-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <h1 className="text-xl font-bold flex-1 min-w-0">
          Orders {!loading && <span className="text-gray-500 font-normal text-sm">({filtered.length}{filtered.length !== orders.length ? ` / ${orders.length}` : ''})</span>}
        </h1>

        {/* Search */}
        <div className="relative">
          <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" size={13} />
          <input
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            placeholder="Search order #, name, email..."
            className="input-admin pl-8 w-56 text-xs"
          />
          {searchText && (
            <button onClick={() => setSearchText('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
              <FiX size={12} />
            </button>
          )}
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="input-admin bg-[#111] w-36 text-sm"
        >
          <option value="">All Status</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Export */}
        <button
          onClick={() => {
            if (filtered.length === 0) { toast.error('No orders to export'); return; }
            exportCSV(filtered);
            toast.success(`Exported ${filtered.length} order${filtered.length !== 1 ? 's' : ''}`);
          }}
          className="btn-ghost gap-2 whitespace-nowrap"
        >
          <FiDownload size={14} />
          Export {filtered.length > 0 ? `(${filtered.length})` : ''}
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#111] border border-[#1E1E1E] overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-[#1E1E1E]">
            <tr className="text-xs text-gray-500 uppercase tracking-wider">
              <th className="text-left px-4 py-3">Order #</th>
              <th className="text-left px-4 py-3 hidden sm:table-cell">Customer</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Date</th>
              <th className="text-left px-4 py-3">Total</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-right px-4 py-3">View</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-10 text-gray-500 text-sm">Loading...</td></tr>
            ) : paginated.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-10 text-gray-500 text-sm">
                {searchText || statusFilter ? 'No matching orders' : 'No orders yet'}
              </td></tr>
            ) : paginated.map(order => (
              <tr key={order.id} className="table-row border-b border-[#1a1a1a]">
                <td className="px-4 py-3 font-mono text-xs">{order.order_number}</td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <p className="text-xs">{order.shipping_name}</p>
                  <p className="text-gray-500 text-xs">{order.shipping_email}</p>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-xs text-gray-400">
                  {new Date(order.created_at).toLocaleDateString('en-IN')}
                </td>
                <td className="px-4 py-3 font-bold text-[#D4AF37] text-xs">₹{order.total}</td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-0.5 font-medium" style={{ color: STATUS_COLORS[order.status], background: `${STATUS_COLORS[order.status]}18` }}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => {
                      setViewing(order);
                      setStatusForm({
                        status: order.status,
                        payment_status: order.payment_status,
                        tracking_number: order.tracking_number || '',
                        tracking_url: order.tracking_url || '',
                        notes: order.notes || '',
                      });
                    }}
                    className="text-gray-400 hover:text-[#D4AF37] transition-colors p-1"
                  >
                    <FiEye size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-gray-500">
            Page {page} of {totalPages} · showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <FiChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
              // Show pages around current
              let pg = i + 1;
              if (totalPages > 7) {
                if (page <= 4) pg = i + 1;
                else if (page >= totalPages - 3) pg = totalPages - 6 + i;
                else pg = page - 3 + i;
              }
              return (
                <button
                  key={pg}
                  onClick={() => setPage(pg)}
                  className={`w-7 h-7 text-xs font-medium transition-colors ${pg === page ? 'bg-[#D4AF37] text-black' : 'text-gray-400 hover:text-white'}`}
                >
                  {pg}
                </button>
              );
            })}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {viewing && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-[#1E1E1E] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E1E1E]">
              <div>
                <h2 className="font-bold text-sm font-mono">{viewing.order_number}</h2>
                <p className="text-xs text-gray-500 mt-0.5">{new Date(viewing.created_at).toLocaleString('en-IN')}</p>
              </div>
              <button onClick={() => setViewing(null)} className="text-gray-400 hover:text-white"><FiX size={18} /></button>
            </div>
            <div className="p-5 space-y-5">
              {/* Customer info */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-xs text-gray-500 mb-0.5">Customer</p><p>{viewing.shipping_name}</p></div>
                <div><p className="text-xs text-gray-500 mb-0.5">Email</p><p className="truncate">{viewing.shipping_email}</p></div>
                <div><p className="text-xs text-gray-500 mb-0.5">Phone</p><p>{viewing.shipping_phone}</p></div>
                <div><p className="text-xs text-gray-500 mb-0.5">City / State</p><p>{viewing.shipping_city}, {viewing.shipping_state}</p></div>
                <div className="col-span-2"><p className="text-xs text-gray-500 mb-0.5">Address</p><p>{viewing.shipping_address}, {viewing.shipping_pincode}</p></div>
              </div>

              {/* Items */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Items</p>
                {viewing.items?.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm py-1.5 border-b border-[#1a1a1a]">
                    <span>{item.product_name} × {item.quantity}</span>
                    <span className="text-[#D4AF37]">₹{item.subtotal}</span>
                  </div>
                ))}
                <div className="text-xs text-gray-500 pt-2 space-y-1">
                  <div className="flex justify-between"><span>Subtotal</span><span>₹{viewing.subtotal}</span></div>
                  {viewing.discount_amount > 0 && <div className="flex justify-between text-green-400"><span>Discount ({viewing.discount_code})</span><span>−₹{viewing.discount_amount}</span></div>}
                  <div className="flex justify-between"><span>Shipping</span><span>{viewing.shipping_charge === 0 ? 'FREE' : `₹${viewing.shipping_charge}`}</span></div>
                </div>
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-[#1E1E1E] mt-2">
                  <span>Total</span><span className="text-[#D4AF37]">₹{viewing.total}</span>
                </div>
              </div>

              {/* Update form */}
              <div className="space-y-3">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Update Order</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Order Status</label>
                    <select value={statusForm.status} onChange={e => setStatusForm((f: any) => ({ ...f, status: e.target.value }))} className="input-admin bg-[#0A0A0A]">
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Payment Status</label>
                    <select value={statusForm.payment_status} onChange={e => setStatusForm((f: any) => ({ ...f, payment_status: e.target.value }))} className="input-admin bg-[#0A0A0A]">
                      {PAYMENT_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Tracking Number</label>
                    <input
                      type="text"
                      value={statusForm.tracking_number}
                      onChange={e => setStatusForm((f: any) => ({ ...f, tracking_number: e.target.value }))}
                      className="input-admin"
                      placeholder="e.g. 1234567890"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      Tracking Link
                      {statusForm.tracking_url && (
                        <a href={statusForm.tracking_url} target="_blank" rel="noopener noreferrer" className="ml-2 text-[#D4AF37] hover:text-[#F0D060]">
                          <FiExternalLink size={11} className="inline" />
                        </a>
                      )}
                    </label>
                    <input
                      type="url"
                      value={statusForm.tracking_url}
                      onChange={e => setStatusForm((f: any) => ({ ...f, tracking_url: e.target.value }))}
                      className="input-admin"
                      placeholder="https://track.carrier.com/..."
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-400 mb-1">Internal Notes</label>
                    <input
                      type="text"
                      value={statusForm.notes}
                      onChange={e => setStatusForm((f: any) => ({ ...f, notes: e.target.value }))}
                      className="input-admin"
                      placeholder="Optional notes"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="px-5 py-4 border-t border-[#1E1E1E] flex justify-end gap-3">
              <button onClick={() => setViewing(null)} className="btn-ghost">Close</button>
              <button onClick={() => handleStatusUpdate(viewing.id)} disabled={updating} className="btn-primary">
                {updating ? 'Saving...' : 'Update Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

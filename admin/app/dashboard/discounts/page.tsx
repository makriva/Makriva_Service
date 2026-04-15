'use client';

import { useState, useEffect } from 'react';
import { getDiscounts, createDiscount, updateDiscount, deleteDiscount } from '@/lib/api';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCopy } from 'react-icons/fi';
import toast from 'react-hot-toast';

const EMPTY = { code: '', description: '', discount_type: 'percentage', value: '', min_order_amount: '0', max_uses: '', is_active: true, valid_until: '' };

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => getDiscounts().then(setDiscounts).catch(() => {});
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(EMPTY); setEditing(null); setModal('create'); };
  const openEdit = (d: any) => { setForm({ ...d, value: String(d.value), min_order_amount: String(d.min_order_amount || 0), max_uses: String(d.max_uses || ''), valid_until: d.valid_until ? d.valid_until.split('T')[0] : '' }); setEditing(d); setModal('edit'); };

  const handleSave = async () => {
    if (!form.code || !form.value) { toast.error('Code and value required'); return; }
    setSaving(true);
    try {
      const payload = { ...form, code: form.code.toUpperCase(), value: parseFloat(form.value), min_order_amount: parseFloat(form.min_order_amount) || 0, max_uses: form.max_uses ? parseInt(form.max_uses) : null, valid_until: form.valid_until ? new Date(form.valid_until).toISOString() : null };
      if (modal === 'create') await createDiscount(payload);
      else await updateDiscount(editing.id, payload);
      toast.success('Discount saved!'); setModal(null); load();
    } catch (err: any) { toast.error(err?.response?.data?.detail || 'Error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this discount code?')) return;
    try { await deleteDiscount(id); toast.success('Deleted'); load(); }
    catch { toast.error('Error'); }
  };

  const copyCode = (code: string) => { navigator.clipboard.writeText(code); toast.success('Copied!'); };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Discount Codes ({discounts.length})</h1>
        <button onClick={openCreate} className="btn-primary gap-2"><FiPlus size={15} /> Create Code</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {discounts.map(d => (
          <div key={d.id} className={`bg-[#111] border p-4 transition-colors ${d.is_active ? 'border-[#1E1E1E]' : 'border-[#1a1a1a] opacity-60'}`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold font-mono text-[#D4AF37] text-sm tracking-wider">{d.code}</span>
                  <button onClick={() => copyCode(d.code)} className="text-gray-500 hover:text-[#D4AF37] transition-colors"><FiCopy size={12} /></button>
                </div>
                {d.description && <p className="text-xs text-gray-500 mt-0.5">{d.description}</p>}
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(d)} className="text-gray-400 hover:text-[#D4AF37] p-1"><FiEdit2 size={13} /></button>
                <button onClick={() => handleDelete(d.id)} className="text-gray-400 hover:text-red-400 p-1"><FiTrash2 size={13} /></button>
              </div>
            </div>
            <div className="space-y-1 text-xs text-gray-400">
              <div className="flex justify-between"><span>Discount</span><span className="text-white font-semibold">{d.discount_type === 'percentage' ? `${d.value}%` : `₹${d.value}`}</span></div>
              <div className="flex justify-between"><span>Min Order</span><span>₹{d.min_order_amount}</span></div>
              <div className="flex justify-between"><span>Used</span><span>{d.used_count}{d.max_uses ? ` / ${d.max_uses}` : ''}</span></div>
              {d.valid_until && <div className="flex justify-between"><span>Expires</span><span>{new Date(d.valid_until).toLocaleDateString('en-IN')}</span></div>}
            </div>
            <div className="mt-3">
              <span className={`text-xs px-2 py-0.5 ${d.is_active ? 'bg-green-400/10 text-green-400' : 'bg-gray-400/10 text-gray-400'}`}>
                {d.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))}
        {discounts.length === 0 && <div className="col-span-3 text-center py-16 text-gray-500 text-sm">No discount codes yet</div>}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-[#1E1E1E] w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E1E1E]">
              <h2 className="font-bold text-sm uppercase">{modal === 'create' ? 'Create Discount' : 'Edit Discount'}</h2>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-white"><FiX size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              {[
                { key: 'code', label: 'Code *', type: 'text', placeholder: 'SAVE20' },
                { key: 'description', label: 'Description', type: 'text', placeholder: 'Optional' },
                { key: 'value', label: 'Value *', type: 'number', placeholder: '20' },
                { key: 'min_order_amount', label: 'Min Order (₹)', type: 'number', placeholder: '0' },
                { key: 'max_uses', label: 'Max Uses (blank = unlimited)', type: 'number', placeholder: '' },
                { key: 'valid_until', label: 'Expires On', type: 'date', placeholder: '' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1">{f.label}</label>
                  <input type={f.type} value={form[f.key]} onChange={e => setForm((ff: any) => ({ ...ff, [f.key]: e.target.value }))} className="input-admin" placeholder={f.placeholder} />
                </div>
              ))}
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Discount Type</label>
                <select value={form.discount_type} onChange={e => setForm((ff: any) => ({ ...ff, discount_type: e.target.value }))} className="input-admin bg-[#0A0A0A]">
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={e => setForm((ff: any) => ({ ...ff, is_active: e.target.checked }))} className="accent-[#D4AF37]" />
                Active
              </label>
            </div>
            <div className="px-5 py-4 border-t border-[#1E1E1E] flex justify-end gap-3">
              <button onClick={() => setModal(null)} className="btn-ghost">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

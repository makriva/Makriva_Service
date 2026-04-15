'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { getProducts, createProduct, updateProduct, deleteProduct, uploadProductImage, deleteProductImage, getCategories } from '@/lib/api';
import { FiPlus, FiEdit2, FiTrash2, FiUpload, FiX, FiSearch, FiImage, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';

const EMPTY_FORM = { name: '', slug: '', description: '', short_description: '', price: '', original_price: '', weight: '', stock: '', category_id: '', is_active: true, is_featured: false, is_bestseller: false };

// Each pending image: { file, preview, isPrimary }
type PendingImage = { file: File; preview: string; isPrimary: boolean };

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  // Existing images (for edit mode)
  const [existingImages, setExistingImages] = useState<any[]>([]);
  // Newly queued images (before save)
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);

  // Per-row upload (quick replace from table)
  const [uploadId, setUploadId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const multiFileRef = useRef<HTMLInputElement>(null);

  const load = () => Promise.all([getProducts({ limit: 200 }), getCategories()])
    .then(([p, c]) => { setProducts(p); setCategories(c); })
    .catch(() => {});

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditing(null);
    setExistingImages([]);
    setPendingImages([]);
    setModal('create');
  };

  const openEdit = (p: any) => {
    setForm({ ...p, price: String(p.price), original_price: String(p.original_price || ''), stock: String(p.stock), category_id: p.category_id || '' });
    setEditing(p);
    setExistingImages(p.images || []);
    setPendingImages([]);
    setModal('edit');
  };

  const handleMultiSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const newImages: PendingImage[] = files.map((file, i) => ({
      file,
      preview: URL.createObjectURL(file),
      // First added image is primary if no existing images and no pending images yet
      isPrimary: existingImages.length === 0 && pendingImages.length === 0 && i === 0,
    }));
    setPendingImages(prev => [...prev, ...newImages]);
    e.target.value = '';
  };

  const removePending = (idx: number) => {
    setPendingImages(prev => {
      const next = prev.filter((_, i) => i !== idx);
      // Ensure at least one is primary if any remain
      if (next.length > 0 && !next.some(p => p.isPrimary)) {
        next[0].isPrimary = true;
      }
      return [...next];
    });
  };

  const setPendingPrimary = (idx: number) => {
    setPendingImages(prev => prev.map((p, i) => ({ ...p, isPrimary: i === idx })));
    // Clear primary from existing
    setExistingImages(prev => prev.map(img => ({ ...img, is_primary: false })));
  };

  const setExistingPrimary = (imgId: string) => {
    setExistingImages(prev => prev.map(img => ({ ...img, is_primary: img.id === imgId })));
    // Clear primary from pending
    setPendingImages(prev => prev.map(p => ({ ...p, isPrimary: false })));
  };

  const handleDeleteExisting = async (imgId: string) => {
    try {
      await deleteProductImage(imgId);
      setExistingImages(prev => prev.filter(img => img.id !== imgId));
      toast.success('Image removed');
    } catch {
      toast.error('Failed to remove image');
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.slug || !form.price) { toast.error('Name, slug, and price are required'); return; }
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        original_price: form.original_price ? parseFloat(form.original_price) : null,
        stock: parseInt(form.stock) || 0,
        category_id: form.category_id || null,
      };
      let product: any;
      if (modal === 'create') {
        product = await createProduct(payload);
      } else {
        product = await updateProduct(editing.id, payload);
      }

      // Upload all pending images sequentially
      for (let i = 0; i < pendingImages.length; i++) {
        const img = pendingImages[i];
        try {
          await uploadProductImage(product.id, img.file, img.isPrimary);
        } catch {
          toast.error(`Failed to upload image ${i + 1}`);
        }
      }

      toast.success(modal === 'create' ? 'Product created!' : 'Product updated!');
      setModal(null);
      load();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Error saving product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deactivate this product?')) return;
    try { await deleteProduct(id); toast.success('Product deactivated'); load(); }
    catch { toast.error('Error'); }
  };

  const handleTableUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!uploadId || !e.target.files?.[0]) return;
    try {
      await uploadProductImage(uploadId, e.target.files[0], true);
      toast.success('Image uploaded!'); load();
    } catch { toast.error('Upload failed'); }
    e.target.value = '';
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Products ({products.length})</h1>
        <button onClick={openCreate} className="btn-primary gap-2"><FiPlus size={15} /> Add Product</button>
      </div>

      <div className="relative mb-4">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="input-admin pl-9 max-w-sm" />
      </div>

      <div className="bg-[#111] border border-[#1E1E1E] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-[#1E1E1E]">
            <tr className="text-xs text-gray-500 uppercase tracking-wider">
              <th className="text-left px-4 py-3">Product</th>
              <th className="text-left px-4 py-3 hidden sm:table-cell">Price</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Stock</th>
              <th className="text-left px-4 py-3 hidden lg:table-cell">Status</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className="table-row border-b border-[#1a1a1a]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1a1a1a] flex-shrink-0 overflow-hidden">
                      {p.thumbnail_url
                        ? <Image src={p.thumbnail_url} alt="" width={40} height={40} className="object-cover w-full h-full" />
                        : <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">?</div>}
                    </div>
                    <div>
                      <p className="font-medium text-xs">{p.name}</p>
                      <p className="text-gray-500 text-xs">{p.weight} · {p.images?.length || 0} image{p.images?.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className="text-[#D4AF37] font-semibold">₹{p.price}</span>
                  {p.original_price && <span className="text-gray-500 text-xs ml-1 line-through">₹{p.original_price}</span>}
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className={p.stock > 0 ? 'text-green-400' : 'text-red-400'}>{p.stock}</span>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <div className="flex gap-1.5 flex-wrap">
                    {p.is_active && <span className="text-xs px-2 py-0.5 bg-green-400/10 text-green-400">Active</span>}
                    {p.is_featured && <span className="text-xs px-2 py-0.5 bg-[#D4AF37]/10 text-[#D4AF37]">Featured</span>}
                    {p.is_bestseller && <span className="text-xs px-2 py-0.5 bg-purple-400/10 text-purple-400">Bestseller</span>}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => { setUploadId(p.id); fileRef.current?.click(); }} title="Quick upload image" className="text-gray-400 hover:text-[#D4AF37] transition-colors p-1"><FiUpload size={14} /></button>
                    <button onClick={() => openEdit(p)} className="text-gray-400 hover:text-[#D4AF37] transition-colors p-1"><FiEdit2 size={14} /></button>
                    <button onClick={() => handleDelete(p.id)} className="text-gray-400 hover:text-red-400 transition-colors p-1"><FiTrash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="text-center py-10 text-gray-500 text-sm">No products found</div>}
      </div>

      {/* Hidden inputs */}
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleTableUpload} />
      <input ref={multiFileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleMultiSelect} />

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-[#1E1E1E] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E1E1E]">
              <h2 className="font-bold text-sm uppercase tracking-wider">{modal === 'create' ? 'Add Product' : 'Edit Product'}</h2>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-white"><FiX size={18} /></button>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* ── Images section ── */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-gray-400 uppercase tracking-wider">
                    Product Images ({existingImages.length + pendingImages.length})
                  </label>
                  <button
                    type="button"
                    onClick={() => multiFileRef.current?.click()}
                    className="text-xs text-[#D4AF37] hover:text-[#F0D060] flex items-center gap-1 transition-colors"
                  >
                    <FiPlus size={12} /> Add Images
                  </button>
                </div>

                {existingImages.length === 0 && pendingImages.length === 0 ? (
                  <div
                    onClick={() => multiFileRef.current?.click()}
                    className="border border-dashed border-[#333] hover:border-[#D4AF37] transition-colors cursor-pointer h-28 flex flex-col items-center justify-center gap-2 text-gray-500"
                  >
                    <FiImage size={26} />
                    <span className="text-xs">Click to upload images (multiple supported)</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    {/* Existing images */}
                    {existingImages.map(img => (
                      <div key={img.id} className="relative group aspect-square bg-[#0A0A0A] border border-[#1E1E1E] overflow-hidden">
                        <Image src={img.url} alt="" fill className="object-cover" />
                        {img.is_primary && (
                          <div className="absolute top-1 left-1 bg-[#D4AF37] rounded-sm px-1 py-0.5 text-black text-[9px] font-bold flex items-center gap-0.5">
                            <FiStar size={8} /> Primary
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5">
                          {!img.is_primary && (
                            <button
                              type="button"
                              onClick={() => setExistingPrimary(img.id)}
                              className="text-[9px] bg-[#D4AF37] text-black px-1.5 py-0.5 font-bold"
                            >
                              Set Primary
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteExisting(img.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <FiTrash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Pending (not yet uploaded) images */}
                    {pendingImages.map((img, idx) => (
                      <div key={idx} className="relative group aspect-square bg-[#0A0A0A] border border-[#333] border-dashed overflow-hidden">
                        <img src={img.preview} alt="" className="w-full h-full object-cover opacity-70" />
                        {img.isPrimary && (
                          <div className="absolute top-1 left-1 bg-[#D4AF37] rounded-sm px-1 py-0.5 text-black text-[9px] font-bold flex items-center gap-0.5">
                            <FiStar size={8} /> Primary
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5">
                          {!img.isPrimary && (
                            <button
                              type="button"
                              onClick={() => setPendingPrimary(idx)}
                              className="text-[9px] bg-[#D4AF37] text-black px-1.5 py-0.5 font-bold"
                            >
                              Set Primary
                            </button>
                          )}
                          <button type="button" onClick={() => removePending(idx)} className="text-red-400 hover:text-red-300">
                            <FiX size={13} />
                          </button>
                        </div>
                        {/* "New" badge */}
                        <div className="absolute bottom-1 right-1 bg-blue-500 text-white text-[8px] px-1 py-0.5 font-bold">NEW</div>
                      </div>
                    ))}

                    {/* Add more */}
                    <div
                      onClick={() => multiFileRef.current?.click()}
                      className="aspect-square border border-dashed border-[#333] hover:border-[#D4AF37] transition-colors cursor-pointer flex flex-col items-center justify-center gap-1 text-gray-600 hover:text-gray-400"
                    >
                      <FiPlus size={18} />
                      <span className="text-[9px]">Add more</span>
                    </div>
                  </div>
                )}
                {pendingImages.length > 0 && (
                  <p className="text-xs text-[#D4AF37] mt-1.5">{pendingImages.length} new image{pendingImages.length !== 1 ? 's' : ''} will upload on save</p>
                )}
              </div>

              {/* Form fields */}
              {[
                { key: 'name', label: 'Name *', span: true },
                { key: 'slug', label: 'Slug *', span: true },
                { key: 'short_description', label: 'Short Description', span: true },
                { key: 'price', label: 'Price (₹) *' },
                { key: 'original_price', label: 'Original Price (₹)' },
                { key: 'weight', label: 'Weight (e.g. 150g)' },
                { key: 'stock', label: 'Stock Qty' },
              ].map(f => (
                <div key={f.key} className={(f as any).span ? 'sm:col-span-2' : ''}>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1">{f.label}</label>
                  <input
                    type={['price', 'original_price', 'stock'].includes(f.key) ? 'number' : 'text'}
                    value={form[f.key]}
                    onChange={e => setForm((ff: any) => ({ ...ff, [f.key]: e.target.value }))}
                    className="input-admin"
                  />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Description</label>
                <textarea rows={3} value={form.description} onChange={e => setForm((ff: any) => ({ ...ff, description: e.target.value }))} className="input-admin resize-none" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Category</label>
                <select value={form.category_id} onChange={e => setForm((ff: any) => ({ ...ff, category_id: e.target.value }))} className="input-admin bg-[#0A0A0A]">
                  <option value="">No Category</option>
                  {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-4 pt-2">
                {[{ key: 'is_active', label: 'Active' }, { key: 'is_featured', label: 'Featured' }, { key: 'is_bestseller', label: 'Bestseller' }].map(f => (
                  <label key={f.key} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={form[f.key]} onChange={e => setForm((ff: any) => ({ ...ff, [f.key]: e.target.checked }))} className="accent-[#D4AF37]" />
                    {f.label}
                  </label>
                ))}
              </div>
            </div>
            <div className="px-5 py-4 border-t border-[#1E1E1E] flex justify-end gap-3">
              <button onClick={() => setModal(null)} className="btn-ghost">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary">
                {saving ? 'Saving...' : modal === 'create' ? 'Create Product' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

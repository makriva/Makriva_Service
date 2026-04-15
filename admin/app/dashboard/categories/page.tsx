'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { getCategories, createCategory, updateCategory, uploadCategoryImage } from '@/lib/api';
import { FiPlus, FiEdit2, FiX, FiImage } from 'react-icons/fi';
import toast from 'react-hot-toast';

const EMPTY = { name: '', slug: '', description: '', image_url: '', is_active: true };

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => getCategories().then(setCategories).catch(() => {});
  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm(EMPTY); setEditing(null);
    setImageFile(null); setImagePreview(null);
    setModal('create');
  };

  const openEdit = (c: any) => {
    setForm({ ...c }); setEditing(c);
    setImageFile(null); setImagePreview(c.image_url || null);
    setModal('edit');
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!form.name || !form.slug) { toast.error('Name and slug required'); return; }
    setSaving(true);
    try {
      let savedCategory: any;
      if (modal === 'create') {
        savedCategory = await createCategory(form);
      } else {
        savedCategory = await updateCategory(editing.id, form);
      }
      // Upload image to Cloudinary if a file was selected
      if (imageFile) {
        try {
          await uploadCategoryImage(savedCategory.id, imageFile);
        } catch {
          toast.error('Category saved but image upload failed');
        }
      }
      toast.success('Category saved!');
      setModal(null);
      load();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Categories ({categories.length})</h1>
        <button onClick={openCreate} className="btn-primary gap-2"><FiPlus size={15} /> Add Category</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(c => (
          <div key={c.id} className="bg-[#111] border border-[#1E1E1E] overflow-hidden">
            {c.image_url && (
              <div className="relative h-28 bg-[#0A0A0A]">
                <Image src={c.image_url} alt={c.name} fill className="object-cover opacity-80" />
              </div>
            )}
            <div className="p-4 flex items-start justify-between">
              <div>
                <p className="font-semibold text-sm">{c.name}</p>
                <p className="text-xs text-gray-500 font-mono mt-0.5">/{c.slug}</p>
                {c.description && <p className="text-xs text-gray-500 mt-1">{c.description}</p>}
                <span className={`inline-block mt-2 text-xs px-2 py-0.5 ${c.is_active ? 'bg-green-400/10 text-green-400' : 'bg-gray-400/10 text-gray-400'}`}>
                  {c.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <button onClick={() => openEdit(c)} className="text-gray-400 hover:text-[#D4AF37] p-1 ml-2">
                <FiEdit2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="col-span-3 text-center py-16 text-gray-500 text-sm">No categories yet</div>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-[#1E1E1E] w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E1E1E]">
              <h2 className="font-bold text-sm uppercase">{modal === 'create' ? 'Add Category' : 'Edit Category'}</h2>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-white"><FiX size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              {/* Image upload */}
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Category Image</label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="border border-dashed border-[#333] hover:border-[#D4AF37] transition-colors cursor-pointer overflow-hidden"
                  style={{ height: imagePreview ? 'auto' : '90px' }}
                >
                  {imagePreview ? (
                    <div className="relative">
                      <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="text-xs text-white flex items-center gap-1"><FiImage size={13} /> Change</span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center gap-1 text-gray-500">
                      <FiImage size={22} />
                      <span className="text-xs">Click to upload image</span>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                {imageFile && <p className="text-xs text-[#D4AF37] mt-1">{imageFile.name} — uploads on save</p>}
              </div>

              {[
                { key: 'name', label: 'Name *' },
                { key: 'slug', label: 'Slug *', placeholder: 'e.g. roasted-makhana' },
                { key: 'description', label: 'Description' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1">{f.label}</label>
                  <input
                    type="text"
                    value={form[f.key]}
                    onChange={e => setForm((ff: any) => ({ ...ff, [f.key]: e.target.value }))}
                    className="input-admin"
                    placeholder={(f as any).placeholder || ''}
                  />
                </div>
              ))}

              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={e => setForm((ff: any) => ({ ...ff, is_active: e.target.checked }))} className="accent-[#D4AF37]" />
                Active
              </label>
            </div>
            <div className="px-5 py-4 border-t border-[#1E1E1E] flex justify-end gap-3">
              <button onClick={() => setModal(null)} className="btn-ghost">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary">
                {saving ? 'Saving...' : 'Save Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

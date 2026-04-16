'use client';

import { useState, useEffect } from 'react';
import { getAdminReels, addReel, updateReel, deleteReel } from '@/lib/api';
import { FiInstagram, FiPlus, FiTrash2, FiEye, FiEyeOff, FiLink, FiVideo } from 'react-icons/fi';
import toast from 'react-hot-toast';

type Reel = { id: string; url: string; video_url?: string; order: number; is_active: boolean; created_at: string };

export default function ReelsPage() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUrl, setNewUrl] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    getAdminReels()
      .then((d: Reel[]) => setReels(d || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const extractInstagramUrl = (input: string): string | null => {
    const match = input.match(/https?:\/\/(?:www\.)?instagram\.com\/(reel|p)\/([A-Za-z0-9_-]+)/);
    return match ? `https://www.instagram.com/${match[1]}/${match[2]}/` : null;
  };

  const handleAdd = async () => {
    if (!newUrl.trim()) return;
    const cleanUrl = extractInstagramUrl(newUrl.trim());
    if (!cleanUrl) {
      toast.error('Please enter a valid Instagram reel URL');
      return;
    }
    if (!newVideoUrl.trim()) {
      toast.error('Please enter the direct video URL (MP4 link)');
      return;
    }
    setAdding(true);
    try {
      const reel = await addReel({ url: cleanUrl, video_url: newVideoUrl.trim(), order: reels.length, is_active: true });
      setReels(prev => [...prev, reel]);
      setNewUrl('');
      setNewVideoUrl('');
      toast.success('Reel added');
    } catch {
      toast.error('Failed to add reel');
    } finally {
      setAdding(false);
    }
  };

  const handleToggle = async (reel: Reel) => {
    try {
      const updated = await updateReel(reel.id, { is_active: !reel.is_active });
      setReels(prev => prev.map(r => r.id === reel.id ? { ...r, ...updated } : r));
    } catch {
      toast.error('Failed to update');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this reel?')) return;
    try {
      await deleteReel(id);
      setReels(prev => prev.filter(r => r.id !== id));
      toast.success('Reel removed');
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <FiInstagram className="text-[#D4AF37]" /> Instagram Reels
        </h1>
        <p className="text-gray-400 text-sm mt-1">Add reels to display as autoplay videos on the homepage</p>
      </div>

      {/* Add new reel */}
      <div className="bg-[#111] border border-[#1E1E1E] rounded-xl p-5 mb-8 space-y-3">
        <p className="text-sm font-semibold text-white">Add a Reel</p>

        {/* Instagram URL */}
        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block">Instagram URL</label>
          <div className="relative">
            <FiInstagram size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="url"
              value={newUrl}
              onChange={e => setNewUrl(e.target.value)}
              placeholder="https://www.instagram.com/reel/ABC123/"
              className="w-full pl-9 pr-4 py-2.5 bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg text-sm text-white placeholder:text-gray-600 outline-none focus:border-[#D4AF37]/60 transition-colors"
            />
          </div>
          <p className="text-xs text-gray-600 mt-1">Used as the link when user clicks the video</p>
        </div>

        {/* Direct video URL */}
        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block">Direct Video URL (MP4)</label>
          <div className="relative">
            <FiVideo size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="url"
              value={newVideoUrl}
              onChange={e => setNewVideoUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="https://your-cdn.com/video.mp4"
              className="w-full pl-9 pr-4 py-2.5 bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg text-sm text-white placeholder:text-gray-600 outline-none focus:border-[#D4AF37]/60 transition-colors"
            />
          </div>
          <p className="text-xs text-gray-600 mt-1">Direct link to the MP4 video file (from Google Drive, S3, Cloudinary, etc.)</p>
        </div>

        <button
          onClick={handleAdd}
          disabled={adding}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-black disabled:opacity-50 transition-all"
          style={{ background: 'linear-gradient(135deg,#D4AF37,#F0D060)' }}
        >
          <FiPlus size={15} /> {adding ? 'Adding…' : 'Add Reel'}
        </button>
      </div>

      {/* Reels list */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : reels.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No reels added yet. Add your first reel above.</div>
      ) : (
        <div className="space-y-3">
          {reels.map((reel, i) => (
            <div key={reel.id} className={`p-4 rounded-xl border transition-all ${reel.is_active ? 'border-[#1E1E1E] bg-[#111]' : 'border-[#1A1A1A] bg-[#0D0D0D] opacity-60'}`}>
              <div className="flex items-center gap-4">
                <span className="text-gray-600 text-sm w-5 text-center shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <FiInstagram size={13} className="text-[#D4AF37] shrink-0" />
                    <span className="text-gray-300 text-sm truncate">{reel.url}</span>
                  </div>
                  {reel.video_url ? (
                    <div className="flex items-center gap-2">
                      <FiVideo size={13} className="text-green-400 shrink-0" />
                      <span className="text-green-400 text-xs truncate">{reel.video_url}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-amber-500">⚠ No video URL — won't display on homepage</span>
                  )}
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${reel.is_active ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-500'}`}>
                  {reel.is_active ? 'Active' : 'Hidden'}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggle(reel)}
                    title={reel.is_active ? 'Hide' : 'Show'}
                    className="w-8 h-8 rounded-lg border border-[#2A2A2A] flex items-center justify-center text-gray-400 hover:text-white hover:border-[#D4AF37]/40 transition-all"
                  >
                    {reel.is_active ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                  </button>
                  <button
                    onClick={() => handleDelete(reel.id)}
                    title="Remove"
                    className="w-8 h-8 rounded-lg border border-[#2A2A2A] flex items-center justify-center text-gray-400 hover:text-red-400 hover:border-red-500/40 transition-all"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

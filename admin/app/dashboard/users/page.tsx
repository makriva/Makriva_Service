'use client';

import { useState, useEffect } from 'react';
import { getUsers, toggleUserActive } from '@/lib/api';
import { FiSearch, FiUser, FiShield, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => getUsers({ limit: 200 }).then(setUsers).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleToggle = async (id: string) => {
    try { await toggleUserActive(id); toast.success('Updated'); load(); }
    catch { toast.error('Error'); }
  };

  const filtered = users.filter(u => u.email.toLowerCase().includes(search.toLowerCase()) || (u.full_name || '').toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Users ({users.length})</h1>
      </div>

      <div className="relative mb-4">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." className="input-admin pl-9 max-w-sm" />
      </div>

      <div className="bg-[#111] border border-[#1E1E1E]">
        <table className="w-full text-sm">
          <thead className="border-b border-[#1E1E1E]">
            <tr className="text-xs text-gray-500 uppercase tracking-wider">
              <th className="text-left px-4 py-3">User</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Joined</th>
              <th className="text-left px-4 py-3">Role</th>
              <th className="text-right px-4 py-3">Active</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="text-center py-10 text-gray-500 text-sm">Loading...</td></tr>
            ) : filtered.map(user => (
              <tr key={user.id} className="table-row border-b border-[#1a1a1a]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center flex-shrink-0">
                      <FiUser size={14} className="text-gray-500" />
                    </div>
                    <div>
                      <p className="text-xs font-medium">{user.full_name || '—'}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-xs text-gray-400">
                  {new Date(user.created_at).toLocaleDateString('en-IN')}
                </td>
                <td className="px-4 py-3">
                  {user.is_admin ? (
                    <span className="flex items-center gap-1 text-xs text-[#D4AF37]"><FiShield size={11} /> Admin</span>
                  ) : (
                    <span className="text-xs text-gray-500">Customer</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => handleToggle(user.id)} className={`transition-colors ${user.is_active ? 'text-green-400 hover:text-red-400' : 'text-red-400 hover:text-green-400'}`}>
                    {user.is_active ? <FiToggleRight size={22} /> : <FiToggleLeft size={22} />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && filtered.length === 0 && <div className="text-center py-10 text-gray-500 text-sm">No users found</div>}
      </div>
    </div>
  );
}

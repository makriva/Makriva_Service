'use client';

import { useState, useEffect } from 'react';
import { getContactQueries, markQueryViewed, getNewsletterSignups, markNewsletterViewed } from '@/lib/api';
import { FiMail, FiMessageSquare, FiCheck, FiClock } from 'react-icons/fi';

type Query = { id: string; name: string; email: string; subject: string; message: string; is_viewed: boolean; created_at: string };
type Signup = { id: string; email: string; is_viewed: boolean; created_at: string };

export default function QueriesPage() {
  const [tab, setTab] = useState<'contact' | 'newsletter'>('contact');
  const [queries, setQueries] = useState<Query[]>([]);
  const [signups, setSignups] = useState<Signup[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getContactQueries(), getNewsletterSignups()])
      .then(([q, s]) => { setQueries(q || []); setSignups(s || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleMarkQuery = async (id: string) => {
    await markQueryViewed(id).catch(() => {});
    setQueries(prev => prev.map(q => q.id === id ? { ...q, is_viewed: true } : q));
  };

  const handleMarkSignup = async (id: string) => {
    await markNewsletterViewed(id).catch(() => {});
    setSignups(prev => prev.map(s => s.id === id ? { ...s, is_viewed: true } : s));
  };

  const unreadQueries = queries.filter(q => !q.is_viewed).length;
  const unreadSignups = signups.filter(s => !s.is_viewed).length;

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Queries & Signups</h1>
        <p className="text-gray-400 text-sm mt-1">Contact form submissions and newsletter signups</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'contact', label: 'Contact Queries', icon: FiMessageSquare, count: unreadQueries },
          { key: 'newsletter', label: 'Newsletter', icon: FiMail, count: unreadSignups },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              tab === t.key
                ? 'text-black'
                : 'text-gray-400 bg-[#1A1A1A] hover:text-white'
            }`}
            style={tab === t.key ? { background: 'linear-gradient(135deg,#D4AF37,#F0D060)' } : {}}
          >
            <t.icon size={15} />
            {t.label}
            {t.count > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${tab === t.key ? 'bg-black/20 text-black' : 'bg-[#D4AF37]/20 text-[#D4AF37]'}`}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : tab === 'contact' ? (
        <div className="space-y-3">
          {queries.length === 0 ? (
            <div className="text-center py-20 text-gray-500">No contact queries yet.</div>
          ) : queries.map(q => (
            <div
              key={q.id}
              className={`border rounded-xl overflow-hidden transition-all ${
                q.is_viewed ? 'border-[#1E1E1E] bg-[#111]' : 'border-[#D4AF37]/40 bg-[#111]'
              }`}
            >
              <div
                className="flex items-start justify-between gap-4 p-4 cursor-pointer"
                onClick={() => setExpanded(expanded === q.id ? null : q.id)}
              >
                <div className="flex items-start gap-3 min-w-0">
                  {!q.is_viewed && <span className="w-2 h-2 rounded-full bg-[#D4AF37] mt-2 shrink-0" />}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-white text-sm">{q.name}</span>
                      <span className="text-gray-500 text-xs">{q.email}</span>
                    </div>
                    <p className="text-gray-400 text-xs mt-0.5">{q.subject || '(no subject)'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-gray-600 text-xs flex items-center gap-1">
                    <FiClock size={11} />
                    {new Date(q.created_at).toLocaleDateString('en-IN')}
                  </span>
                  {!q.is_viewed && (
                    <button
                      onClick={e => { e.stopPropagation(); handleMarkQuery(q.id); }}
                      className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors"
                    >
                      <FiCheck size={12} /> Mark Viewed
                    </button>
                  )}
                  {q.is_viewed && <span className="text-xs text-gray-600 flex items-center gap-1"><FiCheck size={12} /> Viewed</span>}
                </div>
              </div>
              {expanded === q.id && (
                <div className="px-4 pb-4 border-t border-[#1E1E1E] pt-3">
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{q.message}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {signups.length === 0 ? (
            <div className="text-center py-20 text-gray-500">No newsletter signups yet.</div>
          ) : signups.map(s => (
            <div
              key={s.id}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                s.is_viewed ? 'border-[#1E1E1E] bg-[#111]' : 'border-[#D4AF37]/40 bg-[#111]'
              }`}
            >
              <div className="flex items-center gap-3">
                {!s.is_viewed && <span className="w-2 h-2 rounded-full bg-[#D4AF37] shrink-0" />}
                <span className="text-white text-sm">{s.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-600 text-xs flex items-center gap-1">
                  <FiClock size={11} />
                  {new Date(s.created_at).toLocaleDateString('en-IN')}
                </span>
                {!s.is_viewed ? (
                  <button
                    onClick={() => handleMarkSignup(s.id)}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors"
                  >
                    <FiCheck size={12} /> Mark Viewed
                  </button>
                ) : (
                  <span className="text-xs text-gray-600 flex items-center gap-1"><FiCheck size={12} /> Viewed</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

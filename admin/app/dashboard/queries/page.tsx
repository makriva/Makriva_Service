'use client';

import { useState, useEffect } from 'react';
import {
  getContactQueries, markQueryViewed, replyToQuery,
  getNewsletterSignups, markNewsletterViewed, sendBulkNewsletterEmail,
  sendGeneralEmail,
} from '@/lib/api';
import { FiMail, FiMessageSquare, FiCheck, FiClock, FiSend, FiX, FiSquare, FiCheckSquare } from 'react-icons/fi';
import toast from 'react-hot-toast';

type Query   = { id: string; name: string; email: string; subject: string; message: string; is_viewed: boolean; created_at: string };
type Signup  = { id: string; email: string; is_viewed: boolean; created_at: string };
type Tab     = 'contact' | 'newsletter' | 'compose';

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-[#111] border border-[#2A2A2A] rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E1E1E]">
          <h3 className="font-bold text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><FiX size={18}/></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export default function QueriesPage() {
  const [tab, setTab]         = useState<Tab>('contact');
  const [queries, setQueries] = useState<Query[]>([]);
  const [signups, setSignups] = useState<Signup[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  // Reply modal
  const [replyTarget, setReplyTarget] = useState<Query | null>(null);
  const [replyText, setReplyText]     = useState('');
  const [sending, setSending]         = useState(false);

  // Newsletter bulk
  const [selected, setSelected]     = useState<Set<string>>(new Set());
  const [bulkSubject, setBulkSubject] = useState('');
  const [bulkBody, setBulkBody]       = useState('');
  const [bulkOpen, setBulkOpen]       = useState(false);
  const [bulkSending, setBulkSending] = useState(false);

  // General compose
  const [gTo, setGTo]           = useState('');
  const [gSubject, setGSubject] = useState('');
  const [gBody, setGBody]       = useState('');
  const [gSending, setGSending] = useState(false);

  useEffect(() => {
    Promise.all([getContactQueries(), getNewsletterSignups()])
      .then(([q, s]) => { setQueries(q || []); setSignups(s || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const unreadQueries = queries.filter(q => !q.is_viewed).length;
  const unreadSignups = signups.filter(s => !s.is_viewed).length;

  const handleMarkQuery = async (id: string) => {
    await markQueryViewed(id).catch(() => {});
    setQueries(prev => prev.map(q => q.id === id ? { ...q, is_viewed: true } : q));
  };

  const handleReply = async () => {
    if (!replyTarget || !replyText.trim()) return;
    setSending(true);
    try {
      await replyToQuery(replyTarget.id, replyText);
      toast.success('Reply sent!');
      setQueries(prev => prev.map(q => q.id === replyTarget.id ? { ...q, is_viewed: true } : q));
      setReplyTarget(null); setReplyText('');
    } catch {
      toast.error('Failed to send reply');
    } finally { setSending(false); }
  };

  const toggleSelect = (id: string) => setSelected(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const selectAll = () => setSelected(new Set(signups.map(s => s.id)));
  const clearAll  = () => setSelected(new Set());

  const handleBulkSend = async () => {
    if (!bulkSubject.trim() || !bulkBody.trim() || selected.size === 0) return;
    setBulkSending(true);
    try {
      const res = await sendBulkNewsletterEmail(Array.from(selected), bulkSubject, bulkBody);
      toast.success(`Sent to ${res.sent} subscriber${res.sent !== 1 ? 's' : ''}${res.failed ? `, ${res.failed} failed` : ''}`);
      setBulkOpen(false); setBulkSubject(''); setBulkBody(''); setSelected(new Set());
    } catch {
      toast.error('Failed to send');
    } finally { setBulkSending(false); }
  };

  const handleGeneralSend = async () => {
    if (!gTo.trim() || !gSubject.trim() || !gBody.trim()) return;
    setGSending(true);
    try {
      await sendGeneralEmail(gTo.trim(), gSubject, gBody);
      toast.success('Email sent!');
      setGTo(''); setGSubject(''); setGBody('');
    } catch {
      toast.error('Failed to send');
    } finally { setGSending(false); }
  };

  const TABS: { key: Tab; label: string; icon: any; count?: number }[] = [
    { key: 'contact',    label: 'Contact Queries',  icon: FiMessageSquare, count: unreadQueries },
    { key: 'newsletter', label: 'Newsletter',        icon: FiMail,          count: unreadSignups },
    { key: 'compose',   label: 'Send Email',         icon: FiSend },
  ];

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Queries & Email</h1>
        <p className="text-gray-400 text-sm mt-1">Contact queries, newsletter subscribers, and email tools</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              tab === t.key ? 'text-black' : 'text-gray-400 bg-[#1A1A1A] hover:text-white'
            }`}
            style={tab === t.key ? { background: 'linear-gradient(135deg,#D4AF37,#F0D060)' } : {}}>
            <t.icon size={15}/>
            {t.label}
            {t.count != null && t.count > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${tab === t.key ? 'bg-black/20 text-black' : 'bg-[#D4AF37]/20 text-[#D4AF37]'}`}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"/>
        </div>
      ) : tab === 'contact' ? (
        /* ── Contact Queries ── */
        <div className="space-y-3">
          {queries.length === 0 ? (
            <div className="text-center py-20 text-gray-500">No contact queries yet.</div>
          ) : queries.map(q => (
            <div key={q.id} className={`border rounded-xl overflow-hidden transition-all ${q.is_viewed ? 'border-[#1E1E1E] bg-[#111]' : 'border-[#D4AF37]/40 bg-[#111]'}`}>
              <div className="flex items-start justify-between gap-4 p-4 cursor-pointer"
                onClick={() => setExpanded(expanded === q.id ? null : q.id)}>
                <div className="flex items-start gap-3 min-w-0">
                  {!q.is_viewed && <span className="w-2 h-2 rounded-full bg-[#D4AF37] mt-2 shrink-0"/>}
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
                    <FiClock size={11}/>{new Date(q.created_at).toLocaleDateString('en-IN')}
                  </span>
                  <button onClick={e => { e.stopPropagation(); setReplyTarget(q); setReplyText(''); }}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors">
                    <FiSend size={11}/> Reply
                  </button>
                  {!q.is_viewed && (
                    <button onClick={e => { e.stopPropagation(); handleMarkQuery(q.id); }}
                      className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border border-[#333] text-gray-400 hover:text-white transition-colors">
                      <FiCheck size={12}/>
                    </button>
                  )}
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

      ) : tab === 'newsletter' ? (
        /* ── Newsletter ── */
        <div>
          {signups.length > 0 && (
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <button onClick={selected.size === signups.length ? clearAll : selectAll}
                  className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors">
                  {selected.size === signups.length ? <FiCheckSquare size={14}/> : <FiSquare size={14}/>}
                  {selected.size === signups.length ? 'Deselect All' : 'Select All'}
                </button>
                {selected.size > 0 && (
                  <span className="text-xs text-[#D4AF37]">{selected.size} selected</span>
                )}
              </div>
              {selected.size > 0 && (
                <button onClick={() => setBulkOpen(true)}
                  className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg font-bold text-black"
                  style={{ background: 'linear-gradient(135deg,#D4AF37,#F0D060)' }}>
                  <FiSend size={13}/> Send Email to Selected
                </button>
              )}
            </div>
          )}

          <div className="space-y-2">
            {signups.length === 0 ? (
              <div className="text-center py-20 text-gray-500">No newsletter signups yet.</div>
            ) : signups.map(s => (
              <div key={s.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${s.is_viewed ? 'border-[#1E1E1E] bg-[#111]' : 'border-[#D4AF37]/40 bg-[#111]'}`}>
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleSelect(s.id)} className="text-gray-500 hover:text-[#D4AF37] transition-colors">
                    {selected.has(s.id) ? <FiCheckSquare size={16} className="text-[#D4AF37]"/> : <FiSquare size={16}/>}
                  </button>
                  {!s.is_viewed && <span className="w-2 h-2 rounded-full bg-[#D4AF37] shrink-0"/>}
                  <span className="text-white text-sm">{s.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-600 text-xs flex items-center gap-1">
                    <FiClock size={11}/>{new Date(s.created_at).toLocaleDateString('en-IN')}
                  </span>
                  {!s.is_viewed && (
                    <button onClick={async () => { await markNewsletterViewed(s.id).catch(() => {}); setSignups(prev => prev.map(x => x.id === s.id ? { ...x, is_viewed: true } : x)); }}
                      className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors">
                      <FiCheck size={12}/>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      ) : (
        /* ── General Compose ── */
        <div className="max-w-lg">
          <div className="bg-[#111] border border-[#1E1E1E] rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-[#D4AF37] uppercase tracking-widest flex items-center gap-2"><FiSend size={14}/> Compose Email</h2>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">To</label>
              <input type="email" value={gTo} onChange={e => setGTo(e.target.value)} placeholder="recipient@email.com"
                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Subject</label>
              <input type="text" value={gSubject} onChange={e => setGSubject(e.target.value)} placeholder="Email subject"
                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Message</label>
              <textarea value={gBody} onChange={e => setGBody(e.target.value)} rows={8} placeholder="Write your message here…"
                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37] resize-none"/>
            </div>
            <button onClick={handleGeneralSend} disabled={gSending || !gTo.trim() || !gSubject.trim() || !gBody.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-black disabled:opacity-50 transition-opacity"
              style={{ background: 'linear-gradient(135deg,#D4AF37,#F0D060)' }}>
              {gSending ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"/> : <FiSend size={14}/>}
              {gSending ? 'Sending…' : 'Send Email'}
            </button>
          </div>
        </div>
      )}

      {/* ── Reply Modal ── */}
      {replyTarget && (
        <Modal title={`Reply to ${replyTarget.name}`} onClose={() => setReplyTarget(null)}>
          <div className="space-y-4">
            <div className="bg-[#1A1A1A] rounded-lg p-3 text-xs text-gray-400">
              <p><span className="text-gray-300">{replyTarget.name}</span> &lt;{replyTarget.email}&gt;</p>
              <p className="mt-1 text-gray-500">{replyTarget.subject || '(no subject)'}</p>
              <p className="mt-2 text-gray-400 line-clamp-3">{replyTarget.message}</p>
            </div>
            <textarea value={replyText} onChange={e => setReplyText(e.target.value)} rows={6}
              placeholder="Type your reply…"
              className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37] resize-none"/>
            <button onClick={handleReply} disabled={sending || !replyText.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-black disabled:opacity-50 w-full justify-center"
              style={{ background: 'linear-gradient(135deg,#D4AF37,#F0D060)' }}>
              {sending ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"/> : <FiSend size={14}/>}
              {sending ? 'Sending…' : 'Send Reply'}
            </button>
          </div>
        </Modal>
      )}

      {/* ── Bulk Email Modal ── */}
      {bulkOpen && (
        <Modal title={`Email to ${selected.size} subscriber${selected.size !== 1 ? 's' : ''}`} onClose={() => setBulkOpen(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Subject</label>
              <input type="text" value={bulkSubject} onChange={e => setBulkSubject(e.target.value)} placeholder="Email subject"
                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Message</label>
              <textarea value={bulkBody} onChange={e => setBulkBody(e.target.value)} rows={8} placeholder="Write your message…"
                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37] resize-none"/>
            </div>
            <button onClick={handleBulkSend} disabled={bulkSending || !bulkSubject.trim() || !bulkBody.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-black disabled:opacity-50 w-full justify-center"
              style={{ background: 'linear-gradient(135deg,#D4AF37,#F0D060)' }}>
              {bulkSending ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"/> : <FiSend size={14}/>}
              {bulkSending ? 'Sending…' : `Send to ${selected.size} subscribers`}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

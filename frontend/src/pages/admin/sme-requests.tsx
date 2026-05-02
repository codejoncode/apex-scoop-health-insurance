'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import api from '@/lib/api';

interface SmeRequest {
  id: string; question: string; bot_answer?: string; name: string; email?: string;
  phone?: string; best_time?: string; source: string; status: string;
  admin_notes?: string; created_at: string;
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  DONE: 'bg-green-100 text-green-800',
};

export default function SmeRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<SmeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<SmeRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('token')) { router.push('/admin/login'); return; }
    load();
  }, []);

  async function load() {
    setLoading(true);
    const r = await api.get('/api/ask/sme-requests').catch(() => null);
    if (r) setRequests(r.data);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string, notes?: string) {
    setSaving(true);
    await api.patch(`/api/ask/sme-requests/${id}`, { status, admin_notes: notes ?? null }).catch(() => {});
    setSaving(false);
    setSelected(null);
    load();
  }

  function openRequest(req: SmeRequest) {
    setSelected(req);
    setAdminNotes(req.admin_notes ?? '');
  }

  const filtered = statusFilter ? requests.filter(r => r.status === statusFilter) : requests;
  const counts = { PENDING: requests.filter(r => r.status === 'PENDING').length, IN_PROGRESS: requests.filter(r => r.status === 'IN_PROGRESS').length, DONE: requests.filter(r => r.status === 'DONE').length };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">SME Request Inbox</h1>
            <p className="text-gray-500 mt-1">Questions the bot couldn't answer — review and respond to leads</p>
          </div>
          <a href="/admin/dashboard" className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 text-sm">← Dashboard</a>
        </div>

        {/* Status summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[['PENDING', 'Pending', 'text-yellow-600'], ['IN_PROGRESS', 'In Progress', 'text-blue-600'], ['DONE', 'Done', 'text-green-600']].map(([s, label, color]) => (
            <div key={s} className="card text-center py-4 cursor-pointer hover:shadow-md" onClick={() => setStatusFilter(statusFilter === s ? '' : s)}>
              <div className={`text-3xl font-black ${color}`}>{counts[s as keyof typeof counts]}</div>
              <div className="text-sm text-gray-500 mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-4">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
          <span className="self-center text-gray-500 text-sm">{filtered.length} requests</span>
        </div>

        {/* Request list */}
        <div className="space-y-3">
          {loading && <div className="text-center text-gray-500 py-8">Loading...</div>}
          {!loading && filtered.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              No SME requests yet. When site visitors ask questions the bot can't answer,
              they'll appear here.
            </div>
          )}
          {filtered.map(req => (
            <div key={req.id} className="card p-4 hover:shadow-md cursor-pointer" onClick={() => openRequest(req)}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold">{req.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[req.status] ?? 'bg-gray-100'}`}>{req.status}</span>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2 mb-1">{req.question}</p>
                  <div className="flex gap-4 text-xs text-gray-400">
                    {req.email && <span>✉ {req.email}</span>}
                    {req.phone && <span>📞 {req.phone}</span>}
                    {req.best_time && <span>🕐 {req.best_time}</span>}
                    <span>{new Date(req.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {req.status === 'PENDING' && (
                    <button onClick={e => { e.stopPropagation(); updateStatus(req.id, 'IN_PROGRESS'); }}
                      className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-lg font-medium">
                      Mark In Progress
                    </button>
                  )}
                  {req.status === 'IN_PROGRESS' && (
                    <button onClick={e => { e.stopPropagation(); updateStatus(req.id, 'DONE'); }}
                      className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded-lg font-medium">
                      Mark Done
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-start justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-8 max-w-xl w-full my-8 shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold">{selected.name}</h2>
                <div className="flex gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[selected.status]}`}>{selected.status}</span>
                  <span className="text-xs text-gray-400">{new Date(selected.created_at).toLocaleString()}</span>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex gap-4 text-sm">
                {selected.email && <span>✉ <a href={`mailto:${selected.email}`} className="text-blue-600 underline">{selected.email}</a></span>}
                {selected.phone && <span>📞 <a href={`tel:${selected.phone}`} className="text-blue-600 underline">{selected.phone}</a></span>}
                {selected.best_time && <span>🕐 {selected.best_time}</span>}
              </div>

              <div>
                <div className="text-xs font-bold uppercase text-gray-500 mb-1">Question</div>
                <div className="bg-gray-50 rounded-xl p-4 text-sm whitespace-pre-wrap">{selected.question}</div>
              </div>

              {selected.bot_answer && (
                <div>
                  <div className="text-xs font-bold uppercase text-gray-500 mb-1">Bot's Answer (before escalating)</div>
                  <div className="bg-blue-50 rounded-xl p-4 text-sm whitespace-pre-wrap text-blue-800">{selected.bot_answer}</div>
                </div>
              )}

              <div>
                <div className="text-xs font-bold uppercase text-gray-500 mb-1">Your Research Notes</div>
                <textarea className="w-full border rounded-xl px-3 py-2 text-sm" rows={4}
                  placeholder="Add notes about your research, follow-up actions, or response..."
                  value={adminNotes} onChange={e => setAdminNotes(e.target.value)} />
              </div>
            </div>

            <div className="flex gap-3">
              {selected.status !== 'DONE' && (
                <button onClick={() => updateStatus(selected.id, 'DONE', adminNotes)} disabled={saving}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl disabled:opacity-50">
                  {saving ? 'Saving...' : 'Mark as Done'}
                </button>
              )}
              {selected.status === 'PENDING' && (
                <button onClick={() => updateStatus(selected.id, 'IN_PROGRESS', adminNotes)} disabled={saving}
                  className="flex-1 btn-primary py-3 rounded-xl font-bold disabled:opacity-50">
                  {saving ? 'Saving...' : 'Mark In Progress'}
                </button>
              )}
              <button onClick={() => { saveAdminNotes(); }}
                className="px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl font-medium text-sm">
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );

  async function saveAdminNotes() {
    if (!selected) return;
    setSaving(true);
    await api.patch(`/api/ask/sme-requests/${selected.id}`, { admin_notes: adminNotes }).catch(() => {});
    setSaving(false);
  }
}

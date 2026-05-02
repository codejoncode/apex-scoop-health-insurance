'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import api from '@/lib/api';

interface RebuttalRow {
  id: number; title: string; content: string; nlp_notes?: string;
  objection_type_id?: string; objection_label?: string;
  is_custom: boolean; status: string; usage_count: string;
}
interface ObjectionType { id: string; label: string; }
interface StatRow {
  objection_type: string; rebuttal_title: string; rebuttal_id: number;
  times_used: string; resulted_in_sale: string; sale_rate: string;
}

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  draft: 'bg-yellow-100 text-yellow-700',
  deprecated: 'bg-gray-100 text-gray-500',
};

export default function AdminRebutalsPage() {
  const router = useRouter();
  const [rebuttals, setRebuttals] = useState<RebuttalRow[]>([]);
  const [objectionTypes, setObjectionTypes] = useState<ObjectionType[]>([]);
  const [stats, setStats] = useState<StatRow[]>([]);
  const [filter, setFilter] = useState('');
  const [editing, setEditing] = useState<RebuttalRow | null>(null);
  const [editData, setEditData] = useState({ title: '', content: '', nlp_notes: '', status: '', objection_type_id: '' });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'library' | 'stats'>('library');

  useEffect(() => {
    if (!localStorage.getItem('token')) { router.push('/admin/login'); return; }
    loadData();
  }, []);

  async function loadData() {
    const [rebRes, objRes, statRes] = await Promise.all([
      api.get('/api/objections/admin/all').catch(() => ({ data: [] })),
      api.get('/api/objections').catch(() => ({ data: [] })),
      api.get('/api/objections/stats').catch(() => ({ data: [] })),
    ]);
    setRebuttals(rebRes.data);
    setObjectionTypes(objRes.data);
    setStats(statRes.data);
  }

  function openEdit(r: RebuttalRow) {
    setEditing(r);
    setEditData({ title: r.title, content: r.content, nlp_notes: r.nlp_notes ?? '', status: r.status, objection_type_id: r.objection_type_id ?? '' });
  }

  async function saveEdit() {
    if (!editing) return;
    setSaving(true);
    try {
      await api.patch(`/api/objections/rebuttals/${editing.id}`, {
        title: editData.title,
        content: editData.content,
        nlp_notes: editData.nlp_notes || null,
        status: editData.status,
        objection_type_id: editData.objection_type_id || null,
      });
      setEditing(null);
      loadData();
    } catch { alert('Failed to save.'); }
    finally { setSaving(false); }
  }

  const filtered = filter
    ? rebuttals.filter(r => r.objection_label?.toLowerCase().includes(filter.toLowerCase()) || r.title.toLowerCase().includes(filter.toLowerCase()))
    : rebuttals;

  const drafts = rebuttals.filter(r => r.status === 'draft');

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Rebuttal Library</h1>
            <p className="text-gray-500 mt-1">Manage objection handling scripts and track effectiveness</p>
          </div>
          <a href="/admin/dashboard" className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 text-sm">← Dashboard</a>
        </div>

        {/* Draft alert */}
        {drafts.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <strong className="text-yellow-800">{drafts.length} draft rebuttal{drafts.length > 1 ? 's' : ''}</strong>
            <span className="text-yellow-700 ml-2">captured from live calls — review and categorize below.</span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b mb-6">
          {(['library', 'stats'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 font-medium capitalize ${activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
              {tab === 'library' ? 'Rebuttal Library' : 'Effectiveness Stats'}
            </button>
          ))}
        </div>

        {activeTab === 'library' && (
          <>
            {/* Filter */}
            <div className="mb-4 flex gap-3">
              <input className="border rounded-lg px-3 py-2 text-sm w-64" placeholder="Filter by objection or title..."
                value={filter} onChange={e => setFilter(e.target.value)} />
              <span className="text-gray-500 text-sm self-center">{filtered.length} rebuttals</span>
            </div>

            <div className="space-y-2">
              {filtered.map(r => (
                <div key={r.id} className={`card p-4 ${r.status === 'deprecated' ? 'opacity-50' : ''}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-800">{r.title}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[r.status] ?? 'bg-gray-100'}`}>{r.status}</span>
                        {r.is_custom && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Custom</span>}
                      </div>
                      {r.objection_label && <div className="text-xs text-gray-500 mb-1">Objection: {r.objection_label}</div>}
                      <p className="text-sm text-gray-600 line-clamp-2">{r.content}</p>
                      {r.nlp_notes && <p className="text-xs text-blue-600 italic mt-1">Coach: {r.nlp_notes}</p>}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-xs text-gray-400">Used {r.usage_count}×</div>
                      <button onClick={() => openEdit(r)} className="text-blue-600 hover:text-blue-700 text-xs underline">Edit</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'stats' && (
          <div className="card overflow-x-auto">
            {stats.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No call data yet. Rebuttals will show effectiveness once calls are logged.</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="border-b bg-gray-50"><tr>
                  <th className="text-left py-3 px-4">Objection</th>
                  <th className="text-left py-3 px-4">Rebuttal Used</th>
                  <th className="text-left py-3 px-4">Times Used</th>
                  <th className="text-left py-3 px-4">Sales</th>
                  <th className="text-left py-3 px-4">Sale Rate</th>
                </tr></thead>
                <tbody>
                  {stats.map((s, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-700">{s.objection_type ?? '—'}</td>
                      <td className="py-3 px-4 font-medium">{s.rebuttal_title}</td>
                      <td className="py-3 px-4">{s.times_used}</td>
                      <td className="py-3 px-4 text-green-700 font-bold">{s.resulted_in_sale}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 rounded-full bg-gray-200">
                            <div className="h-2 rounded-full bg-green-500" style={{ width: `${Math.min(Number(s.sale_rate ?? 0), 100)}%` }} />
                          </div>
                          <span>{s.sale_rate ?? 0}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Edit Rebuttal</h2>
              <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input className="w-full border rounded-lg px-3 py-2 text-sm" value={editData.title}
                  onChange={e => setEditData(d => ({ ...d, title: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Script / Content</label>
                <textarea className="w-full border rounded-lg px-3 py-2 text-sm" rows={6} value={editData.content}
                  onChange={e => setEditData(d => ({ ...d, content: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Coaching Notes (NLP / Why it works)</label>
                <textarea className="w-full border rounded-lg px-3 py-2 text-sm" rows={2} value={editData.nlp_notes}
                  onChange={e => setEditData(d => ({ ...d, nlp_notes: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Objection Category</label>
                  <select className="w-full border rounded-lg px-3 py-2 text-sm" value={editData.objection_type_id}
                    onChange={e => setEditData(d => ({ ...d, objection_type_id: e.target.value }))}>
                    <option value="">Uncategorized</option>
                    {objectionTypes.map((o: ObjectionType) => <option key={o.id} value={o.id}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select className="w-full border rounded-lg px-3 py-2 text-sm" value={editData.status}
                    onChange={e => setEditData(d => ({ ...d, status: e.target.value }))}>
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="deprecated">Deprecated</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={saveEdit} disabled={saving} className="flex-1 btn-primary py-3 rounded-xl font-bold disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button onClick={() => setEditing(null)} className="flex-1 bg-gray-200 hover:bg-gray-300 py-3 rounded-xl font-bold">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

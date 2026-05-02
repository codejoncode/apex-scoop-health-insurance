'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import api from '@/lib/api';

interface CallRow {
  id: string; started_at: string; ended_at?: string; script_type_name: string;
  outcome?: string; max_section_reached?: number; rebuttal_count: number; notes?: string;
}
interface CallDetail {
  call: CallRow;
  steps: Array<{ section_title: string; section_number: number; completed_at: string }>;
  rebuttals_used: Array<{ objection_label: string; rebuttal_title: string; section_title?: string; created_at: string }>;
}
interface Stats {
  total_calls: string; sales: string; presentations: string;
  calls_this_week: string; sales_this_week: string; presentations_this_week: string;
  by_script: Array<{ script_type: string; total: string; sold: string; presentation_accepted: string; close_rate: string }>;
}

const OUTCOME_COLORS: Record<string, string> = {
  INSURANCE_SOLD: 'bg-green-100 text-green-800',
  PRESENTATION_ACCEPTED: 'bg-blue-100 text-blue-800',
  INSURANCE_OFFER_REJECTED: 'bg-orange-100 text-orange-800',
  PRESENTATION_REJECTED: 'bg-yellow-100 text-yellow-800',
  NOT_QUALIFIED: 'bg-purple-100 text-purple-800',
  VOICEMAIL: 'bg-gray-100 text-gray-600',
  HANGUP: 'bg-red-100 text-red-700',
};
const OUTCOME_LABELS: Record<string, string> = {
  INSURANCE_SOLD: 'Sold', PRESENTATION_ACCEPTED: 'Presentation', INSURANCE_OFFER_REJECTED: 'Offer Rejected',
  PRESENTATION_REJECTED: 'Presentation Rejected', NOT_QUALIFIED: 'Not Qualified', VOICEMAIL: 'Voicemail', HANGUP: 'Hung Up',
};

export default function AdminCallsPage() {
  const router = useRouter();
  const [calls, setCalls] = useState<CallRow[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [selected, setSelected] = useState<CallDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [outcomeFilter, setOutcomeFilter] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('token')) { router.push('/admin/login'); return; }
    loadData();
  }, [outcomeFilter]);

  async function loadData() {
    setLoading(true);
    try {
      const params = outcomeFilter ? `?outcome=${outcomeFilter}` : '';
      const [callsRes, statsRes] = await Promise.all([
        api.get(`/api/calls${params}`),
        api.get('/api/calls/stats'),
      ]);
      setCalls(callsRes.data);
      setStats(statsRes.data);
    } catch { router.push('/admin/login'); }
    finally { setLoading(false); }
  }

  async function openDetail(callId: string) {
    const r = await api.get(`/api/calls/${callId}`).catch(() => null);
    if (r) setSelected(r.data);
  }

  const statCards = stats ? [
    { label: 'Total Calls', value: stats.total_calls, color: 'text-blue-600' },
    { label: 'Presentations', value: stats.presentations, color: 'text-blue-600' },
    { label: 'Sales Total', value: stats.sales, color: 'text-green-600' },
    { label: 'Calls This Week', value: stats.calls_this_week, color: 'text-blue-600' },
    { label: 'Sales This Week', value: stats.sales_this_week, color: 'text-green-600' },
  ] : [];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Call History</h1>
            <p className="text-gray-500 mt-1">Track every call, script progress, and outcome</p>
          </div>
          <div className="flex gap-3">
            <a href="/admin/dashboard" className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 text-sm">Dashboard</a>
            <a href="/calls/new" className="btn-primary px-4 py-2 rounded-lg text-sm font-bold">+ Start Call</a>
          </div>
        </div>

        {/* Stats row */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {statCards.map((s, i) => (
              <div key={i} className="card text-center py-4">
                <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
                <div className="text-xs text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Script health table */}
        {stats?.by_script && stats.by_script.length > 0 && (
          <div className="card p-4 mb-6 overflow-x-auto">
            <h3 className="font-bold text-sm uppercase text-gray-600 mb-3">Script Performance (Last 30 Days)</h3>
            <table className="w-full text-sm">
              <thead><tr className="text-left text-gray-500 border-b">
                <th className="pb-2">Script Type</th><th className="pb-2">Calls</th>
                <th className="pb-2">Presentations</th><th className="pb-2">Sales</th><th className="pb-2">Close Rate</th>
              </tr></thead>
              <tbody>
                {stats.by_script.map((s, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="py-2 font-medium">{s.script_type}</td>
                    <td className="py-2">{s.total}</td>
                    <td className="py-2">{s.presentation_accepted}</td>
                    <td className="py-2 text-green-700 font-bold">{s.sold}</td>
                    <td className="py-2">{s.close_rate ?? '0'}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-3 mb-4">
          <select value={outcomeFilter} onChange={e => setOutcomeFilter(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
            <option value="">All Outcomes</option>
            {Object.entries(OUTCOME_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>

        {/* Calls table */}
        <div className="card overflow-x-auto">
          {loading ? <div className="p-8 text-center text-gray-500">Loading...</div> : (
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50"><tr>
                <th className="text-left py-3 px-4">Date / Time</th>
                <th className="text-left py-3 px-4">Script Type</th>
                <th className="text-left py-3 px-4">Outcome</th>
                <th className="text-left py-3 px-4">Furthest Section</th>
                <th className="text-left py-3 px-4">Rebuttals Used</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr></thead>
              <tbody>
                {calls.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-12 text-gray-500">
                    No calls logged yet. <a href="/calls/new" className="text-blue-600 underline">Start your first call →</a>
                  </td></tr>
                )}
                {calls.map(call => (
                  <tr key={call.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>{new Date(call.started_at).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-400">{new Date(call.started_at).toLocaleTimeString()}</div>
                    </td>
                    <td className="py-3 px-4">{call.script_type_name ?? '—'}</td>
                    <td className="py-3 px-4">
                      {call.outcome ? (
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${OUTCOME_COLORS[call.outcome] ?? 'bg-gray-100'}`}>
                          {OUTCOME_LABELS[call.outcome] ?? call.outcome}
                        </span>
                      ) : <span className="text-gray-400 text-xs">In progress</span>}
                    </td>
                    <td className="py-3 px-4">{call.max_section_reached ?? '—'}</td>
                    <td className="py-3 px-4">{call.rebuttal_count}</td>
                    <td className="py-3 px-4">
                      <button onClick={() => openDetail(call.id)} className="text-blue-600 hover:text-blue-700 text-xs underline">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-start justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full my-8 shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold">Call Detail</h2>
                <p className="text-gray-500 text-sm">{selected.call.script_type_name} — {new Date(selected.call.started_at).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>

            {selected.call.outcome && (
              <div className={`inline-flex px-3 py-1 rounded-full text-sm font-bold mb-4 ${OUTCOME_COLORS[selected.call.outcome] ?? 'bg-gray-100'}`}>
                {OUTCOME_LABELS[selected.call.outcome] ?? selected.call.outcome}
              </div>
            )}

            {/* Script progression */}
            {selected.steps.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold text-sm uppercase text-gray-600 mb-3">Script Progression</h3>
                <div className="flex gap-2 flex-wrap">
                  {selected.steps.map((s, i) => (
                    <div key={i} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      {s.section_number}. {s.section_title}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rebuttals used */}
            {selected.rebuttals_used.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold text-sm uppercase text-gray-600 mb-3">Objections & Rebuttals Used</h3>
                {selected.rebuttals_used.map((r, i) => (
                  <div key={i} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-2 text-sm">
                    <span className="font-bold text-yellow-800">{r.objection_label ?? 'Objection'}</span>
                    {r.section_title && <span className="text-gray-500"> — at {r.section_title}</span>}
                    <div className="text-gray-600 mt-1">→ {r.rebuttal_title}</div>
                  </div>
                ))}
              </div>
            )}

            {selected.call.notes && (
              <div className="bg-gray-50 rounded-lg p-4 text-sm">
                <strong>Notes:</strong> {selected.call.notes}
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}

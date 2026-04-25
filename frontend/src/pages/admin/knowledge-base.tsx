import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { kbAPI } from '@/lib/api';

interface KBEntry {
  id: number;
  keywords: string[];
  answer: string;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

const emptyForm = { keywords: '', answer: '', active: true, sort_order: 0 };

export default function KnowledgeBasePage() {
  const router = useRouter();
  const [entries, setEntries] = useState<KBEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/admin/login'); return; }
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const res = await kbAPI.getAll();
      setEntries(res.data);
    } catch {
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
    setShowModal(true);
  };

  const openEdit = (entry: KBEntry) => {
    setEditingId(entry.id);
    setForm({
      keywords: entry.keywords.join(', '),
      answer: entry.answer,
      active: entry.active,
      sort_order: entry.sort_order,
    });
    setError('');
    setShowModal(true);
  };

  const handleSave = async () => {
    const keywordsArr = form.keywords.split(',').map((k) => k.trim().toLowerCase()).filter(Boolean);
    if (!keywordsArr.length || !form.answer.trim()) {
      setError('Keywords and answer are both required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (editingId !== null) {
        await kbAPI.update(editingId, { keywords: keywordsArr, answer: form.answer.trim(), active: form.active, sort_order: form.sort_order });
      } else {
        await kbAPI.create({ keywords: keywordsArr, answer: form.answer.trim(), active: form.active, sort_order: form.sort_order });
      }
      setShowModal(false);
      fetchEntries();
      flash(editingId !== null ? 'Entry updated.' : 'Entry created.');
    } catch {
      setError('Save failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (entry: KBEntry) => {
    try {
      await kbAPI.update(entry.id, { active: !entry.active });
      fetchEntries();
    } catch {
      flash('Failed to update.', true);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this entry? The chatbot will no longer use it.')) return;
    try {
      await kbAPI.delete(id);
      fetchEntries();
      flash('Entry deleted.');
    } catch {
      flash('Delete failed.', true);
    }
  };

  const handleSeed = async () => {
    const hasEntries = entries.length > 0;
    const msg = hasEntries
      ? 'This will REPLACE all current entries with the 20 default AIL Q&A pairs. Continue?'
      : 'Load the 20 default AIL Q&A pairs into the knowledge base?';
    if (!confirm(msg)) return;
    try {
      await kbAPI.seed(hasEntries);
      fetchEntries();
      flash('Default entries loaded.');
    } catch {
      flash('Seed failed.', true);
    }
  };

  const flash = (msg: string, isError = false) => {
    if (isError) {
      setError(msg);
      setTimeout(() => setError(''), 4000);
    } else {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 py-16 text-center"><p>Loading...</p></div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold">Knowledge Base</h1>
            <p className="text-gray-500 mt-1">Manage what the chatbot knows. {entries.length} entries.</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <a href="/admin/dashboard" className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              ← Dashboard
            </a>
            <button
              onClick={handleSeed}
              className="px-4 py-2 border border-yellow-400 text-yellow-700 rounded-lg text-sm hover:bg-yellow-50"
            >
              {entries.length === 0 ? 'Load Default Q&A' : 'Reset to Defaults'}
            </button>
            <button
              onClick={openCreate}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
            >
              + Add Entry
            </button>
          </div>
        </div>

        {/* Flash messages */}
        {successMsg && (
          <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg">{successMsg}</div>
        )}
        {error && !showModal && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>
        )}

        {/* Empty state */}
        {entries.length === 0 && (
          <div className="card text-center py-16">
            <p className="text-gray-500 mb-4">No entries yet.</p>
            <p className="text-gray-400 text-sm mb-6">Click <strong>Load Default Q&A</strong> to add 20 pre-written AIL insurance answers, or create your own with <strong>+ Add Entry</strong>.</p>
            <button onClick={handleSeed} className="btn-primary">Load Default Q&A</button>
          </div>
        )}

        {/* Entries table */}
        {entries.length > 0 && (
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-3 px-4 w-8">#</th>
                  <th className="text-left py-3 px-4">Keywords (triggers)</th>
                  <th className="text-left py-3 px-4">Answer preview</th>
                  <th className="text-left py-3 px-4 w-24">Status</th>
                  <th className="text-left py-3 px-4 w-32">Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id} className={`border-b hover:bg-gray-50 ${!entry.active ? 'opacity-50' : ''}`}>
                    <td className="py-3 px-4 text-gray-400">{entry.sort_order}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {entry.keywords.slice(0, 5).map((kw) => (
                          <span key={kw} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs border border-blue-100">{kw}</span>
                        ))}
                        {entry.keywords.length > 5 && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">+{entry.keywords.length - 5} more</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 max-w-sm">
                      <span className="line-clamp-2">{entry.answer.slice(0, 120)}{entry.answer.length > 120 ? '…' : ''}</span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleActive(entry)}
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${entry.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                      >
                        {entry.active ? 'Active' : 'Off'}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <button onClick={() => openEdit(entry)} className="text-blue-600 hover:underline mr-3">Edit</button>
                      <button onClick={() => handleDelete(entry.id)} className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 max-w-lg w-full shadow-xl">
            <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit Entry' : 'Add Entry'}</h2>

            {error && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
            )}

            <div className="mb-4">
              <label className="block font-semibold mb-1 text-sm">Keywords <span className="font-normal text-gray-400">(comma-separated — these trigger this answer)</span></label>
              <input
                type="text"
                value={form.keywords}
                onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                placeholder="e.g. term life, temporary coverage, term policy"
                className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-1 text-sm">Answer</label>
              <textarea
                value={form.answer}
                onChange={(e) => setForm({ ...form, answer: e.target.value })}
                rows={5}
                placeholder="What the chatbot will say when a visitor's message matches one of the keywords above..."
                className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div className="flex gap-6 mb-6">
              <div className="flex-1">
                <label className="block font-semibold mb-1 text-sm">Sort Order</label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border rounded-lg text-sm"
                  min={0}
                />
                <p className="text-xs text-gray-400 mt-1">Lower = checked first</p>
              </div>
              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="active-toggle"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="active-toggle" className="font-semibold text-sm">Active</label>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

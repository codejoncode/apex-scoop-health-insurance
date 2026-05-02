'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import api from '@/lib/api';

interface ScriptType { id: number; name: string; description: string; }
interface ScriptSection { id: number; section_number: number; title: string; content: string; }
interface ObjectionType { id: string; label: string; rebuttals: Rebuttal[]; }
interface Rebuttal { id: number; title: string; script: string; nlp_notes?: string; }

const OUTCOMES = [
  { value: 'VOICEMAIL',              label: 'Voicemail',              color: 'bg-gray-100 text-gray-800' },
  { value: 'HANGUP',                 label: 'Hung Up',                color: 'bg-red-100 text-red-800' },
  { value: 'PRESENTATION_ACCEPTED',  label: 'Presentation Accepted',  color: 'bg-blue-100 text-blue-800' },
  { value: 'INSURANCE_SOLD',         label: 'Insurance Sold',         color: 'bg-green-100 text-green-800' },
  { value: 'INSURANCE_OFFER_REJECTED','label': 'Offer Rejected',      color: 'bg-orange-100 text-orange-800' },
  { value: 'PRESENTATION_REJECTED',  label: 'Presentation Rejected',  color: 'bg-yellow-100 text-yellow-800' },
  { value: 'NOT_QUALIFIED',          label: 'Not Qualified',          color: 'bg-purple-100 text-purple-800' },
];

export default function NewCallPage() {
  const router = useRouter();
  const [scriptTypes, setScriptTypes] = useState<ScriptType[]>([]);
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [sections, setSections] = useState<ScriptSection[]>([]);
  const [objections, setObjections] = useState<ObjectionType[]>([]);
  const [callId, setCallId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [showRebuttals, setShowRebuttals] = useState(false);
  const [selectedObjection, setSelectedObjection] = useState<string | null>(null);
  const [expandedRebuttal, setExpandedRebuttal] = useState<number | null>(null);
  const [showEndModal, setShowEndModal] = useState(false);
  const [outcomeValue, setOutcomeValue] = useState('');
  const [outcomeNotes, setOutcomeNotes] = useState('');
  const [showCustomRebuttal, setShowCustomRebuttal] = useState(false);
  const [customObjectionPhrase, setCustomObjectionPhrase] = useState('');
  const [customResponse, setCustomResponse] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/admin/login'); return; }
    api.get('/api/data/script-types').then(r => setScriptTypes(r.data)).catch(() => {});
    api.get('/api/objections').then(r => setObjections(r.data)).catch(() => {});
  }, []);

  async function startCall() {
    if (!selectedType) return;
    setSaving(true);
    try {
      const [callRes, sectionsRes] = await Promise.all([
        api.post('/api/calls', { scriptTypeId: selectedType }),
        api.get(`/api/data/script-sections/${selectedType}`),
      ]);
      setCallId(callRes.data.id);
      setSections(sectionsRes.data);
      setCurrentIndex(0);
      setStarted(true);
    } catch { alert('Failed to start call. Make sure you are logged in.'); }
    finally { setSaving(false); }
  }

  async function logStep(sectionId: number) {
    if (!callId) return;
    await api.post(`/api/calls/${callId}/steps`, { scriptSectionId: sectionId }).catch(() => {});
  }

  async function nextSection() {
    const section = sections[currentIndex];
    if (section) await logStep(section.id);
    if (currentIndex < sections.length - 1) {
      setCurrentIndex(i => i + 1);
    } else {
      setShowEndModal(true);
    }
  }

  async function useRebuttal(rebuttal: Rebuttal, objectionId: string) {
    setExpandedRebuttal(rebuttal.id);
    if (!callId) return;
    await api.post(`/api/calls/${callId}/rebuttals`, {
      rebuttalId: rebuttal.id,
      objectionTypeId: objectionId,
      scriptSectionId: sections[currentIndex]?.id ?? null,
    }).catch(() => {});
  }

  async function endCall() {
    if (!outcomeValue || !callId) return;
    setSaving(true);
    try {
      await api.post(`/api/calls/${callId}/end`, { outcome: outcomeValue, notes: outcomeNotes });
      router.push('/admin/calls');
    } catch { alert('Failed to save call outcome.'); }
    finally { setSaving(false); }
  }

  async function submitCustomRebuttal() {
    if (!customObjectionPhrase.trim() || !customResponse.trim() || !callId) return;
    await api.post(`/api/calls/${callId}/rebuttals/custom`, {
      objectionPhrase: customObjectionPhrase,
      yourResponse: customResponse,
      scriptSectionId: sections[currentIndex]?.id ?? null,
    }).catch(() => {});
    setCustomObjectionPhrase('');
    setCustomResponse('');
    setShowCustomRebuttal(false);
  }

  const currentSection = sections[currentIndex];
  const selectedObjectionData = objections.find(o => o.id === selectedObjection);

  if (!started) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="flex items-center gap-3 mb-8">
            <a href="/admin/dashboard" className="text-gray-500 hover:text-gray-700">← Dashboard</a>
          </div>
          <h1 className="text-4xl font-bold mb-2">Start a Call</h1>
          <p className="text-gray-600 mb-8">Select your script type to begin the call session tracker.</p>

          <div className="card p-8">
            <label className="block text-lg font-bold mb-4">Choose Script Type</label>
            <div className="grid grid-cols-1 gap-3 mb-8">
              {scriptTypes.map(st => (
                <button key={st.id} onClick={() => setSelectedType(st.id)}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${selectedType === st.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                  <div className="font-bold text-lg">{st.name}</div>
                  {st.description && <div className="text-gray-500 text-sm mt-1">{st.description}</div>}
                </button>
              ))}
            </div>
            <button onClick={startCall} disabled={!selectedType || saving}
              className="w-full btn-primary text-xl py-4 rounded-xl disabled:opacity-50">
              {saving ? 'Starting...' : 'Start Call Session'}
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex h-screen flex-col" style={{ height: 'calc(100vh - 64px)' }}>
        {/* Header */}
        <div className="bg-blue-700 text-white px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-bold text-lg">{scriptTypes.find(t => t.id === selectedType)?.name}</span>
            <span className="bg-blue-600 px-3 py-1 rounded-full text-sm">
              Step {currentIndex + 1} / {sections.length}
            </span>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowRebuttals(s => !s)}
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-4 py-2 rounded-lg text-sm">
              {showRebuttals ? 'Hide' : 'Show'} Rebuttals
            </button>
            <button onClick={() => setShowEndModal(true)}
              className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2 rounded-lg text-sm">
              End Call
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Script pane */}
          <div className={`flex flex-col transition-all duration-300 overflow-y-auto ${showRebuttals ? 'w-1/2' : 'w-full'}`}>
            {/* Progress dots */}
            <div className="flex gap-2 px-6 py-4 border-b bg-gray-50">
              {sections.map((s, i) => (
                <div key={s.id} className={`flex-1 h-2 rounded-full transition-all ${i < currentIndex ? 'bg-green-500' : i === currentIndex ? 'bg-blue-500' : 'bg-gray-200'}`} />
              ))}
            </div>

            <div className="flex-1 px-8 py-6">
              {currentSection && (
                <>
                  <div className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-3">
                    {currentSection.title}
                  </div>
                  <div className="text-lg leading-relaxed whitespace-pre-wrap text-gray-800 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    {currentSection.content}
                  </div>
                </>
              )}
            </div>

            <div className="px-8 pb-8">
              <button onClick={nextSection}
                className="w-full btn-primary text-xl py-5 rounded-xl shadow-lg">
                {currentIndex < sections.length - 1 ? `Next → ${sections[currentIndex + 1]?.title ?? ''}` : 'End of Script — Set Outcome'}
              </button>
            </div>
          </div>

          {/* Rebuttal pane */}
          {showRebuttals && (
            <div className="w-1/2 border-l flex flex-col bg-yellow-50 overflow-hidden">
              <div className="px-4 py-3 bg-yellow-100 border-b font-bold text-yellow-800">
                Objection Handling
              </div>

              {/* Objection category tabs */}
              <div className="flex flex-wrap gap-1 px-3 py-2 bg-white border-b">
                {objections.map(o => (
                  <button key={o.id} onClick={() => { setSelectedObjection(o.id); setExpandedRebuttal(null); }}
                    className={`text-xs px-3 py-1 rounded-full font-medium transition-all ${selectedObjection === o.id ? 'bg-yellow-500 text-white' : 'bg-gray-100 hover:bg-yellow-100 text-gray-700'}`}>
                    {o.label}
                  </button>
                ))}
              </div>

              {/* Rebuttals */}
              <div className="flex-1 overflow-y-auto px-3 py-3">
                {selectedObjectionData ? (
                  selectedObjectionData.rebuttals.length ? selectedObjectionData.rebuttals.map(r => (
                    <div key={r.id} className="mb-3 rounded-xl border border-yellow-200 bg-white shadow-sm overflow-hidden">
                      <button onClick={() => useRebuttal(r, selectedObjectionData.id)}
                        className="w-full text-left px-4 py-3 font-semibold text-gray-800 hover:bg-yellow-50 flex items-center justify-between">
                        <span>{r.title}</span>
                        <span className="text-yellow-500 text-lg">{expandedRebuttal === r.id ? '▲' : '▼'}</span>
                      </button>
                      {expandedRebuttal === r.id && (
                        <div className="px-4 pb-4 border-t">
                          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mt-3">{r.script}</p>
                          {r.nlp_notes && (
                            <p className="text-xs text-blue-600 mt-3 italic border-t pt-2">
                              Coach: {r.nlp_notes}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )) : <p className="text-gray-500 text-sm text-center mt-8">No rebuttals for this objection yet.</p>
                ) : (
                  <p className="text-gray-500 text-sm text-center mt-8">Select an objection category above.</p>
                )}

                <button onClick={() => setShowCustomRebuttal(s => !s)}
                  className="w-full mt-4 py-2 border-2 border-dashed border-yellow-400 rounded-xl text-yellow-700 text-sm font-medium hover:bg-yellow-50">
                  + Capture new objection from this call
                </button>
                {showCustomRebuttal && (
                  <div className="mt-3 p-4 bg-white rounded-xl border border-gray-200">
                    <input className="w-full border rounded-lg px-3 py-2 text-sm mb-2" placeholder="Objection phrase they used..."
                      value={customObjectionPhrase} onChange={e => setCustomObjectionPhrase(e.target.value)} />
                    <textarea className="w-full border rounded-lg px-3 py-2 text-sm mb-2" rows={3}
                      placeholder="What you said in response..."
                      value={customResponse} onChange={e => setCustomResponse(e.target.value)} />
                    <button onClick={submitCustomRebuttal}
                      className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 rounded-lg text-sm">
                      Save to Draft Rebuttals
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* End Call Modal */}
      {showEndModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">End Call — Select Outcome</h2>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {OUTCOMES.map(o => (
                <button key={o.value} onClick={() => setOutcomeValue(o.value)}
                  className={`p-3 rounded-xl border-2 text-sm font-bold transition-all ${outcomeValue === o.value ? 'border-blue-500 shadow-md ' + o.color : 'border-gray-200 hover:border-gray-400 ' + o.color}`}>
                  {o.label}
                </button>
              ))}
            </div>
            <textarea className="w-full border rounded-xl px-4 py-3 mb-6 text-sm" rows={3}
              placeholder="Optional notes about this call..."
              value={outcomeNotes} onChange={e => setOutcomeNotes(e.target.value)} />
            <div className="flex gap-3">
              <button onClick={endCall} disabled={!outcomeValue || saving}
                className="flex-1 btn-primary py-3 rounded-xl font-bold disabled:opacity-50">
                {saving ? 'Saving...' : 'Save & Finish'}
              </button>
              <button onClick={() => setShowEndModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

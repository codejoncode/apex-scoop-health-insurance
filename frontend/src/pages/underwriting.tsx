'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import api from '@/lib/api';

interface SearchResult { id: number; name: string; category: string; notes: string; qualifications?: string; is_senior_only: boolean; }
interface BuildResult { tRating: string; ratingColor: string; summary: string; isSenior: boolean; }
interface Assessment { overallStatus: string; statusLabel: string; statusColor: string; flags: string[]; recommendations: string[]; }

const CATEGORY_COLORS: Record<string, string> = {
  AUTO_DECLINE: 'bg-red-100 text-red-800 border-red-200',
  AUTO_TRIAL: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  SPECIAL: 'bg-orange-100 text-orange-800 border-orange-200',
  INFO_ONLY: 'bg-gray-100 text-gray-700 border-gray-200',
  SENIOR_TRIAL: 'bg-purple-100 text-purple-800 border-purple-200',
  BLOOD_THINNER: 'bg-blue-100 text-blue-800 border-blue-200',
  ORGAN_REJECTION: 'bg-red-100 text-red-800 border-red-200',
};

const CATEGORY_LABELS: Record<string, string> = {
  AUTO_DECLINE: 'Auto Decline', AUTO_TRIAL: 'Auto Trial', SPECIAL: 'Special',
  INFO_ONLY: 'Info Only', SENIOR_TRIAL: 'Senior Trial', BLOOD_THINNER: 'Blood Thinner', ORGAN_REJECTION: 'Organ Rejection',
};

const BUILD_COLORS: Record<string, string> = {
  green: 'bg-green-100 border-green-300 text-green-800',
  yellow: 'bg-yellow-100 border-yellow-300 text-yellow-800',
  orange: 'bg-orange-100 border-orange-300 text-orange-800',
  red: 'bg-red-100 border-red-300 text-red-800',
};

export default function UnderwritingPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/admin/login'); }
  }, [router]);

  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [heightFeet, setHeightFeet] = useState('');
  const [heightInches, setHeightInches] = useState('0');
  const [weight, setWeight] = useState('');
  const [buildResult, setBuildResult] = useState<BuildResult | null>(null);

  const [conditionQuery, setConditionQuery] = useState('');
  const [conditionResults, setConditionResults] = useState<SearchResult[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<SearchResult[]>([]);

  const [medQuery, setMedQuery] = useState('');
  const [medResults, setMedResults] = useState<SearchResult[]>([]);
  const [selectedMeds, setSelectedMeds] = useState<SearchResult[]>([]);

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [calculating, setCalculating] = useState(false);

  async function calculateBuild() {
    if (!heightFeet || !weight) return;
    setCalculating(true);
    try {
      const r = await api.post('/api/underwriting/build', { heightFeet: Number(heightFeet), heightInches: Number(heightInches), weight: Number(weight), age: Number(age) });
      setBuildResult(r.data);
    } catch {}
    finally { setCalculating(false); }
  }

  async function searchConditions(q: string) {
    setConditionQuery(q);
    if (q.length < 2) { setConditionResults([]); return; }
    const r = await api.get(`/api/underwriting/conditions?q=${encodeURIComponent(q)}`).catch(() => null);
    if (r) setConditionResults(r.data);
  }

  async function searchMeds(q: string) {
    setMedQuery(q);
    if (q.length < 2) { setMedResults([]); return; }
    const r = await api.get(`/api/underwriting/medications?q=${encodeURIComponent(q)}`).catch(() => null);
    if (r) setMedResults(r.data);
  }

  function addCondition(c: SearchResult) {
    if (!selectedConditions.find(x => x.id === c.id)) setSelectedConditions(s => [...s, c]);
    setConditionQuery(''); setConditionResults([]);
  }

  function addMed(m: SearchResult) {
    if (!selectedMeds.find(x => x.id === m.id)) setSelectedMeds(s => [...s, m]);
    setMedQuery(''); setMedResults([]);
  }

  async function runAssessment() {
    if (!buildResult) return;
    const r = await api.post('/api/underwriting/assess', {
      tRating: buildResult.tRating,
      conditionIds: selectedConditions.map(c => c.id),
      medicationIds: selectedMeds.map(m => m.id),
      age: Number(age),
    }).catch(() => null);
    if (r) setAssessment(r.data);
  }

  function reset() {
    setAge(''); setSex(''); setHeightFeet(''); setHeightInches('0'); setWeight('');
    setBuildResult(null); setSelectedConditions([]); setSelectedMeds([]); setAssessment(null);
    setConditionQuery(''); setMedQuery('');
  }

  const statusColorMap: Record<string, string> = {
    green: 'bg-green-50 border-green-300', yellow: 'bg-yellow-50 border-yellow-300', red: 'bg-red-50 border-red-300',
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Underwriting Assistant</h1>
            <p className="text-gray-500 mt-1">Field qualification tool — based on AIL underwriting guidelines</p>
          </div>
          <div className="flex gap-3">
            <a href="/admin/dashboard" className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 text-sm">← Dashboard</a>
            <button onClick={reset} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium">Reset</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: Demographics */}
          <div className="lg:col-span-1">
            <div className="card p-6">
              <h2 className="text-lg font-bold mb-4">Demographics & Build</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input type="number" value={age} onChange={e => setAge(e.target.value)} min={18} max={90}
                    className="w-full border rounded-lg px-3 py-2" placeholder="e.g. 65" />
                  {Number(age) >= 60 && <p className="text-xs text-purple-600 mt-1">Senior guidelines apply (age 60+)</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sex</label>
                  <select value={sex} onChange={e => setSex(e.target.value)} className="w-full border rounded-lg px-3 py-2">
                    <option value="">Select...</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <input type="number" value={heightFeet} onChange={e => setHeightFeet(e.target.value)} min={4} max={7}
                        className="w-full border rounded-lg px-3 py-2" placeholder="Feet" />
                    </div>
                    <div className="flex-1">
                      <select value={heightInches} onChange={e => setHeightInches(e.target.value)} className="w-full border rounded-lg px-3 py-2">
                        {[0,1,2,3,4,5,6,7,8,9,10,11].map(i => <option key={i} value={i}>{i}"</option>)}
                      </select>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (lbs)</label>
                  <input type="number" value={weight} onChange={e => setWeight(e.target.value)} min={80} max={600}
                    className="w-full border rounded-lg px-3 py-2" placeholder="e.g. 210" />
                </div>
                <button onClick={calculateBuild} disabled={!heightFeet || !weight || calculating}
                  className="w-full btn-primary py-3 rounded-xl font-bold disabled:opacity-50">
                  {calculating ? 'Calculating...' : 'Calculate Build Rating'}
                </button>
              </div>

              {buildResult && (
                <div className={`mt-4 p-4 rounded-xl border-2 ${BUILD_COLORS[buildResult.ratingColor] ?? 'bg-gray-50 border-gray-300'}`}>
                  <div className="text-2xl font-black mb-1">Build: {buildResult.tRating}</div>
                  <p className="text-sm">{buildResult.summary}</p>
                  {buildResult.isSenior && <p className="text-xs font-bold mt-2">Senior guidelines apply</p>}
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Conditions & Meds */}
          <div className="lg:col-span-1">
            <div className="card p-6 mb-6">
              <h2 className="text-lg font-bold mb-4">Conditions / Diagnoses</h2>
              <div className="relative">
                <input value={conditionQuery} onChange={e => searchConditions(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Type to search: diabetes, COPD, lupus..." />
                {conditionResults.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
                    {conditionResults.map(c => (
                      <button key={c.id} onClick={() => addCondition(c)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm border-b last:border-0">
                        <span className="font-medium">{c.name}</span>
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[c.category] ?? ''}`}>
                          {CATEGORY_LABELS[c.category] ?? c.category}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedConditions.map(c => (
                  <div key={c.id} className={`flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium ${CATEGORY_COLORS[c.category] ?? 'bg-gray-100'}`}>
                    {c.name}
                    <button onClick={() => setSelectedConditions(s => s.filter(x => x.id !== c.id))} className="ml-1 font-bold hover:opacity-70">×</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-lg font-bold mb-4">Medications</h2>
              <div className="relative">
                <input value={medQuery} onChange={e => searchMeds(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Type to search: insulin, Eliquis, Aricept..." />
                {medResults.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
                    {medResults.map(m => (
                      <button key={m.id} onClick={() => addMed(m)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm border-b last:border-0">
                        <span className="font-medium">{m.name}</span>
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[m.category] ?? ''}`}>
                          {CATEGORY_LABELS[m.category] ?? m.category}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedMeds.map(m => (
                  <div key={m.id} className={`flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium ${CATEGORY_COLORS[m.category] ?? 'bg-gray-100'}`}>
                    {m.name}
                    <button onClick={() => setSelectedMeds(s => s.filter(x => x.id !== m.id))} className="ml-1 font-bold hover:opacity-70">×</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 3: Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6">
              <h2 className="text-lg font-bold mb-4">Assessment Summary</h2>
              {!buildResult ? (
                <p className="text-gray-500 text-sm">Calculate the build rating first to run a full assessment.</p>
              ) : (
                <>
                  <button onClick={runAssessment}
                    className="w-full btn-primary py-3 rounded-xl font-bold mb-4">
                    Run Full Assessment
                  </button>
                  {assessment && (
                    <div className={`p-4 rounded-xl border-2 ${statusColorMap[assessment.statusColor] ?? 'bg-gray-50 border-gray-300'}`}>
                      <div className="text-xl font-black mb-3">{assessment.statusLabel}</div>
                      {assessment.flags.length > 0 && (
                        <div className="mb-4">
                          <div className="text-xs font-bold uppercase text-gray-600 mb-2">Flags:</div>
                          {assessment.flags.map((f, i) => (
                            <div key={i} className="text-sm mb-1 flex items-start gap-2">
                              <span className="text-red-500 font-bold mt-0.5">!</span> {f}
                            </div>
                          ))}
                        </div>
                      )}
                      {assessment.recommendations.length > 0 && (
                        <div>
                          <div className="text-xs font-bold uppercase text-gray-600 mb-2">Products to Consider:</div>
                          {assessment.recommendations.map((r, i) => (
                            <div key={i} className="text-sm mb-1 flex items-start gap-2">
                              <span className="text-green-600 font-bold mt-0.5">✓</span> {r}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Selected items detail */}
            {(selectedConditions.length > 0 || selectedMeds.length > 0) && (
              <div className="card p-6 mt-4">
                <h3 className="font-bold mb-3 text-sm uppercase text-gray-600">Underwriting Notes</h3>
                {[...selectedConditions, ...selectedMeds].map(item => (
                  <div key={item.id} className="mb-3 pb-3 border-b last:border-0">
                    <div className="font-medium text-sm">{item.name}</div>
                    <div className="text-xs text-gray-600 mt-1">{item.notes}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center mt-8">
          This tool reflects AIL field underwriting guidelines only. It is not a carrier underwriting decision.
          Always verify complex cases with your manager or the home office.
        </p>
      </div>
    </Layout>
  );
}

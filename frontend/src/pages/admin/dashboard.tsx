'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { leadsAPI } from '@/lib/api';

interface Lead {
  id: number;
  name: string;
  email: string;
  phone?: string;
  status: 'new' | 'contacted' | 'converted' | 'rejected';
  notes?: string;
  created_at: string;
}

interface Stats {
  total: number;
  new: number;
  contacted: number;
  converted: number;
  rejected: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    try {
      const leadsResponse = await leadsAPI.getAll();
      let filteredLeads = leadsResponse.data;

      if (filter) {
        filteredLeads = filteredLeads.filter((l: Lead) => l.status === filter);
      }

      setLeads(filteredLeads);

      const statsResponse = await leadsAPI.getStats();
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedLead || !newStatus) return;

    try {
      await leadsAPI.updateStatus(selectedLead.id, newStatus, notes);
      setSelectedLead(null);
      setNewStatus('');
      setNotes('');
      fetchData();
    } catch (error) {
      console.error('Failed to update lead:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      try {
        await leadsAPI.delete(id);
        fetchData();
      } catch (error) {
        console.error('Failed to delete lead:', error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <button onClick={handleLogout} className="text-red-600 hover:text-red-700 text-sm">Logout</button>
        </div>

        {/* Navigation tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <a href="/calls/new" className="card p-4 text-center hover:shadow-md transition-shadow bg-blue-600 text-white rounded-xl">
            <div className="text-2xl mb-1">📞</div>
            <div className="font-bold text-sm">Start Call</div>
            <div className="text-xs opacity-80">Run a live call session</div>
          </a>
          <a href="/admin/calls" className="card p-4 text-center hover:shadow-md transition-shadow rounded-xl">
            <div className="text-2xl mb-1">📊</div>
            <div className="font-bold text-sm">Call History</div>
            <div className="text-xs text-gray-500">Script & outcome analytics</div>
          </a>
          <a href="/admin/rebuttals" className="card p-4 text-center hover:shadow-md transition-shadow rounded-xl">
            <div className="text-2xl mb-1">💬</div>
            <div className="font-bold text-sm">Rebuttals</div>
            <div className="text-xs text-gray-500">Manage objection scripts</div>
          </a>
          <a href="/underwriting" className="card p-4 text-center hover:shadow-md transition-shadow rounded-xl">
            <div className="text-2xl mb-1">🏥</div>
            <div className="font-bold text-sm">Underwriting</div>
            <div className="text-xs text-gray-500">Build rating & conditions</div>
          </a>
          <a href="/ask" className="card p-4 text-center hover:shadow-md transition-shadow rounded-xl">
            <div className="text-2xl mb-1">🤖</div>
            <div className="font-bold text-sm">Ask Assistant</div>
            <div className="text-xs text-gray-500">AI knowledge bot</div>
          </a>
          <a href="/admin/sme-requests" className="card p-4 text-center hover:shadow-md transition-shadow rounded-xl">
            <div className="text-2xl mb-1">📩</div>
            <div className="font-bold text-sm">SME Inbox</div>
            <div className="text-xs text-gray-500">Escalated questions</div>
          </a>
          <div className="card p-4 text-center rounded-xl opacity-50 cursor-not-allowed">
            <div className="text-2xl mb-1">💬</div>
            <div className="font-bold text-sm">Live Chat</div>
            <div className="text-xs text-blue-500 font-semibold">Coming Soon</div>
          </div>
          <a href="/admin/knowledge-base" className="card p-4 text-center hover:shadow-md transition-shadow rounded-xl">
            <div className="text-2xl mb-1">🧠</div>
            <div className="font-bold text-sm">Knowledge Base</div>
            <div className="text-xs text-gray-500">Edit bot Q&A pairs</div>
          </a>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="card text-center">
              <div className="text-3xl font-bold text-primary">{stats.total}</div>
              <p className="text-gray-600">Total Leads</p>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-yellow-600">{stats.new}</div>
              <p className="text-gray-600">New</p>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.contacted}</div>
              <p className="text-gray-600">Contacted</p>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-green-600">{stats.converted}</div>
              <p className="text-gray-600">Converted</p>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-red-600">{stats.rejected}</div>
              <p className="text-gray-600">Rejected</p>
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="mb-8">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Leads Table */}
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="text-left py-4 px-4">Name</th>
                <th className="text-left py-4 px-4">Email</th>
                <th className="text-left py-4 px-4">Phone</th>
                <th className="text-left py-4 px-4">Status</th>
                <th className="text-left py-4 px-4">Date</th>
                <th className="text-left py-4 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-4">{lead.name}</td>
                  <td className="py-4 px-4">{lead.email}</td>
                  <td className="py-4 px-4">{lead.phone || '-'}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold ${
                        lead.status === 'new'
                          ? 'bg-yellow-100 text-yellow-800'
                          : lead.status === 'contacted'
                          ? 'bg-blue-100 text-blue-800'
                          : lead.status === 'converted'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => {
                        setSelectedLead(lead);
                        setNewStatus(lead.status);
                        setNotes(lead.notes || '');
                      }}
                      className="text-blue-600 hover:text-blue-700 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(lead.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit Modal */}
        {selectedLead && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-6">Update Lead</h2>

              <div className="mb-4">
                <p className="font-bold mb-2">{selectedLead.name}</p>
                <p className="text-gray-600">{selectedLead.email}</p>
              </div>

              <div className="mb-4">
                <label className="block font-bold mb-2">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="converted">Converted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block font-bold mb-2">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={4}
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleUpdateStatus}
                  className="flex-1 btn-primary"
                >
                  Save
                </button>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

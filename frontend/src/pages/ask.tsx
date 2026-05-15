'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import api from '@/lib/api';

interface Message {
  role: 'user' | 'bot';
  content: string;
  requiresSme?: boolean;
}

interface SmeForm { name: string; email: string; phone: string; bestTime: string; }

export default function AskPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/admin/login'); }
  }, [router]);

  const [messages, setMessages] = useState<Message[]>([{
    role: 'bot',
    content: "Hi! I'm the ApexScoop assistant. I answer questions about insurance benefits, qualifying conditions, and coverage options — using Jonathan's actual AIL documentation. What's your question today?",
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSmeForm, setShowSmeForm] = useState(false);
  const [smeForm, setSmeForm] = useState<SmeForm>({ name: '', email: '', phone: '', bestTime: '' });
  const [pendingQuestion, setPendingQuestion] = useState('');
  const [pendingBotAnswer, setPendingBotAnswer] = useState('');
  const [smeSubmitted, setSmeSubmitted] = useState(false);
  const [submittingSme, setSubmittingSme] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, showSmeForm]);

  async function sendMessage() {
    const q = input.trim();
    if (!q || loading) return;
    setInput('');
    setMessages(m => [...m, { role: 'user', content: q }]);
    setLoading(true);
    try {
      const r = await api.post('/api/ask', { message: q });
      const { answer, requiresSme } = r.data;
      setMessages(m => [...m, { role: 'bot', content: answer, requiresSme }]);
      if (requiresSme) {
        setPendingQuestion(q);
        setPendingBotAnswer(answer);
        setShowSmeForm(true);
      }
    } catch {
      setMessages(m => [...m, { role: 'bot', content: "Sorry, I ran into an issue. Please try again or contact Jonathan directly." }]);
    } finally {
      setLoading(false);
    }
  }

  async function submitSmeRequest() {
    if (!smeForm.name.trim()) { alert('Please enter your name.'); return; }
    setSubmittingSme(true);
    try {
      await api.post('/api/ask/sme-request', {
        question: pendingQuestion,
        botAnswer: pendingBotAnswer,
        name: smeForm.name,
        email: smeForm.email || null,
        phone: smeForm.phone || null,
        bestTime: smeForm.bestTime || null,
        source: 'ask_page',
      });
      setSmeSubmitted(true);
      setShowSmeForm(false);
      setMessages(m => [...m, {
        role: 'bot',
        content: `Thank you, ${smeForm.name}! Jonathan has been notified and will get back to you ${smeForm.bestTime ? `during ${smeForm.bestTime}` : 'as soon as possible'}. Keep an eye on your email or phone!`,
      }]);
    } catch {
      alert('Failed to submit. Please try again.');
    } finally {
      setSubmittingSme(false); }
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Ask Jonathan's Assistant</h1>
            <p className="text-gray-500 mt-1 text-sm">Answers are based on AIL internal documentation — not generic web results.</p>
          </div>
          <a href="/" className="text-gray-500 hover:text-gray-700 text-sm">← Home</a>
        </div>

        {/* Chat window */}
        <div className="bg-white rounded-2xl border shadow-sm min-h-96 max-h-[60vh] overflow-y-auto p-6 mb-4">
          {messages.map((msg, i) => (
            <div key={i} className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-lg rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap
                ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}
              `}>
                {msg.content}
                {msg.role === 'bot' && !msg.requiresSme && (
                  <div className="text-xs text-gray-400 mt-2">Source: AIL internal guidelines</div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  {[0,1,2].map(i => <div key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* SME Contact Form */}
        {showSmeForm && !smeSubmitted && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-4">
            <h3 className="font-bold text-lg mb-1">Have Jonathan Review This</h3>
            <p className="text-sm text-gray-600 mb-4">Leave your contact information and Jonathan will research this and get back to you.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Your Name *</label>
                <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Jane Smith"
                  value={smeForm.name} onChange={e => setSmeForm(s => ({ ...s, name: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                <input type="email" className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="jane@example.com"
                  value={smeForm.email} onChange={e => setSmeForm(s => ({ ...s, email: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                <input type="tel" className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="555-555-5555"
                  value={smeForm.phone} onChange={e => setSmeForm(s => ({ ...s, phone: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Best Time to Reach You</label>
                <select className="w-full border rounded-lg px-3 py-2 text-sm"
                  value={smeForm.bestTime} onChange={e => setSmeForm(s => ({ ...s, bestTime: e.target.value }))}>
                  <option value="">Any time</option>
                  <option value="Morning (9am–12pm)">Morning (9am–12pm)</option>
                  <option value="Afternoon (12pm–5pm)">Afternoon (12pm–5pm)</option>
                  <option value="Evening (5pm–8pm)">Evening (5pm–8pm)</option>
                  <option value="Weekends">Weekends</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={submitSmeRequest} disabled={submittingSme || !smeForm.name}
                className="flex-1 btn-primary py-2 rounded-xl text-sm font-bold disabled:opacity-50">
                {submittingSme ? 'Submitting...' : 'Submit — Have Jonathan Contact Me'}
              </button>
              <button onClick={() => setShowSmeForm(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl text-sm font-medium">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="flex gap-3">
          <input
            className="flex-1 border-2 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="Ask about coverage, qualifying conditions, products..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            disabled={loading}
          />
          <button onClick={sendMessage} disabled={loading || !input.trim()}
            className="btn-primary px-6 py-3 rounded-xl font-bold disabled:opacity-50">
            Ask
          </button>
        </div>
        <p className="text-xs text-gray-400 text-center mt-3">
          Responses are based on AIL field documentation. For final underwriting decisions, always consult Jonathan directly.
        </p>
      </div>
    </Layout>
  );
}

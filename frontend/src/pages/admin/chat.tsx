import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const WS_URL = API_URL.replace(/^http/, 'ws');

interface ChatSession {
  id: string;
  visitor_name: string | null;
  visitor_email: string | null;
  visitor_phone: string | null;
  status: 'bot' | 'agent_live' | 'closed';
  created_at: string;
  updated_at: string;
  last_message: string | null;
  message_count: number;
  agent_name: string | null;
}

interface ChatMessage {
  id: number;
  session_id: string;
  role: 'visitor' | 'bot' | 'agent';
  content: string;
  created_at: string;
}

export default function AdminChatPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [agentInput, setAgentInput] = useState('');
  const [connected, setConnected] = useState(false);
  const [visitorOnline, setVisitorOnline] = useState<Record<string, boolean>>({});
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Rebuttals and script tracking
  const [scriptTypes, setScriptTypes] = useState<any[]>([]);
  const [selectedScriptType, setSelectedScriptType] = useState<string | null>(null);
  const [rebuttals, setRebuttals] = useState<any[]>([]);
  const [selectedRebuttals, setSelectedRebuttals] = useState<Set<number>>(new Set());
  const [callOutcomes, setCallOutcomes] = useState<any[]>([]);
  const [scriptSections, setScriptSections] = useState<any[]>([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [showRebuttalForm, setShowRebuttalForm] = useState(false);
  const [newRebuttal, setNewRebuttal] = useState({ title: '', content: '' });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(scrollToBottom, [messages]);

  const connectWS = useCallback((token: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(`${WS_URL}/ws?admin=true&token=${encodeURIComponent(token)}`);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => {
      setConnected(false);
      // Reconnect
      setTimeout(() => {
        const t = localStorage.getItem('token');
        if (t) connectWS(t);
      }, 3000);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case 'sessions_list':
          setSessions(data.sessions);
          break;

        case 'new_message':
          // If message belongs to selected session, append it
          setSelectedSession(curr => {
            if (curr === data.sessionId) {
              setMessages(prev => {
                // Avoid duplicates
                if (prev.some(m => m.id === data.message.id)) return prev;
                return [...prev, data.message];
              });
            }
            return curr;
          });
          break;

        case 'session_messages':
          setMessages(data.messages);
          break;

        case 'visitor_connected':
          setVisitorOnline(prev => ({ ...prev, [data.sessionId]: true }));
          break;

        case 'visitor_disconnected':
          setVisitorOnline(prev => ({ ...prev, [data.sessionId]: false }));
          break;

        case 'session_status':
          setSessions(prev =>
            prev.map(s => s.id === data.sessionId ? { ...s, status: data.status } : s)
          );
          break;
      }
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    connectWS(token);
    return () => { wsRef.current?.close(); };
  }, [router, connectWS]);

  // Load script data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [scriptRes, outcomesRes] = await Promise.all([
          fetch('/api/data/script-types'),
          fetch('/api/data/call-outcomes')
        ]);
        const scripts = await scriptRes.json();
        const outcomes = await outcomesRes.json();
        setScriptTypes(scripts);
        setCallOutcomes(outcomes);
      } catch (error) {
        console.error('Failed to load script data:', error);
      }
    };
    loadData();
  }, []);

  const selectSession = (sessionId: string) => {
    setSelectedSession(sessionId);
    setMessages([]);
    wsRef.current?.send(JSON.stringify({ type: 'get_messages', sessionId }));
  };

  const takeOver = (sessionId: string) => {
    wsRef.current?.send(JSON.stringify({ type: 'take_over', sessionId }));
  };

  const handBack = (sessionId: string) => {
    wsRef.current?.send(JSON.stringify({ type: 'hand_back', sessionId }));
  };

  const closeSession = (sessionId: string) => {
    if (!confirm('Close this chat session?')) return;
    wsRef.current?.send(JSON.stringify({ type: 'close_session', sessionId }));
    if (selectedSession === sessionId) {
      setSelectedSession(null);
      setMessages([]);
    }
  };

  const sendAgentMessage = () => {
    if (!agentInput.trim() || !selectedSession) return;
    wsRef.current?.send(JSON.stringify({
      type: 'agent_message',
      sessionId: selectedSession,
      content: agentInput.trim(),
    }));
    setAgentInput('');
  };

  // Script and rebuttal functions
  const selectScriptType = async (scriptTypeId: string) => {
    setSelectedScriptType(scriptTypeId);
    setSelectedRebuttals(new Set());
    setCurrentSection(0);
    try {
      const [rebuttalsRes, sectionsRes] = await Promise.all([
        fetch(`/api/data/rebuttals/${scriptTypeId}`),
        fetch(`/api/data/script-sections/${scriptTypeId}`)
      ]);
      const rebuttalsData = await rebuttalsRes.json();
      const sectionsData = await sectionsRes.json();
      setRebuttals(rebuttalsData);
      setScriptSections(sectionsData);
    } catch (error) {
      console.error('Failed to load script data:', error);
    }
  };

  const toggleRebuttal = (rebuttalId: number) => {
    setSelectedRebuttals(prev => {
      const newSet = new Set(prev);
      if (newSet.has(rebuttalId)) {
        newSet.delete(rebuttalId);
      } else {
        newSet.add(rebuttalId);
      }
      return newSet;
    });
  };

  const nextSection = () => {
    if (currentSection < scriptSections.length - 1) {
      setCurrentSection(prev => prev + 1);
    }
  };

  const auxCall = async (outcomeId: string) => {
    if (!selectedSession) return;
    try {
      await fetch('/api/data/agent-calls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: selectedSession,
          agentId: 1, // Assuming admin user ID
          scriptTypeId: selectedScriptType,
          selectedRebuttals: Array.from(selectedRebuttals),
          scriptProgress: currentSection,
          outcomeId,
        }),
      });
      // Close session or hand back
      handBack(selectedSession);
    } catch (error) {
      console.error('Failed to record call:', error);
    }
  };

  const addRebuttal = async () => {
    if (!selectedScriptType || !newRebuttal.title || !newRebuttal.content) return;
    try {
      await fetch('/api/data/rebuttals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scriptTypeId: selectedScriptType,
          title: newRebuttal.title,
          content: newRebuttal.content,
        }),
      });
      setNewRebuttal({ title: '', content: '' });
      setShowRebuttalForm(false);
      // Reload rebuttals
      if (selectedScriptType) {
        const res = await fetch(`/api/data/rebuttals/${selectedScriptType}`);
        const data = await res.json();
        setRebuttals(data);
      }
    } catch (error) {
      console.error('Failed to add rebuttal:', error);
    }
  };

  const selectedSessionData = sessions.find(s => s.id === selectedSession);
  const activeSessions = sessions.filter(s => s.status !== 'closed');
  const closedSessions = sessions.filter(s => s.status === 'closed');

  const statusBadge = (status: ChatSession['status']) => {
    if (status === 'agent_live') return <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">Agent Live</span>;
    if (status === 'bot') return <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Bot</span>;
    return <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs font-medium">Closed</span>;
  };

  const roleColor = (role: ChatMessage['role']) => {
    if (role === 'visitor') return 'justify-end';
    return 'justify-start';
  };

  const bubbleStyle = (role: ChatMessage['role']) => {
    if (role === 'visitor') return 'bg-blue-600 text-white rounded-br-sm';
    if (role === 'agent') return 'bg-green-50 border border-green-200 text-gray-800 rounded-bl-sm';
    return 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm';
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard" className="text-gray-500 hover:text-gray-700">
            ← Dashboard
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">Live Chat</h1>
          <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-400'}`} />
          <span className="text-sm text-gray-500">{connected ? 'Connected' : 'Reconnecting...'}</span>
        </div>
        <div className="flex gap-4 text-sm text-gray-500">
          <span className="font-medium text-blue-700">{activeSessions.length}</span> active
          &nbsp;·&nbsp;
          <span className="font-medium text-green-700">{activeSessions.filter(s => s.status === 'agent_live').length}</span> live with agent
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 57px)' }}>
        {/* Session list */}
        <aside className="w-72 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Conversations</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {activeSessions.length === 0 && (
              <div className="px-4 py-8 text-center text-gray-400 text-sm">
                No active conversations yet.<br />When visitors start chatting, they'll appear here.
              </div>
            )}
            {activeSessions.map(session => (
              <button
                key={session.id}
                onClick={() => selectSession(session.id)}
                className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${selectedSession === session.id ? 'bg-blue-50 border-l-2 border-l-blue-600' : ''}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm text-gray-800 truncate">
                    {session.visitor_name || 'Visitor'}
                    {visitorOnline[session.id] && <span className="ml-1 text-green-500 text-xs">●</span>}
                  </span>
                  {statusBadge(session.status)}
                </div>
                {session.visitor_email && (
                  <p className="text-xs text-gray-400 truncate">{session.visitor_email}</p>
                )}
                {session.last_message && (
                  <p className="text-xs text-gray-500 truncate mt-1">{session.last_message}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {session.message_count} msgs · {new Date(session.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </button>
            ))}

            {closedSessions.length > 0 && (
              <>
                <div className="px-4 py-2 bg-gray-50">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Closed</p>
                </div>
                {closedSessions.slice(0, 10).map(session => (
                  <button
                    key={session.id}
                    onClick={() => selectSession(session.id)}
                    className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 opacity-60 transition-colors ${selectedSession === session.id ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm text-gray-700 truncate">{session.visitor_name || 'Visitor'}</span>
                      {statusBadge(session.status)}
                    </div>
                    <p className="text-xs text-gray-400">{session.message_count} msgs</p>
                  </button>
                ))}
              </>
            )}
          </div>
        </aside>

        {/* Chat pane */}
        <main className="flex-1 flex flex-col overflow-hidden bg-gray-50">
          {selectedSessionData ? (
            <>
              {/* Session header */}
              <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-gray-900">
                      {selectedSessionData.visitor_name || 'Anonymous Visitor'}
                    </h2>
                    {statusBadge(selectedSessionData.status)}
                    {visitorOnline[selectedSessionData.id] && (
                      <span className="text-xs text-green-600">● Visitor online</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {selectedSessionData.visitor_email || 'No email'}{' '}
                    {selectedSessionData.visitor_phone ? `· ${selectedSessionData.visitor_phone}` : ''}
                  </p>
                </div>
                <div className="flex gap-2">
                  {selectedSessionData.status === 'bot' && (
                    <button
                      onClick={() => takeOver(selectedSessionData.id)}
                      className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg font-medium transition-colors"
                    >
                      Take Over Chat
                    </button>
                  )}
                  {selectedSessionData.status === 'agent_live' && (
                    <button
                      onClick={() => handBack(selectedSessionData.id)}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-medium transition-colors"
                    >
                      Hand Back to Bot
                    </button>
                  )}
                  {selectedSessionData.status !== 'closed' && (
                    <button
                      onClick={() => closeSession(selectedSessionData.id)}
                      className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm rounded-lg font-medium transition-colors"
                    >
                      Close Chat
                    </button>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                {messages.map((msg, i) => (
                  <div key={msg.id ?? i} className={`flex ${roleColor(msg.role)}`}>
                    {msg.role !== 'visitor' && (
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0 mt-1 ${msg.role === 'agent' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {msg.role === 'agent' ? 'J' : 'AI'}
                      </div>
                    )}
                    <div className={`max-w-md px-3 py-2 rounded-2xl text-sm leading-relaxed ${bubbleStyle(msg.role)}`}>
                      {msg.role === 'agent' && (
                        <p className="text-green-600 font-semibold text-xs mb-1">You (Jonathan)</p>
                      )}
                      {msg.role === 'bot' && (
                        <p className="text-blue-600 font-semibold text-xs mb-1">AI Assistant</p>
                      )}
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      <p className="text-xs opacity-50 mt-1">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Agent input (only when agent_live) */}
              {selectedSessionData.status === 'agent_live' && (
                <div className="bg-white border-t border-gray-200 px-4 py-3">
                  <div className="flex gap-2 items-center">
                    <div className="flex-1 flex gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                      <span className="text-green-600 text-sm font-medium flex-shrink-0">Jonathan:</span>
                      <input
                        type="text"
                        value={agentInput}
                        onChange={e => setAgentInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendAgentMessage(); } }}
                        placeholder="Type your message..."
                        className="flex-1 bg-transparent text-sm focus:outline-none text-gray-800"
                        autoFocus
                      />
                    </div>
                    <button
                      onClick={sendAgentMessage}
                      disabled={!agentInput.trim()}
                      className="w-10 h-10 bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 px-1">You are chatting live as Jonathan. Visitor sees your messages in real-time.</p>
                </div>
              )}

              {selectedSessionData.status === 'bot' && (
                <div className="bg-blue-50 border-t border-blue-200 px-4 py-2 text-center">
                  <p className="text-sm text-blue-600">
                    AI is handling this conversation. Click <strong>Take Over Chat</strong> to respond directly.
                  </p>
                </div>
              )}

              {selectedSessionData.status === 'closed' && (
                <div className="bg-gray-100 border-t border-gray-200 px-4 py-2 text-center">
                  <p className="text-sm text-gray-500">This conversation is closed.</p>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-lg font-medium text-gray-500">Select a conversation</p>
                <p className="text-sm mt-1">Choose a session from the left to view messages and respond</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

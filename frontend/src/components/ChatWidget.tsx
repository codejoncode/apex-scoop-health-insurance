import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const WS_URL = API_URL.replace(/^http/, 'ws');

interface Message {
  id?: number;
  role: 'visitor' | 'bot' | 'agent';
  content: string;
  streaming?: boolean;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [agentOnline, setAgentOnline] = useState(false);
  const [connected, setConnected] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [showEscalationForm, setShowEscalationForm] = useState(false);
  const [escalationData, setEscalationData] = useState({ name: '', email: '', phone: '' });
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages, streamingText]);

  // Create or restore session
  const ensureSession = useCallback(async (): Promise<string> => {
    const stored = localStorage.getItem('chat_session_id');
    if (stored) return stored;

    const res = await axios.post(`${API_URL}/api/chat/session`);
    const id = res.data.sessionId;
    localStorage.setItem('chat_session_id', id);
    return id;
  }, []);

  // Connect WebSocket
  const connect = useCallback(async () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const sid = await ensureSession();
    setSessionId(sid);

    const ws = new WebSocket(`${WS_URL}/ws?session_id=${sid}`);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => {
      setConnected(false);
      // Reconnect after 3s if widget is open
      setTimeout(() => {
        if (open) connect();
      }, 3000);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case 'history':
          setMessages(data.messages.map((m: { id: number; role: Message['role']; content: string }) => ({
            id: m.id, role: m.role, content: m.content,
          })));
          break;

        case 'stream_start':
          setIsStreaming(true);
          setStreamingText('');
          break;

        case 'stream_chunk':
          setStreamingText(prev => prev + data.text);
          break;

        case 'stream_end':
          setIsStreaming(false);
          setMessages(prev => [
            ...prev,
            { id: data.messageId, role: 'bot', content: streamingTextRef.current },
          ]);
          setStreamingText('');
          break;

        case 'bot_message':
          setMessages(prev => [...prev, { id: data.id, role: 'bot', content: data.content }]);
          break;

        case 'agent_message':
          setMessages(prev => [...prev, { id: data.messageId, role: 'agent', content: data.content }]);
          break;

        case 'agent_joined':
          setAgentOnline(true);
          setMessages(prev => [
            ...prev,
            { role: 'bot', content: `✅ Jonathan has joined the chat and will assist you directly.` },
          ]);
          break;

        case 'agent_left':
          setAgentOnline(false);
          setMessages(prev => [
            ...prev,
            { role: 'bot', content: `Jonathan has stepped away. I'll continue to help you!` },
          ]);
          break;

        case 'escalation_request':
          setMessages(prev => [...prev, { role: 'bot', content: data.message }]);
          setShowEscalationForm(true);
          break;
          break;

        case 'error':
          setIsStreaming(false);
          setMessages(prev => [
            ...prev,
            { role: 'bot', content: data.message || 'Something went wrong. Please try again.' },
          ]);
          break;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ensureSession, open]);

  // Ref to capture latest streamingText inside ws.onmessage closure
  const streamingTextRef = useRef('');
  useEffect(() => { streamingTextRef.current = streamingText; }, [streamingText]);

  // Open chat → connect
  useEffect(() => {
    if (open && !connected) {
      connect();
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open, connected, connect]);

  // Welcome message when first opened with no history
  useEffect(() => {
    if (open && connected && messages.length === 0) {
      setMessages([{
        role: 'bot',
        content: "Hi there! 👋 I'm Jonathan's AI assistant. I can help you understand your insurance options, estimate coverage needs, or connect you with Jonathan directly. How can I help you today?",
      }]);
    }
  }, [open, connected, messages.length]);

  const sendMessage = () => {
    if (!input.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    const content = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'visitor', content }]);
    wsRef.current.send(JSON.stringify({ type: 'message', content }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-110"
        aria-label="Open chat"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
          </svg>
        )}
        {/* Unread indicator — simple pulse when closed */}
        {!open && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-green-400 rounded-full animate-pulse border-2 border-white" />
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
          style={{ height: '520px' }}>

          {/* Header */}
          <div className="bg-blue-600 px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              JH
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm leading-tight">Jonathan Holloway</p>
              <p className="text-blue-200 text-xs">
                {agentOnline ? '🟢 Agent online' : '🤖 AI Assistant · Usually instant'}
              </p>
            </div>
            <button onClick={() => setOpen(false)} className="text-blue-200 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={msg.id ?? i} className={`flex ${msg.role === 'visitor' ? 'justify-end' : 'justify-start'}`}>
                {msg.role !== 'visitor' && (
                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold mr-2 flex-shrink-0 mt-1">
                    {msg.role === 'agent' ? 'J' : 'AI'}
                  </div>
                )}
                <div className={`max-w-[78%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'visitor'
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : msg.role === 'agent'
                    ? 'bg-green-50 text-gray-800 border border-green-200 rounded-bl-sm'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm'
                }`}>
                  {msg.role === 'agent' && (
                    <p className="text-green-600 font-semibold text-xs mb-1">Jonathan</p>
                  )}
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}

            {/* Streaming bot message */}
            {isStreaming && (
              <div className="flex justify-start">
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold mr-2 flex-shrink-0 mt-1">
                  AI
                </div>
                <div className="max-w-[78%] px-3 py-2 rounded-2xl rounded-bl-sm text-sm bg-white border border-gray-200 shadow-sm text-gray-800">
                  {streamingText ? (
                    <p className="whitespace-pre-wrap">{streamingText}<span className="inline-block w-1 h-4 bg-blue-400 ml-0.5 animate-pulse" /></p>
                  ) : (
                    <div className="flex gap-1 items-center py-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  )}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Escalation form */}
          {showEscalationForm && (
            <div className="px-3 py-3 bg-yellow-50 border-t border-yellow-200">
              <p className="text-sm text-gray-700 mb-3">Please provide your contact information so our subject matter expert can research your question and get back to you:</p>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Your name"
                  value={escalationData.name}
                  onChange={e => setEscalationData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="email"
                  placeholder="Your email"
                  value={escalationData.email}
                  onChange={e => setEscalationData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="tel"
                  placeholder="Your phone (optional)"
                  value={escalationData.phone}
                  onChange={e => setEscalationData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  onClick={async () => {
                    if (!escalationData.name || !escalationData.email) return;
                    try {
                      await axios.post(`${API_URL}/api/leads/escalation`, {
                        ...escalationData,
                        question: messages[messages.length - 1]?.content || '',
                        sessionId: sessionId,
                      });
                      setShowEscalationForm(false);
                      setMessages(prev => [...prev, {
                        role: 'bot',
                        content: 'Thank you! A subject matter expert will research your question and get back to you soon.'
                      }]);
                    } catch (error) {
                      console.error('Failed to submit escalation:', error);
                    }
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded transition-colors"
                >
                  Submit
                </button>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="px-3 py-3 bg-white border-t border-gray-200 flex gap-2 items-center">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about insurance..."
              disabled={isStreaming}
              className="flex-1 text-sm border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isStreaming}
              className="w-9 h-9 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-full flex items-center justify-center transition-colors flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

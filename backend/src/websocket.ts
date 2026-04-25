import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage, Server } from 'http';
import jwt from 'jsonwebtoken';
import db from './db.js';
import { getKnowledgeBaseResponse } from './services/knowledgeBase.js';

// ─── Connection registries ────────────────────────────────────────────────────
// visitor sessionId -> WebSocket
const visitorSockets = new Map<string, WebSocket>();
// admin WebSocket -> admin user info
const adminSockets = new Map<WebSocket, { id: number; email: string }>();
// sessions currently being typed by bot (prevents double AI calls)
const botStreaming = new Set<string>();

// ─── Helpers ─────────────────────────────────────────────────────────────────

function sendJSON(ws: WebSocket, payload: object): void {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(payload));
  }
}

function broadcastToAdmins(payload: object): void {
  for (const ws of adminSockets.keys()) {
    sendJSON(ws, payload);
  }
}

async function getSessionMessages(sessionId: string) {
  const result = await db.query(
    'SELECT id, role, content, created_at FROM chat_messages WHERE session_id = $1 ORDER BY created_at ASC',
    [sessionId]
  );
  return result.rows;
}

async function getActiveSessions() {
  const result = await db.query(
    `SELECT s.id, s.visitor_name, s.visitor_email, s.visitor_phone, s.status, s.created_at,
       (SELECT content FROM chat_messages WHERE session_id = s.id ORDER BY created_at DESC LIMIT 1) as last_message,
       (SELECT COUNT(*) FROM chat_messages WHERE session_id = s.id) as message_count
     FROM chat_sessions s
     WHERE s.status != 'closed'
     ORDER BY s.updated_at DESC`
  );
  return result.rows;
}

async function saveMessage(sessionId: string, role: 'visitor' | 'bot' | 'agent', content: string) {
  const result = await db.query(
    'INSERT INTO chat_messages (session_id, role, content) VALUES ($1, $2, $3) RETURNING *',
    [sessionId, role, content]
  );
  await db.query('UPDATE chat_sessions SET updated_at = NOW() WHERE id = $1', [sessionId]);
  return result.rows[0];
}

async function getSessionStatus(sessionId: string): Promise<string | null> {
  const result = await db.query('SELECT status FROM chat_sessions WHERE id = $1', [sessionId]);
  return result.rows[0]?.status ?? null;
}

// ─── Visitor message handler ──────────────────────────────────────────────────

async function handleVisitorMessage(ws: WebSocket, sessionId: string, raw: string) {
  let data: { type: string; content?: string; name?: string; email?: string; phone?: string };
  try {
    data = JSON.parse(raw);
  } catch {
    return;
  }

  if (data.type === 'visitor_info') {
    await db.query(
      'UPDATE chat_sessions SET visitor_name = $1, visitor_email = $2, visitor_phone = $3 WHERE id = $4',
      [data.name || null, data.email || null, data.phone || null, sessionId]
    );
    const updatedSessions = await getActiveSessions();
    broadcastToAdmins({ type: 'sessions_list', sessions: updatedSessions });
    return;
  }

  if (data.type !== 'message' || !data.content?.trim()) return;

  const content = data.content.trim();
  const status = await getSessionStatus(sessionId);

  // Save visitor message
  const msg = await saveMessage(sessionId, 'visitor', content);
  broadcastToAdmins({ type: 'new_message', sessionId, message: msg });

  // If agent has taken over, do NOT call Claude
  if (status === 'agent_live') {
    // Notify all admins about the new visitor message so they see it in real-time
    const sessions = await getActiveSessions();
    broadcastToAdmins({ type: 'sessions_list', sessions });
    return;
  }

  // Bot mode — knowledge base response (no external API, zero cost)
  if (botStreaming.has(sessionId)) return;
  botStreaming.add(sessionId);

  try {
    const response = await getKnowledgeBaseResponse(content);

    if (response.escalated) {
      // Escalated: collect contact info and notify admin
      sendJSON(ws, { type: 'escalation_request', message: response.answer });
      // Save escalated message
      await saveMessage(sessionId, 'bot', response.answer);
      broadcastToAdmins({ type: 'escalated_question', sessionId, question: content });
    } else {
      // Normal response
      sendJSON(ws, { type: 'stream_start' });
      broadcastToAdmins({ type: 'bot_typing', sessionId });

      // Simulate natural typing by sending in small chunks
      const words = response.answer.split(' ');
      const chunkSize = 3;
      for (let i = 0; i < words.length; i += chunkSize) {
        const chunk = words.slice(i, i + chunkSize).join(' ') + (i + chunkSize < words.length ? ' ' : '');
        sendJSON(ws, { type: 'stream_chunk', text: chunk });
        await new Promise((r) => setTimeout(r, 40));
      }

      const botMsg = await saveMessage(sessionId, 'bot', response.answer);
      sendJSON(ws, { type: 'stream_end', messageId: botMsg.id });
      broadcastToAdmins({ type: 'new_message', sessionId, message: botMsg });
    }

    const sessions = await getActiveSessions();
    broadcastToAdmins({ type: 'sessions_list', sessions });
  } catch (err) {
    console.error('Bot handler error:', err);
    sendJSON(ws, { type: 'error', message: 'Sorry, I had trouble responding. Please try again.' });
  } finally {
    botStreaming.delete(sessionId);
  }
}

// ─── Admin message handler ────────────────────────────────────────────────────

async function handleAdminMessage(ws: WebSocket, raw: string) {
  let data: { type: string; sessionId?: string; content?: string };
  try {
    data = JSON.parse(raw);
  } catch {
    return;
  }

  const admin = adminSockets.get(ws);
  if (!admin) return;

  if (data.type === 'take_over' && data.sessionId) {
    const { sessionId } = data;
    await db.query(
      `UPDATE chat_sessions SET status = 'agent_live', agent_id = $1, updated_at = NOW() WHERE id = $2`,
      [admin.id, sessionId]
    );

    // Notify visitor
    const visitorWs = visitorSockets.get(sessionId);
    if (visitorWs) sendJSON(visitorWs, { type: 'agent_joined', agentName: 'Jonathan' });

    // Broadcast session update to all admins
    const sessions = await getActiveSessions();
    broadcastToAdmins({ type: 'sessions_list', sessions });
    broadcastToAdmins({ type: 'session_status', sessionId, status: 'agent_live' });
  }

  if (data.type === 'hand_back' && data.sessionId) {
    const { sessionId } = data;
    await db.query(
      `UPDATE chat_sessions SET status = 'bot', agent_id = NULL, updated_at = NOW() WHERE id = $1`,
      [sessionId]
    );

    const visitorWs = visitorSockets.get(sessionId);
    if (visitorWs) sendJSON(visitorWs, { type: 'agent_left' });

    const sessions = await getActiveSessions();
    broadcastToAdmins({ type: 'sessions_list', sessions });
    broadcastToAdmins({ type: 'session_status', sessionId, status: 'bot' });
  }

  if (data.type === 'agent_message' && data.sessionId && data.content?.trim()) {
    const { sessionId, content } = data;
    const msg = await saveMessage(sessionId, 'agent', content!.trim());

    // Send to visitor
    const visitorWs = visitorSockets.get(sessionId);
    if (visitorWs) {
      sendJSON(visitorWs, {
        type: 'agent_message',
        content: msg.content,
        messageId: msg.id,
        agentName: 'Jonathan',
      });
    }

    // Broadcast to all admins (so other admin tabs stay in sync)
    broadcastToAdmins({ type: 'new_message', sessionId, message: msg });
    const sessions = await getActiveSessions();
    broadcastToAdmins({ type: 'sessions_list', sessions });
  }

  if (data.type === 'close_session' && data.sessionId) {
    const { sessionId } = data;
    await db.query(
      `UPDATE chat_sessions SET status = 'closed', updated_at = NOW() WHERE id = $1`,
      [sessionId]
    );

    const visitorWs = visitorSockets.get(sessionId);
    if (visitorWs) sendJSON(visitorWs, { type: 'session_closed' });

    const sessions = await getActiveSessions();
    broadcastToAdmins({ type: 'sessions_list', sessions });
  }

  if (data.type === 'get_messages' && data.sessionId) {
    const messages = await getSessionMessages(data.sessionId);
    sendJSON(ws, { type: 'session_messages', sessionId: data.sessionId, messages });
  }
}

// ─── WebSocket server setup ───────────────────────────────────────────────────

export function setupWebSocket(server: Server): void {
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', async (ws: WebSocket, req: IncomingMessage) => {
    const urlStr = req.url ?? '/';
    const url = new URL(urlStr, `http://${req.headers.host ?? 'localhost'}`);
    const sessionId = url.searchParams.get('session_id');
    const isAdmin = url.searchParams.get('admin') === 'true';
    const token = url.searchParams.get('token');

    if (isAdmin) {
      if (!token) {
        ws.close(1008, 'Unauthorized');
        return;
      }
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; email: string };
        adminSockets.set(ws, decoded);

        // Send current active sessions
        const sessions = await getActiveSessions();
        sendJSON(ws, { type: 'sessions_list', sessions });

        ws.on('message', (data) => handleAdminMessage(ws, data.toString()));
        ws.on('close', () => adminSockets.delete(ws));
      } catch {
        ws.close(1008, 'Invalid token');
      }
      return;
    }

    if (sessionId) {
      // Verify session exists
      const exists = await db.query('SELECT id, status FROM chat_sessions WHERE id = $1', [sessionId]);
      if (!exists.rows[0]) {
        ws.close(1008, 'Session not found');
        return;
      }

      visitorSockets.set(sessionId, ws);
      broadcastToAdmins({ type: 'visitor_connected', sessionId });

      // Send message history
      const messages = await getSessionMessages(sessionId);
      sendJSON(ws, { type: 'history', messages });

      ws.on('message', (data) => handleVisitorMessage(ws, sessionId, data.toString()));
      ws.on('close', () => {
        visitorSockets.delete(sessionId);
        broadcastToAdmins({ type: 'visitor_disconnected', sessionId });
      });
      return;
    }

    ws.close(1008, 'Missing session_id or admin parameter');
  });
}

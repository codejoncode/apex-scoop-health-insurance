import { Router, Request, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import db from '../db.js';
import { randomUUID } from 'crypto';
import { DEFAULT_PAIRS, invalidateCache } from '../services/knowledgeBase.js';

const router = Router();

// POST /api/chat/session — create new session (public, called by chat widget)
router.post('/session', async (req: Request, res: Response) => {
  try {
    const id = randomUUID();
    await db.query(
      'INSERT INTO chat_sessions (id) VALUES ($1)',
      [id]
    );
    res.json({ sessionId: id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// GET /api/chat/sessions — list all sessions (admin only)
router.get('/sessions', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const result = await db.query(
      `SELECT s.id, s.visitor_name, s.visitor_email, s.visitor_phone, s.status, s.created_at, s.updated_at,
         (SELECT content FROM chat_messages WHERE session_id = s.id ORDER BY created_at DESC LIMIT 1) as last_message,
         (SELECT COUNT(*) FROM chat_messages WHERE session_id = s.id) as message_count,
         a.name as agent_name
       FROM chat_sessions s
       LEFT JOIN admin_users a ON s.agent_id = a.id
       ORDER BY s.updated_at DESC
       LIMIT 100`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// GET /api/chat/sessions/:id/messages — get messages for a session (admin only)
router.get('/sessions/:id/messages', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'SELECT * FROM chat_messages WHERE session_id = $1 ORDER BY created_at ASC',
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// PATCH /api/chat/sessions/:id/close — close a session (admin only)
router.patch('/sessions/:id/close', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await db.query(
      `UPDATE chat_sessions SET status = 'closed', updated_at = NOW() WHERE id = $1`,
      [id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to close session' });
  }
});

// GET /api/chat/stats — quick stats for admin dashboard
router.get('/stats', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const result = await db.query(
      `SELECT
         COUNT(*) FILTER (WHERE status = 'bot') as bot_active,
         COUNT(*) FILTER (WHERE status = 'agent_live') as agent_active,
         COUNT(*) FILTER (WHERE status = 'closed') as closed,
         COUNT(*) as total
       FROM chat_sessions`
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// ─── Knowledge Base CRUD (admin only) ────────────────────────────────────────

// GET /api/chat/kb — list all entries
router.get('/kb', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const result = await db.query(
      'SELECT * FROM chat_kb_entries ORDER BY sort_order ASC, id ASC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch knowledge base' });
  }
});

// POST /api/chat/kb — create entry
router.post('/kb', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { keywords, answer, active = true, sort_order = 0 } = req.body;
    if (!keywords?.length || !answer?.trim()) {
      res.status(400).json({ error: 'keywords and answer are required' });
      return;
    }
    const result = await db.query(
      'INSERT INTO chat_kb_entries (keywords, answer, active, sort_order) VALUES ($1, $2, $3, $4) RETURNING *',
      [keywords, answer.trim(), active, sort_order]
    );
    invalidateCache();
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create entry' });
  }
});

// PUT /api/chat/kb/:id — update entry
router.put('/kb/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { keywords, answer, active, sort_order } = req.body;
    const result = await db.query(
      `UPDATE chat_kb_entries
       SET keywords = COALESCE($1, keywords),
           answer = COALESCE($2, answer),
           active = COALESCE($3, active),
           sort_order = COALESCE($4, sort_order),
           updated_at = NOW()
       WHERE id = $5 RETURNING *`,
      [keywords ?? null, answer?.trim() ?? null, active ?? null, sort_order ?? null, id]
    );
    if (!result.rows[0]) {
      res.status(404).json({ error: 'Entry not found' });
      return;
    }
    invalidateCache();
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update entry' });
  }
});

// DELETE /api/chat/kb/:id — delete entry
router.delete('/kb/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM chat_kb_entries WHERE id = $1', [id]);
    invalidateCache();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete entry' });
  }
});

// POST /api/chat/kb/seed — populate DB with default Q&A (skips if entries already exist)
router.post('/kb/seed', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { force = false } = req.body;
    const existing = await db.query('SELECT COUNT(*) as count FROM chat_kb_entries');
    if (parseInt(existing.rows[0].count) > 0 && !force) {
      res.json({ message: 'Knowledge base already has entries. Pass force:true to re-seed.', count: existing.rows[0].count });
      return;
    }
    if (force) {
      await db.query('DELETE FROM chat_kb_entries');
    }
    const insertPromises = DEFAULT_PAIRS.map((pair, i) =>
      db.query(
        'INSERT INTO chat_kb_entries (keywords, answer, sort_order) VALUES ($1, $2, $3)',
        [pair.keywords, pair.answer, i]
      )
    );
    await Promise.all(insertPromises);
    invalidateCache();
    res.json({ success: true, inserted: DEFAULT_PAIRS.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to seed knowledge base' });
  }
});

export default router;

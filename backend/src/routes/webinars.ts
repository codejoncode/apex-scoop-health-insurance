import { Router, Request, Response } from 'express';
import db from '../db.js';
import { emailService } from '../services/emailService.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

const TOPIC_LABELS: Record<string, string> = {
  'whole-life-101': 'Whole Life 101',
  'income-mortgage': 'Income & Mortgage Protection',
  'free-member-benefits': 'Free Members Benefits',
  'underwriting-eligibility': 'Underwriting & Eligibility 101',
  'final-expense-senior': 'Final Expense & Senior Protection',
  'riders-that-matter': 'Riders That Matter',
  'kids-coverage': 'Kids Coverage Head Start & Future Insurability',
  'senior-underwriting': 'Senior Underwriting Deep Dive',
};

// POST /api/webinars/signup — public
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, topic } = req.body;

    if (!name || !email || !topic) {
      return res.status(400).json({ error: 'name, email, and topic are required' });
    }

    if (!TOPIC_LABELS[topic]) {
      return res.status(400).json({ error: 'Invalid topic' });
    }

    const result = await db.query(
      `INSERT INTO webinar_signups (name, email, phone, topic)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name.trim(), email.trim().toLowerCase(), phone?.trim() || null, topic]
    );

    const signup = result.rows[0];
    const topicLabel = TOPIC_LABELS[topic];

    // Email notification to Jonathan
    try {
      await emailService.sendLeadNotification(
        process.env.EMAIL_TO!,
        `Webinar Signup: ${topicLabel} — ${name}`,
        `
          <h2>New Webinar Signup</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
          <p><strong>Topic:</strong> ${topicLabel}</p>
          <p><strong>Signed up at:</strong> ${new Date(signup.created_at).toLocaleString()}</p>
          <hr>
          <p><a href="${process.env.FRONTEND_URL}/admin/webinars">View all signups in Dashboard</a></p>
        `
      );
    } catch {
      // Email failure should not block the response
    }

    res.status(201).json({ message: 'Signed up successfully', id: signup.id });
  } catch (error) {
    console.error('Webinar signup error:', error);
    res.status(500).json({ error: 'Signup failed' });
  }
});

// GET /api/webinars/signups — admin: list all signups
router.get('/signups', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { topic, status } = req.query;
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (topic) {
      params.push(topic);
      conditions.push(`topic = $${params.length}`);
    }
    if (status) {
      params.push(status);
      conditions.push(`status = $${params.length}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const result = await db.query(
      `SELECT * FROM webinar_signups ${where} ORDER BY created_at DESC`,
      params
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Webinar signups fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch signups' });
  }
});

// GET /api/webinars/stats — admin: count per topic
router.get('/stats', authMiddleware, async (_req: Request, res: Response) => {
  try {
    const result = await db.query(`
      SELECT
        topic,
        COUNT(*)::int                                              AS total,
        COUNT(*) FILTER (WHERE status = 'attended')::int          AS attended,
        COUNT(*) FILTER (WHERE status = 'confirmed')::int         AS confirmed,
        COUNT(*) FILTER (WHERE status = 'pending')::int           AS pending,
        MAX(created_at)                                           AS last_signup
      FROM webinar_signups
      GROUP BY topic
      ORDER BY total DESC
    `);

    const rows = result.rows.map((r) => ({
      ...r,
      topicLabel: TOPIC_LABELS[r.topic] || r.topic,
    }));

    res.json(rows);
  } catch (error) {
    console.error('Webinar stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// PATCH /api/webinars/signups/:id — admin: update status/notes
router.patch('/signups/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { status, notes } = req.body;
    const result = await db.query(
      `UPDATE webinar_signups SET status = COALESCE($1, status), notes = COALESCE($2, notes)
       WHERE id = $3 RETURNING *`,
      [status || null, notes || null, parseInt(req.params.id)]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Signup not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Webinar signup update error:', error);
    res.status(500).json({ error: 'Failed to update signup' });
  }
});

export default router;

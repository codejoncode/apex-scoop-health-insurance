import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import db from '../db.js';

const router = Router();

// GET /api/objections — all objection types with their rebuttals (used in call session)
router.get('/', async (_req, res: Response) => {
  try {
    const types = await db.query(
      `SELECT id, label, description FROM objection_types ORDER BY display_order ASC`
    );
    const rebuttals = await db.query(
      `SELECT id, objection_type_id, title, content as script, nlp_notes, is_custom, status
       FROM rebuttals
       WHERE objection_type_id IS NOT NULL AND status = 'active'
       ORDER BY id ASC`
    );
    const rebuttalMap: Record<string, typeof rebuttals.rows> = {};
    for (const r of rebuttals.rows) {
      if (!rebuttalMap[r.objection_type_id]) rebuttalMap[r.objection_type_id] = [];
      rebuttalMap[r.objection_type_id].push(r);
    }
    const result = types.rows.map((t) => ({
      ...t,
      rebuttals: rebuttalMap[t.id] ?? [],
    }));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch objections' });
  }
});

// GET /api/objections/:id/rebuttals — rebuttals for one objection type
router.get('/:id/rebuttals', async (req, res: Response) => {
  try {
    const result = await db.query(
      `SELECT id, title, content as script, nlp_notes, is_custom, status
       FROM rebuttals WHERE objection_type_id = $1 AND status != 'deprecated'
       ORDER BY id ASC`,
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch rebuttals' });
  }
});

// GET /api/objections/admin/all — all rebuttals including drafts (admin)
router.get('/admin/all', authMiddleware, async (_req: AuthRequest, res: Response) => {
  try {
    const result = await db.query(`
      SELECT r.*, ot.label as objection_label,
        (SELECT COUNT(*) FROM call_rebuttals cr WHERE cr.rebuttal_id = r.id) as usage_count
      FROM rebuttals r
      LEFT JOIN objection_types ot ON ot.id = r.objection_type_id
      ORDER BY ot.display_order, r.id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch all rebuttals' });
  }
});

// PATCH /api/objections/rebuttals/:id — update a rebuttal (admin)
router.patch('/rebuttals/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, nlp_notes, status, objection_type_id } = req.body;
    const result = await db.query(
      `UPDATE rebuttals
       SET title = COALESCE($1, title),
           content = COALESCE($2, content),
           nlp_notes = COALESCE($3, nlp_notes),
           status = COALESCE($4, status),
           objection_type_id = COALESCE($5, objection_type_id)
       WHERE id = $6 RETURNING *`,
      [title ?? null, content ?? null, nlp_notes ?? null, status ?? null, objection_type_id ?? null, id]
    );
    if (!result.rows[0]) { res.status(404).json({ error: 'Rebuttal not found' }); return; }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update rebuttal' });
  }
});

// GET /api/objections/stats — rebuttal usage analytics (admin)
router.get('/stats', authMiddleware, async (_req: AuthRequest, res: Response) => {
  try {
    const result = await db.query(`
      SELECT ot.label as objection_type, r.title as rebuttal_title, r.id as rebuttal_id,
        COUNT(cr.id) as times_used,
        COUNT(cr.id) FILTER (WHERE cs.outcome = 'INSURANCE_SOLD') as resulted_in_sale,
        COUNT(cr.id) FILTER (WHERE cs.outcome = 'PRESENTATION_ACCEPTED') as resulted_in_presentation,
        COUNT(cr.id) FILTER (WHERE cs.outcome IN ('INSURANCE_OFFER_REJECTED','PRESENTATION_REJECTED','NOT_QUALIFIED')) as resulted_in_loss,
        ROUND(COUNT(cr.id) FILTER (WHERE cs.outcome = 'INSURANCE_SOLD') * 100.0 / NULLIF(COUNT(cr.id),0), 1) as sale_rate
      FROM call_rebuttals cr
      JOIN rebuttals r ON r.id = cr.rebuttal_id
      JOIN call_sessions cs ON cs.id = cr.call_session_id
      LEFT JOIN objection_types ot ON ot.id = r.objection_type_id
      GROUP BY ot.label, r.title, r.id
      ORDER BY times_used DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch rebuttal stats' });
  }
});

export default router;

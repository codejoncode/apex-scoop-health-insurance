import { Router, Request, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import db from '../db.js';

const router = Router();

// POST /api/calls — start a new call session
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { scriptTypeId, leadId } = req.body;
    if (!scriptTypeId) { res.status(400).json({ error: 'scriptTypeId required' }); return; }
    const result = await db.query(
      `INSERT INTO call_sessions (script_type_id, lead_id, agent_id, source)
       VALUES ($1, $2, $3, 'phone') RETURNING *`,
      [scriptTypeId, leadId ?? null, req.user?.id ?? null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to start call session' });
  }
});

// GET /api/calls — list call sessions for admin
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { limit = 50, offset = 0, outcome, scriptTypeId } = req.query;
    const conditions: string[] = [];
    const params: unknown[] = [];
    let p = 1;

    if (outcome) { conditions.push(`cs.outcome = $${p++}`); params.push(outcome); }
    if (scriptTypeId) { conditions.push(`cs.script_type_id = $${p++}`); params.push(scriptTypeId); }

    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
    params.push(limit, offset);

    const result = await db.query(
      `SELECT cs.*, st.name as script_type_name,
         (SELECT MAX(ss.section_number) FROM call_steps cst
          JOIN script_sections ss ON ss.id = cst.script_section_id
          WHERE cst.call_session_id = cs.id) as max_section_reached,
         (SELECT COUNT(*) FROM call_rebuttals WHERE call_session_id = cs.id) as rebuttal_count
       FROM call_sessions cs
       LEFT JOIN script_types st ON st.id = cs.script_type_id
       ${where}
       ORDER BY cs.started_at DESC
       LIMIT $${p++} OFFSET $${p}`,
      params
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch calls' });
  }
});

// GET /api/calls/stats — aggregate stats for admin dashboard
router.get('/stats', authMiddleware, async (_req: AuthRequest, res: Response) => {
  try {
    const result = await db.query(`
      SELECT
        COUNT(*) as total_calls,
        COUNT(*) FILTER (WHERE outcome = 'INSURANCE_SOLD') as sales,
        COUNT(*) FILTER (WHERE outcome = 'PRESENTATION_ACCEPTED') as presentations,
        COUNT(*) FILTER (WHERE outcome IN ('INSURANCE_SOLD','PRESENTATION_ACCEPTED','INSURANCE_OFFER_REJECTED','PRESENTATION_REJECTED')) as completed,
        COUNT(*) FILTER (WHERE started_at >= NOW() - INTERVAL '7 days') as calls_this_week,
        COUNT(*) FILTER (WHERE outcome = 'INSURANCE_SOLD' AND started_at >= NOW() - INTERVAL '7 days') as sales_this_week,
        COUNT(*) FILTER (WHERE outcome = 'PRESENTATION_ACCEPTED' AND started_at >= NOW() - INTERVAL '7 days') as presentations_this_week
      FROM call_sessions
    `);

    const byScript = await db.query(`
      SELECT st.name as script_type,
        COUNT(cs.id) as total,
        COUNT(cs.id) FILTER (WHERE cs.outcome = 'INSURANCE_SOLD') as sold,
        COUNT(cs.id) FILTER (WHERE cs.outcome = 'PRESENTATION_ACCEPTED') as presentation_accepted,
        ROUND(COUNT(cs.id) FILTER (WHERE cs.outcome = 'INSURANCE_SOLD') * 100.0 / NULLIF(COUNT(cs.id),0), 1) as close_rate
      FROM call_sessions cs
      JOIN script_types st ON st.id = cs.script_type_id
      WHERE cs.started_at >= NOW() - INTERVAL '30 days'
      GROUP BY st.name ORDER BY total DESC
    `);

    res.json({ summary: result.rows[0], by_script: byScript.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch call stats' });
  }
});

// GET /api/calls/:id — call detail with steps and rebuttals
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const callResult = await db.query(
      `SELECT cs.*, st.name as script_type_name FROM call_sessions cs
       LEFT JOIN script_types st ON st.id = cs.script_type_id
       WHERE cs.id = $1`, [id]
    );
    if (!callResult.rows[0]) { res.status(404).json({ error: 'Call not found' }); return; }

    const stepsResult = await db.query(
      `SELECT cst.*, ss.title as section_title, ss.section_number, ss.content as section_content
       FROM call_steps cst
       JOIN script_sections ss ON ss.id = cst.script_section_id
       WHERE cst.call_session_id = $1 ORDER BY cst.completed_at ASC`, [id]
    );

    const rebuttalResult = await db.query(
      `SELECT cr.*, ot.label as objection_label, r.title as rebuttal_title, ss.title as section_title
       FROM call_rebuttals cr
       JOIN objection_types ot ON ot.id = cr.objection_type_id
       JOIN rebuttals r ON r.id = cr.rebuttal_id
       LEFT JOIN script_sections ss ON ss.id = cr.script_section_id
       WHERE cr.call_session_id = $1 ORDER BY cr.created_at ASC`, [id]
    );

    res.json({
      call: callResult.rows[0],
      steps: stepsResult.rows,
      rebuttals_used: rebuttalResult.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch call detail' });
  }
});

// POST /api/calls/:id/steps — log completion of a script section
router.post('/:id/steps', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { scriptSectionId } = req.body;
    if (!scriptSectionId) { res.status(400).json({ error: 'scriptSectionId required' }); return; }
    const result = await db.query(
      `INSERT INTO call_steps (call_session_id, script_section_id) VALUES ($1, $2) RETURNING *`,
      [id, scriptSectionId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to log call step' });
  }
});

// POST /api/calls/:id/rebuttals — log a rebuttal usage
router.post('/:id/rebuttals', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { rebuttalId, objectionTypeId, scriptSectionId } = req.body;
    if (!rebuttalId || !objectionTypeId) { res.status(400).json({ error: 'rebuttalId and objectionTypeId required' }); return; }
    const result = await db.query(
      `INSERT INTO call_rebuttals (call_session_id, rebuttal_id, objection_type_id, script_section_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [id, rebuttalId, objectionTypeId, scriptSectionId ?? null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to log rebuttal usage' });
  }
});

// POST /api/calls/:id/end — end a call with outcome
router.post('/:id/end', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { outcome, notes } = req.body;
    const allowed = ['VOICEMAIL','HANGUP','PRESENTATION_ACCEPTED','INSURANCE_SOLD','INSURANCE_OFFER_REJECTED','PRESENTATION_REJECTED','NOT_QUALIFIED'];
    if (!outcome || !allowed.includes(outcome)) {
      res.status(400).json({ error: 'Valid outcome required', allowed });
      return;
    }
    const result = await db.query(
      `UPDATE call_sessions SET outcome = $1, notes = $2, ended_at = NOW() WHERE id = $3 RETURNING *`,
      [outcome, notes ?? null, id]
    );
    if (!result.rows[0]) { res.status(404).json({ error: 'Call not found' }); return; }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to end call' });
  }
});

// POST /api/calls/:id/rebuttals/custom — add a brand-new on-the-fly rebuttal from a live call
router.post('/:id/rebuttals/custom', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { objectionPhrase, yourResponse, scriptSectionId } = req.body;
    if (!objectionPhrase || !yourResponse) { res.status(400).json({ error: 'objectionPhrase and yourResponse required' }); return; }
    // Create a draft rebuttal under a generic objection type (can be re-categorized from admin)
    const firstType = await db.query('SELECT id FROM script_types LIMIT 1');
    const rebuttalResult = await db.query(
      `INSERT INTO rebuttals (script_type_id, title, content, is_custom, status)
       VALUES ($1, $2, $3, true, 'draft') RETURNING *`,
      [firstType.rows[0]?.id ?? 1, objectionPhrase, yourResponse]
    );
    const rebuttal = rebuttalResult.rows[0];
    // Log the usage so this call still has a record
    if (scriptSectionId) {
      await db.query(
        `INSERT INTO call_rebuttals (call_session_id, rebuttal_id, script_section_id) VALUES ($1, $2, $3)`,
        [id, rebuttal.id, scriptSectionId]
      );
    }
    res.status(201).json(rebuttal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create custom rebuttal' });
  }
});

export default router;

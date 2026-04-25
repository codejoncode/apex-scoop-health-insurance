import { Router } from 'express';
import db from '../db.js';

const router = Router();

// Get all script types
router.get('/script-types', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM script_types WHERE active = true ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch script types' });
  }
});

// Get rebuttals for a script type
router.get('/rebuttals/:scriptTypeId', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM rebuttals WHERE script_type_id = $1 AND active = true ORDER BY title',
      [req.params.scriptTypeId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rebuttals' });
  }
});

// Get all call outcomes
router.get('/call-outcomes', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM call_outcomes WHERE active = true ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch call outcomes' });
  }
});

// Get script sections for a script type
router.get('/script-sections/:scriptTypeId', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM script_sections WHERE script_type_id = $1 AND active = true ORDER BY section_number',
      [req.params.scriptTypeId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch script sections' });
  }
});

// Search diseases
router.get('/diseases', async (req, res) => {
  try {
    const query = req.query.q as string;
    let sql = 'SELECT * FROM diseases WHERE active = true';
    const params = [];
    if (query) {
      sql += ' AND name ILIKE $1';
      params.push(`%${query}%`);
    }
    sql += ' ORDER BY name LIMIT 10';
    const result = await db.query(sql, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch diseases' });
  }
});

// Get all insurance types
router.get('/insurance-types', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM insurance_types WHERE active = true ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch insurance types' });
  }
});

// Calculate qualification
router.post('/qualification', async (req, res) => {
  try {
    const { age, weight, height } = req.body;
    const bmi = (weight / ((height / 100) ** 2)).toFixed(2);

    const result = await db.query(
      'SELECT * FROM qualification_rules WHERE active = true AND $1 BETWEEN min_age AND max_age AND $2 BETWEEN min_weight AND max_weight AND $3 BETWEEN min_height AND max_height ORDER BY category',
      [age, weight, height]
    );

    const rules = result.rows;
    let category = 'Not Qualified';
    if (rules.length > 0) {
      category = rules[0].category;
    }

    res.json({ bmi, category, qualified: category !== 'Not Qualified' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate qualification' });
  }
});

// Create agent call record
router.post('/agent-calls', async (req, res) => {
  try {
    const { sessionId, agentId, scriptTypeId, selectedRebuttals, scriptProgress, outcomeId, notes } = req.body;
    const result = await db.query(
      'INSERT INTO agent_calls (session_id, agent_id, script_type_id, selected_rebuttals, script_progress, outcome_id, notes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [sessionId, agentId, scriptTypeId, selectedRebuttals || [], scriptProgress || 0, outcomeId, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create agent call record' });
  }
});

// Add new rebuttal
router.post('/rebuttals', async (req, res) => {
  try {
    const { scriptTypeId, title, content } = req.body;
    const result = await db.query(
      'INSERT INTO rebuttals (script_type_id, title, content) VALUES ($1, $2, $3) RETURNING *',
      [scriptTypeId, title, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create rebuttal' });
  }
});

export default router;
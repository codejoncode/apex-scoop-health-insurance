import { Router, Request, Response } from 'express';
import db from '../db.js';
import { emailService } from '../services/emailService.js';

const router = Router();

// ─── Knowledge search ─────────────────────────────────────────────────────────

async function searchKnowledgeBase(question: string): Promise<{ answer: string; confidence: number; sources: string[] }> {
  const lower = question.toLowerCase();
  const sources: string[] = [];

  // 1. Check chat_kb_entries (general Q&A)
  const kbResult = await db.query(
    `SELECT keywords, answer FROM chat_kb_entries WHERE active = true ORDER BY sort_order ASC`
  );
  let bestScore = 0;
  let bestAnswer = '';
  for (const row of kbResult.rows) {
    let score = 0;
    for (const kw of (row.keywords as string[])) {
      if (lower.includes(kw.toLowerCase())) score += kw.split(' ').length;
    }
    if (score > bestScore) { bestScore = score; bestAnswer = row.answer; }
  }
  if (bestScore >= 2) {
    sources.push('General knowledge base');
    return { answer: bestAnswer, confidence: Math.min(0.5 + bestScore * 0.05, 0.9), sources };
  }

  // 2. Check conditions (underwriting)
  const condKeywords = extractConditionKeywords(lower);
  if (condKeywords.length) {
    const condResult = await db.query(
      `SELECT name, category, qualifications FROM diseases
       WHERE active = true AND (${condKeywords.map((_,i) => `name ILIKE $${i+1}`).join(' OR ')})
       LIMIT 3`,
      condKeywords.map(k => `%${k}%`)
    );
    if (condResult.rows.length) {
      const parts = condResult.rows.map(c =>
        `**${c.name}** (${categoryLabel(c.category)}): ${c.qualifications ?? 'See AIL underwriting manual.'}`
      );
      sources.push('AIL Underwriting Manual');
      return {
        answer: `Based on AIL underwriting guidelines:\n\n${parts.join('\n\n')}\n\nFor a full qualification assessment, use the Underwriting Assistant tool or consult Jonathan directly.`,
        confidence: 0.75,
        sources,
      };
    }
  }

  // 3. Check medications
  const medKeywords = extractMedKeywords(lower);
  if (medKeywords.length) {
    const medResult = await db.query(
      `SELECT name, category, notes FROM medications
       WHERE active = true AND (${medKeywords.map((_,i) => `name ILIKE $${i+1}`).join(' OR ')})
       LIMIT 3`,
      medKeywords.map(k => `%${k}%`)
    );
    if (medResult.rows.length) {
      const parts = medResult.rows.map(m =>
        `**${m.name}** (${categoryLabel(m.category)}): ${m.notes ?? 'See AIL guidelines.'}`
      );
      sources.push('AIL Underwriting Manual — Medications');
      return {
        answer: `Based on AIL medication/underwriting guidelines:\n\n${parts.join('\n\n')}\n\nFor a complete assessment, use the Underwriting Assistant or contact Jonathan.`,
        confidence: 0.78,
        sources,
      };
    }
  }

  // 4. Check script sections (scripts/rebuttals topics)
  if (isScriptQuestion(lower)) {
    const scriptResult = await db.query(
      `SELECT st.name as script_type, ss.title, ss.content
       FROM script_sections ss JOIN script_types st ON st.id = ss.script_type_id
       WHERE ss.active = true AND (ss.title ILIKE $1 OR ss.content ILIKE $1)
       LIMIT 2`,
      [`%${question.split(' ').slice(0,3).join('%')}%`]
    );
    if (scriptResult.rows.length) {
      sources.push('AIL Call Scripts');
      return {
        answer: `From the ${scriptResult.rows[0].script_type} script (${scriptResult.rows[0].title}):\n\n${scriptResult.rows[0].content.substring(0, 400)}...`,
        confidence: 0.7,
        sources,
      };
    }
  }

  // 5. Check insurance types
  if (isProductQuestion(lower)) {
    const prodResult = await db.query(
      `SELECT name, description, details FROM insurance_types WHERE active = true AND (name ILIKE $1 OR description ILIKE $1) LIMIT 2`,
      [`%${extractProductKeyword(lower)}%`]
    );
    if (prodResult.rows.length) {
      sources.push('AIL Product Guide');
      return {
        answer: `**${prodResult.rows[0].name}**: ${prodResult.rows[0].details ?? prodResult.rows[0].description}`,
        confidence: 0.72,
        sources,
      };
    }
  }

  return { answer: '', confidence: 0, sources: [] };
}

function categoryLabel(cat: string): string {
  const map: Record<string, string> = {
    AUTO_TRIAL: 'Auto Trial', AUTO_DECLINE: 'Auto Decline', SPECIAL: 'Special Handling',
    INFO_ONLY: 'Info Only', SENIOR_TRIAL: 'Senior Trial', BLOOD_THINNER: 'Blood Thinner',
    ORGAN_REJECTION: 'Organ Rejection',
  };
  return map[cat] ?? cat;
}

function extractConditionKeywords(text: string): string[] {
  const terms = ['diabetes', 'copd', 'cancer', 'stroke', 'heart', 'lupus', 'ms', 'multiple sclerosis',
    'parkinson', 'alzheimer', 'dementia', 'kidney', 'dialysis', 'hiv', 'aids', 'cirrhosis',
    'epilepsy', 'seizure', 'bipolar', 'depression', 'asthma', 'arthritis', 'crohn'];
  return terms.filter(t => text.includes(t));
}

function extractMedKeywords(text: string): string[] {
  const terms = ['insulin', 'metformin', 'coumadin', 'warfarin', 'eliquis', 'xarelto', 'plavix',
    'aricept', 'seroquel', 'humira', 'enbrel', 'truvada', 'suboxone', 'anastrozole',
    'femara', 'lisinopril', 'metoprolol', 'atorvastatin', 'tacrolimus', 'mycophenolate'];
  return terms.filter(t => text.includes(t));
}

function isScriptQuestion(text: string): boolean {
  return ['script', 'intro', 'what do i say', 'how do i start', 'opening', 'call', 'rebuttal', 'objection'].some(k => text.includes(k));
}

function isProductQuestion(text: string): boolean {
  return ['final expense', 'term life', 'whole life', 'accident', 'cancer', 'supplemental', 'csk', 'child safe', 'will kit'].some(k => text.includes(k));
}

function extractProductKeyword(text: string): string {
  const prods = ['final expense', 'term life', 'whole life', 'accident', 'cancer', 'child safe', 'will kit'];
  return prods.find(p => text.includes(p)) ?? text.split(' ').slice(0, 2).join(' ');
}

// ─── POST /api/ask ─────────────────────────────────────────────────────────────

router.post('/', async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    if (!message?.trim()) { res.status(400).json({ error: 'message required' }); return; }

    // Check availability setting
    const settingResult = await db.query(`SELECT value FROM app_settings WHERE key = 'is_jonathan_available'`);
    const isAvailable = settingResult.rows[0]?.value === 'true';

    const { answer, confidence, sources } = await searchKnowledgeBase(message);

    const THRESHOLD = 0.65;
    const requiresSme = confidence < THRESHOLD || !answer;

    if (requiresSme) {
      const etaResult = await db.query(`SELECT value FROM app_settings WHERE key = 'sme_response_eta_hours'`);
      const eta = etaResult.rows[0]?.value ?? '24';
      const contactMessage = isAvailable
        ? `I don't want to guess on something this important. This question needs Jonathan's expertise. He's currently available and can usually respond the same day. Would you like him to review this and contact you?`
        : `I don't want to guess on something this important. Jonathan is currently with other clients, but he will research this and get back to you within ${eta} hours. Would you like to leave your contact information?`;
      res.json({ answer: contactMessage, requiresSme: true, confidence, sources });
    } else {
      const sourceNote = sources.length ? `\n\n*Source: ${sources.join(', ')}*` : '';
      res.json({ answer: answer + sourceNote, requiresSme: false, confidence, sources });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process question' });
  }
});

// ─── POST /api/ask/sme-request ────────────────────────────────────────────────

router.post('/sme-request', async (req: Request, res: Response) => {
  try {
    const { question, botAnswer, name, email, phone, bestTime, source } = req.body;
    if (!question?.trim() || !name?.trim()) {
      res.status(400).json({ error: 'question and name are required' });
      return;
    }

    const result = await db.query(
      `INSERT INTO sme_requests (question, bot_answer, name, email, phone, best_time, source)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [question, botAnswer ?? null, name, email ?? null, phone ?? null, bestTime ?? null, source ?? 'ask_page']
    );
    const smeReq = result.rows[0];

    // Send email notification
    try {
      const html = `
        <h2>New SME Request — Apex Scoop</h2>
        <p><strong>From:</strong> ${name}</p>
        ${email ? `<p><strong>Email:</strong> ${email}</p>` : ''}
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        ${bestTime ? `<p><strong>Best time to reach:</strong> ${bestTime}</p>` : ''}
        <hr>
        <p><strong>Question:</strong></p>
        <blockquote>${question.replace(/\n/g, '<br>')}</blockquote>
        ${botAnswer ? `<p><strong>Bot answered:</strong></p><blockquote>${botAnswer.replace(/\n/g, '<br>')}</blockquote>` : ''}
        <hr>
        <p><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/sme-requests">View in Admin Dashboard</a></p>
        <p><em>Request ID: ${smeReq.id}</em></p>
      `;
      await emailService.sendLeadNotification(
        process.env.EMAIL_TO || 'mrjonathanjholloway@gmail.com',
        `SME Request: ${name} — ${question.substring(0, 60)}...`,
        html
      );
    } catch (emailErr) {
      console.error('SME email failed (request still saved):', emailErr);
    }

    res.status(201).json({ success: true, id: smeReq.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit SME request' });
  }
});

// ─── GET /api/ask/sme-requests — admin inbox ──────────────────────────────────

router.get('/sme-requests', async (req: Request, res: Response) => {
  try {
    const result = await db.query(
      `SELECT * FROM sme_requests ORDER BY created_at DESC LIMIT 100`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch SME requests' });
  }
});

// PATCH /api/ask/sme-requests/:id — update status / add notes (admin)
router.patch('/sme-requests/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, admin_notes } = req.body;
    const result = await db.query(
      `UPDATE sme_requests SET status = COALESCE($1, status), admin_notes = COALESCE($2, admin_notes), updated_at = NOW()
       WHERE id = $3 RETURNING *`,
      [status ?? null, admin_notes ?? null, id]
    );
    if (!result.rows[0]) { res.status(404).json({ error: 'Not found' }); return; }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update SME request' });
  }
});

export default router;

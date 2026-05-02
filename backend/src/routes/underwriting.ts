import { Router, Request, Response } from 'express';
import db from '../db.js';

const router = Router();

// POST /api/underwriting/build — compute T-rating from height/weight/age
router.post('/build', async (req: Request, res: Response) => {
  try {
    const { heightFeet, heightInches, weight, age } = req.body;
    if (!weight || (heightFeet === undefined && heightInches === undefined)) {
      res.status(400).json({ error: 'height (feet+inches or total inches) and weight required' });
      return;
    }
    const totalInches = heightFeet !== undefined
      ? Math.round(Number(heightFeet) * 12 + Number(heightInches ?? 0))
      : Math.round(Number(heightInches));

    const isSenior = Number(age) >= 60;

    // Find exact height first, then bracket to nearest available
    const rangeResult = await db.query(
      `SELECT t_rating, min_weight, max_weight FROM build_ranges
       WHERE height_inches = $1 AND $2 BETWEEN min_weight AND max_weight
       LIMIT 1`,
      [totalInches, weight]
    );

    let tRating = 'Unknown';
    let note = '';

    if (rangeResult.rows[0]) {
      tRating = rangeResult.rows[0].t_rating;
    } else {
      // Check if weight exceeds the max on the chart for this height
      const maxResult = await db.query(
        `SELECT MAX(max_weight) as chart_max, MIN(min_weight) as chart_min
         FROM build_ranges WHERE height_inches = $1`, [totalInches]
      );
      if (maxResult.rows[0]) {
        const { chart_max, chart_min } = maxResult.rows[0];
        if (Number(weight) > Number(chart_max)) {
          tRating = 'Over Chart';
          note = 'Weight exceeds build chart maximum — likely decline for standard products.';
        } else if (Number(weight) < Number(chart_min)) {
          tRating = 'Under Chart';
          note = 'Weight is below build chart minimum — underweight trial or decline depending on product.';
        }
      }
      // Try nearest height bracket if exact match not found
      if (tRating === 'Unknown') {
        const bracketResult = await db.query(
          `SELECT t_rating FROM build_ranges
           ORDER BY ABS(height_inches - $1)
           LIMIT 1`, [totalInches]
        );
        if (bracketResult.rows[0]) tRating = bracketResult.rows[0].t_rating + ' (approx)';
      }
    }

    const ratingColor = tRating === 'Standard' ? 'green'
      : ['T2','T3','T4'].includes(tRating) ? 'yellow'
      : ['T6','T8'].includes(tRating) ? 'orange'
      : 'red';

    const summary = buildRatingSummary(tRating, isSenior, note);

    res.json({ tRating, ratingColor, summary, isSenior, heightInches: totalInches, weight: Number(weight), age: Number(age) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to compute build rating' });
  }
});

function buildRatingSummary(rating: string, isSenior: boolean, extraNote: string): string {
  const base: Record<string, string> = {
    Standard: 'Build is within standard range. No build-related rating.',
    T2: 'Slightly over standard build. Minor table rating — still very insurable.',
    T3: 'Moderate build rating. T3 on most whole life products.',
    T4: 'T4 build rating. May require trial on combo products; still qualifies for most senior whole life.',
    T6: 'T6 build rating. Trial strongly recommended for most products. Senior whole life possible.',
    T8: 'T8 build — significant overweight. Limited products available; senior graded only.',
    T10: 'T10 — severe overweight rating. Senior graded or decline likely for most products.',
    T12: isSenior ? 'T12 — auto trial for senior applications. Senior graded whole life only.' : 'T12 — likely decline for standard whole life. Senior graded possible if eligible.',
    'Over Chart': extraNote || 'Weight exceeds build chart. Likely decline.',
    'Under Chart': extraNote || 'Weight below chart minimum. Underweight trial/decline depending on product.',
  };
  return base[rating] ?? 'Build rating not determinable from available data. Manual underwriting review needed.';
}

// GET /api/underwriting/conditions — search conditions
router.get('/conditions', async (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string ?? '').trim();
    const result = await db.query(
      `SELECT id, name, description as notes, qualifications, category, is_senior_only
       FROM diseases
       WHERE active = true ${q ? "AND name ILIKE $1" : ''}
       ORDER BY
         CASE category WHEN 'AUTO_DECLINE' THEN 1 WHEN 'AUTO_TRIAL' THEN 2 WHEN 'SPECIAL' THEN 3 ELSE 4 END,
         name
       LIMIT 20`,
      q ? [`%${q}%`] : []
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to search conditions' });
  }
});

// GET /api/underwriting/medications — search medications
router.get('/medications', async (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string ?? '').trim();
    const result = await db.query(
      `SELECT id, name, category, notes, is_senior_only
       FROM medications
       WHERE active = true ${q ? "AND name ILIKE $1" : ''}
       ORDER BY
         CASE category WHEN 'AUTO_DECLINE' THEN 1 WHEN 'ORGAN_REJECTION' THEN 2 WHEN 'AUTO_TRIAL' THEN 3 WHEN 'BLOOD_THINNER' THEN 4 WHEN 'SENIOR_TRIAL' THEN 5 ELSE 6 END,
         name
       LIMIT 20`,
      q ? [`%${q}%`] : []
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to search medications' });
  }
});

// POST /api/underwriting/assess — full assessment: build + conditions + meds → overall status
router.post('/assess', async (req: Request, res: Response) => {
  try {
    const { tRating, conditionIds, medicationIds, age } = req.body;
    const isSenior = Number(age) >= 60;
    const flags: string[] = [];
    let overallStatus: 'STANDARD' | 'TRIAL' | 'DECLINE' = 'STANDARD';

    // Build-based flags
    if (tRating === 'Over Chart' || tRating === 'Under Chart') {
      flags.push(`Build: ${tRating} — likely decline`);
      overallStatus = 'DECLINE';
    } else if (['T10','T12'].includes(tRating)) {
      flags.push(`Build: ${tRating} — significant rating`);
      if (overallStatus !== 'DECLINE') overallStatus = 'TRIAL';
    } else if (['T6','T8'].includes(tRating)) {
      flags.push(`Build: ${tRating} — rated`);
      if (overallStatus === 'STANDARD') overallStatus = 'TRIAL';
    }

    // Condition-based flags
    if (conditionIds?.length) {
      const condResult = await db.query(
        `SELECT name, category, is_senior_only FROM diseases WHERE id = ANY($1::int[])`,
        [conditionIds]
      );
      for (const c of condResult.rows) {
        if (c.category === 'AUTO_DECLINE') {
          flags.push(`Condition: ${c.name} — AUTO DECLINE`);
          overallStatus = 'DECLINE';
        } else if (c.category === 'AUTO_TRIAL' || c.category === 'SPECIAL') {
          flags.push(`Condition: ${c.name} — Auto trial`);
          if (overallStatus === 'STANDARD') overallStatus = 'TRIAL';
        }
      }
    }

    // Medication-based flags
    if (medicationIds?.length) {
      const medResult = await db.query(
        `SELECT name, category, is_senior_only FROM medications WHERE id = ANY($1::int[])`,
        [medicationIds]
      );
      for (const m of medResult.rows) {
        if (m.category === 'ORGAN_REJECTION') {
          flags.push(`Medication: ${m.name} — confirms organ transplant, AUTO DECLINE`);
          overallStatus = 'DECLINE';
        } else if (m.category === 'AUTO_DECLINE') {
          flags.push(`Medication: ${m.name} — AUTO DECLINE`);
          overallStatus = 'DECLINE';
        } else if (['AUTO_TRIAL','BLOOD_THINNER','SENIOR_TRIAL'].includes(m.category)) {
          flags.push(`Medication: ${m.name} — trial (${m.category.replace('_',' ').toLowerCase()})`);
          if (overallStatus === 'STANDARD') overallStatus = 'TRIAL';
        }
      }
    }

    const statusLabel = overallStatus === 'STANDARD' ? 'Standard / Possibly T2–T4'
      : overallStatus === 'TRIAL' ? 'Trial Strongly Recommended'
      : 'Likely Decline';

    const statusColor = overallStatus === 'STANDARD' ? 'green'
      : overallStatus === 'TRIAL' ? 'yellow'
      : 'red';

    const recommendations = overallStatus === 'DECLINE'
      ? ['Senior Graded Whole Life may still be possible', 'AD&D / Accident coverage may qualify regardless', 'Verify all conditions before final determination']
      : overallStatus === 'TRIAL'
      ? ['Senior Whole Life (graded or standard depending on build)', 'Final Expense plans with trial provisions', 'Supplemental accident coverage likely qualifies']
      : ['Standard Whole Life products', 'Term life at preferred or standard rates', 'Full suite of AIL products likely available'];

    res.json({ overallStatus, statusLabel, statusColor, flags, recommendations, isSenior });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to assess underwriting' });
  }
});

export default router;

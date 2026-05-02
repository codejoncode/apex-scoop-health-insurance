-- ============================================================
-- Migration 002: Call Tracking, Underwriting, SME Escalation
-- ============================================================

-- Proper call sessions (replaces the limited agent_calls table)
CREATE TABLE IF NOT EXISTS call_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id INTEGER REFERENCES leads(id) ON DELETE SET NULL,
  script_type_id INTEGER REFERENCES script_types(id),
  agent_id INTEGER REFERENCES admin_users(id),
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  outcome VARCHAR(50) CHECK (outcome IN (
    'VOICEMAIL','HANGUP','PRESENTATION_ACCEPTED',
    'INSURANCE_SOLD','INSURANCE_OFFER_REJECTED',
    'PRESENTATION_REJECTED','NOT_QUALIFIED'
  )),
  notes TEXT,
  source VARCHAR(20) NOT NULL DEFAULT 'phone' CHECK (source IN ('phone','chat','bot'))
);

-- Step-by-step script section completion log
CREATE TABLE IF NOT EXISTS call_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  call_session_id UUID NOT NULL REFERENCES call_sessions(id) ON DELETE CASCADE,
  script_section_id INTEGER NOT NULL REFERENCES script_sections(id),
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Structured objection categories
CREATE TABLE IF NOT EXISTS objection_types (
  id VARCHAR(50) PRIMARY KEY,            -- e.g. 'NOT_INTERESTED'
  label TEXT NOT NULL,                   -- "I'm not interested"
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0
);

-- Add objection linkage + extras to existing rebuttals table
ALTER TABLE rebuttals
  ADD COLUMN IF NOT EXISTS objection_type_id VARCHAR(50) REFERENCES objection_types(id),
  ADD COLUMN IF NOT EXISTS nlp_notes TEXT,
  ADD COLUMN IF NOT EXISTS is_custom BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'active'
    CHECK (status IN ('active','draft','deprecated'));

-- Log which rebuttal was used at which point in a call
CREATE TABLE IF NOT EXISTS call_rebuttals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  call_session_id UUID NOT NULL REFERENCES call_sessions(id) ON DELETE CASCADE,
  script_section_id INTEGER REFERENCES script_sections(id),
  objection_type_id VARCHAR(50) REFERENCES objection_types(id),
  rebuttal_id INTEGER NOT NULL REFERENCES rebuttals(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Build chart: height (inches) + weight range → T-rating
CREATE TABLE IF NOT EXISTS build_ranges (
  id SERIAL PRIMARY KEY,
  height_inches INTEGER NOT NULL,
  min_weight INTEGER NOT NULL,
  max_weight INTEGER NOT NULL,
  t_rating VARCHAR(20) NOT NULL,   -- 'Standard', 'T2', 'T3', 'T4', 'T6', 'T8', 'T10', 'T12'
  sex VARCHAR(10) NOT NULL DEFAULT 'any' CHECK (sex IN ('male','female','any'))
);

-- Add category to diseases table for underwriting decisions
ALTER TABLE diseases
  ADD COLUMN IF NOT EXISTS category VARCHAR(30) DEFAULT 'INFO_ONLY'
    CHECK (category IN ('AUTO_TRIAL','AUTO_DECLINE','SPECIAL','INFO_ONLY')),
  ADD COLUMN IF NOT EXISTS is_senior_only BOOLEAN NOT NULL DEFAULT FALSE;

-- Medications (separate from diseases; different underwriting rules)
CREATE TABLE IF NOT EXISTS medications (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category VARCHAR(30) NOT NULL DEFAULT 'INFO_ONLY'
    CHECK (category IN ('AUTO_TRIAL','AUTO_DECLINE','SENIOR_TRIAL','BLOOD_THINNER','ORGAN_REJECTION','INFO_ONLY')),
  notes TEXT,
  is_senior_only BOOLEAN NOT NULL DEFAULT FALSE,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

-- SME escalation inbox: questions the bot couldn't answer
CREATE TABLE IF NOT EXISTS sme_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  bot_answer TEXT,                       -- what the bot said before escalating
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  best_time TEXT,
  source VARCHAR(30) NOT NULL DEFAULT 'ask_page',
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING'
    CHECK (status IN ('PENDING','IN_PROGRESS','DONE')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- App-level settings (availability toggle, goals, etc.)
CREATE TABLE IF NOT EXISTS app_settings (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO app_settings (key, value) VALUES
  ('is_jonathan_available', 'true'),
  ('sme_response_eta_hours', '24'),
  ('weekly_calls_target', '750'),
  ('weekly_appointments_target', '36'),
  ('weekly_presentations_target', '12'),
  ('weekly_sales_target', '3'),
  ('weekly_alp_target', '2000'),
  ('commission_percent', '50')
ON CONFLICT (key) DO NOTHING;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_call_sessions_agent ON call_sessions(agent_id);
CREATE INDEX IF NOT EXISTS idx_call_sessions_outcome ON call_sessions(outcome);
CREATE INDEX IF NOT EXISTS idx_call_sessions_started ON call_sessions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_call_steps_session ON call_steps(call_session_id);
CREATE INDEX IF NOT EXISTS idx_call_rebuttals_session ON call_rebuttals(call_session_id);
CREATE INDEX IF NOT EXISTS idx_rebuttals_objection ON rebuttals(objection_type_id);
CREATE INDEX IF NOT EXISTS idx_build_ranges_height ON build_ranges(height_inches);
CREATE INDEX IF NOT EXISTS idx_medications_name ON medications(name);
CREATE INDEX IF NOT EXISTS idx_medications_category ON medications(category);
CREATE INDEX IF NOT EXISTS idx_sme_requests_status ON sme_requests(status);
CREATE INDEX IF NOT EXISTS idx_sme_requests_created ON sme_requests(created_at DESC);

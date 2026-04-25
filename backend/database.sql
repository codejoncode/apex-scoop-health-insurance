-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  message TEXT,
  status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'rejected', 'escalated')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt VARCHAR(500),
  author VARCHAR(255) DEFAULT 'ApexScoop',
  image_url VARCHAR(500),
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id VARCHAR(36) PRIMARY KEY,
  visitor_name VARCHAR(255),
  visitor_email VARCHAR(255),
  visitor_phone VARCHAR(20),
  status VARCHAR(20) DEFAULT 'bot' CHECK (status IN ('bot', 'agent_live', 'closed')),
  agent_id INTEGER REFERENCES admin_users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(36) NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('visitor', 'bot', 'agent')),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create knowledge base entries table (editable via admin UI)
CREATE TABLE IF NOT EXISTS chat_kb_entries (
  id SERIAL PRIMARY KEY,
  keywords TEXT[] NOT NULL,
  answer TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create script types table
CREATE TABLE IF NOT EXISTS script_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create rebuttals table
CREATE TABLE IF NOT EXISTS rebuttals (
  id SERIAL PRIMARY KEY,
  script_type_id INTEGER NOT NULL REFERENCES script_types(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create call outcomes table
CREATE TABLE IF NOT EXISTS call_outcomes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create agent calls table (for tracking calls and outcomes)
CREATE TABLE IF NOT EXISTS agent_calls (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(36) NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  agent_id INTEGER NOT NULL REFERENCES admin_users(id),
  script_type_id INTEGER REFERENCES script_types(id),
  selected_rebuttals INTEGER[], -- array of rebuttal ids
  script_progress INTEGER DEFAULT 0, -- which section reached
  outcome_id INTEGER REFERENCES call_outcomes(id),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create script sections table
CREATE TABLE IF NOT EXISTS script_sections (
  id SERIAL PRIMARY KEY,
  script_type_id INTEGER NOT NULL REFERENCES script_types(id) ON DELETE CASCADE,
  section_number INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create diseases/ailments table
CREATE TABLE IF NOT EXISTS diseases (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  qualifications TEXT, -- what it qualifies for
  restrictions TEXT, -- any restrictions
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create insurance types table
CREATE TABLE IF NOT EXISTS insurance_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  details TEXT, -- comprehensive details
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create qualification rules table (for calculator)
CREATE TABLE IF NOT EXISTS qualification_rules (
  id SERIAL PRIMARY KEY,
  min_age INTEGER,
  max_age INTEGER,
  min_weight INTEGER,
  max_weight INTEGER,
  min_height INTEGER, -- in inches
  max_height INTEGER,
  bmi_min DECIMAL(4,2),
  bmi_max DECIMAL(4,2),
  category VARCHAR(50), -- T4, T6, T12, etc.
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_status ON chat_sessions(status);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_created ON chat_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_kb_active ON chat_kb_entries(active);
CREATE INDEX IF NOT EXISTS idx_kb_sort ON chat_kb_entries(sort_order ASC);
CREATE INDEX IF NOT EXISTS idx_script_types_active ON script_types(active);
CREATE INDEX IF NOT EXISTS idx_rebuttals_script ON rebuttals(script_type_id);
CREATE INDEX IF NOT EXISTS idx_rebuttals_active ON rebuttals(active);
CREATE INDEX IF NOT EXISTS idx_agent_calls_session ON agent_calls(session_id);
CREATE INDEX IF NOT EXISTS idx_agent_calls_agent ON agent_calls(agent_id);
CREATE INDEX IF NOT EXISTS idx_script_sections_script ON script_sections(script_type_id);
CREATE INDEX IF NOT EXISTS idx_diseases_active ON diseases(active);
CREATE INDEX IF NOT EXISTS idx_insurance_types_active ON insurance_types(active);
CREATE INDEX IF NOT EXISTS idx_qualification_rules_active ON qualification_rules(active);

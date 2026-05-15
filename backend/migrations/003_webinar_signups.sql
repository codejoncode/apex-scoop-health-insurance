-- Webinar signup registrations
CREATE TABLE IF NOT EXISTS webinar_signups (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(255)  NOT NULL,
  email       VARCHAR(255)  NOT NULL,
  phone       VARCHAR(50),
  topic       VARCHAR(255)  NOT NULL,
  status      VARCHAR(50)   NOT NULL DEFAULT 'pending',  -- pending | confirmed | attended | cancelled
  notes       TEXT,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_webinar_signups_topic   ON webinar_signups (topic);
CREATE INDEX IF NOT EXISTS idx_webinar_signups_status  ON webinar_signups (status);
CREATE INDEX IF NOT EXISTS idx_webinar_signups_email   ON webinar_signups (email);

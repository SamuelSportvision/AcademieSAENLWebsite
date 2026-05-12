-- Per-sport configuration table.
-- Allows admins to override individual sport settings (e.g. registration URL)
-- without a code deploy. Falls back to the static data/sports.ts values when
-- no row exists for a given slug.

CREATE TABLE IF NOT EXISTS sport_config (
  slug             TEXT        PRIMARY KEY,
  registration_url TEXT        NOT NULL DEFAULT '',
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE sport_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read sport config" ON sport_config;
CREATE POLICY "Public read sport config"
  ON sport_config FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated write sport config" ON sport_config;
CREATE POLICY "Authenticated write sport config"
  ON sport_config FOR ALL
  USING (auth.role() = 'authenticated');

-- Seed with the TeamSnap URL for all current sports.
-- Re-running is safe (ON CONFLICT (slug) DO NOTHING).
INSERT INTO sport_config (slug, registration_url) VALUES
  ('hockey',       'https://go.teamsnap.com/forms/518037'),
  ('cheerleading', 'https://go.teamsnap.com/forms/518037'),
  ('volleyball',   'https://go.teamsnap.com/forms/518037'),
  ('baseball',     'https://go.teamsnap.com/forms/518037'),
  ('basketball',   'https://go.teamsnap.com/forms/518037'),
  ('boxing',       'https://go.teamsnap.com/forms/518037'),
  ('dance',        'https://go.teamsnap.com/forms/518037'),
  ('soccer',       'https://go.teamsnap.com/forms/518037')
ON CONFLICT (slug) DO NOTHING;

-- Run this in the Supabase SQL Editor to set up all features.
-- Re-running is safe: all statements use IF NOT EXISTS / OR REPLACE.

CREATE TABLE IF NOT EXISTS schedule_events (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  day         TEXT        NOT NULL
                CHECK (day IN ('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday')),
  sport_slug  TEXT        NOT NULL,
  sport_name  TEXT        NOT NULL,
  start_time  TEXT        NOT NULL,  -- "15:00" 24-hour format
  end_time    TEXT        NOT NULL,  -- "17:00" 24-hour format
  location    TEXT,
  color       TEXT        NOT NULL DEFAULT '#C9A84C',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE schedule_events ENABLE ROW LEVEL SECURITY;

-- Anyone can read the schedule (public calendar)
CREATE POLICY "Public read access"
  ON schedule_events FOR SELECT
  USING (true);

-- Only authenticated users can write
CREATE POLICY "Authenticated write access"
  ON schedule_events FOR ALL
  USING (auth.role() = 'authenticated');

-- ─── SEED: Schedule Events ───────────────────────────────────────────────────
-- Times are placeholders (3:00–5:00 PM) — update per sport via the admin panel.
-- R in the schedule image = Thursday.

INSERT INTO schedule_events (day, sport_slug, sport_name, start_time, end_time, location, color) VALUES
  -- Hockey · M T
  ('Monday',    'hockey',       'Hockey',       '15:00', '17:00', 'Xtreme Hockey',          '#3B82F6'),
  ('Tuesday',   'hockey',       'Hockey',       '15:00', '17:00', 'Xtreme Hockey',          '#3B82F6'),
  -- Cheerleading · M T W R
  ('Monday',    'cheerleading', 'Cheerleading', '15:00', '17:00', 'Cheer Sport Sharks',     '#EC4899'),
  ('Tuesday',   'cheerleading', 'Cheerleading', '15:00', '17:00', 'Cheer Sport Sharks',     '#EC4899'),
  ('Wednesday', 'cheerleading', 'Cheerleading', '15:00', '17:00', 'Cheer Sport Sharks',     '#EC4899'),
  ('Thursday',  'cheerleading', 'Cheerleading', '15:00', '17:00', 'Cheer Sport Sharks',     '#EC4899'),
  -- Volleyball · M T W R
  ('Monday',    'volleyball',   'Volleyball',   '15:00', '17:00', 'The Court House',        '#F59E0B'),
  ('Tuesday',   'volleyball',   'Volleyball',   '15:00', '17:00', 'The Court House',        '#F59E0B'),
  ('Wednesday', 'volleyball',   'Volleyball',   '15:00', '17:00', 'The Court House',        '#F59E0B'),
  ('Thursday',  'volleyball',   'Volleyball',   '15:00', '17:00', 'The Court House',        '#F59E0B'),
  -- Baseball · T W R
  ('Tuesday',   'baseball',     'Baseball',     '15:00', '17:00', 'Premier Sports Academy', '#10B981'),
  ('Wednesday', 'baseball',     'Baseball',     '15:00', '17:00', 'Premier Sports Academy', '#10B981'),
  ('Thursday',  'baseball',     'Baseball',     '15:00', '17:00', 'Premier Sports Academy', '#10B981'),
  -- Basketball · T R
  ('Tuesday',   'basketball',   'Basketball',   '15:00', '17:00', 'CE23 Basketball',        '#F97316'),
  ('Thursday',  'basketball',   'Basketball',   '15:00', '17:00', 'CE23 Basketball',        '#F97316'),
  -- Boxing · R
  ('Thursday',  'boxing',       'Boxing',       '15:00', '17:00', 'NL Boxing',              '#EF4444'),
  -- Dance · M T
  ('Monday',    'dance',        'Dance',        '15:00', '17:00', 'The Dance Academy',      '#A855F7'),
  ('Tuesday',   'dance',        'Dance',        '15:00', '17:00', 'The Dance Academy',      '#A855F7'),
  -- Soccer · M T
  ('Monday',    'soccer',       'Soccer',       '15:00', '17:00', 'Pro Touch Academy',      '#22C55E'),
  ('Tuesday',   'soccer',       'Soccer',       '15:00', '17:00', 'Pro Touch Academy',      '#22C55E')
ON CONFLICT DO NOTHING;

-- ─── FAQ ────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS faqs (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  category    TEXT        NOT NULL
                CHECK (category IN ('General', 'Registration', 'Tax & Finances')),
  question    TEXT        NOT NULL,
  answer      TEXT        NOT NULL,
  sort_order  INTEGER     NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read faqs"
  ON faqs FOR SELECT
  USING (true);

CREATE POLICY "Authenticated write faqs"
  ON faqs FOR ALL
  USING (auth.role() = 'authenticated');

-- ─── SCHOOLS ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS schools (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT        NOT NULL,
  level       TEXT        NOT NULL
                CHECK (level IN ('Elementary', 'Intermediate', 'Other')),
  sort_order  INTEGER     NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE schools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read schools"
  ON schools FOR SELECT
  USING (true);

CREATE POLICY "Authenticated write schools"
  ON schools FOR ALL
  USING (auth.role() = 'authenticated');

-- ─── SEED: Schools ──────────────────────────────────────────────────────────
-- Run once after creating the table. Safe to re-run if the table is empty.

INSERT INTO schools (name, level, sort_order) VALUES
  ('Admirals Academy',                'Other',        0),
  ('Beachy Cove Elementary',          'Elementary',   0),
  ('Bishop Abraham',                  'Other',        0),
  ('Bishop Field Elementary',         'Elementary',   0),
  ('Brookside Intermediate',          'Intermediate', 0),
  ('Cape St. Francis Elementary',     'Elementary',   0),
  ('Cowan Heights Elementary',        'Elementary',   0),
  ('East Point Elementary',           'Elementary',   0),
  ('Ecole des Grands-Vents',          'Other',        0),
  ('Elizabeth Park Elementary',       'Elementary',   0),
  ('Goulds Elementary',               'Elementary',   0),
  ('Hazelwood Elementary',            'Elementary',   0),
  ('Holy Family Elementary',          'Elementary',   0),
  ('Holy Trinity Elementary',         'Elementary',   0),
  ('Juniper Ridge Intermediate',      'Intermediate', 0),
  ('L''ecole Rocher-du-Nord',         'Other',        0),
  ('Lakecrest Independent School',    'Other',        0),
  ('Larkhall Academy',                'Other',        0),
  ('Learys Brook Junior High',        'Intermediate', 0),
  ('Macdonald Drive Elementary',      'Elementary',   0),
  ('Mary Queen of Peace',             'Elementary',   0),
  ('Mary Queen of the World',         'Elementary',   0),
  ('Morris Academy',                  'Other',        0),
  ('Mount Pearl Intermediate',        'Intermediate', 0),
  ('Newtown Elementary School',       'Elementary',   0),
  ('Octagon Pond School',             'Other',        0),
  ('Paradise Elementary',             'Elementary',   0),
  ('Paradise Intermediate',           'Intermediate', 0),
  ('Rennie''s River Elementary',      'Elementary',   0),
  ('Roncalli Elementary',             'Elementary',   0),
  ('St. Andrew''s Elementary',        'Elementary',   0),
  ('St. Bonaventure''s College',      'Other',        0),
  ('St. Edwards School',              'Other',        0),
  ('St. Georges Elementary',          'Elementary',   0),
  ('St. John Bosco',                  'Elementary',   0),
  ('St. Kevins Junior High',          'Intermediate', 0),
  ('St. Mary''s Elementary',          'Elementary',   0),
  ('St. Matthew''s School',           'Other',        0),
  ('St. Peter''s Primary',            'Elementary',   0),
  ('St. Teresas School/Ecole',        'Other',        0),
  ('St. Francis of Assisi',           'Elementary',   0),
  ('Topsail Elementary',              'Elementary',   0),
  ('Upper Gullies Elementary',        'Elementary',   0),
  ('Vanier Elementary',               'Elementary',   0),
  ('Villanova Junior High',           'Intermediate', 0)
ON CONFLICT DO NOTHING;

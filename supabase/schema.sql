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

-- ─── SPORT PAGE SECTIONS ────────────────────────────────────────────────────
-- Flexible content sections for each sport's public page (CMS-driven).
-- section_type options: 'text' | 'highlights' | 'image_text' | 'stats' | 'cta'
-- content is a JSONB object whose shape varies by section_type:
--   text        → { body: string }
--   highlights  → { items: string[] }
--   image_text  → { image_url: string, body: string, image_side: "left"|"right" }
--   stats       → { items: { label: string, value: string }[] }
--   cta         → { heading: string, body?: string, button_label: string, button_url: string, button_style: "primary"|"secondary" }

CREATE TABLE IF NOT EXISTS sport_page_sections (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  sport_slug   TEXT        NOT NULL,
  section_type TEXT        NOT NULL
                 CHECK (section_type IN ('text','highlights','image_text','stats','cta')),
  title        TEXT,
  content      JSONB       NOT NULL DEFAULT '{}',
  sort_order   INTEGER     NOT NULL DEFAULT 0,
  is_visible   BOOLEAN     NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE sport_page_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read sport sections"
  ON sport_page_sections FOR SELECT
  USING (true);

CREATE POLICY "Authenticated write sport sections"
  ON sport_page_sections FOR ALL
  USING (auth.role() = 'authenticated');

-- Trigger to keep updated_at current
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS sport_page_sections_updated_at ON sport_page_sections;
CREATE TRIGGER sport_page_sections_updated_at
  BEFORE UPDATE ON sport_page_sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── SEED: Sport Page Sections ───────────────────────────────────────────────
-- Pre-populated from static data/sports.ts so every sport starts with content.

INSERT INTO sport_page_sections (sport_slug, section_type, title, content, sort_order) VALUES
  -- Hockey
  ('hockey', 'text', 'About',
   '{"body":"Our Hockey program gives athletes the ice time and coaching they need to develop at an elite level."}',
   0),
  ('hockey', 'highlights', 'Program Highlights',
   '{"items":["Weekly on-ice training sessions","Qualified and experienced coaching staff","Partner program: Xtreme Hockey"]}',
   1),

  -- Cheerleading
  ('cheerleading', 'text', 'About',
   '{"body":"Our Cheerleading program combines athleticism, artistry, and teamwork. Athletes train weekly with qualified coaches in a supportive environment that nurtures both sport performance and personal growth."}',
   0),
  ('cheerleading', 'highlights', 'Program Highlights',
   '{"items":["Weekly practice with certified coaches","Strength and conditioning included","Partner program: Cheer Sport Sharks"]}',
   1),

  -- Volleyball
  ('volleyball', 'text', 'About',
   '{"body":"Partnered with The Court House, our Volleyball program gives dedicated athletes weekly court time and expert coaching to develop their skills at a high level."}',
   0),
  ('volleyball', 'highlights', 'Program Highlights',
   '{"items":["Weekly training with experienced coaches","Technical and tactical skill development","Partner facility: The Court House"]}',
   1),

  -- Baseball
  ('baseball', 'text', 'About',
   '{"body":"In partnership with Premier Sports Academy, our Baseball program provides a structured weekly training environment for players who want to take their game to the next level."}',
   0),
  ('baseball', 'highlights', 'Program Highlights',
   '{"items":["Weekly hitting, fielding, and pitching sessions","Coaching from Premier Sports Academy staff","Focus on fundamentals and game IQ"]}',
   1),

  -- Basketball
  ('basketball', 'text', 'About',
   '{"body":"Our Basketball program, developed in partnership with CE23 Basketball, offers weekly training sessions focused on skill development, team play, and athletic growth."}',
   0),
  ('basketball', 'highlights', 'Program Highlights',
   '{"items":["Weekly skill development sessions","Partner program: CE23 Basketball","Individual and team-based coaching"]}',
   1),

  -- Boxing
  ('boxing', 'text', 'About',
   '{"body":"Our Boxing program develops discipline, mental toughness, and physical conditioning in a safe and structured environment. Athletes train weekly under qualified coaches."}',
   0),
  ('boxing', 'highlights', 'Program Highlights',
   '{"items":["Weekly training with qualified boxing coaches","Focus on technique, fitness, and mental strength","Partner program: NL Boxing"]}',
   1),

  -- Dance
  ('dance', 'text', 'About',
   '{"body":"Partnered with The Dance Academy, our Dance program allows aspiring dancers to train weekly in a professional environment."}',
   0),
  ('dance', 'highlights', 'Program Highlights',
   '{"items":["Weekly dance training with professional instructors","Partner facility: The Dance Academy","Multiple styles and disciplines available"]}',
   1),

  -- Soccer
  ('soccer', 'text', 'About',
   '{"body":"Our Soccer program provides athletes with weekly training sessions focused on technical development, tactical understanding, and physical conditioning."}',
   0),
  ('soccer', 'highlights', 'Program Highlights',
   '{"items":["Weekly technical and tactical training","Conditioning and game preparation","Partner program: Pro Touch Academy"]}',
   1)

ON CONFLICT DO NOTHING;

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

-- ─── FORMS ───────────────────────────────────────────────────────────────────
-- General-purpose form builder. Each form is hosted at /forms/[slug].

CREATE TABLE IF NOT EXISTS forms (
  id                 UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name               TEXT        NOT NULL,
  slug               TEXT        NOT NULL UNIQUE,
  description        TEXT,
  success_message    TEXT        NOT NULL DEFAULT 'Thank you! Your response has been submitted.',
  notification_email TEXT,
  is_active          BOOLEAN     NOT NULL DEFAULT true,
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  updated_at         TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active forms"  ON forms FOR SELECT USING (true);
CREATE POLICY "Authenticated write forms" ON forms FOR ALL USING (auth.role() = 'authenticated');

DROP TRIGGER IF EXISTS forms_updated_at ON forms;
CREATE TRIGGER forms_updated_at
  BEFORE UPDATE ON forms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── FORM FIELDS ─────────────────────────────────────────────────────────────
-- field_type: text | email | phone | number | date | textarea | select | checkbox

CREATE TABLE IF NOT EXISTS form_fields (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id     UUID        NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  field_type  TEXT        NOT NULL
                CHECK (field_type IN ('text','email','phone','number','date','textarea','select','checkbox')),
  label       TEXT        NOT NULL,
  placeholder TEXT,
  options     JSONB,        -- string[] for select dropdowns
  required    BOOLEAN     NOT NULL DEFAULT false,
  sort_order  INTEGER     NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE form_fields ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read form fields"        ON form_fields FOR SELECT USING (true);
CREATE POLICY "Authenticated write form fields" ON form_fields FOR ALL USING (auth.role() = 'authenticated');

-- ─── FORM SUBMISSIONS ────────────────────────────────────────────────────────
-- data is a JSONB object: { "Field Label": "submitted value", … }

CREATE TABLE IF NOT EXISTS form_submissions (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id      UUID        NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  data         JSONB       NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert submissions"          ON form_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated read submissions"     ON form_submissions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated delete submissions"   ON form_submissions FOR DELETE USING (auth.role() = 'authenticated');

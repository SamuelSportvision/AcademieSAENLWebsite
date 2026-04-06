-- Run this in the Supabase SQL Editor to set up the schedule feature.

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

-- Optional: seed a few example events to get started
-- INSERT INTO schedule_events (day, sport_slug, sport_name, start_time, end_time, location, color) VALUES
--   ('Monday',    'hockey',     'Hockey',     '15:00', '17:00', 'Ice Rink',      '#3B82F6'),
--   ('Tuesday',   'volleyball', 'Volleyball', '15:00', '17:00', 'The Court House','#F59E0B'),
--   ('Wednesday', 'basketball', 'Basketball', '15:30', '17:30', 'Gym A',         '#F97316');

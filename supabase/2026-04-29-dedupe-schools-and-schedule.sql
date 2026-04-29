-- One-shot cleanup: deduplicate the `schools` and `schedule_events` tables and
-- enforce uniqueness so re-running the schema file can never re-introduce
-- duplicates again.
--
-- Why duplicates happened: schema.sql ended both seed blocks with
-- `ON CONFLICT DO NOTHING`, but neither table had a unique constraint on the
-- natural key. Without a conflict target the ON CONFLICT clause is a no-op,
-- so every re-run of the schema inserted a fresh copy of every seeded row.
--
-- Safe to run repeatedly. The whole thing runs in a single transaction.

BEGIN;

-- ── 1. Schools: keep the oldest row per name, drop the rest ─────────────────
DELETE FROM schools a
USING  schools b
WHERE  a.name = b.name
  AND  (a.created_at, a.id) > (b.created_at, b.id);

-- Now that names are unique, enforce it at the schema level.
ALTER TABLE schools
  DROP CONSTRAINT IF EXISTS schools_name_key;
ALTER TABLE schools
  ADD  CONSTRAINT schools_name_key UNIQUE (name);

-- ── 2. Schedule events: keep the oldest row per natural slot ────────────────
-- A "slot" is the same sport, same day, same start time, same location.
DELETE FROM schedule_events a
USING  schedule_events b
WHERE  a.day        = b.day
  AND  a.sport_slug = b.sport_slug
  AND  a.start_time = b.start_time
  AND  COALESCE(a.location, '') = COALESCE(b.location, '')
  AND  (a.created_at, a.id) > (b.created_at, b.id);

DROP INDEX IF EXISTS schedule_events_unique_slot;
CREATE UNIQUE INDEX schedule_events_unique_slot
  ON schedule_events (day, sport_slug, start_time, location);

COMMIT;

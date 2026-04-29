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

-- ── 1. Schools: keep the first row per name, drop the rest ──────────────────
-- Uses ROW_NUMBER so every group keeps exactly one row, even when several
-- rows share the same created_at (which happens when the seed inserted them
-- all in one batch).
WITH ranked AS (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY name
           ORDER BY     created_at, id
         ) AS rn
  FROM   schools
)
DELETE FROM schools
WHERE  id IN (SELECT id FROM ranked WHERE rn > 1);

-- Now that names are unique, enforce it at the schema level.
ALTER TABLE schools
  DROP CONSTRAINT IF EXISTS schools_name_key;
ALTER TABLE schools
  ADD  CONSTRAINT schools_name_key UNIQUE (name);

-- ── 2. Schedule events: keep the first row per natural slot ─────────────────
-- A "slot" is the same sport, same day, same start time, same location.
WITH ranked AS (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY day, sport_slug, start_time, COALESCE(location, '')
           ORDER BY     created_at, id
         ) AS rn
  FROM   schedule_events
)
DELETE FROM schedule_events
WHERE  id IN (SELECT id FROM ranked WHERE rn > 1);

DROP INDEX IF EXISTS schedule_events_unique_slot;
CREATE UNIQUE INDEX schedule_events_unique_slot
  ON schedule_events (day, sport_slug, start_time, location);

COMMIT;

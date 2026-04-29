-- ─────────────────────────────────────────────────────────────────────────────
-- 2026-04-26 · Repositioning copy update
--
-- Aligns the live FAQ rows in Supabase with the new positioning:
--   • Elite After-School Development Program language
--   • $62.50/day value breakdown
--   • Pricing-objection answer
--   • Waitlist funnel (instead of "Register Now")
--
-- Safe to run multiple times. Updates are matched by category + question.
-- Inserts are guarded with NOT EXISTS so re-running is idempotent.
--
-- How to apply:
--   1. Open Supabase Studio → SQL Editor
--   2. Paste this file's contents and click "Run"
--   (or) `supabase db query < supabase/2026-04-26-repositioning-copy.sql`
-- ─────────────────────────────────────────────────────────────────────────────

BEGIN;

-- 1. Reposition the lead "What is SAE Academy?" answer ─────────────────────────
UPDATE faqs
SET answer = 'Sports, Arts, Education Academy (SAE Academy) is an Elite After-School Development Program that combines structured weekly development in sport or art with qualified coaching. We partner with established local sports organizations to give athletes and artists the time, facilities, and coaching they need to develop at a high level.'
WHERE category = 'General'
  AND question = 'What is the Sports, Arts, Education Academy?';

-- 2. Rename "How do I register?" → "How do I join the waitlist?" ───────────────
UPDATE faqs
SET
  question = 'How do I join the waitlist?',
  answer   = 'Spots are filled on a first-come, first-served basis through our waitlist. You can join from any sport page or from the navigation bar — click ''Join the Waitlist'' on the program of your choice and complete the short form. Once a seat opens up, we''ll be in touch to confirm your spot.'
WHERE category = 'Registration'
  AND question = 'How do I register?';

-- 3. NEW · "What's included in the $62.50/day program fee?" (General) ──────────
INSERT INTO faqs (category, question, answer, sort_order)
SELECT
  'General',
  'What''s included in the $62.50/day program fee?',
  E'The daily fee covers a complete, end-to-end after-school solution — far more than just a practice. Each day includes:\n\n• School pickup at the end of the school day\n• Safe, supervised transportation to the training facility\n• 1.5 hours of structured, sport-specific instruction\n• Elite coaching from qualified partner organizations\n• Access to premium training facilities\n• A seamless 3:00–5:00 PM solution for working families\n\nYou''re investing in your athlete''s development and your family''s weekday routine at the same time.',
  1
WHERE NOT EXISTS (
  SELECT 1 FROM faqs
  WHERE category = 'General'
    AND question = 'What''s included in the $62.50/day program fee?'
);

-- 4. NEW · "Why is SAE Academy priced at $62.50/day?" (Tax & Finances) ─────────
INSERT INTO faqs (category, question, answer, sort_order)
SELECT
  'Tax & Finances',
  'Why is SAE Academy priced at $62.50/day?',
  E'The $62.50 daily rate reflects the true cost of delivering an Elite After-School Development Program — not just a practice. Here''s where the value goes:\n\n• Transportation is the single largest cost. We operate safe, supervised transit from your child''s school to the training facility every program day.\n• School pickup is included. Your child is collected directly from their participating school at the end of the school day.\n• 1.5 hours of structured, sport-specific instruction is included — not free play or supervised time.\n• Top coaches and premium facilities are included. We partner with established sports organizations and train at the same venues used by leading local programs.\n• It''s a flexible add-on, not full-time childcare. Parents pay only for the days their child is enrolled — there''s no full-day daycare overhead built into the price.\n• Eligible tax incentives may reduce the total cost. Many families qualify for the NL Physical Activity Tax Credit (up to $2,000/family/year) and federal child-care expense deductions, lowering the real out-of-pocket cost significantly.\n\nWhen you compare to the cost of separate transportation, private coaching, and facility access, the daily rate delivers all of it in one seamless 3:00–5:00 PM solution.',
  0
WHERE NOT EXISTS (
  SELECT 1 FROM faqs
  WHERE category = 'Tax & Finances'
    AND question = 'Why is SAE Academy priced at $62.50/day?'
);

COMMIT;

-- ─── Verify (optional) ──────────────────────────────────────────────────────
-- SELECT category, question, sort_order FROM faqs ORDER BY category, sort_order, created_at;

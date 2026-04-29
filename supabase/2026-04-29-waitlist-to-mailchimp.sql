-- Point the "Join the Waitlist" CTAs at the Mailchimp signup while the
-- program is in waitlist mode. Updates the registration_url and the
-- home-hero secondary CTA href on the existing site_settings rows.
--
-- Safe to re-run: it always sets the values, even if they already match.
-- When registration opens, swap the URL back to the TeamSnap form.

UPDATE site_settings
SET    value      = '"https://mailchi.mp/saeacademynl/email-sign-up"',
       updated_at = NOW()
WHERE  key = 'registration_url';

UPDATE site_settings
SET    value = jsonb_set(
                 value,
                 '{cta_secondary,href}',
                 '"https://mailchi.mp/saeacademynl/email-sign-up"',
                 false
               ),
       updated_at = NOW()
WHERE  key = 'home_hero';

import "server-only";

import { createAdminClient } from "@/lib/supabase/server";

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface CtaLink {
  label: string;
  href: string;
}

export interface HomeHero {
  eyebrow: string;
  /** Three lines; the third is rendered in the gold accent color. */
  title_lines: [string, string, string];
  subtitle: string;
  cta_primary: CtaLink;
  cta_secondary: CtaLink;
}

export interface HomeStat {
  value: string;
  label: string;
}

export interface SiteSettings {
  contact_email: string;
  registration_url: string;
  mailing_list_url: string;
  mailing_list_eyebrow: string;
  mailing_list_heading: string;
  mailing_list_subheading: string;
  home_hero: HomeHero;
  home_stats: HomeStat[];
}

/* ─── Defaults ───────────────────────────────────────────────────────────── */
/* These mirror what's hardcoded in the JSX today, so the public site looks
   identical before anyone edits anything in the admin. */

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  contact_email: "info@saeacademynl.com",
  // While the program is in waitlist mode, the "Join the Waitlist" CTAs
  // intentionally point at the Mailchimp signup, not TeamSnap.
  registration_url: "https://mailchi.mp/saeacademynl/email-sign-up",
  mailing_list_url: "https://mailchi.mp/saeacademynl/email-sign-up",
  mailing_list_eyebrow: "Stay in the loop",
  mailing_list_heading: "Join our mailing list",
  mailing_list_subheading:
    "Be among the first to secure a spot in the SAE Academy's Elite After-School Development Program.",
  home_hero: {
    eyebrow: "Newfoundland Sport Education Program",
    title_lines: [
      "Elite After-School",
      "Development",
      "For Athletes Who Want More.",
    ],
    subtitle:
      "A premium 3:00–5:00 PM solution for families. School pickup, transportation, 1.5 hours of structured instruction, and elite coaching — all in one program.",
    cta_primary: { label: "Explore Programs", href: "/sports" },
    cta_secondary: {
      label: "Join the Waitlist",
      href: "https://mailchi.mp/saeacademynl/email-sign-up",
    },
  },
  home_stats: [
    { value: "8", label: "Disciplines" },
    { value: "45", label: "Eligible Schools" },
    { value: "1.5h", label: "Daily Development" },
  ],
};

/* ─── Loader ─────────────────────────────────────────────────────────────── */

/**
 * Fetches every key from `site_settings` and merges it on top of the defaults.
 * Always returns a complete `SiteSettings` object — if Supabase is unreachable
 * or a key is missing, the default value fills in.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  const isConfigured =
    process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!isConfigured) return DEFAULT_SITE_SETTINGS;

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("site_settings")
      .select("key, value");

    if (error || !data) return DEFAULT_SITE_SETTINGS;

    const map: Record<string, unknown> = {};
    for (const row of data as { key: string; value: unknown }[]) {
      map[row.key] = row.value;
    }

    return mergeWithDefaults(map);
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

/* ─── Internal: merge raw rows on top of defaults with light validation ──── */

function mergeWithDefaults(map: Record<string, unknown>): SiteSettings {
  const d = DEFAULT_SITE_SETTINGS;

  return {
    contact_email: asString(map.contact_email, d.contact_email),
    registration_url: asString(map.registration_url, d.registration_url),
    mailing_list_url: asString(map.mailing_list_url, d.mailing_list_url),
    mailing_list_eyebrow: asString(map.mailing_list_eyebrow, d.mailing_list_eyebrow),
    mailing_list_heading: asString(map.mailing_list_heading, d.mailing_list_heading),
    mailing_list_subheading: asString(
      map.mailing_list_subheading,
      d.mailing_list_subheading
    ),
    home_hero: asHomeHero(map.home_hero, d.home_hero),
    home_stats: asHomeStats(map.home_stats, d.home_stats),
  };
}

function asString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
}

function asCta(value: unknown, fallback: CtaLink): CtaLink {
  if (!value || typeof value !== "object") return fallback;
  const v = value as Partial<CtaLink>;
  return {
    label: asString(v.label, fallback.label),
    href: asString(v.href, fallback.href),
  };
}

function asHomeHero(value: unknown, fallback: HomeHero): HomeHero {
  if (!value || typeof value !== "object") return fallback;
  const v = value as Partial<HomeHero> & { title_lines?: unknown };
  const lines = Array.isArray(v.title_lines) ? v.title_lines : [];
  const [l1, l2, l3] = fallback.title_lines;
  return {
    eyebrow: asString(v.eyebrow, fallback.eyebrow),
    title_lines: [
      asString(lines[0], l1),
      asString(lines[1], l2),
      asString(lines[2], l3),
    ],
    subtitle: asString(v.subtitle, fallback.subtitle),
    cta_primary: asCta(v.cta_primary, fallback.cta_primary),
    cta_secondary: asCta(v.cta_secondary, fallback.cta_secondary),
  };
}

function asHomeStats(value: unknown, fallback: HomeStat[]): HomeStat[] {
  if (!Array.isArray(value)) return fallback;
  const cleaned = value
    .map((entry) => {
      if (!entry || typeof entry !== "object") return null;
      const e = entry as Partial<HomeStat>;
      const v = asString(e.value, "");
      const l = asString(e.label, "");
      if (!v || !l) return null;
      return { value: v, label: l };
    })
    .filter((s): s is HomeStat => s !== null);
  return cleaned.length > 0 ? cleaned : fallback;
}

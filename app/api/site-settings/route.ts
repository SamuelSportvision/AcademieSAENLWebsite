import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, createServerSupabaseClient } from "@/lib/supabase/server";
import { getSiteSettings } from "@/lib/site-settings";

/**
 * GET — Returns the merged settings object (defaults + DB overrides).
 * Used by the admin form to populate inputs.
 */
export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json(settings);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * PUT — Upserts a partial settings object. The body should be a flat object
 * keyed by setting name, e.g.
 *   { contact_email: "x@y.com", home_hero: { ... } }
 * Each top-level key is stored as one row in `site_settings`.
 */
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as Record<string, unknown>;
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    const rows = Object.entries(body).map(([key, value]) => ({ key, value }));
    if (rows.length === 0) {
      return NextResponse.json({ error: "No settings provided" }, { status: 400 });
    }

    const admin = createAdminClient();
    const { error } = await admin
      .from("site_settings")
      .upsert(rows, { onConflict: "key" });

    if (error) throw error;

    const settings = await getSiteSettings();
    return NextResponse.json(settings);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

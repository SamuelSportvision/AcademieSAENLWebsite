import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

interface Params {
  params: Promise<{ slug: string }>;
}

// GET /api/sports/[slug]/config
export async function GET(_req: NextRequest, { params }: Params) {
  const { slug } = await params;
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("sport_config")
      .select("registration_url")
      .eq("slug", slug)
      .maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data ?? {});
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// PUT /api/sports/[slug]/config
// Body: { registration_url: string }
export async function PUT(req: NextRequest, { params }: Params) {
  const { slug } = await params;
  try {
    const body = await req.json();
    const registration_url: string = (body.registration_url ?? "").trim();

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("sport_config")
      .upsert(
        { slug, registration_url, updated_at: new Date().toISOString() },
        { onConflict: "slug" }
      )
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

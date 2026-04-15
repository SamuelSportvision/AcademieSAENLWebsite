import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, createServerSupabaseClient } from "@/lib/supabase/server";

// Body: { ids: string[] }  — ordered list of section IDs to reassign sort_order
export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { ids } = await req.json() as { ids: string[] };
    if (!Array.isArray(ids)) {
      return NextResponse.json({ error: "ids must be an array" }, { status: 400 });
    }

    const admin = createAdminClient();
    await Promise.all(
      ids.map((id, index) =>
        admin
          .from("sport_page_sections")
          .update({ sort_order: index })
          .eq("id", id)
      )
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

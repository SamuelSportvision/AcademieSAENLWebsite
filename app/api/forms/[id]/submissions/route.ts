import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, createServerSupabaseClient } from "@/lib/supabase/server";
import { Resend } from "resend";

type Params = { params: Promise<{ id: string }> };

const resend = new Resend(process.env.RESEND_API_KEY);

/* ── GET — admin only: list submissions for a form ── */
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("form_submissions")
      .select("*")
      .eq("form_id", id)
      .order("submitted_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}

/* ── POST — public: submit a form ── */
export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await req.json() as { data: Record<string, string | boolean> };

    if (!body.data || typeof body.data !== "object") {
      return NextResponse.json({ error: "Invalid submission data" }, { status: 400 });
    }

    const admin = createAdminClient();

    // Fetch form meta (name, notification_email)
    const { data: form, error: formError } = await admin
      .from("forms")
      .select("id, name, notification_email, is_active")
      .eq("id", id)
      .single();

    if (formError || !form) return NextResponse.json({ error: "Form not found" }, { status: 404 });
    if (!form.is_active) return NextResponse.json({ error: "This form is no longer accepting submissions" }, { status: 403 });

    // Save submission
    const { error: insertError } = await admin
      .from("form_submissions")
      .insert({ form_id: id, data: body.data });

    if (insertError) throw insertError;

    // Send email notification if configured
    if (form.notification_email && process.env.RESEND_API_KEY) {
      const fieldRows = Object.entries(body.data)
        .map(([label, value]) => {
          const safe = String(value ?? "—").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
          return `
            <tr>
              <td style="padding:10px 16px;border-bottom:1px solid #2a2a2a;width:35%;vertical-align:top;">
                <span style="font-size:10px;color:#888;text-transform:uppercase;letter-spacing:2px;">${label}</span>
              </td>
              <td style="padding:10px 16px;border-bottom:1px solid #2a2a2a;">
                <span style="font-size:14px;color:#d0d0d0;">${safe}</span>
              </td>
            </tr>`;
        })
        .join("");

      const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0f0f0f;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f0f;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#1a1a1a;border-radius:8px;overflow:hidden;border:1px solid #2a2a2a;">
        <tr><td style="height:4px;background:linear-gradient(to right,#C8102E,#C9A84C,#C8102E);"></td></tr>
        <tr>
          <td style="padding:28px 32px 20px;border-bottom:1px solid #2a2a2a;">
            <p style="margin:0;font-size:10px;color:#C9A84C;text-transform:uppercase;letter-spacing:3px;">New Form Submission</p>
            <p style="margin:6px 0 0;font-size:20px;font-weight:900;color:#ffffff;text-transform:uppercase;letter-spacing:1px;">${form.name}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:0;">
            <table width="100%" cellpadding="0" cellspacing="0">
              ${fieldRows}
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px;background:#111;">
            <p style="margin:0;font-size:11px;color:#444;">
              Submitted via <a href="https://academiesaenl.com" style="color:#555;text-decoration:none;">academiesaenl.com</a>
            </p>
          </td>
        </tr>
        <tr><td style="height:3px;background:linear-gradient(to right,#C8102E,#C9A84C,#C8102E);"></td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

      await resend.emails.send({
        from: "SAE Academy <noreply@academiesaenl.com>",
        to: [form.notification_email],
        subject: `[Form] New submission: ${form.name}`,
        html,
      }).catch(() => {
        // Don't fail the response if email delivery fails
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}

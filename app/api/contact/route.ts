import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const SUBJECT_LABELS: Record<string, string> = {
  registration: "Program Registration",
  general: "General Inquiry",
  coaching: "Coaching & Staff",
  partnership: "Partnership / Sponsorship",
  parent: "Parent / Guardian",
  media: "Media & Press",
  other: "Other",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message, attachments } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const subjectLabel = SUBJECT_LABELS[subject] ?? subject;

    // Build attachment objects for Resend
    const resendAttachments = (attachments ?? []).map(
      (file: { filename: string; content: string }) => ({
        filename: file.filename,
        content: file.content, // base64 string
      })
    );

    const safeMessage = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");

    const htmlBody = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0f0f0f;font-family:Arial,Helvetica,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f0f;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#1a1a1a;border-radius:8px;overflow:hidden;border:1px solid #2a2a2a;">

        <!-- Gold/Red accent bar -->
        <tr>
          <td style="height:4px;background:linear-gradient(to right,#C8102E,#C9A84C,#C8102E);"></td>
        </tr>

        <!-- Header -->
        <tr>
          <td style="padding:32px 36px 24px;border-bottom:1px solid #2a2a2a;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="vertical-align:middle;">
                  <p style="margin:0;font-size:18px;font-weight:900;color:#ffffff;text-transform:uppercase;letter-spacing:2px;line-height:1.2;">
                    SAE Academy
                  </p>
                  <p style="margin:4px 0 0;font-size:10px;color:#C9A84C;text-transform:uppercase;letter-spacing:3px;">
                    Sports · Arts · Education
                  </p>
                </td>
                <td align="right" style="vertical-align:middle;">
                  <span style="background:#C8102E;color:#fff;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;padding:4px 10px;border-radius:3px;">
                    New Message
                  </span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Subject banner -->
        <tr>
          <td style="padding:20px 36px;background:#111;border-bottom:1px solid #2a2a2a;">
            <p style="margin:0;font-size:10px;color:#C9A84C;text-transform:uppercase;letter-spacing:3px;margin-bottom:6px;">Subject</p>
            <p style="margin:0;font-size:20px;font-weight:900;color:#ffffff;text-transform:uppercase;letter-spacing:1px;">
              ${subjectLabel}
            </p>
          </td>
        </tr>

        <!-- Sender details -->
        <tr>
          <td style="padding:24px 36px;border-bottom:1px solid #2a2a2a;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="50%" style="padding-right:12px;">
                  <p style="margin:0 0 4px;font-size:10px;color:#666;text-transform:uppercase;letter-spacing:2px;">From</p>
                  <p style="margin:0;font-size:14px;font-weight:700;color:#ffffff;">${name}</p>
                </td>
                <td width="50%" style="padding-left:12px;">
                  <p style="margin:0 0 4px;font-size:10px;color:#666;text-transform:uppercase;letter-spacing:2px;">Email</p>
                  <a href="mailto:${email}" style="color:#C9A84C;font-size:14px;font-weight:600;text-decoration:none;">${email}</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Message body -->
        <tr>
          <td style="padding:24px 36px;${resendAttachments.length > 0 ? "" : "border-bottom:1px solid #2a2a2a;"}">
            <p style="margin:0 0 12px;font-size:10px;color:#666;text-transform:uppercase;letter-spacing:2px;">Message</p>
            <div style="background:#111;border-left:3px solid #C9A84C;padding:16px 20px;border-radius:0 4px 4px 0;">
              <p style="margin:0;font-size:14px;color:#d0d0d0;line-height:1.75;">${safeMessage}</p>
            </div>
          </td>
        </tr>

        <!-- Attachments (if any) -->
        ${resendAttachments.length > 0 ? `
        <tr>
          <td style="padding:0 36px 24px;border-bottom:1px solid #2a2a2a;">
            <p style="margin:0 0 8px;font-size:10px;color:#666;text-transform:uppercase;letter-spacing:2px;">
              Attachments (${resendAttachments.length})
            </p>
            ${resendAttachments.map((a: { filename: string }) => `
              <span style="display:inline-block;background:#222;border:1px solid #333;color:#aaa;font-size:11px;padding:4px 10px;border-radius:3px;margin:0 4px 4px 0;">
                📎 ${a.filename}
              </span>
            `).join("")}
          </td>
        </tr>` : ""}

        <!-- Footer -->
        <tr>
          <td style="padding:20px 36px;background:#111;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <p style="margin:0;font-size:11px;color:#444;line-height:1.6;">
                    Received via <a href="https://academiesaenl.com" style="color:#555;text-decoration:none;">academiesaenl.com</a> contact form.<br>
                    Reply directly to this email to respond to ${name}.
                  </p>
                </td>
                <td align="right" style="vertical-align:top;">
                  <p style="margin:0;font-size:10px;color:#333;text-transform:uppercase;letter-spacing:1px;">SAE Academy</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Bottom accent bar -->
        <tr>
          <td style="height:3px;background:linear-gradient(to right,#C8102E,#C9A84C,#C8102E);"></td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`;

    await resend.emails.send({
      from: "SAE Academy <noreply@academiesaenl.com>",
      to: ["info@saeacademynl.com"],
      cc: [email],
      replyTo: email,
      subject: `[${subjectLabel}] Message from ${name}`,
      html: htmlBody,
      attachments: resendAttachments,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

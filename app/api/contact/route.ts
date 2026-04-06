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

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #111; color: #f0f0f0; padding: 32px; border-radius: 8px;">
        <div style="border-bottom: 3px solid #C9A84C; padding-bottom: 20px; margin-bottom: 24px;">
          <h1 style="margin: 0; font-size: 22px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; color: #fff;">
            New Contact Form Submission
          </h1>
          <p style="margin: 6px 0 0; font-size: 12px; color: #C9A84C; text-transform: uppercase; letter-spacing: 3px;">
            SAE Academy
          </p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #333; font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 1px; width: 100px;">Name</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #333; font-size: 14px; color: #fff; font-weight: 600;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #333; font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 1px;">Email</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #333; font-size: 14px; color: #C9A84C;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #333; font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 1px;">Subject</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #333; font-size: 14px; color: #fff; font-weight: 600;">${subjectLabel}</td>
          </tr>
        </table>

        <div style="background: #1a1a1a; border-left: 3px solid #C9A84C; padding: 16px 20px; border-radius: 0 4px 4px 0;">
          <p style="margin: 0 0 8px; font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 1px;">Message</p>
          <p style="margin: 0; font-size: 14px; color: #e0e0e0; line-height: 1.7; white-space: pre-wrap;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
        </div>

        ${
          resendAttachments.length > 0
            ? `<p style="margin-top: 20px; font-size: 12px; color: #666;">${resendAttachments.length} attachment(s) included.</p>`
            : ""
        }

        <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #333;">
          <p style="margin: 0; font-size: 11px; color: #555;">
            Sent via academiesaenl.com contact form · Reply to this email to respond directly to ${name}.
          </p>
        </div>
      </div>
    `;

    await resend.emails.send({
      from: "SAE Academy <noreply@academiesaenl.com>",
      to: ["info@academiesae.com"],
      cc: [email],
      reply_to: email,
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

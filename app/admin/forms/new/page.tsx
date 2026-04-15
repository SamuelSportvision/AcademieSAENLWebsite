"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

function fieldClass(extra = "") {
  return `bg-[#111] border border-white/10 rounded px-4 py-2.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-[#C9A84C] transition-colors ${extra}`;
}

function Label({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 block mb-1">
      {children}
    </label>
  );
}

export default function NewFormPage() {
  const router = useRouter();

  const [name, setName]                   = useState("");
  const [slug, setSlug]                   = useState("");
  const [slugTouched, setSlugTouched]     = useState(false);
  const [description, setDescription]     = useState("");
  const [successMessage, setSuccessMessage] = useState("Thank you! Your response has been submitted.");
  const [notificationEmail, setNotificationEmail] = useState("");
  const [saving, setSaving]               = useState(false);
  const [error, setError]                 = useState<string | null>(null);

  function handleNameChange(val: string) {
    setName(val);
    if (!slugTouched) setSlug(slugify(val));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError("Name is required."); return; }
    if (!slug.trim()) { setError("URL slug is required."); return; }

    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          slug: slug.trim(),
          description: description.trim() || null,
          success_message: successMessage.trim() || "Thank you! Your response has been submitted.",
          notification_email: notificationEmail.trim() || null,
          is_active: true,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Request failed (${res.status})`);
      }

      const created = await res.json();
      router.push(`/admin/forms/${created.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setSaving(false);
    }
  }

  return (
    <div className="bg-[#0f0f0f] min-h-screen py-10 px-5">
      <div className="max-w-2xl mx-auto">

        <div className="mb-8">
          <Link
            href="/admin/forms"
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600 hover:text-gray-400 transition-colors"
          >
            ← Back to Forms
          </Link>
          <h1 className="text-white font-black text-2xl uppercase tracking-wide mt-4">Create Form</h1>
          <p className="text-gray-600 text-xs mt-1">Set the form details — you can add fields on the next screen.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#1a1a1a] border border-white/10 rounded p-6 flex flex-col gap-6"
        >
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="form_name">Form Name</Label>
            <input
              id="form_name"
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Hockey Tryout Interest"
              className={fieldClass("w-full")}
            />
          </div>

          {/* Slug */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="form_slug">
              URL Slug <span className="text-gray-700 normal-case tracking-normal font-normal">(auto-generated, must be unique)</span>
            </Label>
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-sm font-mono whitespace-nowrap">/forms/</span>
              <input
                id="form_slug"
                type="text"
                required
                value={slug}
                onChange={(e) => { setSlug(slugify(e.target.value)); setSlugTouched(true); }}
                placeholder="hockey-tryout-interest"
                className={fieldClass("flex-1 font-mono")}
              />
            </div>
            <p className="text-[10px] text-gray-600">
              Public URL will be: <span className="text-gray-500 font-mono">academiesaenl.com/forms/{slug || "your-slug"}</span>
            </p>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="form_desc">
              Description <span className="text-gray-700 normal-case tracking-normal font-normal">(optional — shown on the form page)</span>
            </Label>
            <textarea
              id="form_desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short description of what this form is for…"
              className={fieldClass("resize-y leading-relaxed")}
            />
          </div>

          {/* Success message */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="success_msg">Success Message</Label>
            <input
              id="success_msg"
              type="text"
              value={successMessage}
              onChange={(e) => setSuccessMessage(e.target.value)}
              placeholder="Thank you! Your response has been submitted."
              className={fieldClass("w-full")}
            />
            <p className="text-[10px] text-gray-600">Shown to the user after they successfully submit the form.</p>
          </div>

          {/* Notification email */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notif_email">
              Notification Email <span className="text-gray-700 normal-case tracking-normal font-normal">(optional)</span>
            </Label>
            <input
              id="notif_email"
              type="email"
              value={notificationEmail}
              onChange={(e) => setNotificationEmail(e.target.value)}
              placeholder="info@saeacademynl.com"
              className={fieldClass("w-full")}
            />
            <p className="text-[10px] text-gray-600">Receive an email every time this form is submitted.</p>
          </div>

          {error && <p className="text-[#C8102E] text-xs font-semibold">{error}</p>}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-[#C9A84C] text-black font-black text-sm uppercase tracking-widest py-3 rounded hover:bg-yellow-400 transition-colors disabled:opacity-50"
            >
              {saving ? "Creating…" : "Create Form & Add Fields →"}
            </button>
            <Link
              href="/admin/forms"
              className="px-5 py-3 text-sm font-bold uppercase tracking-wider text-gray-500 hover:text-white border border-white/10 hover:border-white/30 rounded transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

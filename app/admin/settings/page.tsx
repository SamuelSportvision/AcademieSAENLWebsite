"use client";

import { useEffect, useState, useCallback } from "react";
import type { SiteSettings, HomeStat } from "@/lib/site-settings";

/* ─── Reusable input styles (match existing admin look) ──────────────────── */

const inputCls =
  "bg-[#111] border border-white/10 rounded px-4 py-2.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-[#C9A84C] transition-colors w-full";
const labelCls =
  "text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500";
const sectionTitleCls =
  "text-white font-black text-sm uppercase tracking-[0.2em]";
const sectionDescCls = "text-gray-600 text-xs mt-1";

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [toast, setToast]       = useState<{ type: "success" | "error"; message: string } | null>(null);

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  }

  /* ── Load ── */
  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/site-settings");
      if (!res.ok) throw new Error("Failed to load settings");
      setSettings(await res.json());
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  /* ── Save ── */
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    try {
      const res = await fetch("/api/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Save failed");
      }
      const updated: SiteSettings = await res.json();
      setSettings(updated);
      showToast("success", "Settings saved.");
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  }

  /* ── Helpers ── */
  function update<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setSettings((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  function updateHero<K extends keyof SiteSettings["home_hero"]>(
    key: K,
    value: SiteSettings["home_hero"][K]
  ) {
    setSettings((prev) =>
      prev ? { ...prev, home_hero: { ...prev.home_hero, [key]: value } } : prev
    );
  }

  function updateHeroLine(index: 0 | 1 | 2, value: string) {
    setSettings((prev) => {
      if (!prev) return prev;
      const lines = [...prev.home_hero.title_lines] as [string, string, string];
      lines[index] = value;
      return { ...prev, home_hero: { ...prev.home_hero, title_lines: lines } };
    });
  }

  function updateStat(index: number, patch: Partial<HomeStat>) {
    setSettings((prev) => {
      if (!prev) return prev;
      const stats = prev.home_stats.map((s, i) => (i === index ? { ...s, ...patch } : s));
      return { ...prev, home_stats: stats };
    });
  }

  function addStat() {
    setSettings((prev) =>
      prev
        ? { ...prev, home_stats: [...prev.home_stats, { value: "", label: "" }] }
        : prev
    );
  }

  function removeStat(index: number) {
    setSettings((prev) =>
      prev
        ? { ...prev, home_stats: prev.home_stats.filter((_, i) => i !== index) }
        : prev
    );
  }

  /* ── Render ── */
  if (loading || !settings) {
    return (
      <div className="bg-[#0f0f0f] min-h-screen py-10 px-5">
        <p className="text-gray-600 text-sm uppercase tracking-wider text-center py-12">
          Loading…
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#0f0f0f] min-h-screen py-10 px-5">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h1 className="text-white font-black text-2xl uppercase tracking-wide">Site Settings</h1>
            <p className="text-gray-600 text-xs mt-1 uppercase tracking-wider">
              Global copy, links, and home-page hero content
            </p>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div className={`mb-6 px-5 py-3 rounded text-sm font-semibold ${
            toast.type === "success"
              ? "bg-emerald-900/40 border border-emerald-700/40 text-emerald-400"
              : "bg-red-900/40 border border-red-700/40 text-red-400"
          }`}>
            {toast.message}
          </div>
        )}

        <form onSubmit={handleSave} className="flex flex-col gap-10">

          {/* ─── Contact & Links ─── */}
          <section className="border border-white/10 rounded-lg p-6 bg-[#111]/50">
            <div className="mb-5">
              <p className={sectionTitleCls}>Contact &amp; Links</p>
              <p className={sectionDescCls}>
                Used in the navbar CTA, footer, contact callouts, and tax FAQ.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Contact Email">
                <input
                  type="email"
                  required
                  value={settings.contact_email}
                  onChange={(e) => update("contact_email", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Registration URL">
                <input
                  type="url"
                  required
                  value={settings.registration_url}
                  onChange={(e) => update("registration_url", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Mailing List URL">
                <input
                  type="url"
                  required
                  value={settings.mailing_list_url}
                  onChange={(e) => update("mailing_list_url", e.target.value)}
                  className={inputCls}
                />
              </Field>
            </div>
          </section>

          {/* ─── Footer Mailing List ─── */}
          <section className="border border-white/10 rounded-lg p-6 bg-[#111]/50">
            <div className="mb-5">
              <p className={sectionTitleCls}>Footer · Mailing List</p>
              <p className={sectionDescCls}>
                Copy shown next to the &ldquo;Sign Up Now&rdquo; button in the footer.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Field label="Eyebrow (small label)">
                <input
                  type="text"
                  value={settings.mailing_list_eyebrow}
                  onChange={(e) => update("mailing_list_eyebrow", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Heading">
                <input
                  type="text"
                  value={settings.mailing_list_heading}
                  onChange={(e) => update("mailing_list_heading", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Subheading">
                <textarea
                  rows={2}
                  value={settings.mailing_list_subheading}
                  onChange={(e) => update("mailing_list_subheading", e.target.value)}
                  className={`${inputCls} resize-none`}
                />
              </Field>
            </div>
          </section>

          {/* ─── Home Page · Hero ─── */}
          <section className="border border-white/10 rounded-lg p-6 bg-[#111]/50">
            <div className="mb-5">
              <p className={sectionTitleCls}>Home Page · Hero</p>
              <p className={sectionDescCls}>
                The first thing visitors see. The third title line is shown in gold.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Field label="Eyebrow">
                <input
                  type="text"
                  value={settings.home_hero.eyebrow}
                  onChange={(e) => updateHero("eyebrow", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Title — Line 1">
                  <input
                    type="text"
                    value={settings.home_hero.title_lines[0]}
                    onChange={(e) => updateHeroLine(0, e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label="Title — Line 2">
                  <input
                    type="text"
                    value={settings.home_hero.title_lines[1]}
                    onChange={(e) => updateHeroLine(1, e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label="Title — Line 3 (gold)">
                  <input
                    type="text"
                    value={settings.home_hero.title_lines[2]}
                    onChange={(e) => updateHeroLine(2, e.target.value)}
                    className={inputCls}
                  />
                </Field>
              </div>
              <Field label="Subtitle">
                <textarea
                  rows={3}
                  value={settings.home_hero.subtitle}
                  onChange={(e) => updateHero("subtitle", e.target.value)}
                  className={`${inputCls} resize-none`}
                />
              </Field>

              {/* CTAs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex flex-col gap-3 border border-white/5 rounded p-4 bg-black/20">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A84C]">
                    Primary CTA (red)
                  </p>
                  <Field label="Label">
                    <input
                      type="text"
                      value={settings.home_hero.cta_primary.label}
                      onChange={(e) =>
                        updateHero("cta_primary", {
                          ...settings.home_hero.cta_primary,
                          label: e.target.value,
                        })
                      }
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Link">
                    <input
                      type="text"
                      value={settings.home_hero.cta_primary.href}
                      onChange={(e) =>
                        updateHero("cta_primary", {
                          ...settings.home_hero.cta_primary,
                          href: e.target.value,
                        })
                      }
                      className={inputCls}
                    />
                  </Field>
                </div>
                <div className="flex flex-col gap-3 border border-white/5 rounded p-4 bg-black/20">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A84C]">
                    Secondary CTA (outline)
                  </p>
                  <Field label="Label">
                    <input
                      type="text"
                      value={settings.home_hero.cta_secondary.label}
                      onChange={(e) =>
                        updateHero("cta_secondary", {
                          ...settings.home_hero.cta_secondary,
                          label: e.target.value,
                        })
                      }
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Link">
                    <input
                      type="text"
                      value={settings.home_hero.cta_secondary.href}
                      onChange={(e) =>
                        updateHero("cta_secondary", {
                          ...settings.home_hero.cta_secondary,
                          href: e.target.value,
                        })
                      }
                      className={inputCls}
                    />
                  </Field>
                </div>
              </div>
            </div>
          </section>

          {/* ─── Home Page · Stats Bar ─── */}
          <section className="border border-white/10 rounded-lg p-6 bg-[#111]/50">
            <div className="mb-5 flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className={sectionTitleCls}>Home Page · Stats Bar</p>
                <p className={sectionDescCls}>
                  The gold strip below the hero. Add or remove entries — the bar
                  resizes automatically.
                </p>
              </div>
              <button
                type="button"
                onClick={addStat}
                className="text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:text-white border border-white/10 hover:border-white/30 px-3 py-1.5 rounded transition-colors"
              >
                + Add Stat
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {settings.home_stats.map((stat, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[1fr_2fr_auto] gap-3 items-end"
                >
                  <Field label="Value">
                    <input
                      type="text"
                      placeholder="8"
                      value={stat.value}
                      onChange={(e) => updateStat(i, { value: e.target.value })}
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Label">
                    <input
                      type="text"
                      placeholder="Disciplines"
                      value={stat.label}
                      onChange={(e) => updateStat(i, { label: e.target.value })}
                      className={inputCls}
                    />
                  </Field>
                  <button
                    type="button"
                    onClick={() => removeStat(i)}
                    className="text-[10px] font-bold uppercase tracking-wider text-gray-600 hover:text-red-400 border border-white/10 hover:border-red-500/30 px-3 py-2.5 rounded transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
              {settings.home_stats.length === 0 && (
                <p className="text-gray-700 text-xs italic">
                  No stats — the bar will be hidden on the home page.
                </p>
              )}
            </div>
          </section>

          {/* ─── Sticky save bar ─── */}
          <div className="sticky bottom-0 -mx-5 px-5 py-4 bg-[#0d0d0d] border-t border-white/10 flex items-center justify-between gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-600 hover:text-[#C9A84C] uppercase tracking-wider transition-colors"
            >
              View public home page →
            </a>
            <button
              type="submit"
              disabled={saving}
              className="bg-[#C9A84C] text-black font-black text-xs uppercase tracking-widest px-6 py-3 rounded hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving…" : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Tiny field wrapper for consistent spacing ──────────────────────────── */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

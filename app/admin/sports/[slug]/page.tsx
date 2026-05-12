"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { use } from "react";
import { getSportBySlug } from "@/data/sports";
import type { SportSection, SectionType } from "@/components/SportSections";
import SectionDrawer from "@/components/admin/SectionDrawer";

/* ─── Registration URL editor ────────────────────────────────────────────────── */

function RegistrationUrlEditor({ slug, defaultUrl }: { slug: string; defaultUrl: string }) {
  const [url, setUrl]         = useState<string>("");
  const [saved, setSaved]     = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [status, setStatus]   = useState<"idle" | "saved" | "error">("idle");

  useEffect(() => {
    fetch(`/api/sports/${slug}/config`)
      .then((r) => r.json())
      .then((data) => {
        const v = data?.registration_url ?? defaultUrl;
        setUrl(v);
        setSaved(v);
      })
      .catch(() => { setUrl(defaultUrl); setSaved(defaultUrl); })
      .finally(() => setLoading(false));
  }, [slug, defaultUrl]);

  async function handleSave() {
    setSaving(true);
    setStatus("idle");
    try {
      const res = await fetch(`/api/sports/${slug}/config`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registration_url: url }),
      });
      if (!res.ok) throw new Error();
      setSaved(url);
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("error");
    } finally {
      setSaving(false);
    }
  }

  const dirty = url !== saved;

  return (
    <div className="px-4 pt-4 pb-3 border-b border-white/10 bg-[#111111]">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A84C] mb-2">
        Registration Button URL
      </p>
      {loading ? (
        <p className="text-gray-600 text-xs">Loading…</p>
      ) : (
        <div className="flex items-center gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://…"
            className="flex-1 bg-[#1a1a1a] border border-white/10 focus:border-[#C9A84C]/50 text-white text-xs px-3 py-2 rounded outline-none placeholder-gray-600 transition-colors min-w-0"
          />
          <button
            onClick={handleSave}
            disabled={saving || !dirty}
            className="shrink-0 bg-[#C9A84C] text-black font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded hover:bg-yellow-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      )}
      {status === "saved" && (
        <p className="text-emerald-400 text-[10px] mt-1.5">Saved — public page will update on next load.</p>
      )}
      {status === "error" && (
        <p className="text-red-400 text-[10px] mt-1.5">Failed to save. Try again.</p>
      )}
    </div>
  );
}

/* ─── Constants ──────────────────────────────────────────────────────────────── */

const TYPE_LABELS: Record<SectionType, string> = {
  text:       "Text Block",
  highlights: "Highlights",
  image_text: "Image + Text",
  stats:      "Stats",
  cta:        "Call to Action",
};

const TYPE_BADGE: Record<SectionType, string> = {
  text:       "bg-blue-900/30 text-blue-400 border-blue-800/40",
  highlights: "bg-amber-900/30 text-amber-400 border-amber-800/40",
  image_text: "bg-purple-900/30 text-purple-400 border-purple-800/40",
  stats:      "bg-emerald-900/30 text-emerald-400 border-emerald-800/40",
  cta:        "bg-red-900/30 text-red-400 border-red-800/40",
};

/* ─── Page ───────────────────────────────────────────────────────────────────── */

export default function AdminSportBuilderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const sport = getSportBySlug(slug);

  /* ── State ── */
  const [sections, setSections]       = useState<SportSection[]>([]);
  const [loading, setLoading]         = useState(true);
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [editSection, setEditSection] = useState<SportSection | null>(null);
  const [deletingId, setDeletingId]   = useState<string | null>(null);
  const [toast, setToast]             = useState<{ type: "success" | "error"; message: string } | null>(null);
  // Incrementing this key forces the iframe to reload.
  const [previewKey, setPreviewKey]   = useState(0);

  /* ── Drag-and-drop state ── */
  const dragIndexRef    = useRef<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  /* ── Helpers ── */
  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  }

  function refreshPreview() {
    setPreviewKey((k) => k + 1);
  }

  /* ── Data fetching ── */
  const fetchSections = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/sports/${slug}/sections`);
      if (!res.ok) throw new Error("Failed to load sections");
      setSections(await res.json());
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => { fetchSections(); }, [fetchSections]);

  /* ── Save handler (from drawer) ── */
  function handleSaved(saved: SportSection) {
    setSections((prev) => {
      const exists = prev.find((s) => s.id === saved.id);
      return exists
        ? prev.map((s) => (s.id === saved.id ? saved : s))
        : [...prev, saved];
    });
    setEditSection(null);
    setDrawerOpen(false);
    refreshPreview();
    showToast("success", editSection ? "Section updated." : "Section added.");
  }

  /* ── Toggle visibility ── */
  async function toggleVisibility(section: SportSection) {
    try {
      const res = await fetch(`/api/sports/${slug}/sections/${section.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_visible: !section.is_visible }),
      });
      if (!res.ok) throw new Error("Update failed");
      const updated: SportSection = await res.json();
      setSections((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      refreshPreview();
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Unknown error");
    }
  }

  /* ── Delete ── */
  async function handleDelete(section: SportSection) {
    if (!confirm(`Delete this section?\n\n"${section.title ?? TYPE_LABELS[section.section_type]}"\n\nThis cannot be undone.`)) return;
    setDeletingId(section.id);
    try {
      const res = await fetch(`/api/sports/${slug}/sections/${section.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setSections((prev) => prev.filter((s) => s.id !== section.id));
      showToast("success", "Section deleted.");
      refreshPreview();
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Unknown error");
    } finally {
      setDeletingId(null);
    }
  }

  /* ── Drag and drop ── */
  function onDragStart(index: number) {
    dragIndexRef.current = index;
  }

  function onDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    setDragOver(index);
  }

  async function onDrop(e: React.DragEvent, dropIndex: number) {
    e.preventDefault();
    const from = dragIndexRef.current;
    if (from === null || from === dropIndex) {
      setDragOver(null);
      dragIndexRef.current = null;
      return;
    }

    const next = [...sections];
    const [moved] = next.splice(from, 1);
    next.splice(dropIndex, 0, moved);
    setSections(next);
    setDragOver(null);
    dragIndexRef.current = null;

    try {
      const res = await fetch(`/api/sports/${slug}/sections/reorder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: next.map((s) => s.id) }),
      });
      if (!res.ok) throw new Error("Reorder failed");
      refreshPreview();
    } catch (err) {
      showToast("error", "Reorder failed — try again.");
      await fetchSections();
    }
  }

  function onDragEnd() {
    dragIndexRef.current = null;
    setDragOver(null);
  }

  /* ── Early return if bad slug ── */
  if (!sport) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f0f0f]">
        <p className="text-red-400 font-bold uppercase tracking-wider">
          Sport &ldquo;{slug}&rdquo; not found.
        </p>
      </div>
    );
  }

  /* ─── Render ─────────────────────────────────────────────────────────────── */
  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 112px)" }}>

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#0d0d0d] border-b border-white/10 flex-shrink-0 gap-3 flex-wrap">
        <div className="flex items-center gap-4 min-w-0">
          <Link
            href="/admin/sports"
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600 hover:text-gray-400 transition-colors whitespace-nowrap"
          >
            ← Sports
          </Link>
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-white font-black text-sm uppercase tracking-widest truncate">
              {sport.name}
            </h1>
            <span className="text-gray-600 text-xs hidden sm:inline">
              · {sections.length} section{sections.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Toast (inline in top bar on desktop) */}
        {toast && (
          <div className={`hidden sm:block text-xs font-semibold px-4 py-1.5 rounded ${
            toast.type === "success"
              ? "bg-emerald-900/50 text-emerald-400 border border-emerald-700/40"
              : "bg-red-900/50 text-red-400 border border-red-700/40"
          }`}>
            {toast.message}
          </div>
        )}

        <button
          onClick={() => { setEditSection(null); setDrawerOpen(true); }}
          className="bg-[#C9A84C] text-black font-black text-xs uppercase tracking-widest px-5 py-2 rounded hover:bg-yellow-400 transition-colors whitespace-nowrap flex-shrink-0"
        >
          + Add Section
        </button>
      </div>

      {/* Mobile toast */}
      {toast && (
        <div className={`sm:hidden px-5 py-2.5 text-xs font-semibold ${
          toast.type === "success"
            ? "bg-emerald-900/40 text-emerald-400"
            : "bg-red-900/40 text-red-400"
        }`}>
          {toast.message}
        </div>
      )}

      {/* ── Main split layout ── */}
      <div className="flex flex-1 min-h-0">

        {/* ── Left panel: section list ── */}
        <div className="w-full lg:w-[380px] flex-shrink-0 flex flex-col overflow-y-auto bg-[#0f0f0f] border-r border-white/10">
          <RegistrationUrlEditor slug={slug} defaultUrl={sport.registrationUrl} />
          <div className="flex-1 p-4">
            {loading ? (
              <p className="text-gray-600 text-xs uppercase tracking-wider py-12 text-center">Loading…</p>
            ) : sections.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-20 text-center gap-4">
                <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-2xl">
                  ✦
                </div>
                <div>
                  <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">No sections yet</p>
                  <p className="text-gray-700 text-xs mt-1">Click &ldquo;+ Add Section&rdquo; to start building.</p>
                </div>
                <button
                  onClick={() => { setEditSection(null); setDrawerOpen(true); }}
                  className="mt-2 bg-[#C9A84C] text-black font-black text-xs uppercase tracking-widest px-6 py-2.5 rounded hover:bg-yellow-400 transition-colors"
                >
                  + Add First Section
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {sections.map((section, index) => (
                  <div
                    key={section.id}
                    draggable
                    onDragStart={() => onDragStart(index)}
                    onDragOver={(e) => onDragOver(e, index)}
                    onDrop={(e) => onDrop(e, index)}
                    onDragEnd={onDragEnd}
                    className={`group relative bg-[#1a1a1a] border rounded-lg transition-all cursor-default ${
                      dragOver === index
                        ? "border-[#C9A84C] bg-[#C9A84C]/5"
                        : section.is_visible
                          ? "border-white/10 hover:border-white/20"
                          : "border-white/5 opacity-50"
                    }`}
                  >
                    <div className="flex items-stretch gap-0">

                      {/* Drag handle */}
                      <div
                        className="flex items-center justify-center w-8 flex-shrink-0 text-gray-700 group-hover:text-gray-500 cursor-grab active:cursor-grabbing transition-colors rounded-l-lg hover:bg-white/5 select-none"
                        title="Drag to reorder"
                      >
                        <span className="text-sm leading-none">⠿</span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 py-3 pr-3 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${TYPE_BADGE[section.section_type]}`}>
                            {TYPE_LABELS[section.section_type]}
                          </span>
                          {!section.is_visible && (
                            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border bg-gray-900/30 text-gray-600 border-gray-700/40">
                              Hidden
                            </span>
                          )}
                        </div>
                        <p className="text-white font-semibold text-sm leading-snug truncate">
                          {section.title ?? (
                            <span className="text-gray-600 italic font-normal">No heading</span>
                          )}
                        </p>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1.5 mt-2.5">
                          <button
                            onClick={() => { setEditSection(section); setDrawerOpen(true); }}
                            className="text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:text-white border border-white/10 hover:border-white/30 px-2.5 py-1 rounded transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => toggleVisibility(section)}
                            className="text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:text-white border border-white/10 hover:border-white/30 px-2.5 py-1 rounded transition-colors"
                          >
                            {section.is_visible ? "Hide" : "Show"}
                          </button>
                          <button
                            onClick={() => handleDelete(section)}
                            disabled={deletingId === section.id}
                            className="text-[10px] font-bold uppercase tracking-wider text-gray-600 hover:text-red-400 border border-white/10 hover:border-red-500/30 px-2.5 py-1 rounded transition-colors disabled:opacity-40"
                          >
                            {deletingId === section.id ? "…" : "Delete"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add section button at the bottom of the list */}
                <button
                  onClick={() => { setEditSection(null); setDrawerOpen(true); }}
                  className="mt-1 w-full border border-dashed border-white/15 hover:border-[#C9A84C]/40 hover:bg-[#C9A84C]/5 rounded-lg py-3 text-gray-600 hover:text-[#C9A84C] text-xs font-bold uppercase tracking-wider transition-all"
                >
                  + Add Section
                </button>
              </div>
            )}
          </div>

          {/* Panel footer */}
          <div className="px-4 py-3 border-t border-white/10 flex-shrink-0">
            <p className="text-[10px] text-gray-700 uppercase tracking-wider">
              Drag ⠿ to reorder · Changes go live instantly
            </p>
          </div>
        </div>

        {/* ── Right panel: live preview (hidden on mobile) ── */}
        <div className="hidden lg:flex flex-1 flex-col bg-[#0a0a0a] min-w-0">
          {/* Preview toolbar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 flex-shrink-0 gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#C9A84C]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                Live Preview
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={refreshPreview}
                className="text-[10px] text-gray-600 hover:text-white uppercase tracking-wider transition-colors border border-white/10 hover:border-white/20 px-3 py-1.5 rounded"
                title="Force refresh preview"
              >
                ↺ Refresh
              </button>
              <a
                href={`/sports/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-gray-600 hover:text-[#C9A84C] uppercase tracking-wider transition-colors border border-white/10 hover:border-[#C9A84C]/30 px-3 py-1.5 rounded"
              >
                Open ↗
              </a>
            </div>
          </div>

          {/* iframe */}
          <div className="flex-1 overflow-hidden relative">
            <iframe
              key={previewKey}
              src={`/sports/${slug}`}
              title={`Preview: ${sport.name}`}
              className="w-full h-full border-0"
              sandbox="allow-same-origin allow-scripts allow-forms"
            />
          </div>
        </div>
      </div>

      {/* ── Slide-in drawer ── */}
      <SectionDrawer
        sportSlug={slug}
        editSection={editSection}
        open={drawerOpen}
        onClose={() => { setDrawerOpen(false); setEditSection(null); }}
        onSaved={handleSaved}
      />
    </div>
  );
}

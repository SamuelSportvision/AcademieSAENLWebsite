"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { use } from "react";

interface Submission {
  id: string;
  form_id: string;
  data: Record<string, string | boolean>;
  submitted_at: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-CA", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function AdminSubmissionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [formName, setFormName]       = useState<string>("");
  const [loading, setLoading]         = useState(true);
  const [expandedId, setExpandedId]   = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  }

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [formRes, subRes] = await Promise.all([
        fetch(`/api/forms/${id}`),
        fetch(`/api/forms/${id}/submissions`),
      ]);
      if (formRes.ok) {
        const form = await formRes.json();
        setFormName(form.name);
      }
      if (!subRes.ok) throw new Error("Failed to load submissions");
      setSubmissions(await subRes.json());
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Get all unique field labels across all submissions for the column headers
  const allLabels = Array.from(
    new Set(submissions.flatMap((s) => Object.keys(s.data)))
  );

  return (
    <div className="bg-[#0f0f0f] min-h-screen py-10 px-5">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
          <div>
            <Link
              href={`/admin/forms/${id}`}
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600 hover:text-gray-400 transition-colors"
            >
              ← Back to Builder
            </Link>
            <h1 className="text-white font-black text-2xl uppercase tracking-wide mt-3">
              {formName || "Form"} — Submissions
            </h1>
            <p className="text-gray-600 text-xs mt-1 uppercase tracking-wider">
              {submissions.length} submission{submissions.length !== 1 ? "s" : ""}
            </p>
          </div>
          {/* CSV export */}
          {submissions.length > 0 && (
            <button
              onClick={() => {
                const headers = ["Submitted At", ...allLabels];
                const rows = submissions.map((s) => [
                  formatDate(s.submitted_at),
                  ...allLabels.map((label) => {
                    const val = s.data[label];
                    return val === undefined ? "" : String(val);
                  }),
                ]);
                const csv = [headers, ...rows]
                  .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
                  .join("\n");
                const blob = new Blob([csv], { type: "text/csv" });
                const url  = URL.createObjectURL(blob);
                const a    = document.createElement("a");
                a.href = url;
                a.download = `${formName.toLowerCase().replace(/\s+/g, "-")}-submissions.csv`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="border border-white/15 hover:border-[#C9A84C]/40 text-gray-500 hover:text-[#C9A84C] text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded transition-all"
            >
              ↓ Export CSV
            </button>
          )}
        </div>

        {toast && (
          <div className={`mb-6 px-5 py-3 rounded text-sm font-semibold ${
            toast.type === "success"
              ? "bg-emerald-900/40 border border-emerald-700/40 text-emerald-400"
              : "bg-red-900/40 border border-red-700/40 text-red-400"
          }`}>
            {toast.message}
          </div>
        )}

        {loading ? (
          <p className="text-gray-600 text-sm uppercase tracking-wider py-12 text-center">Loading…</p>
        ) : submissions.length === 0 ? (
          <div className="text-center py-20 border border-white/10 rounded">
            <p className="text-gray-600 text-sm uppercase tracking-wider">No submissions yet</p>
            <p className="text-gray-700 text-xs mt-2">Share the form link and responses will appear here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {submissions.map((sub) => {
              const isOpen = expandedId === sub.id;
              const entries = Object.entries(sub.data);
              // Preview: show first 2 values
              const preview = entries.slice(0, 2).map(([k, v]) => `${k}: ${v}`).join(" · ");

              return (
                <div
                  key={sub.id}
                  className="bg-[#1a1a1a] border border-white/10 rounded-lg overflow-hidden"
                >
                  {/* Row header */}
                  <button
                    onClick={() => setExpandedId(isOpen ? null : sub.id)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className="flex-shrink-0 text-right">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          {formatDate(sub.submitted_at)}
                        </p>
                      </div>
                      <p className="text-gray-400 text-xs truncate hidden sm:block">{preview}</p>
                    </div>
                    <span className={`text-gray-600 text-xs transition-transform flex-shrink-0 ${isOpen ? "rotate-180" : ""}`}>
                      ▼
                    </span>
                  </button>

                  {/* Expanded detail */}
                  {isOpen && (
                    <div className="border-t border-white/10 px-5 py-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {entries.map(([label, value]) => (
                          <div key={label}>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600 mb-1">
                              {label}
                            </p>
                            <p className="text-white text-sm leading-relaxed break-words">
                              {value === true ? "Yes" : value === false ? "No" : String(value) || <span className="text-gray-600 italic">—</span>}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

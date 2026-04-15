"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

interface FormRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  notification_email: string | null;
  is_active: boolean;
  created_at: string;
}

export default function AdminFormsPage() {
  const [forms, setForms]     = useState<FormRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  }

  const fetchForms = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/forms");
      if (!res.ok) throw new Error("Failed to load forms");
      setForms(await res.json());
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchForms(); }, [fetchForms]);

  async function handleDelete(form: FormRow) {
    if (!confirm(`Delete form "${form.name}"?\n\nAll fields and submissions will also be deleted. This cannot be undone.`)) return;
    setDeletingId(form.id);
    try {
      const res = await fetch(`/api/forms/${form.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      showToast("success", "Form deleted.");
      setForms((prev) => prev.filter((f) => f.id !== form.id));
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Unknown error");
    } finally {
      setDeletingId(null);
    }
  }

  async function toggleActive(form: FormRow) {
    try {
      const res = await fetch(`/api/forms/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !form.is_active }),
      });
      if (!res.ok) throw new Error("Update failed");
      setForms((prev) => prev.map((f) => f.id === form.id ? { ...f, is_active: !f.is_active } : f));
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Unknown error");
    }
  }

  return (
    <div className="bg-[#0f0f0f] min-h-screen py-10 px-5">
      <div className="max-w-5xl mx-auto">

        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h1 className="text-white font-black text-2xl uppercase tracking-wide">Forms</h1>
            <p className="text-gray-600 text-xs mt-1 uppercase tracking-wider">
              {forms.length} form{forms.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Link
            href="/admin/forms/new"
            className="bg-[#C9A84C] text-black font-black text-xs uppercase tracking-widest px-6 py-3 rounded hover:bg-yellow-400 transition-colors whitespace-nowrap"
          >
            + Create Form
          </Link>
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
        ) : forms.length === 0 ? (
          <div className="text-center py-20 border border-white/10 rounded">
            <p className="text-gray-600 text-sm uppercase tracking-wider">No forms yet</p>
            <p className="text-gray-700 text-xs mt-2">Click &ldquo;+ Create Form&rdquo; to build your first form.</p>
          </div>
        ) : (
          <div className="border border-white/10 rounded overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#1a1a1a] border-b border-white/10">
                  <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Name</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 hidden sm:table-cell">URL</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 hidden md:table-cell">Status</th>
                  <th className="px-4 py-3 w-48" />
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {forms.map((form) => (
                  <tr key={form.id} className="bg-[#111111] hover:bg-[#161616] transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-white font-semibold text-sm">{form.name}</p>
                      {form.description && (
                        <p className="text-gray-600 text-xs mt-0.5 line-clamp-1">{form.description}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <a
                        href={`/forms/${form.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#C9A84C] text-xs hover:underline font-mono"
                      >
                        /forms/{form.slug}
                      </a>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                        form.is_active
                          ? "bg-emerald-900/30 text-emerald-400 border-emerald-800/40"
                          : "bg-gray-900/30 text-gray-500 border-gray-700/40"
                      }`}>
                        {form.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2 flex-wrap">
                        <Link
                          href={`/admin/forms/${form.id}/submissions`}
                          className="text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:text-white border border-white/10 hover:border-white/30 px-2.5 py-1.5 rounded transition-colors"
                        >
                          Submissions
                        </Link>
                        <Link
                          href={`/admin/forms/${form.id}`}
                          className="text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:text-white border border-white/10 hover:border-white/30 px-2.5 py-1.5 rounded transition-colors"
                        >
                          Build
                        </Link>
                        <button
                          onClick={() => toggleActive(form)}
                          className="text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:text-white border border-white/10 hover:border-white/30 px-2.5 py-1.5 rounded transition-colors"
                        >
                          {form.is_active ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          onClick={() => handleDelete(form)}
                          disabled={deletingId === form.id}
                          className="text-[10px] font-bold uppercase tracking-wider text-gray-600 hover:text-red-400 border border-white/10 hover:border-red-500/30 px-2.5 py-1.5 rounded transition-colors disabled:opacity-40"
                        >
                          {deletingId === form.id ? "…" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

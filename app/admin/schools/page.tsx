"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import type { SchoolRow } from "@/components/admin/SchoolForm";

const LEVEL_COLORS: Record<string, string> = {
  "Elementary": "bg-blue-900/30 text-blue-400 border-blue-800/40",
  "Intermediate": "bg-purple-900/30 text-purple-400 border-purple-800/40",
  "Other": "bg-gray-900/30 text-gray-400 border-gray-700/40",
};

export default function AdminSchoolsPage() {
  const [schools, setSchools] = useState<SchoolRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  }

  const fetchSchools = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/schools");
      if (!res.ok) throw new Error("Failed to load schools");
      setSchools(await res.json());
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSchools(); }, [fetchSchools]);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/schools/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      showToast("success", `"${name}" deleted.`);
      setSchools((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Unknown error");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="bg-[#0f0f0f] min-h-screen py-10 px-5">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-white font-black text-2xl uppercase tracking-wide">Schools</h1>
            <p className="text-gray-600 text-xs mt-1 uppercase tracking-wider">
              {schools.length} school{schools.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Link
            href="/admin/schools/new"
            className="bg-[#C9A84C] text-black font-black text-xs uppercase tracking-widest px-6 py-3 rounded hover:bg-yellow-400 transition-colors whitespace-nowrap"
          >
            + Add School
          </Link>
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

        {/* Table */}
        {loading ? (
          <p className="text-gray-600 text-sm uppercase tracking-wider py-12 text-center">Loading…</p>
        ) : schools.length === 0 ? (
          <div className="text-center py-20 border border-white/10 rounded">
            <p className="text-gray-600 text-sm uppercase tracking-wider">No schools yet</p>
            <p className="text-gray-700 text-xs mt-2">Click &ldquo;+ Add School&rdquo; to create the first one.</p>
          </div>
        ) : (
          <div className="border border-white/10 rounded overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#1a1a1a] border-b border-white/10">
                  <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                    School Name
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                    Level
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 hidden sm:table-cell w-16">
                    Order
                  </th>
                  <th className="px-4 py-3 w-24" />
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {schools.map((school) => (
                  <tr key={school.id} className="bg-[#111111] hover:bg-[#161616] transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-white font-medium">{school.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded border ${LEVEL_COLORS[school.level] ?? "bg-gray-900/30 text-gray-400 border-gray-700/40"}`}>
                        {school.level}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs hidden sm:table-cell">
                      {school.sort_order}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/schools/${school.id}/edit`}
                          className="text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:text-white border border-white/10 hover:border-white/30 px-3 py-1.5 rounded transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(school.id, school.name)}
                          disabled={deletingId === school.id}
                          className="text-[10px] font-bold uppercase tracking-wider text-gray-600 hover:text-red-400 border border-white/10 hover:border-red-500/30 px-3 py-1.5 rounded transition-colors disabled:opacity-40"
                        >
                          {deletingId === school.id ? "…" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <a
            href="/schools"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-600 hover:text-[#C9A84C] uppercase tracking-wider transition-colors"
          >
            View public schools page →
          </a>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import type { FaqRow } from "@/components/admin/FaqForm";

const CATEGORY_COLORS: Record<string, string> = {
  "General": "bg-blue-900/30 text-blue-400 border-blue-800/40",
  "Registration": "bg-emerald-900/30 text-emerald-400 border-emerald-800/40",
  "Tax & Finances": "bg-amber-900/30 text-amber-400 border-amber-800/40",
};

export default function AdminFaqPage() {
  const [faqs, setFaqs] = useState<FaqRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  }

  const fetchFaqs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/faq");
      if (!res.ok) throw new Error("Failed to load FAQs");
      setFaqs(await res.json());
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFaqs(); }, [fetchFaqs]);

  async function handleDelete(id: string, question: string) {
    if (!confirm(`Delete this FAQ?\n\n"${question}"\n\nThis cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/faq/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      showToast("success", "FAQ deleted.");
      setFaqs((prev) => prev.filter((f) => f.id !== id));
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
            <h1 className="text-white font-black text-2xl uppercase tracking-wide">FAQ</h1>
            <p className="text-gray-600 text-xs mt-1 uppercase tracking-wider">
              {faqs.length} question{faqs.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Link
            href="/admin/faq/new"
            className="bg-[#C9A84C] text-black font-black text-xs uppercase tracking-widest px-6 py-3 rounded hover:bg-yellow-400 transition-colors whitespace-nowrap"
          >
            + Add FAQ
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
        ) : faqs.length === 0 ? (
          <div className="text-center py-20 border border-white/10 rounded">
            <p className="text-gray-600 text-sm uppercase tracking-wider">No FAQs yet</p>
            <p className="text-gray-700 text-xs mt-2">Click &ldquo;+ Add FAQ&rdquo; to create the first one.</p>
          </div>
        ) : (
          <div className="border border-white/10 rounded overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#1a1a1a] border-b border-white/10">
                  <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                    Category
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                    Question
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 hidden sm:table-cell w-16">
                    Order
                  </th>
                  <th className="px-4 py-3 w-24" />
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {faqs.map((faq) => (
                  <tr key={faq.id} className="bg-[#111111] hover:bg-[#161616] transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded border ${CATEGORY_COLORS[faq.category] ?? "bg-gray-900/30 text-gray-400 border-gray-700/40"}`}>
                        {faq.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-white font-medium text-sm line-clamp-2">
                        {faq.question}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs hidden sm:table-cell">
                      {faq.sort_order}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/faq/${faq.id}/edit`}
                          className="text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:text-white border border-white/10 hover:border-white/30 px-3 py-1.5 rounded transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(faq.id, faq.question)}
                          disabled={deletingId === faq.id}
                          className="text-[10px] font-bold uppercase tracking-wider text-gray-600 hover:text-red-400 border border-white/10 hover:border-red-500/30 px-3 py-1.5 rounded transition-colors disabled:opacity-40"
                        >
                          {deletingId === faq.id ? "…" : "Delete"}
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
            href="/faq"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-600 hover:text-[#C9A84C] uppercase tracking-wider transition-colors"
          >
            View public FAQ →
          </a>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export interface FaqRow {
  id: string;
  category: "General" | "Registration" | "Tax & Finances";
  question: string;
  answer: string;
  sort_order: number;
  created_at: string;
}

type FaqCategory = "General" | "Registration" | "Tax & Finances";

const CATEGORIES: FaqCategory[] = ["General", "Registration", "Tax & Finances"];

interface FaqFormProps {
  existing?: FaqRow;
}

export default function FaqForm({ existing }: FaqFormProps) {
  const router = useRouter();
  const isEdit = !!existing;

  const [form, setForm] = useState({
    category: existing?.category ?? ("General" as FaqCategory),
    question: existing?.question ?? "",
    answer: existing?.answer ?? "",
    sort_order: existing?.sort_order ?? 0,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): string | null {
    if (!form.question.trim()) return "Question is required.";
    if (!form.answer.trim()) return "Answer is required.";
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setSaving(true);
    setError(null);

    try {
      const url = isEdit ? `/api/faq/${existing!.id}` : "/api/faq";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          question: form.question.trim(),
          answer: form.answer.trim(),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Request failed (${res.status})`);
      }

      router.push("/admin/faq");
      router.refresh();
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
            href="/admin/faq"
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600 hover:text-gray-400 transition-colors"
          >
            ← Back to FAQs
          </Link>
          <h1 className="text-white font-black text-2xl uppercase tracking-wide mt-4">
            {isEdit ? "Edit FAQ" : "Add FAQ"}
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#1a1a1a] border border-white/10 rounded p-6 flex flex-col gap-6"
        >
          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="category"
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500"
            >
              Category
            </label>
            <select
              id="category"
              value={form.category}
              onChange={(e) => set("category", e.target.value as FaqCategory)}
              className="bg-[#111] border border-white/10 rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9A84C] transition-colors appearance-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Question */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="question"
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500"
            >
              Question
            </label>
            <input
              id="question"
              type="text"
              required
              value={form.question}
              onChange={(e) => set("question", e.target.value)}
              placeholder="e.g. How do I register?"
              className="bg-[#111] border border-white/10 rounded px-4 py-2.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-[#C9A84C] transition-colors"
            />
          </div>

          {/* Answer */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="answer"
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500"
            >
              Answer
              <span className="ml-2 text-gray-700 normal-case tracking-normal font-normal">
                (separate paragraphs with a blank line)
              </span>
            </label>
            <textarea
              id="answer"
              required
              rows={7}
              value={form.answer}
              onChange={(e) => set("answer", e.target.value)}
              placeholder="Type the answer here…"
              className="bg-[#111] border border-white/10 rounded px-4 py-2.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-[#C9A84C] transition-colors resize-y leading-relaxed"
            />
          </div>

          {/* Sort order */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="sort_order"
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500"
            >
              Sort Order
              <span className="ml-2 text-gray-700 normal-case tracking-normal font-normal">
                (lower numbers appear first within a category)
              </span>
            </label>
            <input
              id="sort_order"
              type="number"
              value={form.sort_order}
              onChange={(e) => set("sort_order", Number(e.target.value))}
              className="bg-[#111] border border-white/10 rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9A84C] transition-colors w-32"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-[#C8102E] text-xs font-semibold">{error}</p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-[#C9A84C] text-black font-black text-sm uppercase tracking-widest py-3 rounded hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving…" : isEdit ? "Save Changes" : "Add FAQ"}
            </button>
            <Link
              href="/admin/faq"
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

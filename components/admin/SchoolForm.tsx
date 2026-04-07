"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export interface SchoolRow {
  id: string;
  name: string;
  level: "Elementary" | "Intermediate" | "Other";
  sort_order: number;
  created_at: string;
}

type SchoolLevel = "Elementary" | "Intermediate" | "Other";

const LEVELS: SchoolLevel[] = ["Elementary", "Intermediate", "Other"];

interface SchoolFormProps {
  existing?: SchoolRow;
}

export default function SchoolForm({ existing }: SchoolFormProps) {
  const router = useRouter();
  const isEdit = !!existing;

  const [form, setForm] = useState({
    name: existing?.name ?? "",
    level: existing?.level ?? ("Elementary" as SchoolLevel),
    sort_order: existing?.sort_order ?? 0,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { setError("School name is required."); return; }

    setSaving(true);
    setError(null);

    try {
      const url = isEdit ? `/api/schools/${existing!.id}` : "/api/schools";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, name: form.name.trim() }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Request failed (${res.status})`);
      }

      router.push("/admin/schools");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setSaving(false);
    }
  }

  return (
    <div className="bg-[#0f0f0f] min-h-screen py-10 px-5">
      <div className="max-w-xl mx-auto">

        <div className="mb-8">
          <Link
            href="/admin/schools"
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600 hover:text-gray-400 transition-colors"
          >
            ← Back to Schools
          </Link>
          <h1 className="text-white font-black text-2xl uppercase tracking-wide mt-4">
            {isEdit ? "Edit School" : "Add School"}
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#1a1a1a] border border-white/10 rounded p-6 flex flex-col gap-6"
        >
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="name"
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500"
            >
              School Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Holy Trinity Elementary"
              className="bg-[#111] border border-white/10 rounded px-4 py-2.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-[#C9A84C] transition-colors"
            />
          </div>

          {/* Level */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="level"
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500"
            >
              Level
            </label>
            <select
              id="level"
              value={form.level}
              onChange={(e) => set("level", e.target.value as SchoolLevel)}
              className="bg-[#111] border border-white/10 rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9A84C] transition-colors appearance-none"
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          {/* Sort order */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="sort_order"
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500"
            >
              Sort Order
              <span className="ml-2 text-gray-700 normal-case tracking-normal font-normal">
                (lower numbers appear first)
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
              {saving ? "Saving…" : isEdit ? "Save Changes" : "Add School"}
            </button>
            <Link
              href="/admin/schools"
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

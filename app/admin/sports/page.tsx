"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { sports } from "@/data/sports";
import type { SportSection } from "@/components/SportSections";

interface SportWithCount {
  slug: string;
  name: string;
  sectionCount: number | null;
}

export default function AdminSportsPage() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCounts() {
      const results = await Promise.allSettled(
        sports.map(async (s) => {
          const res = await fetch(`/api/sports/${s.slug}/sections`);
          if (!res.ok) return { slug: s.slug, count: 0 };
          const data: SportSection[] = await res.json();
          return { slug: s.slug, count: data.length };
        })
      );
      const map: Record<string, number> = {};
      results.forEach((r) => {
        if (r.status === "fulfilled") map[r.value.slug] = r.value.count;
      });
      setCounts(map);
      setLoading(false);
    }
    loadCounts();
  }, []);

  const sportsWithCounts: SportWithCount[] = sports.map((s) => ({
    slug: s.slug,
    name: s.name,
    sectionCount: loading ? null : (counts[s.slug] ?? 0),
  }));

  return (
    <div className="bg-[#0f0f0f] min-h-screen py-10 px-5">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-white font-black text-2xl uppercase tracking-wide">Sports Pages</h1>
          <p className="text-gray-600 text-xs mt-1 uppercase tracking-wider">
            Select a sport to manage its page content
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sportsWithCounts.map((sport) => (
            <Link
              key={sport.slug}
              href={`/admin/sports/${sport.slug}`}
              className="group bg-[#1a1a1a] border border-white/10 hover:border-[#C9A84C]/40 rounded p-5 flex items-center justify-between transition-all"
            >
              <div>
                <p className="text-white font-black text-sm uppercase tracking-wide group-hover:text-[#C9A84C] transition-colors">
                  {sport.name}
                </p>
                <p className="text-gray-600 text-[10px] uppercase tracking-wider mt-1">
                  {sport.sectionCount === null
                    ? "Loading…"
                    : `${sport.sectionCount} section${sport.sectionCount !== 1 ? "s" : ""}`}
                </p>
              </div>
              <span className="text-gray-600 group-hover:text-[#C9A84C] text-sm transition-colors">
                →
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-white/10">
          <a
            href="/sports"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-600 hover:text-[#C9A84C] uppercase tracking-wider transition-colors"
          >
            View public Sports page →
          </a>
        </div>
      </div>
    </div>
  );
}

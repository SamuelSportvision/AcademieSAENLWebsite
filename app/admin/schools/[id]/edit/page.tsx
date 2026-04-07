"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SchoolForm, { type SchoolRow } from "@/components/admin/SchoolForm";

export default function EditSchoolPage() {
  const { id } = useParams<{ id: string }>();
  const [school, setSchool] = useState<SchoolRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/schools");
        if (!res.ok) throw new Error("Failed to load schools");
        const schools: SchoolRow[] = await res.json();
        const found = schools.find((s) => s.id === id);
        if (!found) throw new Error("School not found");
        setSchool(found);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-[#0f0f0f] min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-sm uppercase tracking-wider">Loading…</p>
      </div>
    );
  }

  if (error || !school) {
    return (
      <div className="bg-[#0f0f0f] min-h-screen flex items-center justify-center">
        <p className="text-red-400 text-sm">{error ?? "School not found"}</p>
      </div>
    );
  }

  return <SchoolForm existing={school} />;
}

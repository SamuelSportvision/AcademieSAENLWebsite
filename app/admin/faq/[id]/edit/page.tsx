"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FaqForm, { type FaqRow } from "@/components/admin/FaqForm";

export default function EditFaqPage() {
  const { id } = useParams<{ id: string }>();
  const [faq, setFaq] = useState<FaqRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/faq");
        if (!res.ok) throw new Error("Failed to load FAQs");
        const faqs: FaqRow[] = await res.json();
        const found = faqs.find((f) => f.id === id);
        if (!found) throw new Error("FAQ not found");
        setFaq(found);
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

  if (error || !faq) {
    return (
      <div className="bg-[#0f0f0f] min-h-screen flex items-center justify-center">
        <p className="text-red-400 text-sm">{error ?? "FAQ not found"}</p>
      </div>
    );
  }

  return <FaqForm existing={faq} />;
}

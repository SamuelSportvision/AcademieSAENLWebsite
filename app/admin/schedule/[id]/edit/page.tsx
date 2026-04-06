"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import EventForm from "@/components/admin/EventForm";
import type { ScheduleEvent } from "@/types/schedule";

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<ScheduleEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/schedule");
        if (!res.ok) throw new Error("Failed to load events");
        const events: ScheduleEvent[] = await res.json();
        const found = events.find((e) => e.id === id);
        if (!found) throw new Error("Event not found");
        setEvent(found);
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

  if (error || !event) {
    return (
      <div className="bg-[#0f0f0f] min-h-screen flex items-center justify-center">
        <p className="text-red-400 text-sm">{error ?? "Event not found"}</p>
      </div>
    );
  }

  return <EventForm existing={event} />;
}

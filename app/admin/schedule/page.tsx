"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { DAYS_OF_WEEK } from "@/types/schedule";
import type { ScheduleEvent } from "@/types/schedule";

function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
}

const DAY_ORDER = Object.fromEntries(DAYS_OF_WEEK.map((d, i) => [d, i]));

export default function AdminSchedulePage() {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  }

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/schedule");
      if (!res.ok) throw new Error("Failed to load events");
      const data: ScheduleEvent[] = await res.json();
      data.sort((a, b) => {
        const dayDiff = (DAY_ORDER[a.day] ?? 0) - (DAY_ORDER[b.day] ?? 0);
        if (dayDiff !== 0) return dayDiff;
        return a.start_time.localeCompare(b.start_time);
      });
      setEvents(data);
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/schedule/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      showToast("success", `"${name}" deleted.`);
      setEvents((prev) => prev.filter((e) => e.id !== id));
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
            <h1 className="text-white font-black text-2xl uppercase tracking-wide">
              Schedule
            </h1>
            <p className="text-gray-600 text-xs mt-1 uppercase tracking-wider">
              {events.length} event{events.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Link
            href="/admin/schedule/new"
            className="bg-[#C9A84C] text-black font-black text-xs uppercase tracking-widest px-6 py-3 rounded hover:bg-yellow-400 transition-colors whitespace-nowrap"
          >
            + Add Event
          </Link>
        </div>

        {/* Toast */}
        {toast && (
          <div
            className={`mb-6 px-5 py-3 rounded text-sm font-semibold ${
              toast.type === "success"
                ? "bg-emerald-900/40 border border-emerald-700/40 text-emerald-400"
                : "bg-red-900/40 border border-red-700/40 text-red-400"
            }`}
          >
            {toast.message}
          </div>
        )}

        {/* Table */}
        {loading ? (
          <p className="text-gray-600 text-sm uppercase tracking-wider py-12 text-center">
            Loading…
          </p>
        ) : events.length === 0 ? (
          <div className="text-center py-20 border border-white/10 rounded">
            <p className="text-gray-600 text-sm uppercase tracking-wider">No events yet</p>
            <p className="text-gray-700 text-xs mt-2">
              Click &ldquo;+ Add Event&rdquo; to create the first one.
            </p>
          </div>
        ) : (
          <div className="border border-white/10 rounded overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#1a1a1a] border-b border-white/10">
                  <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                    Sport
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                    Day
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                    Time
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 hidden sm:table-cell">
                    Location
                  </th>
                  <th className="px-4 py-3 w-24" />
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {events.map((event) => (
                  <tr
                    key={event.id}
                    className="bg-[#111111] hover:bg-[#161616] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                          style={{ backgroundColor: event.color }}
                        />
                        <span className="font-bold text-white">
                          {event.sport_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{event.day}</td>
                    <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                      {formatTime(event.start_time)} – {formatTime(event.end_time)}
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">
                      {event.location ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/schedule/${event.id}/edit`}
                          className="text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:text-white border border-white/10 hover:border-white/30 px-3 py-1.5 rounded transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(event.id, event.sport_name)}
                          disabled={deletingId === event.id}
                          className="text-[10px] font-bold uppercase tracking-wider text-gray-600 hover:text-red-400 border border-white/10 hover:border-red-500/30 px-3 py-1.5 rounded transition-colors disabled:opacity-40"
                        >
                          {deletingId === event.id ? "…" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* View public schedule link */}
        <div className="mt-6 flex justify-end">
          <a
            href="/schedule"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-600 hover:text-[#C9A84C] uppercase tracking-wider transition-colors"
          >
            View public schedule →
          </a>
        </div>
      </div>
    </div>
  );
}

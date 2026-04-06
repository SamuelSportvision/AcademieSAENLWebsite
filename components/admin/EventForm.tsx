"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { sports } from "@/data/sports";
import { DAYS_OF_WEEK } from "@/types/schedule";
import type { NewScheduleEvent, ScheduleEvent } from "@/types/schedule";

interface EventFormProps {
  /** When provided, the form is in edit mode. */
  existing?: ScheduleEvent;
}

const DEFAULT_COLOR = "#C9A84C";

function sportColor(slug: string): string {
  return sports.find((s) => s.slug === slug)?.accentColor ?? DEFAULT_COLOR;
}

export default function EventForm({ existing }: EventFormProps) {
  const router = useRouter();
  const isEdit = !!existing;

  const [form, setForm] = useState<NewScheduleEvent>({
    day: existing?.day ?? "Monday",
    sport_slug: existing?.sport_slug ?? sports[0].slug,
    sport_name: existing?.sport_name ?? sports[0].name,
    start_time: existing?.start_time ?? "15:00",
    end_time: existing?.end_time ?? "17:00",
    location: existing?.location ?? "",
    color: existing?.color ?? sportColor(existing?.sport_slug ?? sports[0].slug),
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSportChange(slug: string) {
    const sport = sports.find((s) => s.slug === slug);
    if (!sport) return;
    setForm((prev) => ({
      ...prev,
      sport_slug: slug,
      sport_name: sport.name,
      // Only auto-update color if it wasn't manually changed from the sport default
      color: prev.color === sportColor(prev.sport_slug) ? sport.accentColor : prev.color,
    }));
  }

  function validate(): string | null {
    if (!form.start_time || !form.end_time) return "Start and end times are required.";
    if (form.start_time >= form.end_time) return "End time must be after start time.";
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      ...form,
      location: form.location?.trim() || null,
    };

    try {
      const url = isEdit
        ? `/api/schedule/${existing!.id}`
        : "/api/schedule";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Request failed (${res.status})`);
      }

      router.push("/admin/schedule");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setSaving(false);
    }
  }

  return (
    <div className="bg-[#0f0f0f] min-h-screen py-10 px-5">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/schedule"
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600 hover:text-gray-400 transition-colors"
          >
            ← Back to Schedule
          </Link>
          <h1 className="text-white font-black text-2xl uppercase tracking-wide mt-4">
            {isEdit ? "Edit Event" : "Add Event"}
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#1a1a1a] border border-white/10 rounded p-6 flex flex-col gap-6"
        >
          {/* Sport */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="sport"
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500"
            >
              Sport / Program
            </label>
            <select
              id="sport"
              value={form.sport_slug}
              onChange={(e) => handleSportChange(e.target.value)}
              className="bg-[#111] border border-white/10 rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9A84C] transition-colors appearance-none"
            >
              {sports.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Day */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="day"
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500"
            >
              Day of Week
            </label>
            <select
              id="day"
              value={form.day}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  day: e.target.value as NewScheduleEvent["day"],
                }))
              }
              className="bg-[#111] border border-white/10 rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9A84C] transition-colors appearance-none"
            >
              {DAYS_OF_WEEK.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Start & End time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="start_time"
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500"
              >
                Start Time
              </label>
              <input
                id="start_time"
                type="time"
                required
                value={form.start_time}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, start_time: e.target.value }))
                }
                className="bg-[#111] border border-white/10 rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9A84C] transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="end_time"
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500"
              >
                End Time
              </label>
              <input
                id="end_time"
                type="time"
                required
                value={form.end_time}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, end_time: e.target.value }))
                }
                className="bg-[#111] border border-white/10 rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9A84C] transition-colors"
              />
            </div>
          </div>

          {/* Location */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="location"
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500"
            >
              Location{" "}
              <span className="text-gray-700 normal-case tracking-normal font-normal">
                (optional)
              </span>
            </label>
            <input
              id="location"
              type="text"
              value={form.location ?? ""}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, location: e.target.value }))
              }
              placeholder="e.g. Gym A, Ice Rink, The Court House"
              className="bg-[#111] border border-white/10 rounded px-4 py-2.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-[#C9A84C] transition-colors"
            />
          </div>

          {/* Color */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="color"
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500"
            >
              Colour
            </label>
            <div className="flex items-center gap-3">
              <input
                id="color"
                type="color"
                value={form.color}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, color: e.target.value }))
                }
                className="w-10 h-10 rounded border border-white/10 bg-[#111] cursor-pointer p-0.5"
              />
              <span className="text-xs text-gray-500 font-mono">{form.color}</span>
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    color: sportColor(prev.sport_slug),
                  }))
                }
                className="text-[10px] text-gray-600 hover:text-gray-400 uppercase tracking-wider transition-colors ml-auto"
              >
                Reset to default
              </button>
            </div>
          </div>

          {/* Preview */}
          <div
            className="rounded px-4 py-3 flex items-center gap-3"
            style={{
              backgroundColor: `${form.color}22`,
              borderLeft: `3px solid ${form.color}`,
            }}
          >
            <div>
              <p
                className="text-sm font-black uppercase tracking-wide"
                style={{ color: form.color }}
              >
                {form.sport_name}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {form.day} · {form.start_time} – {form.end_time}
                {form.location ? ` · ${form.location}` : ""}
              </p>
            </div>
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
              {saving
                ? "Saving…"
                : isEdit
                ? "Save Changes"
                : "Add Event"}
            </button>
            <Link
              href="/admin/schedule"
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

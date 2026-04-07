"use client";

import { useState, useMemo } from "react";
import { DAYS_OF_WEEK } from "@/types/schedule";
import type { ScheduleEvent, DayOfWeek } from "@/types/schedule";

function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
}

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function FilterPill({
  label,
  active,
  onClick,
  accentColor,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  accentColor?: string;
}) {
  const activeStyle =
    active && accentColor
      ? {
          borderColor: `${accentColor}55`,
          backgroundColor: `${accentColor}18`,
          color: accentColor,
        }
      : undefined;

  return (
    <button
      onClick={onClick}
      className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border transition-colors whitespace-nowrap ${
        active
          ? "border-[#C9A84C]/50 bg-[#C9A84C]/10 text-[#C9A84C]"
          : "border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-300"
      }`}
      style={activeStyle}
    >
      {label}
    </button>
  );
}

export default function ScheduleCalendar({ events }: { events: ScheduleEvent[] }) {
  const [activeDay, setActiveDay] = useState<DayOfWeek | "All">("All");
  const [activeSport, setActiveSport] = useState<string>("All");

  const daysWithEvents = useMemo(
    () => DAYS_OF_WEEK.filter((d) => events.some((e) => e.day === d)),
    [events]
  );

  const sportOptions = useMemo(
    () =>
      Array.from(
        new Map(
          events.map((e) => [
            e.sport_slug,
            { slug: e.sport_slug, name: e.sport_name, color: e.color },
          ])
        ).values()
      ),
    [events]
  );

  const filteredEvents = useMemo(
    () =>
      events.filter((e) => {
        const dayMatch = activeDay === "All" || e.day === activeDay;
        const sportMatch = activeSport === "All" || e.sport_slug === activeSport;
        return dayMatch && sportMatch;
      }),
    [events, activeDay, activeSport]
  );

  const visibleDays: DayOfWeek[] =
    activeDay === "All" ? daysWithEvents : [activeDay];

  const legendItems = useMemo(
    () =>
      Array.from(
        new Map(
          filteredEvents.map((e) => [e.sport_slug, { name: e.sport_name, color: e.color }])
        ).values()
      ),
    [filteredEvents]
  );

  const hasResults = filteredEvents.length > 0;

  return (
    <div>
      {/* ── Filter bar ── */}
      <div className="mb-10 flex flex-col gap-3">
        {daysWithEvents.length > 1 && (
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600 w-9 flex-shrink-0">
              Day
            </span>
            <div className="flex flex-wrap gap-1.5">
              <FilterPill label="All" active={activeDay === "All"} onClick={() => setActiveDay("All")} />
              {daysWithEvents.map((day) => (
                <FilterPill
                  key={day}
                  label={day.slice(0, 3)}
                  active={activeDay === day}
                  onClick={() => setActiveDay(activeDay === day ? "All" : day)}
                />
              ))}
            </div>
          </div>
        )}

        {sportOptions.length > 1 && (
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600 w-9 flex-shrink-0">
              Sport
            </span>
            <div className="flex flex-wrap gap-1.5">
              <FilterPill label="All" active={activeSport === "All"} onClick={() => setActiveSport("All")} />
              {sportOptions.map((sport) => (
                <FilterPill
                  key={sport.slug}
                  label={sport.name}
                  active={activeSport === sport.slug}
                  accentColor={sport.color}
                  onClick={() => setActiveSport(activeSport === sport.slug ? "All" : sport.slug)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── No results ── */}
      {!hasResults && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <p className="text-gray-600 text-sm uppercase tracking-[0.2em]">
            No sessions match your filters
          </p>
          <button
            onClick={() => { setActiveDay("All"); setActiveSport("All"); }}
            className="text-[10px] text-[#C9A84C] uppercase tracking-widest hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* ── Day list view ── */}
      {hasResults && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-12">
            {visibleDays.map((day) => {
              const dayEvents = filteredEvents
                .filter((e) => e.day === day)
                .sort((a, b) => a.start_time.localeCompare(b.start_time));
              if (dayEvents.length === 0) return null;

              return (
                <div key={day}>
                  {/* Day heading */}
                  <div className="flex items-center gap-4 mb-5">
                    <p className="text-[#C9A84C] text-[10px] font-black uppercase tracking-[0.3em] whitespace-nowrap">
                      {day}
                    </p>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>

                  {/* Event cards */}
                  <div className="flex flex-col gap-2.5">
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className="rounded px-4 py-3.5 flex items-start gap-4"
                        style={{
                          backgroundColor: hexToRgba(event.color, 0.1),
                          borderLeft: `3px solid ${event.color}`,
                        }}
                      >
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm font-black uppercase tracking-wide leading-tight"
                            style={{ color: event.color }}
                          >
                            {event.sport_name}
                          </p>
                          <p className="text-xs text-gray-400 mt-1 leading-snug">
                            {formatTime(event.start_time)} – {formatTime(event.end_time)}
                          </p>
                          {event.location && (
                            <p className="text-[11px] text-gray-600 mt-0.5 truncate">
                              {event.location}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Legend ── */}
          {legendItems.length > 0 && (
            <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap gap-x-6 gap-y-3">
              {legendItems.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

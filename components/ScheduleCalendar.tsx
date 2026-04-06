"use client";

import { useState, useMemo } from "react";
import { DAYS_OF_WEEK } from "@/types/schedule";
import type { ScheduleEvent, DayOfWeek } from "@/types/schedule";

// ─── Calendar config ───────────────────────────────────────────────────────────
const CALENDAR_START_HOUR = 15;
const CALENDAR_END_HOUR = 21;
const SLOT_HEIGHT_PX = 72;
const TOTAL_SLOTS = (CALENDAR_END_HOUR - CALENDAR_START_HOUR) * 2;
const TOTAL_COLUMN_HEIGHT = TOTAL_SLOTS * SLOT_HEIGHT_PX;

// ─── Helpers ───────────────────────────────────────────────────────────────────
function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function timeToPixel(time: string): number {
  return ((timeToMinutes(time) - CALENDAR_START_HOUR * 60) / 30) * SLOT_HEIGHT_PX;
}

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

const TIME_LABELS: string[] = Array.from({ length: TOTAL_SLOTS }, (_, i) => {
  const totalMin = CALENDAR_START_HOUR * 60 + i * 30;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
});

// ─── Collision layout ──────────────────────────────────────────────────────────
interface EventLayoutInfo {
  event: ScheduleEvent;
  colIndex: number;
  totalCols: number;
}

function doOverlap(a: ScheduleEvent, b: ScheduleEvent): boolean {
  return a.start_time < b.end_time && b.start_time < a.end_time;
}

function layoutDayEvents(events: ScheduleEvent[]): EventLayoutInfo[] {
  if (events.length === 0) return [];
  const sorted = [...events].sort((a, b) => a.start_time.localeCompare(b.start_time));
  const n = sorted.length;

  const laneEndTimes: string[] = [];
  const laneOf: number[] = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    let assigned = -1;
    for (let lane = 0; lane < laneEndTimes.length; lane++) {
      if (laneEndTimes[lane] <= sorted[i].start_time) {
        assigned = lane;
        laneEndTimes[lane] = sorted[i].end_time;
        break;
      }
    }
    if (assigned === -1) {
      assigned = laneEndTimes.length;
      laneEndTimes.push(sorted[i].end_time);
    }
    laneOf[i] = assigned;
  }

  const clusterOf: number[] = new Array(n).fill(-1);
  let clusterCount = 0;
  for (let i = 0; i < n; i++) {
    if (clusterOf[i] !== -1) continue;
    const queue = [i];
    clusterOf[i] = clusterCount;
    while (queue.length > 0) {
      const cur = queue.shift()!;
      for (let j = 0; j < n; j++) {
        if (clusterOf[j] === -1 && doOverlap(sorted[cur], sorted[j])) {
          clusterOf[j] = clusterCount;
          queue.push(j);
        }
      }
    }
    clusterCount++;
  }

  const clusterLanes = new Map<number, number>();
  for (let i = 0; i < n; i++) {
    const c = clusterOf[i];
    clusterLanes.set(c, Math.max(clusterLanes.get(c) ?? 0, laneOf[i]));
  }

  return sorted.map((event, i) => ({
    event,
    colIndex: laneOf[i],
    totalCols: (clusterLanes.get(clusterOf[i]) ?? 0) + 1,
  }));
}

// ─── Filter pill ───────────────────────────────────────────────────────────────
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

// ─── Main component ────────────────────────────────────────────────────────────
export default function ScheduleCalendar({ events }: { events: ScheduleEvent[] }) {
  const [activeDay, setActiveDay] = useState<DayOfWeek | "All">("All");
  const [activeSport, setActiveSport] = useState<string>("All");

  // Days that actually have events (for filter pills)
  const daysWithEvents = useMemo(
    () => DAYS_OF_WEEK.filter((d) => events.some((e) => e.day === d)),
    [events]
  );

  // Unique sports for filter pills
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

  // Days shown in the grid (filtered)
  const visibleDays: DayOfWeek[] = activeDay === "All" ? DAYS_OF_WEEK : [activeDay];

  // Events after applying both filters
  const filteredEvents = useMemo(
    () =>
      events.filter((e) => {
        const dayMatch = activeDay === "All" || e.day === activeDay;
        const sportMatch = activeSport === "All" || e.sport_slug === activeSport;
        return dayMatch && sportMatch;
      }),
    [events, activeDay, activeSport]
  );

  // Layout per visible day (recalculated on filter changes)
  const layoutByDay = useMemo(() => {
    const result: Record<string, EventLayoutInfo[]> = {};
    for (const day of visibleDays) {
      result[day] = layoutDayEvents(filteredEvents.filter((e) => e.day === day));
    }
    return result;
  }, [filteredEvents, visibleDays]);

  // Legend based on visible filtered events
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
      {/* ── Filter bar ──────────────────────────────────────────────────────── */}
      <div className="mb-8 flex flex-col gap-3">
        {/* Day filter */}
        {daysWithEvents.length > 1 && (
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600 w-9 flex-shrink-0">
              Day
            </span>
            <div className="flex flex-wrap gap-1.5">
              <FilterPill
                label="All"
                active={activeDay === "All"}
                onClick={() => setActiveDay("All")}
              />
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

        {/* Sport filter */}
        {sportOptions.length > 1 && (
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600 w-9 flex-shrink-0">
              Sport
            </span>
            <div className="flex flex-wrap gap-1.5">
              <FilterPill
                label="All"
                active={activeSport === "All"}
                onClick={() => setActiveSport("All")}
              />
              {sportOptions.map((sport) => (
                <FilterPill
                  key={sport.slug}
                  label={sport.name}
                  active={activeSport === sport.slug}
                  accentColor={sport.color}
                  onClick={() =>
                    setActiveSport(activeSport === sport.slug ? "All" : sport.slug)
                  }
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── No results ──────────────────────────────────────────────────────── */}
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

      {hasResults && (
        <>
          {/* ── Desktop grid calendar ─────────────────────────────────────── */}
          <div className="hidden lg:block overflow-x-auto rounded border border-white/10">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `68px repeat(${visibleDays.length}, 1fr)`,
                gridTemplateRows: `48px repeat(${TOTAL_SLOTS}, ${SLOT_HEIGHT_PX}px)`,
                minWidth: visibleDays.length === 1 ? 400 : 720,
              }}
            >
              {/* Corner */}
              <div className="bg-[#1a1a1a] border-b border-r border-white/10" />

              {/* Day headers */}
              {visibleDays.map((day) => (
                <div
                  key={`header-${day}`}
                  className="bg-[#1a1a1a] border-b border-r border-white/10 flex items-center justify-center"
                >
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C9A84C]">
                    {day}
                  </span>
                </div>
              ))}

              {/* Time labels */}
              {TIME_LABELS.map((time, rowIdx) => (
                <div
                  key={`timelabel-${rowIdx}`}
                  className="border-b border-r border-white/10 flex items-start justify-end pr-2 pt-1 bg-[#161616]"
                  style={{ gridRow: rowIdx + 2, gridColumn: 1 }}
                >
                  {rowIdx % 2 === 0 && (
                    <span className="text-[9px] text-gray-600 font-semibold tracking-wide">
                      {formatTime(time)}
                    </span>
                  )}
                </div>
              ))}

              {/* Background cells */}
              {visibleDays.flatMap((day, colIdx) =>
                TIME_LABELS.map((_, rowIdx) => (
                  <div
                    key={`cell-${day}-${rowIdx}`}
                    className={`border-b border-r border-white/5 ${
                      rowIdx % 2 === 0 ? "bg-[#111111]" : "bg-[#0f0f0f]"
                    }`}
                    style={{ gridRow: rowIdx + 2, gridColumn: colIdx + 2 }}
                  />
                ))
              )}

              {/* Event overlays — one per visible day */}
              {visibleDays.map((day, colIdx) => (
                <div
                  key={`overlay-${day}`}
                  style={{
                    gridRow: `2 / ${TOTAL_SLOTS + 2}`,
                    gridColumn: colIdx + 2,
                    position: "relative",
                    height: TOTAL_COLUMN_HEIGHT,
                    pointerEvents: "none",
                  }}
                >
                  {(layoutByDay[day] ?? []).map(({ event, colIndex, totalCols }) => {
                    const top = timeToPixel(event.start_time);
                    const height = timeToPixel(event.end_time) - top;
                    const widthPct = 100 / totalCols;
                    const leftPct = colIndex * widthPct;

                    return (
                      <div
                        key={event.id}
                        className="absolute rounded overflow-hidden flex flex-col gap-0.5 px-2 py-1.5 cursor-default"
                        style={{
                          top: top + 2,
                          height: height - 4,
                          left: `calc(${leftPct}% + 2px)`,
                          width: `calc(${widthPct}% - 4px)`,
                          backgroundColor: hexToRgba(event.color, 0.15),
                          borderLeft: `3px solid ${event.color}`,
                          pointerEvents: "auto",
                        }}
                      >
                        <span
                          className="text-[11px] font-black uppercase tracking-wide leading-tight truncate"
                          style={{ color: event.color }}
                        >
                          {event.sport_name}
                        </span>
                        {height >= 58 && (
                          <span className="text-[10px] text-gray-400 leading-tight truncate">
                            {formatTime(event.start_time)} – {formatTime(event.end_time)}
                          </span>
                        )}
                        {height >= 88 && event.location && (
                          <span className="text-[10px] text-gray-600 truncate">
                            {event.location}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* ── Mobile: day cards ─────────────────────────────────────────── */}
          <div className="lg:hidden flex flex-col gap-8">
            {visibleDays.map((day) => {
              const dayEvents = filteredEvents
                .filter((e) => e.day === day)
                .sort((a, b) => a.start_time.localeCompare(b.start_time));
              if (dayEvents.length === 0) return null;

              return (
                <div key={day}>
                  <div className="flex items-center gap-4 mb-4">
                    <p className="text-[#C9A84C] text-[10px] font-black uppercase tracking-[0.3em] whitespace-nowrap">
                      {day}
                    </p>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>
                  <div className="flex flex-col gap-2">
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-start gap-4 rounded px-4 py-3"
                        style={{
                          backgroundColor: hexToRgba(event.color, 0.1),
                          borderLeft: `3px solid ${event.color}`,
                        }}
                      >
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm font-black uppercase tracking-wide"
                            style={{ color: event.color }}
                          >
                            {event.sport_name}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {formatTime(event.start_time)} –{" "}
                            {formatTime(event.end_time)}
                            {event.location && ` · ${event.location}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Legend ────────────────────────────────────────────────────── */}
          {legendItems.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
              {legendItems.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-sm flex-shrink-0"
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

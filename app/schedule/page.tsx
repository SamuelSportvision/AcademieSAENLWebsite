import type { Metadata } from "next";
import type { ScheduleEvent } from "@/types/schedule";
import ScheduleCalendar from "@/components/ScheduleCalendar";

export const metadata: Metadata = {
  title: "Schedule | SAE Academy",
  description:
    "View the structured weekly development schedule for all SAE Academy programs — hockey, volleyball, soccer, and more.",
};

async function getEvents(): Promise<ScheduleEvent[]> {
  const isConfigured =
    process.env.SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!isConfigured) return [];

  try {
    const { createAdminClient } = await import("@/lib/supabase/server");
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("schedule_events")
      .select("*")
      .order("start_time");

    if (error) throw error;
    return (data as ScheduleEvent[]) ?? [];
  } catch {
    return [];
  }
}

export default async function SchedulePage() {
  const events = await getEvents();

  return (
    <>
      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <section className="bg-[#1a1a1a] border-b border-white/10 pt-28 pb-16 px-5">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#C9A84C] text-xs font-bold uppercase tracking-[0.3em] mb-4">
            SAE Academy
          </p>
          <h1 className="font-black text-5xl sm:text-6xl uppercase text-white leading-none">
            Weekly<br />Schedule
          </h1>
        </div>
      </section>

      {/* ── Calendar ──────────────────────────────────────────────────────── */}
      <section className="bg-[#0f0f0f] py-16 px-5">
        <div className="max-w-7xl mx-auto">
          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <p className="text-gray-500 text-sm font-bold uppercase tracking-[0.2em]">
                Schedule coming soon
              </p>
              <p className="text-gray-700 text-xs">
                Check back later or contact us for details.
              </p>
            </div>
          ) : (
            <ScheduleCalendar events={events} />
          )}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="bg-[#1a1a1a] border-t border-white/10 py-12 px-5">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="text-white font-black text-lg uppercase tracking-wide">
              Ready to join?
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Save your spot in the program that fits your schedule.
            </p>
          </div>
          <a
            href="https://mailchi.mp/saeacademynl/email-sign-up"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#C9A84C] text-black font-black text-sm uppercase tracking-widest px-8 py-4 hover:bg-yellow-400 transition-colors whitespace-nowrap"
          >
            Join Our Mailing List
          </a>
        </div>
      </section>
    </>
  );
}

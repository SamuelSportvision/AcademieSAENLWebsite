import type { Metadata } from "next";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/server";
import { schools as staticSchools, type School } from "@/data/schools";
import ContactModal from "@/components/ContactModal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Participating Schools | SAE Academy",
  description:
    "See the list of partner schools in the SAE Academy Sports Studies program in St. John's, Newfoundland.",
};

async function getSchools(): Promise<School[]> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("schools")
      .select("name, level")
      .order("level")
      .order("sort_order")
      .order("name");

    if (error || !data || data.length === 0) return staticSchools;
    return data as School[];
  } catch {
    return staticSchools;
  }
}

export default async function SchoolsPage() {
  const schools = await getSchools();

  return (
    <>
      {/* Page Header */}
      <section className="bg-[#1a1a1a] border-b border-white/10 pt-28 pb-16 px-5">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#C9A84C] text-xs font-bold uppercase tracking-[0.3em] mb-4">
            SAE Academy
          </p>
          <h1 className="font-black text-5xl sm:text-6xl uppercase text-white leading-none">
            Participating<br />Schools
          </h1>
          <p className="text-gray-400 text-base mt-5 max-w-xl leading-relaxed">
            Students attending one of the following schools are eligible for the transportation to their training facility.
          </p>
        </div>
      </section>

      {/* Schools */}
      <section className="bg-[#0f0f0f] py-16 px-5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
            {schools.map((school) => (
              <div
                key={school.name}
                className="bg-[#1a1a1a] px-6 py-5 hover:bg-[#242424] transition-colors"
              >
                <div className="w-5 h-[2px] bg-[#C9A84C] mb-3" />
                <span className="text-white text-sm font-semibold leading-snug">{school.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info CTA */}
      <section className="bg-[#1a1a1a] border-t border-white/10 py-16 px-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-white font-bold text-lg">
              Don&apos;t see your school on the list?
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <ContactModal
              label="Contact Us"
              className="bg-[#C9A84C] text-black font-black text-sm uppercase tracking-widest px-8 py-4 hover:bg-yellow-400 transition-colors text-center"
            />
            <Link
              href="/sports"
              className="border border-white/20 text-gray-300 font-bold text-sm uppercase tracking-wider px-8 py-4 hover:border-white hover:text-white transition-colors text-center"
            >
              View Programs
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

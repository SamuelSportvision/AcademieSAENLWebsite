import type { Metadata } from "next";
import Link from "next/link";
import { schools } from "@/data/schools";

export const metadata: Metadata = {
  title: "Participating Schools | SAE Academy",
  description:
    "See the list of partner schools in the SAE Academy Sports Studies program in New Brunswick.",
};

export default function SchoolsPage() {
  const elementary = schools.filter((s) => s.level === "Elementary");
  const other = schools.filter((s) => s.level !== "Elementary");

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
            Students attending the following partner schools in New Brunswick are eligible to apply to the SAE Academy Sports Studies program.
          </p>
        </div>
      </section>

      {/* Schools */}
      <section className="bg-[#0f0f0f] py-16 px-5">
        <div className="max-w-7xl mx-auto flex flex-col gap-14">

          {/* Elementary */}
          <div>
            <p className="text-[#C9A84C] text-[10px] font-bold uppercase tracking-[0.3em] mb-6">
              Elementary Schools
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
              {elementary.map((school) => (
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

          {/* Other */}
          {other.length > 0 && (
            <div>
              <p className="text-[#C9A84C] text-[10px] font-bold uppercase tracking-[0.3em] mb-6">
                Intermediate &amp; Other Schools
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
                {other.map((school) => (
                  <div
                    key={school.name}
                    className="bg-[#1a1a1a] px-6 py-5 hover:bg-[#242424] transition-colors"
                  >
                    <div className="w-5 h-[2px] bg-[#C8102E] mb-3" />
                    <span className="text-white text-sm font-semibold leading-snug">{school.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Info CTA */}
      <section className="bg-[#1a1a1a] border-t border-white/10 py-16 px-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-white font-bold text-lg">
              Don&apos;t see your school on the list?
            </p>
            <p className="text-gray-400 text-sm mt-1">
              We are always looking to expand our partner school network. Get in touch.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <a
              href="mailto:info@academiesae.com"
              className="bg-[#C9A84C] text-black font-black text-sm uppercase tracking-widest px-8 py-4 hover:bg-yellow-400 transition-colors text-center"
            >
              Contact Us
            </a>
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

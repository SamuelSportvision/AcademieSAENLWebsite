import Image from "next/image";
import Link from "next/link";
import { sports } from "@/data/sports";
import { schools } from "@/data/schools";
import ContactModal from "@/components/ContactModal";

export default function HomePage() {
  const featuredSchools = schools.slice(0, 6);

  return (
    <>
      {/* ── HERO ── full-viewport photo background */}
      <section className="relative min-h-[100svh] flex items-end overflow-hidden">
        {/* Background photo */}
        <Image
          src="/images/hockey-dark.jpg"
          alt="SAE Academy athletes on ice"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Gradient overlay — dark at bottom for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20" />

        {/* Gold bottom line */}
        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#C9A84C] z-20" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 pb-16 pt-32">
          <p className="text-[#C9A84C] text-xs font-bold uppercase tracking-[0.35em] mb-5">
            Newfoundland Sport Education Program
          </p>
          <h1 className="font-black uppercase text-white leading-none mb-6">
            <span className="block text-[clamp(3rem,10vw,7rem)]">Do More.</span>
            <span className="block text-[clamp(3rem,10vw,7rem)] text-[#C9A84C]">Achieve More.</span>
          </h1>
          <p className="text-gray-300 text-base sm:text-lg max-w-xl leading-relaxed mb-8">
            SAE Academy gives student-athletes and artists an elite afterschool program with qualified coaching, and daily training time to reach their full potential.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/sports"
              className="bg-[#C8102E] text-white font-black text-sm uppercase tracking-widest px-8 py-4 hover:bg-red-700 transition-colors text-center"
            >
              Explore Programs
            </Link>
            <Link
              href="https://go.teamsnap.com/forms/518037"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white text-white font-black text-sm uppercase tracking-widest px-8 py-4 hover:bg-white hover:text-black transition-colors text-center"
            >
              Register Now
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="bg-[#C9A84C]">
        <div className="max-w-7xl mx-auto px-5 py-5 grid grid-cols-3 divide-x divide-black/20">
          {[
            { value: "8", label: "Disciplines" },
            { value: "12", label: "Partner Schools" },
            { value: "Daily", label: "Training" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center py-1 gap-0.5">
              <span className="font-black text-2xl sm:text-3xl text-black uppercase">
                {stat.value}
              </span>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-black/60 text-center">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── BUILDING CHAMPIONS ── 2-col with photo (Tenica-style) */}
      <section className="bg-[#0f0f0f] py-0 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2">
          {/* Photo */}
          <div className="relative min-h-[400px] lg:min-h-[560px]">
            <Image
              src="/images/soccer-team.jpg"
              alt="SAE Academy student-athletes"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>
          {/* Text */}
          <div className="bg-[#0f0f0f] px-8 py-16 lg:px-14 flex flex-col justify-center">
            <p className="text-[#C9A84C] text-xs font-bold uppercase tracking-[0.3em] mb-5">
              Who We Are
            </p>
            <h2 className="font-black text-4xl sm:text-5xl uppercase text-white leading-tight mb-6">
              Building Champions,<br />One Session at a Time.
            </h2>
            <p className="text-gray-300 text-base leading-relaxed mb-4">
              SAE Academy is an elite afterschool program built on a single belief: young athletes and artists deserve the time to train every single day. We partner with established sports organizations across Newfoundland to make that possible.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              Proper facilities, highly qualified coaches, and daily training — all in one program.
            </p>
            <Link
              href="/sports"
              className="self-start bg-[#C9A84C] text-black font-black text-sm uppercase tracking-widest px-8 py-4 hover:bg-yellow-400 transition-colors"
            >
              Our Programs
            </Link>
          </div>
        </div>
      </section>

      {/* ── MISSION & VISION ── */}
      <section className="grid grid-cols-1 md:grid-cols-2">
        {/* Mission — red panel */}
        <div className="bg-[#C8102E] px-10 py-16 sm:px-14 sm:py-20 flex flex-col justify-end gap-8 min-h-[340px]">
          <div>
            <h2 className="font-black text-6xl sm:text-7xl uppercase text-white leading-none mb-6">
              Mission
            </h2>
            <p className="text-red-100 text-base leading-relaxed max-w-md">
              To create an environment that supports high-level athletic and artistic development — giving athletes and artists proper facilities, and highly qualified coaches to succeed in both their sport and their studies.
            </p>
          </div>
        </div>

        {/* Vision — gold panel */}
        <div className="bg-[#C9A84C] px-10 py-16 sm:px-14 sm:py-20 flex flex-col justify-end gap-8 min-h-[340px]">
          <div>
            <h2 className="font-black text-6xl sm:text-7xl uppercase text-white leading-none mb-6">
              Vision
            </h2>
            <p className="text-white/70 text-base leading-relaxed max-w-md">
              To become Newfoundland&apos;s leading reference for sport and artistic development. Through an innovative, adapted academic program, young people will practice their discipline daily and reach their highest potential.
            </p>
          </div>
        </div>
      </section>

      {/* ── PROGRAMS ── photo-backed cards */}
      <section className="bg-[#0f0f0f] py-24 px-5">
        <div className="max-w-7xl mx-auto">
          {/* Mobile: just heading + CTA button */}
          <div className="sm:hidden text-center">
            <p className="text-[#C9A84C] text-xs font-bold uppercase tracking-[0.3em] mb-3">
              Our Programs
            </p>
            <h2 className="font-black text-4xl uppercase text-white leading-tight mb-8">
              Choose Your<br />Discipline
            </h2>
            <Link
              href="/sports"
              className="inline-block bg-[#C9A84C] text-black font-black text-sm uppercase tracking-widest px-8 py-4 hover:bg-yellow-400 transition-colors"
            >
              View All Programs
            </Link>
          </div>

          {/* Desktop: heading + card grid */}
          <div className="hidden sm:block">
            <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
              <div>
                <p className="text-[#C9A84C] text-xs font-bold uppercase tracking-[0.3em] mb-3">
                  Our Programs
                </p>
                <h2 className="font-black text-4xl sm:text-5xl uppercase text-white leading-tight">
                  Choose Your<br />Discipline
                </h2>
              </div>
              <Link
                href="/sports"
                className="text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-[#C9A84C] transition-colors border-b border-gray-600 hover:border-[#C9A84C] pb-1"
              >
                View All Programs
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {sports.map((sport, i) => (
                <Link
                  key={sport.slug}
                  href={`/sports/${sport.slug}`}
                  className="group relative overflow-hidden min-h-[280px] flex flex-col justify-end"
                >
                  {sport.image ? (
                    <>
                      <Image
                        src={sport.image}
                        alt={sport.name}
                        fill
                        sizes="(max-width: 1024px) 50vw, 25vw"
                        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    </>
                  ) : (
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(135deg, #1a1a1a 60%, #C9A84C22)`,
                      }}
                    />
                  )}

                  <div
                    className="absolute top-0 left-0 w-full h-[3px]"
                    style={{ backgroundColor: "#C9A84C" }}
                  />

                  <div className="relative z-10 p-5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-black text-2xl uppercase text-white leading-tight group-hover:text-[#C9A84C] transition-colors">
                      {sport.name}
                    </h3>
                    {sport.partner && (
                      <p className="text-gray-400 text-xs font-medium mt-1">{sport.partner}</p>
                    )}
                    <p className="text-[#C9A84C] text-xs font-bold uppercase tracking-widest mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      Register →
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FULL-WIDTH PHOTO CTA ── (Tenica-style mid-page) */}
      <section className="relative py-28 overflow-hidden">
        <Image
          src="/images/baseball-coach.jpg"
          alt="SAE Academy coaching"
          fill
          sizes="100vw"
          className="object-cover object-[70%_8%]"
        />
        <div className="absolute inset-0 bg-[#C8102E]/75" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-red-200 text-xs font-bold uppercase tracking-[0.3em] mb-4">
              Get Started Today
            </p>
            <h2 className="font-black text-4xl sm:text-5xl uppercase text-white leading-tight">
              Ready to Train<br />at the Next Level?
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Link
              href="https://go.teamsnap.com/forms/518037"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[#C8102E] font-black text-sm uppercase tracking-widest px-8 py-4 hover:bg-black hover:text-white transition-colors text-center"
            >
              Register on TeamSnap
            </Link>
            <ContactModal
              label="Contact Us"
              className="border-2 border-white text-white font-black text-sm uppercase tracking-widest px-8 py-4 hover:bg-white hover:text-[#C8102E] transition-colors text-center"
            />
          </div>
        </div>
      </section>

      {/* ── HOCKEY FEATURE ── photo split (Tenica coach section) */}
      <section className="bg-[#0f0f0f] overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2">
          {/* Text */}
          <div className="bg-[#0f0f0f] px-8 py-16 lg:px-14 flex flex-col justify-center order-2 lg:order-1">
            <p className="text-[#C9A84C] text-xs font-bold uppercase tracking-[0.3em] mb-5">
              Certified Coaches
            </p>
            <h2 className="font-black text-4xl sm:text-5xl uppercase text-white leading-tight mb-6">
              Expert Coaches.<br />Real Results.
            </h2>
            <p className="text-gray-300 text-base leading-relaxed mb-4">
              Every program at SAE Academy is led by experienced, qualified coaches with a passion for athlete development. From on-ice hockey sessions to baseball fundamentals, our coaches bring the expertise your athlete needs to grow.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              Small group training means your athlete gets real attention and individualized feedback every single session.
            </p>
            <Link
              href="/sports"
              className="self-start border-2 border-[#C9A84C] text-[#C9A84C] font-black text-sm uppercase tracking-widest px-8 py-4 hover:bg-[#C9A84C] hover:text-black transition-colors"
            >
              See All Programs
            </Link>
          </div>
          {/* Photo — hidden on mobile to reduce scroll length */}
          <div className="relative hidden lg:block min-h-[520px] order-1 lg:order-2">
            <Image
              src="/images/hockey-coach.jpg"
              alt="SAE Academy hockey coach"
              fill
              sizes="50vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* ── PARTICIPATING SCHOOLS ── */}
      <section className="bg-[#1a1a1a] py-24 px-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <p className="text-[#C9A84C] text-xs font-bold uppercase tracking-[0.3em] mb-3">
                Partner Schools
              </p>
              <h2 className="font-black text-4xl sm:text-5xl uppercase text-white leading-tight">
                Here Is Our<br />Partner Schools
              </h2>
            </div>
            <Link
              href="/schools"
              className="text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-[#C9A84C] transition-colors border-b border-gray-600 hover:border-[#C9A84C] pb-1"
            >
              View All Schools
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
            {featuredSchools.map((school) => (
              <div
                key={school.name}
                className="bg-[#1a1a1a] px-6 py-5 hover:bg-[#242424] transition-colors"
              >
                <div className="w-5 h-[2px] bg-[#C9A84C] mb-3" />
                <span className="text-white text-sm font-semibold">{school.name}</span>
              </div>
            ))}
          </div>
          <p className="text-gray-600 text-xs mt-5 uppercase tracking-widest">
            + {schools.length - featuredSchools.length} more participating schools
          </p>
        </div>
      </section>

      {/* ── TAX REBATE CALLOUT ── */}
      <section className="bg-[#0f0f0f] py-20 px-5 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* Left: heading + description */}
            <div className="flex-1">
              <p className="text-[#C9A84C] text-xs font-bold uppercase tracking-[0.3em] mb-3">
                Tax Benefits
              </p>
              <h2 className="font-black text-4xl sm:text-5xl uppercase text-white leading-tight mb-5">
                Families May<br />Qualify for<br />Tax Rebates
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed max-w-prose">
                Enrolling your child in SAE Academy may entitle your family to significant
                government tax relief. Provincial and federal programs are available to help
                offset the cost of youth sport and recreation.
              </p>
              <div className="mt-8">
                <Link
                  href="/faq#tax-finances"
                  className="inline-block bg-[#C9A84C] text-black font-black text-sm uppercase tracking-widest px-8 py-4 hover:bg-yellow-400 transition-colors"
                >
                  See Tax FAQ
                </Link>
              </div>
            </div>
            {/* Right: stat cards */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/10 w-full">
              <div className="bg-[#161616] px-7 py-8">
                <div className="w-5 h-[2px] bg-[#C9A84C] mb-4" />
                <p className="text-[#C9A84C] text-3xl font-black mb-2">$2,000</p>
                <p className="text-white text-sm font-bold uppercase tracking-wide mb-2">
                  Provincial Tax Credit
                </p>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Up to $2,000 per family per year through the NL Physical Activity Tax Credit
                  for fees paid toward eligible sport and recreation programs.
                </p>
              </div>
              <div className="bg-[#161616] px-7 py-8">
                <div className="w-5 h-[2px] bg-[#C9A84C] mb-4" />
                <p className="text-[#C9A84C] text-3xl font-black mb-2">Federal</p>
                <p className="text-white text-sm font-bold uppercase tracking-wide mb-2">
                  Child-Care Deduction
                </p>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Program fees may also qualify as eligible child-care expenses on your
                  federal return, reducing your overall taxable income.
                </p>
              </div>
              <div className="bg-[#161616] px-7 py-8 sm:col-span-2">
                <div className="w-5 h-[2px] bg-[#C9A84C] mb-4" />
                <p className="text-white text-sm font-bold uppercase tracking-wide mb-2">
                  Tax Receipts Available
                </p>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Need documentation for your tax return? Contact us at{" "}
                  <a
                    href="mailto:info@academiesae.com"
                    className="text-[#C9A84C] hover:text-yellow-400 transition-colors"
                  >
                    info@academiesae.com
                  </a>{" "}
                  and we&apos;ll provide the receipts you need.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ TEASER ── */}
      <section className="bg-[#0f0f0f] py-20 px-5 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-[#C9A84C] text-xs font-bold uppercase tracking-[0.3em] mb-2">
              Have Questions?
            </p>
            <h2 className="font-black text-2xl sm:text-3xl uppercase text-white">
              Check Our FAQ
            </h2>
            <p className="text-gray-400 text-sm mt-2">
              Registration, schools, tax credits, and more.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Link
              href="/faq"
              className="bg-[#C9A84C] text-black font-black text-sm uppercase tracking-widest px-8 py-4 hover:bg-yellow-400 transition-colors text-center"
            >
              View FAQ
            </Link>
            <a
              href="mailto:info@academiesae.com"
              className="border border-white/20 text-gray-300 font-bold text-sm uppercase tracking-wider px-8 py-4 hover:border-white hover:text-white transition-colors text-center"
            >
              info@academiesae.com
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

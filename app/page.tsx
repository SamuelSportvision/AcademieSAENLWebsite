import Image from "next/image";
import Link from "next/link";
import { sports } from "@/data/sports";
import { schools } from "@/data/schools";
import ContactModal from "@/components/ContactModal";
import { getSiteSettings } from "@/lib/site-settings";

function isExternal(href: string) {
  return /^https?:\/\//i.test(href);
}

export default async function HomePage() {
  const featuredSchools = schools.slice(0, 6);
  const settings = await getSiteSettings();
  const { home_hero: hero, home_stats: stats, contact_email, registration_url } = settings;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["SportsOrganization", "LocalBusiness"],
    name: "SAE Academy",
    alternateName: "Sports, Arts, Education Academy",
    description:
      "Elite After-School Development Program in St. John's, Newfoundland providing qualified coaches and structured weekly development for athletes and artists.",
    url: "https://www.saeacademynl.com",
    email: contact_email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "St. John's",
      addressRegion: "NL",
      addressCountry: "CA",
    },
    areaServed: "St. John's, Newfoundland",
    sport: [
      "Hockey",
      "Volleyball",
      "Baseball",
      "Cheerleading",
      "Boxing",
      "Dance",
      "Soccer",
    ],
    logo: "https://www.saeacademynl.com/logo-dark.png",
    sameAs: [],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
          {hero.eyebrow && (
            <p className="text-[#C9A84C] text-xs font-bold uppercase tracking-[0.35em] mb-5">
              {hero.eyebrow}
            </p>
          )}
          <h1 className="font-black uppercase text-white leading-[0.95] tracking-tight mb-6 max-w-4xl">
            <span className="block text-[clamp(2.25rem,7vw,5.25rem)]">{hero.title_lines[0]}</span>
            <span className="block text-[clamp(2.25rem,7vw,5.25rem)]">{hero.title_lines[1]}</span>
            <span className="block text-[clamp(2.25rem,7vw,5.25rem)] text-[#C9A84C]">{hero.title_lines[2]}</span>
          </h1>
          <p className="text-gray-300 text-base sm:text-lg max-w-xl leading-relaxed mb-8">
            {hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={hero.cta_primary.href}
              {...(isExternal(hero.cta_primary.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="bg-[#C8102E] text-white font-black text-sm uppercase tracking-widest px-8 py-4 hover:bg-red-700 transition-colors text-center"
            >
              {hero.cta_primary.label}
            </Link>
            <Link
              href={hero.cta_secondary.href}
              {...(isExternal(hero.cta_secondary.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="border-2 border-white text-white font-black text-sm uppercase tracking-widest px-8 py-4 hover:bg-white hover:text-black transition-colors text-center"
            >
              {hero.cta_secondary.label}
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      {stats.length > 0 && (
        <section className="bg-[#C9A84C]">
          <div
            className="max-w-7xl mx-auto px-5 py-5 grid divide-x divide-black/20"
            style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}
          >
            {stats.map((stat) => (
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
      )}

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
              SAE Academy is an Elite After-School Development Program built on a single belief: young athletes and artists deserve the time to train every single week. We partner with established sports organizations across Newfoundland to make that possible.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              Premium facilities, elite coaches, and structured weekly development — all in one program.
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

      {/* ── WHAT'S INCLUDED / $62.50 VALUE ── */}
      <section className="bg-[#111111] py-24 px-5 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-14 items-start">
            {/* Left: price card + headline */}
            <div className="flex-1">
              <p className="text-[#C9A84C] text-xs font-bold uppercase tracking-[0.3em] mb-4">
                What You Get For
              </p>
              <h2 className="font-black text-5xl sm:text-6xl uppercase text-white leading-[0.95] mb-6">
                $62.50<span className="text-[#C9A84C]">/Day</span>
              </h2>
              <p className="text-gray-400 text-base leading-relaxed max-w-prose mb-8">
                You&apos;re paying for far more than a practice. Every session is a complete, end-to-end after-school solution — designed so families don&apos;t have to choose between elite development and a manageable weekday routine.
              </p>
              <div className="inline-flex items-center gap-3 border-l-2 border-[#C9A84C] pl-4">
                <p className="text-white text-sm font-bold uppercase tracking-wider">
                  3:00 – 5:00 PM
                </p>
                <span className="text-gray-600 text-xs">·</span>
                <p className="text-gray-400 text-xs uppercase tracking-wider">
                  Seamless for parents
                </p>
              </div>
            </div>

            {/* Right: included items grid */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/10 w-full">
              {[
                {
                  title: "School Pickup",
                  desc: "Direct pickup from your child's participating school at the end of the day.",
                },
                {
                  title: "Transportation",
                  desc: "Safe, supervised transit from school to the training facility.",
                },
                {
                  title: "1.5 Hours of Instruction",
                  desc: "Structured, sport-specific development — not free play.",
                },
                {
                  title: "Elite Coaching",
                  desc: "Qualified coaches from established partner organizations.",
                },
                {
                  title: "Premium Facilities",
                  desc: "Train at the same venues used by top local programs.",
                },
                {
                  title: "Seamless 3 – 5 PM Solution",
                  desc: "A complete after-school program that fits a working family's schedule.",
                },
              ].map((item) => (
                <div key={item.title} className="bg-[#161616] px-7 py-7">
                  <div className="w-5 h-[2px] bg-[#C9A84C] mb-4" />
                  <p className="text-white text-sm font-bold uppercase tracking-wide mb-2">
                    {item.title}
                  </p>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
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
              Our mission is to develop confident, disciplined, and well-rounded individuals through an elite environment where each participant can excel in their discipline. We strive to maximize their potential while fostering passion, teamwork, leadership and a commitment to excellence.
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
              To become Newfoundland&apos;s leading reference for sport and artistic development. Through innovation, young artists and athletes will practice their discipline weekly and reach their highest potential.
            </p>
          </div>
        </div>
      </section>

      {/* ── PROGRAMS ── photo-backed cards */}
      <section className="bg-[#0f0f0f] py-24 px-5">
        <div className="max-w-7xl mx-auto">
          {/* Mobile: just heading + CTA button */}
          <div className="sm:hidden text-center">
            <h2 className="font-black text-4xl uppercase text-white leading-tight mb-8">
              Choose Your<br />Programs
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
                <h2 className="font-black text-4xl sm:text-5xl uppercase text-white leading-tight">
                  Choose Your<br />Programs
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
                      Join Mailing List →
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
              href={registration_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[#C8102E] font-black text-sm uppercase tracking-widest px-8 py-4 hover:bg-black hover:text-white transition-colors text-center"
            >
              Join Our Mailing List
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
                Eligible Schools<br />for Pickup
              </h2>
              <p className="text-gray-500 text-sm mt-4 leading-relaxed max-w-xl">
                * A minimum of 20 registered students from a school is required for it to be added to the pickup itinerary.
              </p>
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
                    href={`mailto:${contact_email}`}
                    className="text-[#C9A84C] hover:text-yellow-400 transition-colors"
                  >
                    {contact_email}
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
            <ContactModal
              label="Contact Us"
              className="border-2 border-white text-white font-black text-sm uppercase tracking-widest px-8 py-4 hover:bg-white hover:text-[#C8102E] transition-colors text-center"
            />
          </div>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { sports, getSportBySlug } from "@/data/sports";
import ContactModal from "@/components/ContactModal";
import SportSections from "@/components/SportSections";
import type { SportSection } from "@/components/SportSections";
import { createAdminClient } from "@/lib/supabase/server";

// Always fetch fresh so CMS edits appear immediately.
export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sport = getSportBySlug(slug);
  if (!sport) return {};
  return {
    title: `${sport.name} | SAE Academy`,
    description: sport.description,
  };
}

async function fetchSections(slug: string): Promise<SportSection[]> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("sport_page_sections")
      .select("*")
      .eq("sport_slug", slug)
      .eq("is_visible", true)
      .order("sort_order")
      .order("created_at");

    if (error) throw error;
    return (data ?? []) as SportSection[];
  } catch {
    return [];
  }
}

export default async function SportDetailPage({ params }: Props) {
  const { slug } = await params;
  const sport = getSportBySlug(slug);
  if (!sport) notFound();

  const index = sports.findIndex((s) => s.slug === slug);
  const sections = await fetchSections(slug);

  // Fall back to static content when no CMS sections exist yet.
  const hasCmsSections = sections.length > 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `${sport.name} — SAE Academy`,
    description: sport.description,
    url: `https://www.saeacademynl.com/sports/${sport.slug}`,
    provider: {
      "@type": "SportsOrganization",
      name: "SAE Academy",
      url: "https://www.saeacademynl.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "St. John's",
        addressRegion: "NL",
        addressCountry: "CA",
      },
    },
    ...(sport.partner ? { teaches: sport.partner } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative min-h-[520px] flex items-end overflow-hidden">
        {sport.image ? (
          <>
            <Image
              src={sport.image}
              alt={sport.name}
              fill
              priority
              sizes="100vw"
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />
          </>
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(135deg, #111 60%, ${sport.accentColor}22)` }}
          />
        )}
        <div className="absolute top-0 left-0 w-full h-[3px] bg-[#C9A84C]" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 w-full pb-12 pt-28">
          <Link
            href="/sports"
            className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors inline-block mb-8"
          >
            ← All Programs
          </Link>
          <div className="flex items-start gap-6">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2 hidden sm:block">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h1 className="font-black text-5xl sm:text-6xl uppercase text-white leading-none">
                {sport.name}
              </h1>
              {sport.partner && (
                <p className="text-[#C9A84C] text-xs font-bold uppercase tracking-[0.2em] mt-3">
                  Partner: {sport.partner}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="bg-[#0f0f0f] py-16 px-5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left: CMS sections or static fallback */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {hasCmsSections ? (
              <SportSections sections={sections} />
            ) : (
              <>
                <div>
                  <p className="text-[#C9A84C] text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
                    About
                  </p>
                  <p className="text-gray-300 text-base leading-relaxed">{sport.description}</p>
                </div>
                <div>
                  <p className="text-[#C9A84C] text-[10px] font-bold uppercase tracking-[0.3em] mb-5">
                    Program Highlights
                  </p>
                  <ul className="flex flex-col gap-4">
                    {sport.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className="w-[3px] flex-shrink-0 self-stretch mt-1 bg-[#C9A84C]" />
                        <span className="text-white text-sm font-medium leading-relaxed">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>

          {/* Right: CTAs + other programs */}
          <div className="flex flex-col gap-3">
            <p className="text-[#C9A84C] text-[10px] font-bold uppercase tracking-[0.3em] mb-2">
              Save Your Spot
            </p>
            <Link
              href={sport.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#C8102E] text-white font-black text-sm uppercase tracking-widest px-6 py-5 text-center hover:bg-red-700 transition-colors"
            >
              Join the Waitlist
            </Link>
            {sport.partnerUrl && (
              <Link
                href={sport.partnerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-[#C9A84C] text-[#C9A84C] font-black text-sm uppercase tracking-widest px-6 py-4 text-center hover:bg-[#C9A84C] hover:text-black transition-colors"
              >
                Visit {sport.partner}
              </Link>
            )}
            <ContactModal
              label="Contact Us"
              className="border border-white/20 text-gray-400 font-bold text-xs uppercase tracking-widest px-6 py-4 text-center hover:border-white/40 hover:text-white transition-colors"
            />

            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">
                Other Programs
              </p>
              <div className="flex flex-col gap-2">
                {sports
                  .filter((s) => s.slug !== sport.slug)
                  .slice(0, 4)
                  .map((s) => (
                    <Link
                      key={s.slug}
                      href={`/sports/${s.slug}`}
                      className="text-gray-500 text-xs font-bold uppercase tracking-wider hover:text-white transition-colors py-1 border-b border-white/5"
                    >
                      {s.name}
                    </Link>
                  ))}
                <Link
                  href="/sports"
                  className="text-[#C9A84C] text-xs font-bold uppercase tracking-wider hover:underline mt-1"
                >
                  View All →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

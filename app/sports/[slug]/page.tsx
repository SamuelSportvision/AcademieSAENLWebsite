import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { sports, getSportBySlug } from "@/data/sports";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return sports.map((s) => ({ slug: s.slug }));
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

export default async function SportDetailPage({ params }: Props) {
  const { slug } = await params;
  const sport = getSportBySlug(slug);
  if (!sport) notFound();

  const index = sports.findIndex((s) => s.slug === slug);

  return (
    <>
      {/* Header — photo hero if image exists, else dark with accent */}
      <section className="relative min-h-[380px] flex items-end overflow-hidden">
        {sport.image ? (
          <>
            <Image
              src={sport.image}
              alt={sport.name}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
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
              <p className="text-gray-200 text-lg font-semibold mt-3 max-w-xl">
                {sport.tagline}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="bg-[#0f0f0f] py-16 px-5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: content */}
          <div className="lg:col-span-2 flex flex-col gap-8">
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
          </div>

          {/* Right: CTAs */}
          <div className="flex flex-col gap-3">
            <p className="text-[#C9A84C] text-[10px] font-bold uppercase tracking-[0.3em] mb-2">
              Register
            </p>
            <Link
              href={sport.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#C8102E] text-white font-black text-sm uppercase tracking-widest px-6 py-5 text-center hover:bg-red-700 transition-colors"
            >
              Register on TeamSnap
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
            <a
              href="mailto:info@academiesae.com"
              className="border border-white/20 text-gray-400 font-bold text-xs uppercase tracking-widest px-6 py-4 text-center hover:border-white/40 hover:text-white transition-colors"
            >
              info@academiesae.com
            </a>

            {/* Nav to other programs */}
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

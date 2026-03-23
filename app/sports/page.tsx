import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { sports } from "@/data/sports";

export const metadata: Metadata = {
  title: "Programs | Sports, Arts, Education Academy",
  description:
    "Browse all SAE Academy disciplines — Hockey, Volleyball, Basketball, Dance, and more. Daily training with qualified coaches and a flexible academic schedule.",
};

export default function SportsPage() {
  return (
    <>
      {/* Page Header — photo background */}
      <section className="relative min-h-[460px] flex items-end overflow-hidden">
        <Image
          src="/images/soccer-coaches.jpg"
          alt="SAE Academy programs"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_25%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-black/20" />
        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#C9A84C]" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 w-full pb-12 pt-28">
          <p className="text-[#C9A84C] text-xs font-bold uppercase tracking-[0.3em] mb-4">
            SAE Academy
          </p>
          <h1 className="font-black text-5xl sm:text-6xl uppercase text-white leading-none">
            Our Programs
          </h1>
          <p className="text-gray-300 text-base mt-4 max-w-xl leading-relaxed">
            Choose your discipline. Train every day alongside qualified coaches and partner organizations. Click any program to learn more and register.
          </p>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="bg-[#0f0f0f] py-16 px-5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sports.map((sport, i) => (
              <Link
                key={sport.slug}
                href={`/sports/${sport.slug}`}
                className="group relative overflow-hidden min-h-[260px] flex flex-col justify-end"
              >
                {sport.image ? (
                  <>
                    <Image
                      src={sport.image}
                      alt={sport.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  </>
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(135deg, #1a1a1a 60%, #C9A84C22)` }}
                  />
                )}
                <div
                  className="absolute top-0 left-0 w-full h-[3px]"
                  style={{ backgroundColor: "#C9A84C" }}
                />
                <div className="relative z-10 p-6">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-black text-3xl uppercase text-white group-hover:text-[#C9A84C] transition-colors leading-tight mb-1">
                    {sport.name}
                  </h2>
                  {sport.partner && (
                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
                      {sport.partner}
                    </p>
                  )}
                  <p className="text-gray-300 text-sm leading-relaxed mb-3">{sport.tagline}</p>
                  <p className="text-[#C9A84C] text-xs font-bold uppercase tracking-widest group-hover:underline">
                    Learn More &amp; Register →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#1a1a1a] border-t border-white/10 py-16 px-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-white font-bold text-lg">Not sure which program fits you?</p>
            <p className="text-gray-400 text-sm mt-1">Reach out and we will help you find the right fit.</p>
          </div>
          <a
            href="mailto:info@academiesae.com"
            className="bg-[#C9A84C] text-black font-black text-sm uppercase tracking-widest px-8 py-4 hover:bg-yellow-400 transition-colors flex-shrink-0"
          >
            Contact Us
          </a>
        </div>
      </section>
    </>
  );
}

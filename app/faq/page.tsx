import type { Metadata } from "next";
import { faqs } from "@/data/faq";
import FaqAccordion from "@/components/FaqAccordion";

export const metadata: Metadata = {
  title: "FAQ | SAE Academy",
  description:
    "Frequently asked questions about the SAE Academy program, registration, and available tax credits for families in New Brunswick.",
};

const categories = ["General", "Registration", "Tax & Finances"] as const;

export default function FaqPage() {
  return (
    <>
      {/* Page Header */}
      <section className="bg-[#1a1a1a] border-b border-white/10 pt-28 pb-16 px-5">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#C9A84C] text-xs font-bold uppercase tracking-[0.3em] mb-4">
            SAE Academy
          </p>
          <h1 className="font-black text-5xl sm:text-6xl uppercase text-white leading-none">
            Frequently<br />Asked Questions
          </h1>
          <p className="text-gray-400 text-base mt-5 max-w-xl leading-relaxed">
            Can&apos;t find what you&apos;re looking for? Email us at{" "}
            <a href="mailto:info@academiesae.com" className="text-[#C9A84C] hover:underline">
              info@academiesae.com
            </a>
          </p>
        </div>
      </section>

      {/* FAQ Body */}
      <section className="bg-[#0f0f0f] py-16 px-5">
        <div className="max-w-4xl mx-auto flex flex-col gap-14">
          {categories.map((category) => {
            const items = faqs.filter((f) => f.category === category);
            return (
              <div key={category}>
                <div className="flex items-center gap-4 mb-6">
                  <p className="text-[#C9A84C] text-[10px] font-bold uppercase tracking-[0.3em] whitespace-nowrap">
                    {category}
                  </p>
                  <div className="flex-1 h-px bg-white/10" />
                </div>
                <FaqAccordion items={items} />
              </div>
            );
          })}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-[#1a1a1a] border-t border-white/10 py-12 px-5">
        <div className="max-w-4xl mx-auto">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600 mb-3">
            Disclaimer
          </p>
          <p className="text-gray-600 text-xs leading-relaxed">
            Tax information provided on this page is for general informational purposes only and does not constitute tax or financial advice. Program eligibility for tax credits and deductions may vary based on individual circumstances. We recommend consulting a qualified tax professional or reviewing official guidance from the Canada Revenue Agency (CRA) and the New Brunswick Department of Finance to confirm your eligibility.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a
              href="mailto:info@academiesae.com"
              className="bg-[#C8102E] text-white font-black text-sm uppercase tracking-widest px-8 py-4 hover:bg-red-700 transition-colors text-center"
            >
              Email Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

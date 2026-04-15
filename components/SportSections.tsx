import Image from "next/image";
import Link from "next/link";

/* ─── Types ────────────────────────────────────────────────────────────────── */

export type SectionType = "text" | "highlights" | "image_text" | "stats" | "cta";

export interface TextContent    { body: string }
export interface HighlightsContent { items: string[] }
export interface ImageTextContent  { image_url: string; body: string; image_side: "left" | "right" }
export interface StatsContent      { items: { label: string; value: string }[] }
export interface CTAContent        { heading: string; body?: string; button_label: string; button_url: string; button_style: "primary" | "secondary" }

export interface SportSection {
  id: string;
  sport_slug: string;
  section_type: SectionType;
  title: string | null;
  content: TextContent | HighlightsContent | ImageTextContent | StatsContent | CTAContent;
  sort_order: number;
  is_visible: boolean;
}

/* ─── Individual section renderers ─────────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[#C9A84C] text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
      {children}
    </p>
  );
}

function TextSection({ section }: { section: SportSection }) {
  const content = section.content as TextContent;
  return (
    <div>
      {section.title && <SectionLabel>{section.title}</SectionLabel>}
      <p className="text-gray-300 text-base leading-relaxed whitespace-pre-line">{content.body}</p>
    </div>
  );
}

function HighlightsSection({ section }: { section: SportSection }) {
  const content = section.content as HighlightsContent;
  return (
    <div>
      {section.title && <SectionLabel>{section.title}</SectionLabel>}
      <ul className="flex flex-col gap-4">
        {content.items.map((item, i) => (
          <li key={i} className="flex items-start gap-4">
            <div className="w-[3px] flex-shrink-0 self-stretch mt-1 bg-[#C9A84C]" />
            <span className="text-white text-sm font-medium leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ImageTextSection({ section }: { section: SportSection }) {
  const content = section.content as ImageTextContent;
  const imgLeft = content.image_side !== "right";

  return (
    <div>
      {section.title && <SectionLabel>{section.title}</SectionLabel>}
      <div className={`flex flex-col ${imgLeft ? "md:flex-row" : "md:flex-row-reverse"} gap-8 items-start`}>
        {content.image_url && (
          <div className="relative w-full md:w-1/2 aspect-[4/3] flex-shrink-0 overflow-hidden">
            <Image
              src={content.image_url}
              alt={section.title ?? ""}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        )}
        <p className="text-gray-300 text-base leading-relaxed whitespace-pre-line flex-1">
          {content.body}
        </p>
      </div>
    </div>
  );
}

function StatsSection({ section }: { section: SportSection }) {
  const content = section.content as StatsContent;
  return (
    <div>
      {section.title && <SectionLabel>{section.title}</SectionLabel>}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
        {content.items.map((stat, i) => (
          <div key={i} className="border border-white/10 p-5">
            <p className="text-[#C9A84C] font-black text-3xl leading-none">{stat.value}</p>
            <p className="text-gray-500 text-xs uppercase tracking-wider mt-2">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CTASection({ section }: { section: SportSection }) {
  const content = section.content as CTAContent;
  const isPrimary = content.button_style !== "secondary";

  return (
    <div className="bg-[#1a1a1a] border border-white/10 p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
      <div>
        {section.title && <SectionLabel>{section.title}</SectionLabel>}
        <p className="text-white font-black text-xl uppercase tracking-wide leading-snug">
          {content.heading}
        </p>
        {content.body && (
          <p className="text-gray-400 text-sm mt-2 leading-relaxed">{content.body}</p>
        )}
      </div>
      <Link
        href={content.button_url}
        target={content.button_url.startsWith("http") ? "_blank" : undefined}
        rel={content.button_url.startsWith("http") ? "noopener noreferrer" : undefined}
        className={`flex-shrink-0 font-black text-sm uppercase tracking-widest px-8 py-4 text-center transition-colors whitespace-nowrap ${
          isPrimary
            ? "bg-[#C8102E] text-white hover:bg-red-700"
            : "border-2 border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-black"
        }`}
      >
        {content.button_label}
      </Link>
    </div>
  );
}

/* ─── Main renderer ─────────────────────────────────────────────────────────── */

export default function SportSections({ sections }: { sections: SportSection[] }) {
  const visible = sections.filter((s) => s.is_visible);
  if (!visible.length) return null;

  return (
    <div className="flex flex-col gap-10">
      {visible.map((section) => {
        switch (section.section_type) {
          case "text":        return <TextSection       key={section.id} section={section} />;
          case "highlights":  return <HighlightsSection key={section.id} section={section} />;
          case "image_text":  return <ImageTextSection  key={section.id} section={section} />;
          case "stats":       return <StatsSection      key={section.id} section={section} />;
          case "cta":         return <CTASection        key={section.id} section={section} />;
          default:            return null;
        }
      })}
    </div>
  );
}

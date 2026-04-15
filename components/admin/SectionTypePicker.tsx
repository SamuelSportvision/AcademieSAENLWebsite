"use client";

import type { SectionType } from "@/components/SportSections";

interface SectionTypeOption {
  value: SectionType;
  label: string;
  description: string;
  preview: React.ReactNode;
}

/* ─── SVG preview mockups ────────────────────────────────────────────────────── */

function TextPreview() {
  return (
    <svg viewBox="0 0 160 90" className="w-full h-full" aria-hidden>
      <rect width="160" height="90" fill="#111" />
      {/* Heading bar */}
      <rect x="12" y="14" width="50" height="5" rx="2" fill="#C9A84C" opacity="0.6" />
      {/* Body lines */}
      <rect x="12" y="27" width="136" height="4" rx="2" fill="#555" />
      <rect x="12" y="35" width="120" height="4" rx="2" fill="#555" />
      <rect x="12" y="43" width="130" height="4" rx="2" fill="#555" />
      <rect x="12" y="51" width="90"  height="4" rx="2" fill="#555" />
    </svg>
  );
}

function HighlightsPreview() {
  return (
    <svg viewBox="0 0 160 90" className="w-full h-full" aria-hidden>
      <rect width="160" height="90" fill="#111" />
      <rect x="12" y="14" width="60" height="5" rx="2" fill="#C9A84C" opacity="0.6" />
      {/* Bullet rows */}
      {[30, 46, 62].map((y) => (
        <g key={y}>
          <rect x="12" y={y} width="3" height="14" rx="1" fill="#C9A84C" />
          <rect x="22" y={y + 2} width="110" height="4" rx="2" fill="#666" />
          <rect x="22" y={y + 9} width="80"  height="3" rx="2" fill="#444" />
        </g>
      ))}
    </svg>
  );
}

function ImageTextPreview() {
  return (
    <svg viewBox="0 0 160 90" className="w-full h-full" aria-hidden>
      <rect width="160" height="90" fill="#111" />
      {/* Image placeholder */}
      <rect x="12" y="14" width="64" height="62" rx="3" fill="#222" />
      <line x1="12" y1="14" x2="76" y2="76" stroke="#333" strokeWidth="1" />
      <line x1="76" y1="14" x2="12" y2="76" stroke="#333" strokeWidth="1" />
      {/* Text lines */}
      <rect x="84" y="18" width="64" height="4" rx="2" fill="#C9A84C" opacity="0.5" />
      <rect x="84" y="28" width="64" height="3" rx="2" fill="#555" />
      <rect x="84" y="35" width="56" height="3" rx="2" fill="#555" />
      <rect x="84" y="42" width="60" height="3" rx="2" fill="#555" />
      <rect x="84" y="49" width="48" height="3" rx="2" fill="#555" />
    </svg>
  );
}

function StatsPreview() {
  return (
    <svg viewBox="0 0 160 90" className="w-full h-full" aria-hidden>
      <rect width="160" height="90" fill="#111" />
      <rect x="12" y="10" width="50" height="5" rx="2" fill="#C9A84C" opacity="0.6" />
      {/* Stat boxes */}
      {[
        { x: 12,  value: "200+", label: "Athletes" },
        { x: 64,  value: "8",    label: "Sports" },
        { x: 116, value: "5★",   label: "Rating" },
      ].map((stat) => (
        <g key={stat.x}>
          <rect x={stat.x} y="26" width="40" height="52" rx="3" fill="#1a1a1a" stroke="#333" strokeWidth="1" />
          <text x={stat.x + 20} y="48" textAnchor="middle" fill="#C9A84C" fontSize="10" fontWeight="bold">{stat.value}</text>
          <text x={stat.x + 20} y="62" textAnchor="middle" fill="#555" fontSize="6">{stat.label}</text>
        </g>
      ))}
    </svg>
  );
}

function CTAPreview() {
  return (
    <svg viewBox="0 0 160 90" className="w-full h-full" aria-hidden>
      <rect width="160" height="90" fill="#111" />
      {/* CTA banner bg */}
      <rect x="10" y="18" width="140" height="54" rx="4" fill="#1a1a1a" stroke="#333" strokeWidth="1" />
      <rect x="22" y="30" width="80" height="6" rx="2" fill="#eee" opacity="0.5" />
      <rect x="22" y="41" width="60" height="4" rx="2" fill="#555" />
      {/* Button */}
      <rect x="104" y="33" width="36" height="16" rx="3" fill="#C8102E" />
      <rect x="108" y="39" width="28" height="3" rx="1.5" fill="#fff" opacity="0.8" />
    </svg>
  );
}

/* ─── Options list ───────────────────────────────────────────────────────────── */

const OPTIONS: SectionTypeOption[] = [
  {
    value: "text",
    label: "Text Block",
    description: "Heading + paragraph(s) of body text",
    preview: <TextPreview />,
  },
  {
    value: "highlights",
    label: "Highlights",
    description: "Heading + bulleted list of key points",
    preview: <HighlightsPreview />,
  },
  {
    value: "image_text",
    label: "Image + Text",
    description: "Photo beside a paragraph, left or right",
    preview: <ImageTextPreview />,
  },
  {
    value: "stats",
    label: "Stats",
    description: "Bold numbers / statistics in a grid",
    preview: <StatsPreview />,
  },
  {
    value: "cta",
    label: "Call to Action",
    description: "Bold headline with a button link",
    preview: <CTAPreview />,
  },
];

/* ─── Component ──────────────────────────────────────────────────────────────── */

interface SectionTypePickerProps {
  onSelect: (type: SectionType) => void;
}

export default function SectionTypePicker({ onSelect }: SectionTypePickerProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 mb-1">
        Choose a section type
      </p>
      <div className="grid grid-cols-2 gap-3">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onSelect(opt.value)}
            className="group text-left border border-white/10 rounded-lg overflow-hidden hover:border-[#C9A84C]/50 hover:bg-[#C9A84C]/5 transition-all focus:outline-none focus:border-[#C9A84C]"
          >
            {/* Mockup preview */}
            <div className="aspect-[16/9] w-full overflow-hidden bg-[#111] border-b border-white/5">
              {opt.preview}
            </div>
            {/* Label */}
            <div className="px-3 py-2.5">
              <p className="text-white text-xs font-bold group-hover:text-[#C9A84C] transition-colors">
                {opt.label}
              </p>
              <p className="text-gray-600 text-[10px] mt-0.5 leading-snug">
                {opt.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

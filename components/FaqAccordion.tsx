"use client";

import { useState } from "react";
import type { FaqItem } from "@/data/faq";

interface Props {
  items: FaqItem[];
}

export default function FaqAccordion({ items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-px bg-white/10">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i} className="bg-[#1a1a1a]">
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-start justify-between gap-6 px-6 py-5 text-left focus:outline-none group"
              aria-expanded={isOpen}
            >
              <span className="text-white text-sm font-bold leading-snug group-hover:text-[#C9A84C] transition-colors uppercase tracking-wide">
                {item.question}
              </span>
              <span
                className={`text-[#C9A84C] text-xl font-black flex-shrink-0 transition-transform duration-200 leading-none ${
                  isOpen ? "rotate-45" : "rotate-0"
                }`}
              >
                +
              </span>
            </button>
            {isOpen && (
              <div className="px-6 pb-6">
                <div className="border-t border-white/10 pt-4">
                  <div className="text-gray-400 text-sm leading-relaxed flex flex-col gap-3">
                    {item.answer.split("\n\n").map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

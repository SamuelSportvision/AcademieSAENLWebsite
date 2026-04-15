"use client";

import { useState, useEffect } from "react";
import type { SectionType, SportSection } from "@/components/SportSections";
import SectionTypePicker from "@/components/admin/SectionTypePicker";
import SportSectionForm from "@/components/admin/SportSectionForm";

interface SectionDrawerProps {
  sportSlug: string;
  /** If provided, the drawer opens in edit mode for this section. */
  editSection?: SportSection | null;
  open: boolean;
  onClose: () => void;
  onSaved: (section: SportSection) => void;
}

export default function SectionDrawer({
  sportSlug,
  editSection,
  open,
  onClose,
  onSaved,
}: SectionDrawerProps) {
  // "pick" = choose section type, "form" = fill in fields
  const [step, setStep] = useState<"pick" | "form">("pick");
  const [selectedType, setSelectedType] = useState<SectionType | null>(null);

  // Reset state whenever the drawer is opened/closed or the edit target changes.
  useEffect(() => {
    if (open) {
      if (editSection) {
        setStep("form");
        setSelectedType(editSection.section_type);
      } else {
        setStep("pick");
        setSelectedType(null);
      }
    }
  }, [open, editSection]);

  function handleTypeSelect(type: SectionType) {
    setSelectedType(type);
    setStep("form");
  }

  function handleSaved(section: SportSection) {
    onSaved(section);
    onClose();
  }

  const isEdit = !!editSection;

  return (
    <>
      {/* Backdrop — only covers the right preview pane */}
      <div
        className={`fixed inset-0 z-30 transition-opacity duration-300 ${
          open ? "bg-black/40 pointer-events-auto" : "bg-transparent pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden
      />

      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 h-full z-40 w-full max-w-[480px] bg-[#131313] border-l border-white/10 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? "Edit section" : "Add section"}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            {step === "form" && !isEdit && (
              <button
                onClick={() => setStep("pick")}
                className="text-gray-500 hover:text-white transition-colors text-sm"
                aria-label="Back to type picker"
              >
                ←
              </button>
            )}
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#C9A84C]">
                {isEdit ? "Edit Section" : "Add Section"}
              </p>
              {step === "form" && selectedType && (
                <p className="text-white font-black text-base uppercase tracking-wide leading-tight mt-0.5">
                  {TYPE_LABELS[selectedType]}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded hover:bg-white/10"
            aria-label="Close drawer"
          >
            ✕
          </button>
        </div>

        {/* Drawer body — scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {step === "pick" && (
            <SectionTypePicker onSelect={handleTypeSelect} />
          )}

          {step === "form" && (
            <SportSectionForm
              sportSlug={sportSlug}
              existing={editSection ?? undefined}
              onSaved={handleSaved}
              onCancel={onClose}
            />
          )}
        </div>
      </div>
    </>
  );
}

const TYPE_LABELS: Record<SectionType, string> = {
  text:       "Text Block",
  highlights: "Highlights",
  image_text: "Image + Text",
  stats:      "Stats",
  cta:        "Call to Action",
};

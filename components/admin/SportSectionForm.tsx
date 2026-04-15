"use client";

import { useState } from "react";
import type {
  SectionType,
  SportSection,
  TextContent,
  HighlightsContent,
  ImageTextContent,
  StatsContent,
  CTAContent,
} from "@/components/SportSections";

/* ─── Types ─────────────────────────────────────────────────────────────────── */

export interface SportSectionFormProps {
  sportSlug: string;
  existing?: SportSection;
  onSaved: (section: SportSection) => void;
  onCancel: () => void;
}

const SECTION_TYPES: { value: SectionType; label: string; description: string }[] = [
  { value: "text",       label: "Text Block",    description: "A heading and one or more paragraphs of text." },
  { value: "highlights", label: "Highlights",    description: "A heading and a bulleted list of key points." },
  { value: "image_text", label: "Image + Text",  description: "An image side-by-side with a paragraph." },
  { value: "stats",      label: "Stats",         description: "Key numbers or statistics displayed in a grid." },
  { value: "cta",        label: "Call to Action", description: "A bold heading with a button link." },
];

function fieldClass(extra = "") {
  return `bg-[#111] border border-white/10 rounded px-4 py-2.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-[#C9A84C] transition-colors ${extra}`;
}

function Label({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 block mb-1">
      {children}
    </label>
  );
}

/* ─── Content field panels per section type ─────────────────────────────────── */

function TextFields({ content, onChange }: {
  content: Partial<TextContent>;
  onChange: (c: TextContent) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="body">Body Text</Label>
      <textarea
        id="body"
        rows={6}
        required
        value={content.body ?? ""}
        onChange={(e) => onChange({ body: e.target.value })}
        placeholder="Write your paragraph here…"
        className={fieldClass("resize-y leading-relaxed")}
      />
    </div>
  );
}

function HighlightsFields({ content, onChange }: {
  content: Partial<HighlightsContent>;
  onChange: (c: HighlightsContent) => void;
}) {
  const items = content.items ?? [""];

  function updateItem(index: number, value: string) {
    const next = [...items];
    next[index] = value;
    onChange({ items: next });
  }
  function addItem() { onChange({ items: [...items, ""] }); }
  function removeItem(index: number) {
    onChange({ items: items.filter((_, i) => i !== index) });
  }

  return (
    <div className="flex flex-col gap-3">
      <Label>Bullet Points</Label>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 items-start">
          <div className="flex-1">
            <input
              type="text"
              required
              value={item}
              onChange={(e) => updateItem(i, e.target.value)}
              placeholder={`Point ${i + 1}`}
              className={fieldClass("w-full")}
            />
          </div>
          {items.length > 1 && (
            <button
              type="button"
              onClick={() => removeItem(i)}
              className="text-gray-600 hover:text-red-400 text-xs uppercase tracking-wider border border-white/10 hover:border-red-500/30 px-3 py-2.5 rounded transition-colors whitespace-nowrap"
            >
              Remove
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="self-start text-[10px] font-bold uppercase tracking-wider text-[#C9A84C] hover:text-yellow-300 transition-colors mt-1"
      >
        + Add Point
      </button>
    </div>
  );
}

function ImageTextFields({ content, onChange }: {
  content: Partial<ImageTextContent>;
  onChange: (c: ImageTextContent) => void;
}) {
  function update(key: keyof ImageTextContent, value: string) {
    onChange({ image_url: content.image_url ?? "", body: content.body ?? "", image_side: content.image_side ?? "left", [key]: value } as ImageTextContent);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="image_url">Image URL</Label>
        <input
          id="image_url"
          type="text"
          required
          value={content.image_url ?? ""}
          onChange={(e) => update("image_url", e.target.value)}
          placeholder="/images/your-image.jpg or https://…"
          className={fieldClass("w-full")}
        />
        <p className="text-[10px] text-gray-600">Use a path like <code className="text-gray-500">/images/hockey-team.jpg</code> for files in your public folder.</p>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="image_side">Image Position</Label>
        <select
          id="image_side"
          value={content.image_side ?? "left"}
          onChange={(e) => update("image_side", e.target.value)}
          className={fieldClass("appearance-none")}
        >
          <option value="left">Image on Left</option>
          <option value="right">Image on Right</option>
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="img_body">Body Text</Label>
        <textarea
          id="img_body"
          rows={5}
          required
          value={content.body ?? ""}
          onChange={(e) => update("body", e.target.value)}
          placeholder="Text that appears beside the image…"
          className={fieldClass("resize-y leading-relaxed")}
        />
      </div>
    </div>
  );
}

function StatsFields({ content, onChange }: {
  content: Partial<StatsContent>;
  onChange: (c: StatsContent) => void;
}) {
  const items = content.items ?? [{ label: "", value: "" }];

  function updateItem(index: number, key: "label" | "value", val: string) {
    const next = items.map((item, i) => i === index ? { ...item, [key]: val } : item);
    onChange({ items: next });
  }
  function addItem() { onChange({ items: [...items, { label: "", value: "" }] }); }
  function removeItem(index: number) { onChange({ items: items.filter((_, i) => i !== index) }); }

  return (
    <div className="flex flex-col gap-3">
      <Label>Stats</Label>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 items-start">
          <input
            type="text"
            required
            value={item.value}
            onChange={(e) => updateItem(i, "value", e.target.value)}
            placeholder="e.g. 200+"
            className={fieldClass("w-28 flex-shrink-0")}
          />
          <input
            type="text"
            required
            value={item.label}
            onChange={(e) => updateItem(i, "label", e.target.value)}
            placeholder="Label (e.g. Athletes trained)"
            className={fieldClass("flex-1")}
          />
          {items.length > 1 && (
            <button
              type="button"
              onClick={() => removeItem(i)}
              className="text-gray-600 hover:text-red-400 text-xs uppercase tracking-wider border border-white/10 hover:border-red-500/30 px-3 py-2.5 rounded transition-colors whitespace-nowrap"
            >
              Remove
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="self-start text-[10px] font-bold uppercase tracking-wider text-[#C9A84C] hover:text-yellow-300 transition-colors mt-1"
      >
        + Add Stat
      </button>
    </div>
  );
}

function CTAFields({ content, onChange }: {
  content: Partial<CTAContent>;
  onChange: (c: CTAContent) => void;
}) {
  function update(key: keyof CTAContent, value: string) {
    onChange({
      heading: content.heading ?? "",
      button_label: content.button_label ?? "",
      button_url: content.button_url ?? "",
      button_style: content.button_style ?? "primary",
      body: content.body,
      [key]: value,
    } as CTAContent);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="heading">Heading</Label>
        <input
          id="heading"
          type="text"
          required
          value={content.heading ?? ""}
          onChange={(e) => update("heading", e.target.value)}
          placeholder="e.g. Ready to join?"
          className={fieldClass("w-full")}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="cta_body">Body Text <span className="text-gray-700 normal-case tracking-normal font-normal">(optional)</span></Label>
        <textarea
          id="cta_body"
          rows={3}
          value={content.body ?? ""}
          onChange={(e) => update("body", e.target.value)}
          placeholder="A short supporting sentence…"
          className={fieldClass("resize-y leading-relaxed")}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="button_label">Button Label</Label>
          <input
            id="button_label"
            type="text"
            required
            value={content.button_label ?? ""}
            onChange={(e) => update("button_label", e.target.value)}
            placeholder="e.g. Register Now"
            className={fieldClass("w-full")}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="button_style">Button Style</Label>
          <select
            id="button_style"
            value={content.button_style ?? "primary"}
            onChange={(e) => update("button_style", e.target.value)}
            className={fieldClass("appearance-none")}
          >
            <option value="primary">Primary (Red)</option>
            <option value="secondary">Secondary (Gold outline)</option>
          </select>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="button_url">Button URL</Label>
        <input
          id="button_url"
          type="text"
          required
          value={content.button_url ?? ""}
          onChange={(e) => update("button_url", e.target.value)}
          placeholder="https://… or /path"
          className={fieldClass("w-full")}
        />
      </div>
    </div>
  );
}

/* ─── Main form ──────────────────────────────────────────────────────────────── */

function emptyContent(type: SectionType): object {
  switch (type) {
    case "text":       return { body: "" };
    case "highlights": return { items: [""] };
    case "image_text": return { image_url: "", body: "", image_side: "left" };
    case "stats":      return { items: [{ label: "", value: "" }] };
    case "cta":        return { heading: "", body: "", button_label: "", button_url: "", button_style: "primary" };
  }
}

export default function SportSectionForm({ sportSlug, existing, onSaved, onCancel }: SportSectionFormProps) {
  const isEdit = !!existing;

  const [sectionType, setSectionType] = useState<SectionType>(
    existing?.section_type ?? "text"
  );
  const [title, setTitle] = useState(existing?.title ?? "");
  const [content, setContent] = useState<object>(
    existing?.content ?? emptyContent(sectionType)
  );
  const [sortOrder, setSortOrder] = useState(existing?.sort_order ?? 0);
  const [isVisible, setIsVisible] = useState(existing?.is_visible ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleTypeChange(newType: SectionType) {
    setSectionType(newType);
    setContent(emptyContent(newType));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const url = isEdit
        ? `/api/sports/${sportSlug}/sections/${existing!.id}`
        : `/api/sports/${sportSlug}/sections`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section_type: sectionType,
          title: title.trim() || null,
          content,
          sort_order: sortOrder,
          is_visible: isVisible,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Request failed (${res.status})`);
      }

      const saved: SportSection = await res.json();
      onSaved(saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

      {/* Section Type (only on create) */}
      {!isEdit && (
        <div className="flex flex-col gap-2">
          <Label>Section Type</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SECTION_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => handleTypeChange(t.value)}
                className={`text-left px-4 py-3 rounded border transition-all ${
                  sectionType === t.value
                    ? "border-[#C9A84C] bg-[#C9A84C]/10"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <p className={`text-sm font-bold uppercase tracking-wide ${sectionType === t.value ? "text-[#C9A84C]" : "text-gray-300"}`}>
                  {t.label}
                </p>
                <p className="text-[10px] text-gray-600 mt-0.5">{t.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="section_title">
          Section Heading <span className="text-gray-700 normal-case tracking-normal font-normal">(optional)</span>
        </Label>
        <input
          id="section_title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={
            sectionType === "text" ? "e.g. About" :
            sectionType === "highlights" ? "e.g. Program Highlights" :
            sectionType === "stats" ? "e.g. By the Numbers" :
            sectionType === "cta" ? "e.g. Ready to Register?" :
            "Optional heading"
          }
          className={fieldClass("w-full")}
        />
      </div>

      {/* Content fields (vary by type) */}
      {sectionType === "text" && (
        <TextFields content={content as TextContent} onChange={setContent} />
      )}
      {sectionType === "highlights" && (
        <HighlightsFields content={content as HighlightsContent} onChange={setContent} />
      )}
      {sectionType === "image_text" && (
        <ImageTextFields content={content as ImageTextContent} onChange={setContent} />
      )}
      {sectionType === "stats" && (
        <StatsFields content={content as StatsContent} onChange={setContent} />
      )}
      {sectionType === "cta" && (
        <CTAFields content={content as CTAContent} onChange={setContent} />
      )}

      {/* Visibility + Order */}
      <div className="flex gap-4 items-end flex-wrap">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sort_order">Display Order <span className="text-gray-700 normal-case tracking-normal font-normal">(lower = higher)</span></Label>
          <input
            id="sort_order"
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            className={fieldClass("w-24")}
          />
        </div>
        <label className="flex items-center gap-2 cursor-pointer pb-2.5">
          <div
            onClick={() => setIsVisible((v) => !v)}
            className={`relative w-10 h-5 rounded-full transition-colors ${isVisible ? "bg-[#C9A84C]" : "bg-white/10"}`}
          >
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${isVisible ? "left-5" : "left-0.5"}`} />
          </div>
          <span className="text-xs text-gray-400 uppercase tracking-wide">Visible on page</span>
        </label>
      </div>

      {error && <p className="text-[#C8102E] text-xs font-semibold">{error}</p>}

      <div className="flex items-center gap-3 pt-2 border-t border-white/10">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 bg-[#C9A84C] text-black font-black text-sm uppercase tracking-widest py-3 rounded hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Section"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-3 text-sm font-bold uppercase tracking-wider text-gray-500 hover:text-white border border-white/10 hover:border-white/30 rounded transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

"use client";

import { useState } from "react";
import type { FormField } from "@/components/DynamicForm";

export interface FormFieldFormProps {
  formId: string;
  existing?: FormField;
  /** Field type to use when creating a new field (ignored on edit). */
  defaultFieldType?: FormField["field_type"];
  onSaved: (field: FormField) => void;
  onCancel: () => void;
}

const FIELD_TYPE_LABELS: Record<FormField["field_type"], string> = {
  text:     "Short Text",
  email:    "Email",
  phone:    "Phone",
  number:   "Number",
  date:     "Date",
  textarea: "Long Text",
  select:   "Dropdown",
  checkbox: "Checkboxes",
  radio:    "Radio Buttons",
};

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

export default function FormFieldForm({ formId, existing, defaultFieldType, onSaved, onCancel }: FormFieldFormProps) {
  const isEdit = !!existing;

  const [label, setLabel]             = useState(existing?.label ?? "");
  const [placeholder, setPlaceholder] = useState(existing?.placeholder ?? "");
  const [required, setRequired]       = useState(existing?.required ?? false);
  const [options, setOptions]         = useState<string[]>(existing?.options ?? [""]);
  const [sortOrder, setSortOrder]     = useState(existing?.sort_order ?? 0);
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState<string | null>(null);

  const fieldType = existing?.field_type ?? defaultFieldType ?? "text";
  const isSelect   = fieldType === "select";
  const isCheckbox = fieldType === "checkbox";
  const isRadio    = fieldType === "radio";
  const hasOptions = isSelect || isCheckbox || isRadio;

  /* ── Options list management (for select / checkbox) ── */
  function updateOption(index: number, value: string) {
    setOptions((prev) => prev.map((o, i) => (i === index ? value : o)));
  }
  function addOption() { setOptions((prev) => [...prev, ""]); }
  function removeOption(index: number) { setOptions((prev) => prev.filter((_, i) => i !== index)); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!label.trim()) { setError("Label is required."); return; }
    if (hasOptions && options.filter((o) => o.trim()).length === 0) {
      setError("Add at least one option.");
      return;
    }

    setSaving(true);
    setError(null);

    const payload: Partial<FormField> = {
      label: label.trim(),
      placeholder: placeholder.trim() || null,
      required,
      sort_order: sortOrder,
      options: hasOptions ? options.filter((o) => o.trim()) : null,
    };

    try {
      const url  = isEdit
        ? `/api/forms/${formId}/fields/${existing!.id}`
        : `/api/forms/${formId}/fields`;
      const method = isEdit ? "PUT" : "POST";

      if (!isEdit) {
        (payload as Record<string, unknown>).field_type = fieldType;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Request failed (${res.status})`);
      }
      const saved: FormField = await res.json();
      onSaved(saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Field type badge (read-only on edit) */}
      <div className="flex items-center gap-2">
        <span className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded border bg-blue-900/30 text-blue-400 border-blue-800/40">
          {FIELD_TYPE_LABELS[fieldType]}
        </span>
        {isEdit && (
          <span className="text-[10px] text-gray-600">Field type cannot be changed after creation.</span>
        )}
      </div>

      {/* Label */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="field_label">Question / Label</Label>
        <input
          id="field_label"
          type="text"
          required
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder={
            fieldType === "email" ? "e.g. Your Email Address" :
            fieldType === "phone" ? "e.g. Phone Number" :
            fieldType === "checkbox" ? "e.g. I agree to the terms" :
            "e.g. Full Name"
          }
          className={fieldClass("w-full")}
        />
      </div>

      {/* Placeholder — not shown for checkbox */}
      {!isCheckbox && !isRadio && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="field_placeholder">
            Placeholder Text <span className="text-gray-700 normal-case tracking-normal font-normal">(optional)</span>
          </Label>
          <input
            id="field_placeholder"
            type="text"
            value={placeholder}
            onChange={(e) => setPlaceholder(e.target.value)}
            placeholder={
              fieldType === "textarea" ? "e.g. Tell us more…" :
              fieldType === "select"   ? "e.g. Choose your sport" :
              "e.g. John Smith"
            }
            className={fieldClass("w-full")}
          />
        </div>
      )}

      {/* Options list for select / checkbox group / radio */}
      {hasOptions && (
        <div className="flex flex-col gap-3">
          <Label>Options</Label>
          {options.map((opt, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={opt}
                onChange={(e) => updateOption(i, e.target.value)}
                placeholder={`Option ${i + 1}`}
                className={fieldClass("flex-1")}
              />
              {options.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeOption(i)}
                  className="text-gray-600 hover:text-red-400 text-xs uppercase tracking-wider border border-white/10 hover:border-red-500/30 px-3 py-2.5 rounded transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addOption}
            className="self-start text-[10px] font-bold uppercase tracking-wider text-[#C9A84C] hover:text-yellow-300 transition-colors"
          >
            + Add Option
          </button>
        </div>
      )}

      {/* Required + Sort order */}
      <div className="flex gap-5 items-end flex-wrap">
        <label className="flex items-center gap-2 cursor-pointer pb-0.5">
          <div
            onClick={() => setRequired((v) => !v)}
            className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${required ? "bg-[#C9A84C]" : "bg-white/10"}`}
          >
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${required ? "left-5" : "left-0.5"}`} />
          </div>
          <span className="text-xs text-gray-400 uppercase tracking-wide">Required field</span>
        </label>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sort_order">Order</Label>
          <input
            id="sort_order"
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            className={fieldClass("w-20")}
          />
        </div>
      </div>

      {error && <p className="text-[#C8102E] text-xs font-semibold">{error}</p>}

      <div className="flex items-center gap-3 pt-2 border-t border-white/10">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 bg-[#C9A84C] text-black font-black text-sm uppercase tracking-widest py-3 rounded hover:bg-yellow-400 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Field"}
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

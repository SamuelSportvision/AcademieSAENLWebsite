"use client";

import { useState } from "react";

export interface FormField {
  id: string;
  form_id: string;
  field_type:
    | "text" | "email" | "phone" | "number" | "date"
    | "textarea" | "select" | "checkbox" | "radio";
  label: string;
  placeholder: string | null;
  options: string[] | null;
  required: boolean;
  sort_order: number;
}

interface DynamicFormProps {
  formId: string;
  fields: FormField[];
  successMessage: string;
}

const inputClass =
  "w-full bg-[#1a1a1a] border border-white/10 rounded px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#C9A84C] transition-colors";

/* ── Shared option-style components ─────────────────────────────────────────── */

function CheckboxOption({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group" onClick={onToggle}>
      <div
        className={`mt-0.5 w-5 h-5 flex-shrink-0 rounded border-2 flex items-center justify-center transition-colors ${
          checked
            ? "bg-[#C9A84C] border-[#C9A84C]"
            : "border-white/20 bg-transparent group-hover:border-white/40"
        }`}
      >
        {checked && <span className="text-black text-xs font-black leading-none">✓</span>}
      </div>
      <span className="text-gray-300 text-sm leading-relaxed select-none">{label}</span>
    </label>
  );
}

function RadioOption({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group" onClick={onSelect}>
      <div
        className={`mt-0.5 w-5 h-5 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
          selected
            ? "border-[#C9A84C]"
            : "border-white/20 bg-transparent group-hover:border-white/40"
        }`}
      >
        {selected && <div className="w-2.5 h-2.5 rounded-full bg-[#C9A84C]" />}
      </div>
      <span className="text-gray-300 text-sm leading-relaxed select-none">{label}</span>
    </label>
  );
}

/* ── Main form ───────────────────────────────────────────────────────────────── */

export default function DynamicForm({ formId, fields, successMessage }: DynamicFormProps) {
  // Values: string for most types, string[] for checkbox groups, boolean for single checkbox
  const [values, setValues]       = useState<Record<string, string | string[] | boolean>>({});
  const [errors, setErrors]       = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function setValue(id: string, value: string | string[] | boolean) {
    setValues((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  }

  function toggleCheckboxOption(fieldId: string, opt: string) {
    const current = (values[fieldId] as string[]) ?? [];
    const next = current.includes(opt)
      ? current.filter((v) => v !== opt)
      : [...current, opt];
    setValue(fieldId, next);
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    for (const field of fields) {
      if (!field.required) continue;
      const val = values[field.id];

      if (field.field_type === "checkbox") {
        // checkbox group — require at least one selected
        if ((val as string[] ?? []).length === 0) {
          newErrors[field.id] = "Please select at least one option.";
        }
      } else if (field.field_type === "radio") {
        if (!val || String(val).trim() === "") {
          newErrors[field.id] = "Please select an option.";
        }
      } else {
        if (!val || String(val).trim() === "") {
          newErrors[field.id] = "This field is required.";
        }
      }

      if (field.field_type === "email" && val) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val))) {
          newErrors[field.id] = "Please enter a valid email address.";
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError(null);

    // Build labelled submission data: { "Field Label": value }
    const labelledData: Record<string, string> = {};
    for (const field of fields) {
      const val = values[field.id];
      if (field.field_type === "checkbox") {
        const selected = (val as string[]) ?? [];
        labelledData[field.label] = selected.length ? selected.join(", ") : "None";
      } else {
        labelledData[field.label] = val === undefined ? "" : String(val);
      }
    }

    try {
      const res = await fetch(`/api/forms/${formId}/submissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: labelledData }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error ?? "Submission failed");
      }
      setSubmitted(true);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-[#1a1a1a] border border-emerald-700/40 rounded-lg px-8 py-12 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-900/40 border border-emerald-700/40 flex items-center justify-center mx-auto mb-5 text-emerald-400 text-xl">
          ✓
        </div>
        <p className="text-white font-black text-lg uppercase tracking-wide">{successMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {fields.map((field) => (
        <div key={field.id} className="flex flex-col gap-2">
          {/* Label */}
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
            {field.label}
            {field.required && <span className="text-[#C9A84C] ml-1">*</span>}
          </p>

          {/* Textarea */}
          {field.field_type === "textarea" && (
            <textarea
              rows={4}
              value={String(values[field.id] ?? "")}
              onChange={(e) => setValue(field.id, e.target.value)}
              placeholder={field.placeholder ?? ""}
              className={`${inputClass} resize-y leading-relaxed`}
            />
          )}

          {/* Select dropdown */}
          {field.field_type === "select" && (
            <select
              value={String(values[field.id] ?? "")}
              onChange={(e) => setValue(field.id, e.target.value)}
              className={`${inputClass} appearance-none`}
            >
              <option value="">{field.placeholder || "Select an option…"}</option>
              {(field.options ?? []).map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          )}

          {/* Checkbox group — select one or more */}
          {field.field_type === "checkbox" && (
            <div className="flex flex-col gap-2.5 pt-1">
              {(field.options ?? []).map((opt) => (
                <CheckboxOption
                  key={opt}
                  label={opt}
                  checked={((values[field.id] as string[]) ?? []).includes(opt)}
                  onToggle={() => toggleCheckboxOption(field.id, opt)}
                />
              ))}
              {!field.options?.length && (
                <p className="text-gray-600 text-xs italic">No options configured for this field.</p>
              )}
            </div>
          )}

          {/* Radio buttons — select one */}
          {field.field_type === "radio" && (
            <div className="flex flex-col gap-2.5 pt-1">
              {(field.options ?? []).map((opt) => (
                <RadioOption
                  key={opt}
                  label={opt}
                  selected={values[field.id] === opt}
                  onSelect={() => setValue(field.id, opt)}
                />
              ))}
              {!field.options?.length && (
                <p className="text-gray-600 text-xs italic">No options configured for this field.</p>
              )}
            </div>
          )}

          {/* All single-line input types */}
          {!["textarea", "select", "checkbox", "radio"].includes(field.field_type) && (
            <input
              type={field.field_type === "phone" ? "tel" : field.field_type}
              value={String(values[field.id] ?? "")}
              onChange={(e) => setValue(field.id, e.target.value)}
              placeholder={field.placeholder ?? ""}
              className={inputClass}
            />
          )}

          {errors[field.id] && (
            <p className="text-[#C8102E] text-xs font-semibold">{errors[field.id]}</p>
          )}
        </div>
      ))}

      {serverError && (
        <div className="bg-red-900/30 border border-red-700/40 text-red-400 text-sm font-semibold px-5 py-3 rounded">
          {serverError}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="bg-[#C8102E] text-white font-black text-sm uppercase tracking-widest px-8 py-4 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Submitting…" : "Submit"}
      </button>
    </form>
  );
}

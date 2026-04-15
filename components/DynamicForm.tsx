"use client";

import { useState } from "react";

export interface FormField {
  id: string;
  form_id: string;
  field_type: "text" | "email" | "phone" | "number" | "date" | "textarea" | "select" | "checkbox";
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

export default function DynamicForm({ formId, fields, successMessage }: DynamicFormProps) {
  const [values, setValues] = useState<Record<string, string | boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function setValue(fieldId: string, value: string | boolean) {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
    setErrors((prev) => ({ ...prev, [fieldId]: "" }));
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    for (const field of fields) {
      if (!field.required) continue;
      const val = values[field.id];
      if (field.field_type === "checkbox") {
        if (!val) newErrors[field.id] = "This field is required.";
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
    const labelledData: Record<string, string | boolean> = {};
    for (const field of fields) {
      const val = values[field.id];
      labelledData[field.label] = val ?? (field.field_type === "checkbox" ? false : "");
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
        <div key={field.id} className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
            {field.label}
            {field.required && <span className="text-[#C9A84C] ml-1">*</span>}
          </label>

          {field.field_type === "textarea" && (
            <textarea
              rows={4}
              value={String(values[field.id] ?? "")}
              onChange={(e) => setValue(field.id, e.target.value)}
              placeholder={field.placeholder ?? ""}
              className={`${inputClass} resize-y leading-relaxed`}
            />
          )}

          {field.field_type === "select" && (
            <select
              value={String(values[field.id] ?? "")}
              onChange={(e) => setValue(field.id, e.target.value)}
              className={`${inputClass} appearance-none`}
            >
              <option value="">Select an option…</option>
              {(field.options ?? []).map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          )}

          {field.field_type === "checkbox" && (
            <label className="flex items-start gap-3 cursor-pointer group">
              <div
                onClick={() => setValue(field.id, !values[field.id])}
                className={`mt-0.5 w-5 h-5 flex-shrink-0 rounded border-2 flex items-center justify-center transition-colors cursor-pointer ${
                  values[field.id]
                    ? "bg-[#C9A84C] border-[#C9A84C]"
                    : "border-white/20 bg-transparent group-hover:border-white/40"
                }`}
              >
                {values[field.id] && <span className="text-black text-xs font-black leading-none">✓</span>}
              </div>
              <span className="text-gray-400 text-sm leading-relaxed">
                {field.placeholder || field.label}
              </span>
            </label>
          )}

          {!["textarea", "select", "checkbox"].includes(field.field_type) && (
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

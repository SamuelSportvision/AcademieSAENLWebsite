"use client";

import type { FormField } from "@/components/DynamicForm";

type FieldType = FormField["field_type"];

interface FieldTypeOption {
  value: FieldType;
  label: string;
  description: string;
  preview: React.ReactNode;
}

/* ─── SVG mockups ──────────────────────────────────────────────────────────── */

function SingleLinePreview({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 160 70" className="w-full h-full" aria-hidden>
      <rect width="160" height="70" fill="#111" />
      <rect x="12" y="12" width="55" height="4" rx="2" fill="#555" />
      <rect x="12" y="24" width="136" height="22" rx="3" fill="#1a1a1a" stroke="#333" strokeWidth="1" />
      <rect x="20" y="32" width="60" height="3" rx="1.5" fill="#333" />
      <text x="148" y="37" textAnchor="end" fill="#C9A84C" fontSize="8" fontWeight="bold">{label}</text>
    </svg>
  );
}

function TextareaPreview() {
  return (
    <svg viewBox="0 0 160 70" className="w-full h-full" aria-hidden>
      <rect width="160" height="70" fill="#111" />
      <rect x="12" y="10" width="40" height="4" rx="2" fill="#555" />
      <rect x="12" y="22" width="136" height="38" rx="3" fill="#1a1a1a" stroke="#333" strokeWidth="1" />
      <rect x="20" y="30" width="90" height="3" rx="1.5" fill="#333" />
      <rect x="20" y="37" width="70" height="3" rx="1.5" fill="#333" />
      <rect x="20" y="44" width="80" height="3" rx="1.5" fill="#333" />
    </svg>
  );
}

function SelectPreview() {
  return (
    <svg viewBox="0 0 160 70" className="w-full h-full" aria-hidden>
      <rect width="160" height="70" fill="#111" />
      <rect x="12" y="12" width="45" height="4" rx="2" fill="#555" />
      <rect x="12" y="24" width="136" height="22" rx="3" fill="#1a1a1a" stroke="#333" strokeWidth="1" />
      <rect x="20" y="32" width="50" height="3" rx="1.5" fill="#444" />
      <text x="140" y="37" textAnchor="middle" fill="#666" fontSize="10">▾</text>
    </svg>
  );
}

function CheckboxPreview() {
  return (
    <svg viewBox="0 0 160 70" className="w-full h-full" aria-hidden>
      <rect width="160" height="70" fill="#111" />
      {[18, 36, 54].map((y, i) => (
        <g key={y}>
          <rect x="12" y={y} width="14" height="14" rx="3"
            fill={i === 0 ? "#C9A84C" : "#1a1a1a"} stroke={i === 0 ? "#C9A84C" : "#333"} strokeWidth="1" />
          {i === 0 && <text x="19" y={y + 10} textAnchor="middle" fill="#000" fontSize="9" fontWeight="bold">✓</text>}
          <rect x="32" y={y + 4} width={i === 0 ? 80 : 60} height="4" rx="2" fill="#444" />
        </g>
      ))}
    </svg>
  );
}

/* ─── Options ─────────────────────────────────────────────────────────────── */

const OPTIONS: FieldTypeOption[] = [
  { value: "text",     label: "Short Text",   description: "Single-line text answer",       preview: <SingleLinePreview label="Aa" /> },
  { value: "email",    label: "Email",        description: "Email address with validation", preview: <SingleLinePreview label="@" /> },
  { value: "phone",    label: "Phone",        description: "Phone number",                 preview: <SingleLinePreview label="☎" /> },
  { value: "number",   label: "Number",       description: "Numeric input",                preview: <SingleLinePreview label="123" /> },
  { value: "date",     label: "Date",         description: "Date picker",                  preview: <SingleLinePreview label="📅" /> },
  { value: "textarea", label: "Long Text",    description: "Multi-line text answer",       preview: <TextareaPreview /> },
  { value: "select",   label: "Dropdown",     description: "Select one from a list",       preview: <SelectPreview /> },
  { value: "checkbox", label: "Checkboxes",   description: "One or more checkable items",  preview: <CheckboxPreview /> },
];

/* ─── Component ───────────────────────────────────────────────────────────── */

interface FieldTypePickerProps {
  onSelect: (type: FieldType) => void;
}

export default function FieldTypePicker({ onSelect }: FieldTypePickerProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 mb-1">
        Choose a field type
      </p>
      <div className="grid grid-cols-2 gap-3">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onSelect(opt.value)}
            className="group text-left border border-white/10 rounded-lg overflow-hidden hover:border-[#C9A84C]/50 hover:bg-[#C9A84C]/5 transition-all focus:outline-none focus:border-[#C9A84C]"
          >
            <div className="aspect-[16/9] w-full overflow-hidden bg-[#111] border-b border-white/5">
              {opt.preview}
            </div>
            <div className="px-3 py-2.5">
              <p className="text-white text-xs font-bold group-hover:text-[#C9A84C] transition-colors">
                {opt.label}
              </p>
              <p className="text-gray-600 text-[10px] mt-0.5 leading-snug">{opt.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

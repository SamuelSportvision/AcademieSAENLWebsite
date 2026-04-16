"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { use } from "react";
import type { FormField } from "@/components/DynamicForm";
import FieldTypePicker from "@/components/admin/FieldTypePicker";
import FormFieldForm from "@/components/admin/FormFieldForm";

/* ─── Types ──────────────────────────────────────────────────────────────────── */

interface FormRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  success_message: string;
  notification_email: string | null;
  is_active: boolean;
}

const FIELD_TYPE_LABELS: Record<FormField["field_type"], string> = {
  text: "Short Text", email: "Email", phone: "Phone",
  number: "Number", date: "Date", textarea: "Long Text",
  select: "Dropdown", checkbox: "Checkboxes", radio: "Radio Buttons",
};

const FIELD_BADGE: Record<FormField["field_type"], string> = {
  text:     "bg-blue-900/30 text-blue-400 border-blue-800/40",
  email:    "bg-cyan-900/30 text-cyan-400 border-cyan-800/40",
  phone:    "bg-teal-900/30 text-teal-400 border-teal-800/40",
  number:   "bg-violet-900/30 text-violet-400 border-violet-800/40",
  date:     "bg-indigo-900/30 text-indigo-400 border-indigo-800/40",
  textarea: "bg-amber-900/30 text-amber-400 border-amber-800/40",
  select:   "bg-emerald-900/30 text-emerald-400 border-emerald-800/40",
  checkbox: "bg-pink-900/30 text-pink-400 border-pink-800/40",
  radio:    "bg-orange-900/30 text-orange-400 border-orange-800/40",
};

/* ─── Drawer (type picker → field form) ─────────────────────────────────────── */

function FieldDrawer({
  formId, editField, open, onClose, onSaved,
}: {
  formId: string;
  editField: FormField | null;
  open: boolean;
  onClose: () => void;
  onSaved: (field: FormField) => void;
}) {
  const [step, setStep] = useState<"pick" | "form">("pick");
  const [pickedType, setPickedType] = useState<FormField["field_type"] | null>(null);

  useEffect(() => {
    if (open) {
      if (editField) { setStep("form"); setPickedType(editField.field_type); }
      else { setStep("pick"); setPickedType(null); }
    }
  }, [open, editField]);

  function handleSaved(field: FormField) { onSaved(field); onClose(); }

  // We need a synthetic FormField for the form when creating
  const syntheticField = pickedType && !editField
    ? { ...({} as FormField), field_type: pickedType }
    : editField;

  return (
    <>
      <div
        className={`fixed inset-0 z-30 transition-opacity duration-300 ${open ? "bg-black/40 pointer-events-auto" : "bg-transparent pointer-events-none"}`}
        onClick={onClose}
        aria-hidden
      />
      <div
        className={`fixed top-0 right-0 h-full z-40 w-full max-w-[480px] bg-[#131313] border-l border-white/10 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            {step === "form" && !editField && (
              <button onClick={() => setStep("pick")} className="text-gray-500 hover:text-white transition-colors text-sm">←</button>
            )}
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#C9A84C]">
                {editField ? "Edit Field" : "Add Field"}
              </p>
              {step === "form" && pickedType && (
                <p className="text-white font-black text-base uppercase tracking-wide leading-tight mt-0.5">
                  {FIELD_TYPE_LABELS[pickedType]}
                </p>
              )}
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded hover:bg-white/10" aria-label="Close">✕</button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {step === "pick" && (
            <FieldTypePicker onSelect={(type) => { setPickedType(type); setStep("form"); }} />
          )}
          {step === "form" && syntheticField && (
            <FormFieldForm
              formId={formId}
              existing={editField ?? undefined}
              onSaved={handleSaved}
              onCancel={onClose}
            />
          )}
        </div>
      </div>
    </>
  );
}

/* ─── Main page ──────────────────────────────────────────────────────────────── */

export default function AdminFormBuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [form, setForm]           = useState<FormRow | null>(null);
  const [fields, setFields]       = useState<FormField[]>([]);
  const [loading, setLoading]     = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editField, setEditField] = useState<FormField | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [previewKey, setPreviewKey] = useState(0);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const dragIndexRef = useRef<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  }
  function refreshPreview() { setPreviewKey((k) => k + 1); }

  /* ── Fetch ── */
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [formRes, fieldsRes] = await Promise.all([
        fetch(`/api/forms/${id}`),
        fetch(`/api/forms/${id}/fields`),
      ]);
      if (!formRes.ok) throw new Error("Form not found");
      setForm(await formRes.json());
      setFields(fieldsRes.ok ? await fieldsRes.json() : []);
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* ── Save ── */
  function handleSaved(saved: FormField) {
    setFields((prev) => {
      const exists = prev.find((f) => f.id === saved.id);
      return exists ? prev.map((f) => (f.id === saved.id ? saved : f)) : [...prev, saved];
    });
    setEditField(null);
    setDrawerOpen(false);
    refreshPreview();
    showToast("success", editField ? "Field updated." : "Field added.");
  }

  /* ── Delete ── */
  async function handleDelete(field: FormField) {
    if (!confirm(`Delete field "${field.label}"? This cannot be undone.`)) return;
    setDeletingId(field.id);
    try {
      const res = await fetch(`/api/forms/${id}/fields/${field.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setFields((prev) => prev.filter((f) => f.id !== field.id));
      refreshPreview();
      showToast("success", "Field deleted.");
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Unknown error");
    } finally {
      setDeletingId(null);
    }
  }

  /* ── Drag and drop ── */
  function onDragStart(index: number) { dragIndexRef.current = index; }
  function onDragOver(e: React.DragEvent, index: number) { e.preventDefault(); setDragOver(index); }
  async function onDrop(e: React.DragEvent, dropIndex: number) {
    e.preventDefault();
    const from = dragIndexRef.current;
    if (from === null || from === dropIndex) { setDragOver(null); dragIndexRef.current = null; return; }
    const next = [...fields];
    const [moved] = next.splice(from, 1);
    next.splice(dropIndex, 0, moved);
    setFields(next);
    setDragOver(null);
    dragIndexRef.current = null;
    try {
      await fetch(`/api/forms/${id}/fields/reorder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: next.map((f) => f.id) }),
      });
      refreshPreview();
    } catch { await fetchData(); }
  }
  function onDragEnd() { dragIndexRef.current = null; setDragOver(null); }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f0f0f]">
        <p className="text-gray-600 text-xs uppercase tracking-wider">Loading…</p>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f0f0f]">
        <p className="text-red-400 font-bold uppercase tracking-wider">Form not found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 112px)" }}>

      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#0d0d0d] border-b border-white/10 flex-shrink-0 gap-3 flex-wrap">
        <div className="flex items-center gap-4 min-w-0">
          <Link href="/admin/forms" className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600 hover:text-gray-400 transition-colors whitespace-nowrap">
            ← Forms
          </Link>
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-white font-black text-sm uppercase tracking-widest truncate">{form.name}</h1>
            <span className="text-gray-600 text-xs hidden sm:inline">· {fields.length} field{fields.length !== 1 ? "s" : ""}</span>
          </div>
        </div>

        {toast && (
          <div className={`hidden sm:block text-xs font-semibold px-4 py-1.5 rounded ${
            toast.type === "success"
              ? "bg-emerald-900/50 text-emerald-400 border border-emerald-700/40"
              : "bg-red-900/50 text-red-400 border border-red-700/40"
          }`}>
            {toast.message}
          </div>
        )}

        <div className="flex items-center gap-2">
          <Link
            href={`/admin/forms/${id}/submissions`}
            className="text-xs text-gray-600 hover:text-white uppercase tracking-wider transition-colors border border-white/10 hover:border-white/20 px-3 py-2 rounded"
          >
            Submissions
          </Link>
          <button
            onClick={() => { setEditField(null); setDrawerOpen(true); }}
            className="bg-[#C9A84C] text-black font-black text-xs uppercase tracking-widest px-5 py-2 rounded hover:bg-yellow-400 transition-colors whitespace-nowrap"
          >
            + Add Field
          </button>
        </div>
      </div>

      {/* Mobile toast */}
      {toast && (
        <div className={`sm:hidden px-5 py-2.5 text-xs font-semibold ${
          toast.type === "success" ? "bg-emerald-900/40 text-emerald-400" : "bg-red-900/40 text-red-400"
        }`}>{toast.message}</div>
      )}

      {/* Split layout */}
      <div className="flex flex-1 min-h-0">

        {/* Left: field list */}
        <div className="w-full lg:w-[380px] flex-shrink-0 flex flex-col overflow-y-auto bg-[#0f0f0f] border-r border-white/10">
          <div className="flex-1 p-4">
            {fields.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-20 text-center gap-4">
                <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-2xl">⊞</div>
                <div>
                  <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">No fields yet</p>
                  <p className="text-gray-700 text-xs mt-1">Click &ldquo;+ Add Field&rdquo; to build your form.</p>
                </div>
                <button
                  onClick={() => { setEditField(null); setDrawerOpen(true); }}
                  className="mt-2 bg-[#C9A84C] text-black font-black text-xs uppercase tracking-widest px-6 py-2.5 rounded hover:bg-yellow-400 transition-colors"
                >
                  + Add First Field
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    draggable
                    onDragStart={() => onDragStart(index)}
                    onDragOver={(e) => onDragOver(e, index)}
                    onDrop={(e) => onDrop(e, index)}
                    onDragEnd={onDragEnd}
                    className={`group bg-[#1a1a1a] border rounded-lg transition-all cursor-default ${
                      dragOver === index
                        ? "border-[#C9A84C] bg-[#C9A84C]/5"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-stretch gap-0">
                      {/* Drag handle */}
                      <div className="flex items-center justify-center w-8 flex-shrink-0 text-gray-700 group-hover:text-gray-500 cursor-grab active:cursor-grabbing transition-colors rounded-l-lg hover:bg-white/5 select-none" title="Drag to reorder">
                        <span className="text-sm leading-none">⠿</span>
                      </div>
                      {/* Content */}
                      <div className="flex-1 py-3 pr-3 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${FIELD_BADGE[field.field_type]}`}>
                            {FIELD_TYPE_LABELS[field.field_type]}
                          </span>
                          {field.required && (
                            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border bg-amber-900/20 text-amber-500 border-amber-700/30">
                              Required
                            </span>
                          )}
                        </div>
                        <p className="text-white font-semibold text-sm leading-snug truncate">{field.label}</p>
                        {field.placeholder && (
                          <p className="text-gray-600 text-[10px] mt-0.5 truncate italic">"{field.placeholder}"</p>
                        )}
                        <div className="flex items-center gap-1.5 mt-2.5">
                          <button
                            onClick={() => { setEditField(field); setDrawerOpen(true); }}
                            className="text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:text-white border border-white/10 hover:border-white/30 px-2.5 py-1 rounded transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(field)}
                            disabled={deletingId === field.id}
                            className="text-[10px] font-bold uppercase tracking-wider text-gray-600 hover:text-red-400 border border-white/10 hover:border-red-500/30 px-2.5 py-1 rounded transition-colors disabled:opacity-40"
                          >
                            {deletingId === field.id ? "…" : "Delete"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Add more button */}
                <button
                  onClick={() => { setEditField(null); setDrawerOpen(true); }}
                  className="mt-1 w-full border border-dashed border-white/15 hover:border-[#C9A84C]/40 hover:bg-[#C9A84C]/5 rounded-lg py-3 text-gray-600 hover:text-[#C9A84C] text-xs font-bold uppercase tracking-wider transition-all"
                >
                  + Add Field
                </button>
              </div>
            )}
          </div>
          <div className="px-4 py-3 border-t border-white/10 flex-shrink-0">
            <p className="text-[10px] text-gray-700 uppercase tracking-wider">Drag ⠿ to reorder · Changes appear live</p>
          </div>
        </div>

        {/* Right: live preview */}
        <div className="hidden lg:flex flex-1 flex-col bg-[#0a0a0a] min-w-0">
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 flex-shrink-0 gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#C9A84C]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Live Preview</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={refreshPreview} className="text-[10px] text-gray-600 hover:text-white uppercase tracking-wider transition-colors border border-white/10 hover:border-white/20 px-3 py-1.5 rounded">
                ↺ Refresh
              </button>
              <a href={`/forms/${form.slug}`} target="_blank" rel="noopener noreferrer" className="text-[10px] text-gray-600 hover:text-[#C9A84C] uppercase tracking-wider transition-colors border border-white/10 hover:border-[#C9A84C]/30 px-3 py-1.5 rounded">
                Open ↗
              </a>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <iframe
              key={previewKey}
              src={`/forms/${form.slug}`}
              title={`Preview: ${form.name}`}
              className="w-full h-full border-0"
              sandbox="allow-same-origin allow-scripts allow-forms"
            />
          </div>
        </div>
      </div>

      {/* Drawer */}
      <FieldDrawer
        formId={id}
        editField={editField}
        open={drawerOpen}
        onClose={() => { setDrawerOpen(false); setEditField(null); }}
        onSaved={handleSaved}
      />
    </div>
  );
}

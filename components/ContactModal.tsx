"use client";

import { useState, useRef, useEffect, useCallback } from "react";

const SUBJECTS = [
  { value: "registration", label: "Program Registration" },
  { value: "general", label: "General Inquiry" },
  { value: "coaching", label: "Coaching & Staff" },
  { value: "partnership", label: "Partnership / Sponsorship" },
  { value: "parent", label: "Parent / Guardian" },
  { value: "media", label: "Media & Press" },
  { value: "other", label: "Other" },
];

const MAX_FILES = 3;
const MAX_SIZE_MB = 4;

interface AttachmentFile {
  filename: string;
  content: string; // base64
  size: number;
}

interface ContactModalProps {
  /** Custom label for the trigger button */
  label?: string;
  /** Additional className for the trigger button */
  className?: string;
}

export default function ContactModal({
  label = "Contact Us",
  className = "",
}: ContactModalProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Focus first field when modal opens
  useEffect(() => {
    if (open) {
      setTimeout(() => firstInputRef.current?.focus(), 50);
    }
  }, [open]);

  // ESC to close
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) setOpen(false);
    },
    [open]
  );
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  function handleClose() {
    if (status === "sending") return;
    setOpen(false);
    // Reset after animation
    setTimeout(() => {
      setForm({ name: "", email: "", subject: "", message: "" });
      setAttachments([]);
      setFileError(null);
      setStatus("idle");
      setErrorMsg(null);
    }, 200);
  }

  async function handleFiles(files: FileList | null) {
    if (!files) return;
    setFileError(null);

    const current = [...attachments];
    const incoming = Array.from(files);

    if (current.length + incoming.length > MAX_FILES) {
      setFileError(`Maximum ${MAX_FILES} files allowed.`);
      return;
    }

    const readers: Promise<AttachmentFile>[] = incoming.map(
      (file) =>
        new Promise((resolve, reject) => {
          if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            reject(new Error(`"${file.name}" exceeds ${MAX_SIZE_MB} MB.`));
            return;
          }
          const reader = new FileReader();
          reader.onload = () => {
            const base64 = (reader.result as string).split(",")[1];
            resolve({ filename: file.name, content: base64, size: file.size });
          };
          reader.onerror = () => reject(new Error(`Failed to read "${file.name}".`));
          reader.readAsDataURL(file);
        })
    );

    try {
      const results = await Promise.all(readers);
      setAttachments([...current, ...results]);
    } catch (err) {
      setFileError(err instanceof Error ? err.message : "File error.");
    }

    // Reset file input so the same file can be re-added if removed
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeAttachment(idx: number) {
    setAttachments((prev) => prev.filter((_, i) => i !== idx));
    setFileError(null);
  }

  function formatBytes(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, attachments }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Send failed.");
      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Unknown error.");
      setStatus("error");
    }
  }

  const inputCls =
    "bg-[#111] border border-white/10 rounded px-4 py-2.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-[#C9A84C] transition-colors w-full";
  const labelCls =
    "text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500";

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className={className}
      >
        {label}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          onClick={handleClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          {/* Modal card */}
          <div
            className="relative z-10 w-full max-w-lg bg-[#1a1a1a] border border-white/10 rounded overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 flex-shrink-0">
              <div>
                <h2 className="text-white font-black text-lg uppercase tracking-wide">
                  Contact Us
                </h2>
                <p className="text-[10px] text-gray-600 uppercase tracking-wider mt-0.5">
                  SAE Academy
                </p>
              </div>
              <button
                onClick={handleClose}
                disabled={status === "sending"}
                className="text-gray-600 hover:text-white transition-colors p-1 rounded disabled:opacity-40"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1">
              {status === "success" ? (
                /* Success state */
                <div className="flex flex-col items-center justify-center gap-4 py-16 px-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-900/30 border border-emerald-700/40 flex items-center justify-center">
                    <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-black text-xl uppercase tracking-wide">
                      Message Sent!
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      We&apos;ll be in touch soon. A copy has been sent to{" "}
                      <span className="text-[#C9A84C]">{form.email}</span>.
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="mt-4 bg-[#C9A84C] text-black font-black text-xs uppercase tracking-widest px-8 py-3 rounded hover:bg-yellow-400 transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : (
                /* Form */
                <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-5">
                  {/* Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="cf-name" className={labelCls}>Name</label>
                      <input
                        id="cf-name"
                        ref={firstInputRef}
                        type="text"
                        required
                        placeholder="Your full name"
                        value={form.name}
                        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                        className={inputCls}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="cf-email" className={labelCls}>Email</label>
                      <input
                        id="cf-email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                        className={inputCls}
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="cf-subject" className={labelCls}>Subject</label>
                    <select
                      id="cf-subject"
                      required
                      value={form.subject}
                      onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                      className={`${inputCls} appearance-none`}
                    >
                      <option value="" disabled>Select a topic…</option>
                      {SUBJECTS.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="cf-message" className={labelCls}>Message</label>
                    <textarea
                      id="cf-message"
                      required
                      rows={5}
                      placeholder="Write your message here…"
                      value={form.message}
                      onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                      className={`${inputCls} resize-none`}
                    />
                  </div>

                  {/* Attachments */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label className={labelCls}>
                        Attachments{" "}
                        <span className="normal-case font-normal tracking-normal text-gray-700">
                          (optional · max {MAX_FILES} files · {MAX_SIZE_MB} MB each)
                        </span>
                      </label>
                    </div>

                    {/* Drop zone / file picker */}
                    <button
                      type="button"
                      disabled={attachments.length >= MAX_FILES}
                      onClick={() => fileInputRef.current?.click()}
                      className="border border-dashed border-white/10 hover:border-white/25 rounded px-4 py-4 text-xs text-gray-600 hover:text-gray-400 transition-colors text-center disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {attachments.length >= MAX_FILES
                        ? `Maximum ${MAX_FILES} files reached`
                        : "+ Click to attach files"}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFiles(e.target.files)}
                    />

                    {/* Attached file list */}
                    {attachments.length > 0 && (
                      <ul className="flex flex-col gap-1.5">
                        {attachments.map((f, i) => (
                          <li
                            key={i}
                            className="flex items-center justify-between bg-[#111] border border-white/10 rounded px-3 py-2"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <svg className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                              </svg>
                              <span className="text-xs text-gray-300 truncate">{f.filename}</span>
                              <span className="text-[10px] text-gray-600 flex-shrink-0">{formatBytes(f.size)}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeAttachment(i)}
                              className="text-gray-600 hover:text-red-400 transition-colors ml-2 flex-shrink-0"
                              aria-label="Remove file"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}

                    {fileError && (
                      <p className="text-[#C8102E] text-xs">{fileError}</p>
                    )}
                  </div>

                  {/* Error */}
                  {status === "error" && errorMsg && (
                    <p className="text-[#C8102E] text-xs font-semibold">{errorMsg}</p>
                  )}

                  {/* Footer actions */}
                  <div className="flex items-center justify-between gap-3 pt-1 border-t border-white/10 mt-1">
                    <p className="text-[10px] text-gray-700">
                      Sent to{" "}
                      <span className="text-gray-500">info@academiesae.com</span>
                      {" "}· Copy to your email
                    </p>
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="bg-[#C9A84C] text-black font-black text-xs uppercase tracking-widest px-6 py-3 rounded hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex-shrink-0"
                    >
                      {status === "sending" ? "Sending…" : "Send Message"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

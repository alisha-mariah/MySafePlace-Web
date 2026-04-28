"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/src/context/AuthContext";
import {
  addJournalEntry,
  getJournalEntries,
  updateJournalEntry,
  deleteJournalEntry,
  JournalEntry,
  JournalMoodData,
} from "@/src/services/journalService";
import ConfirmDeleteModal from "@/src/components/ui/ConfirmDeleteModal";

/* ── Mood list (matches MoodTracker) ── */

const MOODS = [
  { name: "happy",       color: "#D4A017" },
  { name: "calm",        color: "#5EA88A" },
  { name: "relaxed",     color: "#9B8EC4" },
  { name: "grateful",    color: "#D4789A" },
  { name: "motivated",   color: "#2E9E6A" },
  { name: "sad",         color: "#5B8DB8" },
  { name: "anxious",     color: "#CC8C35" },
  { name: "stressed",    color: "#C46050" },
  { name: "angry",       color: "#C04848" },
  { name: "lonely",      color: "#8A6AAE" },
  { name: "overwhelmed", color: "#4A8A8A" },
  { name: "tired",       color: "#708898" },
  { name: "insecure",    color: "#A87890" },
  { name: "frustrated",  color: "#B87A3E" },
  { name: "bored",       color: "#7A946A" },
];

/* ── Date helpers ── */

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function getDateLabel(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const entryDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (entryDay.getTime() === today.getTime()) return "Today";
  if (entryDay.getTime() === yesterday.getTime()) return "Yesterday";
  const sameYear = date.getFullYear() === now.getFullYear();
  return date.toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
  });
}

function groupEntries(entries: JournalEntry[]): { label: string; entries: JournalEntry[] }[] {
  const groups: { label: string; entries: JournalEntry[] }[] = [];
  let currentLabel = "";
  for (const entry of entries) {
    const label = getDateLabel(entry.createdAt);
    if (label !== currentLabel) {
      groups.push({ label, entries: [entry] });
      currentLabel = label;
    } else {
      groups[groups.length - 1].entries.push(entry);
    }
  }
  return groups;
}

/* ── Mood selector ── */

function MoodSelector({
  selected,
  onChange,
}: {
  selected: string | null;
  onChange: (name: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = MOODS.find((m) => m.name === selected);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex cursor-pointer items-center justify-between gap-2 rounded-xl px-3.5 py-2 text-[12px] font-semibold transition-all duration-150 hover:-translate-y-0.5 hover:brightness-[1.02]"
        style={{
          width: 160,
          backgroundColor: selected
            ? current!.color + "18"
            : open
              ? "rgba(125,184,146,0.22)"
              : "rgba(255,255,255,0.75)",
          border: selected
            ? `1.5px solid ${current!.color}55`
            : `1.5px ${open ? "solid" : "dashed"} rgba(74,155,122,0.55)`,
          color: selected ? current!.color : "#2D6A4F",
          boxShadow: open
            ? "0 4px 12px rgba(45,106,79,0.15)"
            : "0 2px 6px rgba(45,106,79,0.06)",
        }}
      >
        {selected ? (
          <>
            <span
              className="inline-block h-3 w-3 flex-shrink-0 rounded-full"
              style={{ backgroundColor: current!.color }}
            />
            <span className="flex-1 text-center capitalize">{selected}</span>
          </>
        ) : (
          <>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 14s1.5 2 4 2 4-2 4-2" />
              <line x1="9" y1="9" x2="9.01" y2="9" />
              <line x1="15" y1="9" x2="15.01" y2="9" />
            </svg>
            <span className="flex-1 text-center">Add mood</span>
          </>
        )}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0" style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.15s ease", opacity: 0.7 }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute bottom-full left-0 z-30 mb-2 rounded-2xl p-3"
          style={{
            background: "linear-gradient(145deg, #FFFFFF 0%, #F2FAF5 100%)",
            border: "1px solid rgba(200,230,208,0.5)",
            boxShadow: "0 8px 24px rgba(45,106,79,0.10)",
            width: 280,
          }}
        >
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#8DBFA5" }}>
              How are you feeling?
            </p>
            {selected && (
              <button
                type="button"
                onClick={() => { onChange(null); setOpen(false); }}
                className="text-[10px] font-semibold transition-opacity hover:opacity-70"
                style={{ color: "#C46050" }}
              >
                Remove
              </button>
            )}
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {MOODS.map((m) => (
              <button
                key={m.name}
                type="button"
                onClick={() => { onChange(m.name); setOpen(false); }}
                className="flex flex-col items-center gap-1 rounded-xl py-2 text-[9px] font-semibold capitalize transition-all duration-150 hover:scale-105"
                style={{
                  backgroundColor:
                    selected === m.name ? m.color + "20" : "rgba(200,230,208,0.06)",
                  border: `1px solid ${selected === m.name ? m.color + "50" : "rgba(200,230,208,0.25)"}`,
                  color: selected === m.name ? m.color : "#8DBFA5",
                }}
              >
                <span
                  className="inline-block h-3 w-3 rounded-full"
                  style={{ backgroundColor: m.color }}
                />
                {m.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Mood badge (for past entries) ── */

function MoodBadge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize"
      style={{ backgroundColor: color + "18", color }}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}

/* ── Page content ── */

function JournalContent() {
  const { user } = useAuth();

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [content, setContent] = useState("");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deletingEntry, setDeletingEntry] = useState<JournalEntry | null>(null);
  const [deleting, setDeleting] = useState(false);

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  const fetchEntries = useCallback(async () => {
    if (!user) return;
    try {
      const data = await getJournalEntries(user.uid);
      setEntries(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch journal entries:", err);
      setError("Could not load entries.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  function buildMoodData(): JournalMoodData | undefined {
    if (!selectedMood) return undefined;
    const m = MOODS.find((x) => x.name === selectedMood);
    if (!m) return undefined;
    return { moodLabel: m.name, moodColor: m.color };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || !user) return;
    setSubmitting(true);
    try {
      if (editingId) {
        const mood = selectedMood
          ? buildMoodData()
          : null; // null = explicitly clear mood
        await updateJournalEntry(editingId, content.trim(), mood ?? null);
      } else {
        await addJournalEntry(user.uid, content.trim(), buildMoodData());
      }
      const msg = editingId ? "Changes saved!" : "Entry saved!";
      setContent("");
      setSelectedMood(null);
      setEditingId(null);
      await fetchEntries();
      setSavedMsg(msg);
      setTimeout(() => setSavedMsg(null), 2500);
    } catch (err) {
      console.error("Failed to save journal entry:", err);
    } finally {
      setSubmitting(false);
    }
  }

  function handleEdit(entry: JournalEntry) {
    setContent(entry.content);
    setSelectedMood(entry.moodLabel ?? null);
    setEditingId(entry.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancelEdit() {
    setContent("");
    setSelectedMood(null);
    setEditingId(null);
  }

  async function confirmDelete() {
    if (!deletingEntry) return;
    setDeleting(true);
    try {
      await deleteJournalEntry(deletingEntry.id);
      if (editingId === deletingEntry.id) handleCancelEdit();
      setDeletingEntry(null);
      await fetchEntries();
    } catch (err) {
      console.error("Failed to delete journal entry:", err);
    } finally {
      setDeleting(false);
    }
  }

  function previewOf(text: string, max = 50) {
    const clean = text.trim().replace(/\s+/g, " ");
    return clean.length > max ? clean.slice(0, max).trimEnd() + "…" : clean;
  }

  return (
    <div className="relative min-h-screen">

      {/* Header */}
      <header className="relative z-10 mx-auto max-w-5xl px-6 pt-8 pb-2">
        <Link
          href="/dashboard"
          className="pill-btn mb-5 inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium"
          style={{ color: "#6B9E85", backgroundColor: "rgba(255,255,255,0.7)", border: "1px solid rgba(200,230,208,0.5)", backdropFilter: "blur(8px)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          Homepage
        </Link>

        <div
          className="animate-fade-in-up rounded-2xl px-7 py-6"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.55) 100%)",
            border: "1px solid rgba(200,230,208,0.45)",
            boxShadow: "0 8px 32px rgba(45,106,79,0.06), 0 2px 8px rgba(45,106,79,0.03)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: "linear-gradient(135deg, rgba(184,216,196,0.35) 0%, rgba(200,230,208,0.25) 100%)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4E9B78" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5Z" />
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M8 7h8M8 11h5" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold tracking-tight" style={{ color: "#1A3D2B" }}>Journal</h1>
                {entries.length > 0 && (
                  <span className="rounded-full px-2.5 py-0.5 text-[11px] font-bold" style={{ backgroundColor: "rgba(125,184,146,0.15)", color: "#4A9474" }}>
                    {entries.length} {entries.length === 1 ? "entry" : "entries"}
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-sm" style={{ color: "#6B9E85" }}>
                {editingId ? "Edit your entry" : "Write your thoughts and reflect"}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-5 py-6">
        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div
            className="relative animate-fade-in-up-1 rounded-2xl border p-6"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.80) 0%, rgba(255,255,255,0.60) 100%)",
              borderColor: "rgba(200,230,208,0.45)",
              boxShadow: "0 2px 8px rgba(45,106,79,0.04), 0 8px 24px rgba(45,106,79,0.04)",
              backdropFilter: "blur(8px)",
            }}
          >
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              rows={6}
              className="auth-input w-full resize-none rounded-xl border px-5 py-4 text-sm leading-relaxed"
              style={{
                borderColor: "rgba(200,230,208,0.5)",
                backgroundColor: "rgba(255,255,255,0.6)",
                color: "#1A3D2B",
                minHeight: "160px",
              }}
            />

            {/* Mood selector row */}
            <div className="mt-4 flex items-center gap-2">
              <MoodSelector selected={selectedMood} onChange={setSelectedMood} />
              <span className="text-[11px]" style={{ color: "#A8C4B4" }}>optional</span>
            </div>

            {/* Actions row */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={!content.trim() || submitting}
                  className="cta-glow nature-btn flex items-center justify-center gap-2 rounded-xl px-7 py-3 text-sm font-bold text-white tracking-wide disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    background: "linear-gradient(135deg, #4A9B7A 0%, #3D8B6A 40%, #2D6A4F 100%)",
                    boxShadow: "0 4px 14px rgba(45,106,79,0.28)",
                    width: 160,
                  }}
                >
                  {submitting ? "Saving..." : editingId ? (
                    <>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                      Save changes
                    </>
                  ) : (
                    <>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                      Save entry
                    </>
                  )}
                </button>
                {editingId && (
                  <button type="button" onClick={handleCancelEdit} className="text-sm font-medium transition-opacity hover:opacity-70" style={{ color: "#6B8B78" }}>
                    Cancel
                  </button>
                )}
                {savedMsg && (
                  <span className="animate-fade-in-up flex items-center gap-1.5 text-[13px] font-semibold" style={{ color: "#4A9474" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    {savedMsg}
                  </span>
                )}
              </div>

              {/* Word count */}
              {content.trim() && (
                <div className="word-ring flex items-center gap-2">
                  <svg width="28" height="28" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(200,230,208,0.3)" strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="14"
                      fill="none" stroke="#7DB892" strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray={`${Math.min(wordCount / 200, 1) * 88} 88`}
                      transform="rotate(-90 18 18)"
                      style={{ transition: "stroke-dasharray 0.3s ease" }}
                    />
                  </svg>
                  <div>
                    <p className="text-[13px] font-bold tabular-nums" style={{ color: "#2D6A4F" }}>{wordCount}</p>
                    <p className="text-[9px] uppercase tracking-wider" style={{ color: "#8DBFA5" }}>words</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Entries */}
        <div className="mt-8">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest animate-fade-in-up-2" style={{ color: "#8DBFA5" }}>Past entries</p>

          {error && (
            <div className="mb-4 rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: "rgba(254,242,242,0.8)", color: "#DC3545", border: "1px solid #FECACA" }}>{error}</div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="nature-float">
                <path d="M6 3 C10 7 12 13 10 19 C8 19 2 17 1 13 C-1 9 2 5 6 3 Z" fill="#7DB892" opacity="0.6" />
                <path d="M6 3 C5 9 5 15 10 19" stroke="#5EA88A" strokeWidth="0.8" fill="none" opacity="0.4" />
              </svg>
            </div>
          ) : entries.length === 0 ? (
            <div
              className="animate-fade-in-up-3 rounded-2xl border border-dashed py-14 text-center"
              style={{ borderColor: "rgba(200,230,208,0.5)", background: "rgba(255,255,255,0.4)" }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#A8D5BA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5Z" />
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              </svg>
              <p className="text-sm" style={{ color: "#8DBFA5" }}>No entries yet. Start writing.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {groupEntries(entries).map((group) => (
                <div key={group.label}>
                  {/* Date group label */}
                  <div className="mb-2.5 flex items-center gap-3">
                    <span className="text-[12px] font-bold tracking-wide" style={{ color: group.label === "Today" ? "#2D6A4F" : "#6B9E85" }}>
                      {group.label}
                    </span>
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: "rgba(200,230,208,0.3)", color: "#6B9E85" }}>
                      {group.entries.length}
                    </span>
                    <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, rgba(200,230,208,0.5) 0%, transparent 100%)" }} />
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {group.entries.map((entry, i) => (
                      <div
                        key={entry.id}
                        className={`animate-fade-in-up${i < 3 ? `-${i + 1}` : "-3"} group rounded-xl border px-5 py-4 transition-all`}
                        style={{
                          background: "linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.55) 100%)",
                          borderColor: "rgba(200,230,208,0.40)",
                          backdropFilter: "blur(8px)",
                        }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="whitespace-pre-wrap text-sm leading-relaxed" style={{ color: "#1A3D2B" }}>
                              {entry.content}
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <p className="text-[11px]" style={{ color: "#8DBFA5" }}>{formatTime(entry.createdAt)}</p>
                              {entry.moodLabel && entry.moodColor && (
                                <MoodBadge label={entry.moodLabel} color={entry.moodColor} />
                              )}
                            </div>
                          </div>
                          <div className="flex flex-shrink-0 items-center gap-1 opacity-40 transition-opacity group-hover:opacity-100">
                            <button onClick={() => handleEdit(entry)} className="rounded-lg p-2 transition-all hover:bg-white/60 hover:scale-110 active:scale-95" aria-label="Edit entry">
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6B8B78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
                            </button>
                            <button onClick={() => setDeletingEntry(entry)} className="rounded-lg p-2 transition-all hover:bg-red-50/60 hover:scale-110 active:scale-95" aria-label="Delete entry">
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C07070" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-14 text-center">
          <div className="mx-auto mb-3 flex items-center justify-center gap-3">
            <div className="h-px w-10" style={{ backgroundColor: "rgba(200,230,208,0.5)" }} />
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <ellipse cx="10" cy="6.5" rx="2.5" ry="3.5" fill="#F2C4CE" opacity="0.4" />
              <ellipse cx="10" cy="13.5" rx="2.5" ry="3.5" fill="#F2C4CE" opacity="0.4" />
              <ellipse cx="6.5" cy="10" rx="3.5" ry="2.5" fill="#F2C4CE" opacity="0.35" />
              <ellipse cx="13.5" cy="10" rx="3.5" ry="2.5" fill="#F2C4CE" opacity="0.35" />
              <circle cx="10" cy="10" r="2" fill="#E8CA7A" opacity="0.45" />
            </svg>
            <div className="h-px w-10" style={{ backgroundColor: "rgba(200,230,208,0.5)" }} />
          </div>
          <p className="text-[11px]" style={{ color: "#A8C4B4" }}>Your thoughts matter. Keep writing.</p>
        </div>
      </div>

      {deletingEntry && (
        <ConfirmDeleteModal
          title="Delete journal entry"
          itemName={previewOf(deletingEntry.content)}
          confirming={deleting}
          onConfirm={confirmDelete}
          onCancel={() => { if (!deleting) setDeletingEntry(null); }}
        />
      )}
    </div>
  );
}

export default function JournalPage() {
  return <JournalContent />;
}

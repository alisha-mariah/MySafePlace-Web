"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/src/context/AuthContext";
import {
  addMoodEntry,
  getMoodEntries,
  updateMoodEntry,
  deleteMoodEntry,
  MoodEntry,
} from "@/src/services/moodService";
import ConfirmDeleteModal from "@/src/components/ui/ConfirmDeleteModal";

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

function moodColor(mood: string) {
  return MOODS.find((m) => m.name === mood)?.color ?? "#5EA88A";
}

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

function groupEntries(entries: MoodEntry[]): { label: string; entries: MoodEntry[] }[] {
  const groups: { label: string; entries: MoodEntry[] }[] = [];
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

/* ── Mood face SVGs ── */

function MoodFace({ mood, size = 28 }: { mood: string; size?: number }) {
  const c = moodColor(mood);
  const sw = 1.5;
  const head = <circle cx="14" cy="14" r="11.5" stroke={c} strokeWidth={sw} fill={c + "15"} />;

  switch (mood) {
    case "happy":
      // Squinted happy eyes (^_^), big wide grin
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<path d="M8 12 Q10 10 12 12" stroke={c} strokeWidth={sw} strokeLinecap="round" /><path d="M16 12 Q18 10 20 12" stroke={c} strokeWidth={sw} strokeLinecap="round" /><path d="M8 17 Q14 22 20 17" stroke={c} strokeWidth={sw} strokeLinecap="round" /></svg>);
    case "calm":
      // Zen closed eyes (flat lines), tiny serene smile
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<path d="M8 12.5 L12 12.5" stroke={c} strokeWidth={sw} strokeLinecap="round" /><path d="M16 12.5 L20 12.5" stroke={c} strokeWidth={sw} strokeLinecap="round" /><path d="M11 17.5 Q14 19 17 17.5" stroke={c} strokeWidth={sw} strokeLinecap="round" /></svg>);
    case "relaxed":
      // Soft droopy half-lid eyes, loose easy smile
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<circle cx="10" cy="12.5" r="1.2" fill={c} /><path d="M7.5 11 L12.5 11" stroke={c} strokeWidth={sw} strokeLinecap="round" /><circle cx="18" cy="12.5" r="1.2" fill={c} /><path d="M15.5 11 L20.5 11" stroke={c} strokeWidth={sw} strokeLinecap="round" /><path d="M10 17.5 Q14 20 18 17.5" stroke={c} strokeWidth={sw} strokeLinecap="round" /></svg>);
    case "grateful":
      // Smiling closed eyes, warm smile, rosy cheeks
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<path d="M8 13 Q10 11 12 13" stroke={c} strokeWidth={sw} strokeLinecap="round" /><path d="M16 13 Q18 11 20 13" stroke={c} strokeWidth={sw} strokeLinecap="round" /><path d="M9 17 Q14 21 19 17" stroke={c} strokeWidth={sw} strokeLinecap="round" /><circle cx="7" cy="15" r="1.8" fill={c} opacity="0.25" /><circle cx="21" cy="15" r="1.8" fill={c} opacity="0.25" /></svg>);
    case "motivated":
      // Determined thick dot eyes, confident D-shaped grin
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<circle cx="10" cy="12" r="1.5" fill={c} /><circle cx="18" cy="12" r="1.5" fill={c} /><path d="M9 16 L19 16 Q19 20.5 14 20.5 Q9 20.5 9 16 Z" stroke={c} strokeWidth={sw} fill={c + "20"} strokeLinejoin="round" /></svg>);
    case "sad":
      // Sad inner-raised brows, dot eyes, deep frown, teardrop
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<path d="M8 10 L11.5 9" stroke={c} strokeWidth="1.4" strokeLinecap="round" /><path d="M20 10 L16.5 9" stroke={c} strokeWidth="1.4" strokeLinecap="round" /><circle cx="10" cy="12.5" r="1.2" fill={c} /><circle cx="18" cy="12.5" r="1.2" fill={c} /><path d="M9.5 19 Q14 16 18.5 19" stroke={c} strokeWidth={sw} strokeLinecap="round" /><circle cx="20" cy="16" r="1.2" fill={c} /></svg>);
    case "anxious":
      // Wide open eyes, wobbly mouth, sweat drop
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<circle cx="10" cy="12" r="2.2" stroke={c} strokeWidth="1.2" fill="none" /><circle cx="10" cy="12" r="0.9" fill={c} /><circle cx="18" cy="12" r="2.2" stroke={c} strokeWidth="1.2" fill="none" /><circle cx="18" cy="12" r="0.9" fill={c} /><path d="M9 18 Q11 16.5 14 18 Q17 19.5 19 18" stroke={c} strokeWidth={sw} strokeLinecap="round" fill="none" /><path d="M21.5 7.5 Q22 9.5 21.5 11 Q21 9.5 21.5 7.5 Z" fill={c} /></svg>);
    case "stressed":
      // X eyes, zigzag mouth
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<path d="M8.5 11 L11.5 13.5" stroke={c} strokeWidth={sw} strokeLinecap="round" /><path d="M11.5 11 L8.5 13.5" stroke={c} strokeWidth={sw} strokeLinecap="round" /><path d="M16.5 11 L19.5 13.5" stroke={c} strokeWidth={sw} strokeLinecap="round" /><path d="M19.5 11 L16.5 13.5" stroke={c} strokeWidth={sw} strokeLinecap="round" /><path d="M8.5 18 L11 16.5 L14 18 L17 16.5 L19.5 18" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>);
    case "angry":
      // Thick V brows, sharp eyes, clenched teeth
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<path d="M7 9.5 L12 11.5" stroke={c} strokeWidth="1.8" strokeLinecap="round" /><path d="M21 9.5 L16 11.5" stroke={c} strokeWidth="1.8" strokeLinecap="round" /><circle cx="10" cy="13.5" r="1.3" fill={c} /><circle cx="18" cy="13.5" r="1.3" fill={c} /><rect x="9" y="17" width="10" height="3" rx="0.5" stroke={c} strokeWidth="1.3" fill="none" /><path d="M12 17 L12 20" stroke={c} strokeWidth="1" /><path d="M15.5 17 L15.5 20" stroke={c} strokeWidth="1" /></svg>);
    case "lonely":
      // Small dot eyes looking down, gentle frown, empty feeling
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<circle cx="10" cy="13" r="1" fill={c} /><circle cx="18" cy="13" r="1" fill={c} /><path d="M11 18 Q14 16.5 17 18" stroke={c} strokeWidth={sw} strokeLinecap="round" /></svg>);
    case "overwhelmed":
      // Wide shocked eyes, raised brows, open O mouth
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<path d="M7.5 9 L12.5 9" stroke={c} strokeWidth="1.4" strokeLinecap="round" /><path d="M15.5 9 L20.5 9" stroke={c} strokeWidth="1.4" strokeLinecap="round" /><circle cx="10" cy="12.5" r="2.3" stroke={c} strokeWidth="1.3" fill="none" /><circle cx="10" cy="12.5" r="1" fill={c} /><circle cx="18" cy="12.5" r="2.3" stroke={c} strokeWidth="1.3" fill="none" /><circle cx="18" cy="12.5" r="1" fill={c} /><ellipse cx="14" cy="19" rx="2.2" ry="2" stroke={c} strokeWidth={sw} fill="none" /></svg>);
    case "tired":
      // Droopy crescent eyes, open yawn, thin Z's trailing out
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<path d="M8 13 Q10 11.5 12 13" stroke={c} strokeWidth="1.8" strokeLinecap="round" fill="none" /><path d="M16 13 Q18 11.5 20 13" stroke={c} strokeWidth="1.8" strokeLinecap="round" fill="none" /><ellipse cx="14" cy="19" rx="2.5" ry="2" stroke={c} strokeWidth={sw} fill={c + "15"} /><path d="M18 7 L20.5 7 L18 9.5 L20.5 9.5" stroke={c} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" fill="none" /><path d="M24 1.5 L26.5 1.5 L24 3.5 L26.5 3.5" stroke={c} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>);
    case "insecure":
      // >< scrunched eyes, wobbly uncertain mouth
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<path d="M8 11 L10.5 12.5 L8 14" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" /><path d="M20 11 L17.5 12.5 L20 14" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" /><path d="M10 17.5 Q12 18.5 14 17.5 Q16 16.8 18 17.8" stroke={c} strokeWidth={sw} strokeLinecap="round" fill="none" /></svg>);
    case "frustrated":
      // Asymmetric angry brows, frown, puff clouds
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<path d="M8 9 L12 10.5" stroke={c} strokeWidth="1.6" strokeLinecap="round" /><path d="M20 10 L16.5 11" stroke={c} strokeWidth="1.6" strokeLinecap="round" /><circle cx="10" cy="13" r="1.3" fill={c} /><circle cx="18" cy="13" r="1.3" fill={c} /><path d="M9 19.5 Q14 16 19 19.5" stroke={c} strokeWidth={sw} strokeLinecap="round" fill="none" /><circle cx="4.5" cy="14" r="1.8" fill={c + "30"} /><circle cx="3.5" cy="12" r="1.2" fill={c + "25"} /><circle cx="23.5" cy="14" r="1.8" fill={c + "30"} /><circle cx="24.5" cy="12" r="1.2" fill={c + "25"} /></svg>);
    case "bored":
      // Eyes rolled up (pupils at top), flat mouth
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<circle cx="10" cy="12" r="2" stroke={c} strokeWidth="1.2" fill="none" /><circle cx="10" cy="11.2" r="0.9" fill={c} /><circle cx="18" cy="12" r="2" stroke={c} strokeWidth="1.2" fill="none" /><circle cx="18" cy="11.2" r="0.9" fill={c} /><path d="M10.5 18 L17.5 18" stroke={c} strokeWidth={sw} strokeLinecap="round" /></svg>);
    default:
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<circle cx="10" cy="12.5" r="1.2" fill={c} /><circle cx="18" cy="12.5" r="1.2" fill={c} /><path d="M10 17 L18 17" stroke={c} strokeWidth={sw} strokeLinecap="round" /></svg>);
  }
}

/* ── Full-page nature background ── */

/* ── Page content ── */

function MoodContent() {
  const { user } = useAuth();

  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deletingEntry, setDeletingEntry] = useState<MoodEntry | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchEntries = useCallback(async () => {
    if (!user) return;
    try {
      const data = await getMoodEntries(user.uid);
      setEntries(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch mood entries:", err);
      setError("Could not load entries. Check the browser console for details.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedMood || !user) return;
    setSubmitting(true);
    try {
      const msg = editingId ? "Changes saved!" : "Check-in saved!";
      if (editingId) { await updateMoodEntry(editingId, selectedMood, note); }
      else { await addMoodEntry(user.uid, selectedMood, note); }
      setSelectedMood(null);
      setNote("");
      setEditingId(null);
      await fetchEntries();
      setSavedMsg(msg);
      setTimeout(() => setSavedMsg(null), 2500);
    } catch (err) { console.error("Failed to save mood entry:", err); }
    finally { setSubmitting(false); }
  }

  function handleEdit(entry: MoodEntry) {
    setSelectedMood(entry.mood);
    setNote(entry.note);
    setEditingId(entry.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancelEdit() {
    setSelectedMood(null);
    setNote("");
    setEditingId(null);
  }

  async function confirmDelete() {
    if (!deletingEntry) return;
    setDeleting(true);
    try {
      await deleteMoodEntry(deletingEntry.id);
      if (editingId === deletingEntry.id) handleCancelEdit();
      setDeletingEntry(null);
      await fetchEntries();
    } catch (err) {
      console.error("Failed to delete mood entry:", err);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="relative min-h-screen">

      {/* Header */}
      <header className="relative z-10 mx-auto max-w-5xl px-6 pt-8 pb-2">
        <Link href="/dashboard" className="pill-btn mb-5 inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium" style={{ color: "#6B9E85", backgroundColor: "rgba(255,255,255,0.7)", border: "1px solid rgba(200,230,208,0.5)", backdropFilter: "blur(8px)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          Homepage
        </Link>

        <div className="animate-fade-in-up rounded-2xl px-7 py-6" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.55) 100%)", border: "1px solid rgba(200,230,208,0.45)", boxShadow: "0 8px 32px rgba(45,106,79,0.06), 0 2px 8px rgba(45,106,79,0.03)", backdropFilter: "blur(12px)" }}>
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: "linear-gradient(135deg, rgba(184,216,196,0.35) 0%, rgba(200,230,208,0.25) 100%)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4E9B78" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" opacity=".25" strokeWidth={1.4} /><path d="M3 12h3l3-6 3 12 3-6h6" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight" style={{ color: "#1A3D2B" }}>Mood Tracker</h1>
              <p className="mt-0.5 text-sm" style={{ color: "#6B9E85" }}>
                {editingId ? "Update your entry" : "How are you feeling right now?"}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 py-6">
        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="animate-fade-in-up-1 rounded-2xl border p-6" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.80) 0%, rgba(255,255,255,0.60) 100%)", borderColor: "rgba(200,230,208,0.45)", boxShadow: "0 2px 8px rgba(45,106,79,0.04), 0 8px 24px rgba(45,106,79,0.04)", backdropFilter: "blur(8px)" }}>
            <p className="mb-4 text-sm font-semibold" style={{ color: "#1A3D2B" }}>
              {editingId ? "Change your mood" : "Select a mood"}
            </p>

            <div className="grid grid-cols-5 gap-2">
              {MOODS.map((m) => {
                const active = selectedMood === m.name;
                return (
                  <button key={m.name} type="button" onClick={() => setSelectedMood(m.name)} className="mood-btn flex flex-col items-center gap-1.5 rounded-xl py-2.5" style={{ backgroundColor: active ? moodColor(m.name) + "18" : "rgba(255,255,255,0.6)", border: `1.5px solid ${active ? moodColor(m.name) : "rgba(200,230,208,0.4)"}`, color: active ? "#1A3D2B" : "#8A9E92", transform: active ? "scale(1.06)" : "scale(1)" }}>
                    <MoodFace mood={m.name} size={28} />
                    <span className="text-[10px] font-semibold capitalize leading-tight">{m.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex flex-col gap-1.5">
              <label htmlFor="mood-note" className="text-xs font-medium" style={{ color: "#2D6A4F" }}>
                Note <span style={{ color: "#94A89C" }}>(optional)</span>
              </label>
              <textarea id="mood-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="What's on your mind?" rows={3} className="auth-input w-full resize-none rounded-lg border px-4 py-3 text-sm" style={{ borderColor: "rgba(200,230,208,0.5)", backgroundColor: "rgba(255,255,255,0.6)", color: "#1A3D2B" }} />
            </div>

            <div className="mt-5 flex items-center gap-3">
              <button type="submit" disabled={!selectedMood || submitting} className="cta-glow nature-btn flex items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-[15px] font-bold text-white tracking-wide disabled:cursor-not-allowed disabled:opacity-50" style={{ background: "linear-gradient(135deg, #4A9B7A 0%, #3D8B6A 40%, #2D6A4F 100%)", boxShadow: "0 4px 14px rgba(45,106,79,0.28)", minWidth: 170 }}>
                {submitting ? "Saving..." : editingId ? "Save changes" : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                    Log mood
                  </>
                )}
              </button>
              {editingId && (
                <button type="button" onClick={handleCancelEdit} className="text-sm font-medium transition-opacity hover:opacity-70" style={{ color: "#6B8B78" }}>Cancel</button>
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
          </div>
        </form>

        {/* Entries */}
        <div className="mt-8">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest animate-fade-in-up-2" style={{ color: "#8DBFA5" }}>Past entries</p>

          {error && (
            <div className="mb-4 rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: "rgba(254,242,242,0.8)", color: "#DC3545", border: "1px solid #FECACA" }}>{error}</div>
          )}

          {loading ? (
            <div className="flex justify-center py-12"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="nature-float"><path d="M6 3 C10 7 12 13 10 19 C8 19 2 17 1 13 C-1 9 2 5 6 3 Z" fill="#7DB892" opacity="0.6" /><path d="M6 3 C5 9 5 15 10 19" stroke="#5EA88A" strokeWidth="0.8" fill="none" opacity="0.4" /></svg></div>
          ) : entries.length === 0 ? (
            <div className="animate-fade-in-up-3 rounded-2xl border border-dashed py-12 text-center" style={{ borderColor: "rgba(200,230,208,0.5)", background: "rgba(255,255,255,0.4)" }}>
              <p className="text-sm" style={{ color: "#8DBFA5" }}>No entries yet. Log your first mood above.</p>
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
                      <div key={entry.id} className={`animate-fade-in-up${i < 3 ? `-${i + 1}` : "-3"} group rounded-xl border px-5 py-4 transition-all`} style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.55) 100%)", borderColor: "rgba(200,230,208,0.40)", backdropFilter: "blur(8px)" }}>
                        <div className="flex items-center gap-3">
                          <MoodFace mood={entry.mood} size={24} />
                          <div className="min-w-0 flex-1">
                            <span className="text-sm font-semibold capitalize" style={{ color: "#1A3D2B" }}>{entry.mood}</span>
                            <p className="text-[11px]" style={{ color: "#8DBFA5" }}>{formatTime(entry.createdAt)}</p>
                          </div>
                          <div className="flex items-center gap-1 opacity-40 transition-opacity group-hover:opacity-100">
                            <button onClick={() => handleEdit(entry)} className="rounded-lg p-2 transition-all hover:bg-white/60 hover:scale-110 active:scale-95" aria-label="Edit entry">
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6B8B78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
                            </button>
                            <button onClick={() => setDeletingEntry(entry)} className="rounded-lg p-2 transition-all hover:bg-red-50/60 hover:scale-110 active:scale-95" aria-label="Delete entry">
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C07070" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                            </button>
                          </div>
                        </div>
                        {entry.note && (
                          <p className="mt-2 pl-9 text-sm leading-relaxed" style={{ color: "#4A6B5A" }}>{entry.note}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
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
          <p className="text-[11px]" style={{ color: "#A8C4B4" }}>Every feeling is valid.</p>
        </div>
      </div>

      {deletingEntry && (
        <ConfirmDeleteModal
          title="Delete mood entry"
          itemName={`${deletingEntry.mood} at ${formatTime(deletingEntry.createdAt)}`}
          confirming={deleting}
          onConfirm={confirmDelete}
          onCancel={() => { if (!deleting) setDeletingEntry(null); }}
        />
      )}
    </div>
  );
}

export default function MoodPage() {
  return <MoodContent />;
}

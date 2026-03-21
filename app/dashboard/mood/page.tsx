"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import { useAuth } from "@/src/context/AuthContext";
import {
  addMoodEntry,
  getMoodEntries,
  updateMoodEntry,
  deleteMoodEntry,
  MoodEntry,
} from "@/src/services/moodService";

const MOODS = [
  { name: "happy",     color: "#D4A017" },
  { name: "calm",      color: "#5EA88A" },
  { name: "grateful",  color: "#C27888" },
  { name: "motivated", color: "#3F9468" },
  { name: "sad",       color: "#6E94AE" },
  { name: "anxious",   color: "#B88A3E" },
  { name: "stressed",  color: "#B47058" },
  { name: "angry",     color: "#AE5B5B" },
  { name: "tired",     color: "#7E929A" },
  { name: "lonely",    color: "#8A72A0" },
];

function moodColor(mood: string) {
  return MOODS.find((m) => m.name === mood)?.color ?? "#5EA88A";
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

/* ── Mood face SVGs ── */

function MoodFace({ mood, size = 28 }: { mood: string; size?: number }) {
  const c = moodColor(mood);
  const sw = 1.5;
  const head = <circle cx="14" cy="14" r="11.5" stroke={c} strokeWidth={sw} fill={c + "15"} />;

  switch (mood) {
    case "happy":
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<path d="M8.5 12.5 Q10 10.5 11.5 12.5" stroke={c} strokeWidth={sw} strokeLinecap="round" /><path d="M16.5 12.5 Q18 10.5 19.5 12.5" stroke={c} strokeWidth={sw} strokeLinecap="round" /><path d="M8.5 16.5 Q14 21.5 19.5 16.5" stroke={c} strokeWidth={sw} strokeLinecap="round" /></svg>);
    case "calm":
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<path d="M8.5 13 Q10 14.5 11.5 13" stroke={c} strokeWidth={sw} strokeLinecap="round" /><path d="M16.5 13 Q18 14.5 19.5 13" stroke={c} strokeWidth={sw} strokeLinecap="round" /><path d="M10.5 17 Q14 19 17.5 17" stroke={c} strokeWidth={sw} strokeLinecap="round" /></svg>);
    case "grateful":
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<circle cx="10" cy="12.5" r="1.2" fill={c} /><circle cx="18" cy="12.5" r="1.2" fill={c} /><path d="M9 16.5 Q14 21 19 16.5" stroke={c} strokeWidth={sw} strokeLinecap="round" /><path d="M21.5 6.5 Q21.5 5 23 5 Q24.5 5 24.5 6.5 Q24.5 8.5 23 9.5 Q21.5 8.5 21.5 6.5 Z" fill={c} opacity="0.5" /></svg>);
    case "motivated":
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<circle cx="10" cy="12.5" r="1.3" fill={c} /><circle cx="18" cy="12.5" r="1.3" fill={c} /><path d="M9 16 Q14 21 19 16" stroke={c} strokeWidth={sw} strokeLinecap="round" /><path d="M23 8 L23.8 5.5 L22 7.2 L24 7.2 L22.2 5.5 Z" fill={c} opacity="0.5" /></svg>);
    case "sad":
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<circle cx="10" cy="12" r="1.2" fill={c} /><circle cx="18" cy="12" r="1.2" fill={c} /><path d="M9.5 19 Q14 15.5 18.5 19" stroke={c} strokeWidth={sw} strokeLinecap="round" /><path d="M19 13.5 Q19.5 15.5 19 16.5 Q18.5 15.5 19 13.5 Z" fill={c} opacity="0.55" /></svg>);
    case "anxious":
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<circle cx="10" cy="12.5" r="2" stroke={c} strokeWidth="1.2" fill="none" /><circle cx="10" cy="12.5" r="0.8" fill={c} /><circle cx="18" cy="12.5" r="2" stroke={c} strokeWidth="1.2" fill="none" /><circle cx="18" cy="12.5" r="0.8" fill={c} /><path d="M9.5 18 Q12 16 14 18 Q16 20 18.5 18" stroke={c} strokeWidth={sw} strokeLinecap="round" fill="none" /><path d="M21 8 Q21.5 10 21 11.5 Q20.5 10 21 8 Z" fill={c} opacity="0.45" /></svg>);
    case "stressed":
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<path d="M8.5 11.5 L11.5 13.5" stroke={c} strokeWidth={sw} strokeLinecap="round" /><path d="M11.5 11.5 L8.5 13.5" stroke={c} strokeWidth={sw} strokeLinecap="round" /><path d="M16.5 11.5 L19.5 13.5" stroke={c} strokeWidth={sw} strokeLinecap="round" /><path d="M19.5 11.5 L16.5 13.5" stroke={c} strokeWidth={sw} strokeLinecap="round" /><path d="M8.5 18 L11 16.5 L14 18 L17 16.5 L19.5 18" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>);
    case "angry":
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<path d="M7.5 10 L12 12" stroke={c} strokeWidth={sw} strokeLinecap="round" /><path d="M20.5 10 L16 12" stroke={c} strokeWidth={sw} strokeLinecap="round" /><circle cx="10" cy="13.5" r="1.2" fill={c} /><circle cx="18" cy="13.5" r="1.2" fill={c} /><path d="M9.5 19.5 Q14 16 18.5 19.5" stroke={c} strokeWidth={sw} strokeLinecap="round" fill="none" /></svg>);
    case "tired":
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<path d="M8 13 L12 13" stroke={c} strokeWidth={sw} strokeLinecap="round" /><path d="M8.5 11.5 Q10 13 11.5 11.5" stroke={c} strokeWidth="1" strokeLinecap="round" fill="none" /><path d="M16 13 L20 13" stroke={c} strokeWidth={sw} strokeLinecap="round" /><path d="M16.5 11.5 Q18 13 19.5 11.5" stroke={c} strokeWidth="1" strokeLinecap="round" fill="none" /><ellipse cx="14" cy="18" rx="2.5" ry="2" stroke={c} strokeWidth={sw} fill="none" /><path d="M21 9 L23 9 L21 11 L23 11" stroke={c} strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.5" /><path d="M23.5 6 L25 6 L23.5 7.5 L25 7.5" stroke={c} strokeWidth="0.7" strokeLinecap="round" fill="none" opacity="0.35" /></svg>);
    case "lonely":
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<circle cx="9" cy="12.5" r="1.2" fill={c} /><circle cx="17" cy="12.5" r="1.2" fill={c} /><path d="M10 18 Q14 16 18 18" stroke={c} strokeWidth={sw} strokeLinecap="round" fill="none" /><path d="M19 14 Q19.5 15.8 19 16.8 Q18.5 15.8 19 14 Z" fill={c} opacity="0.4" /></svg>);
    default:
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<circle cx="10" cy="12.5" r="1.2" fill={c} /><circle cx="18" cy="12.5" r="1.2" fill={c} /><path d="M10 17 L18 17" stroke={c} strokeWidth={sw} strokeLinecap="round" /></svg>);
  }
}

/* ── Full-page nature background ── */

function MoodNatureBg() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <svg viewBox="0 0 1200 900" fill="none" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        {/* Warm glows */}
        <circle cx="1000" cy="120" r="220" fill="rgba(242,196,206,0.06)" />
        <circle cx="150" cy="700" r="180" fill="rgba(168,213,186,0.05)" />

        {/* Contour lines */}
        <path d="M0 150 Q300 120 600 145 Q900 170 1200 135" stroke="rgba(168,213,186,0.07)" strokeWidth="1" />
        <path d="M0 320 Q350 295 650 315 Q950 340 1200 310" stroke="rgba(168,213,186,0.05)" strokeWidth="1" />
        <path d="M0 500 Q280 480 560 495 Q840 510 1200 490" stroke="rgba(168,213,186,0.04)" strokeWidth="1" />
        <path d="M0 680 Q320 660 640 675 Q960 690 1200 670" stroke="rgba(168,213,186,0.035)" strokeWidth="1" />

        {/* Top-right branch with blossoms */}
        <path d="M1200 0 C1140 70 1080 140 1010 220" stroke="#C8E6D0" strokeWidth="1.3" strokeLinecap="round" opacity="0.22" />
        <g transform="translate(1100,80) rotate(30)">
          <path d="M0,-12 C5,-7 5,7 0,12 C-5,7 -5,-7 0,-12 Z" fill="#C8E6D0" opacity="0.18" />
          <line x1="0" y1="-8" x2="0" y2="8" stroke="#A8D5BA" strokeWidth="0.5" opacity="0.20" />
        </g>
        <g transform="translate(1060,150) rotate(15)">
          <path d="M0,-10 C4,-6 4,6 0,10 C-4,6 -4,-6 0,-10 Z" fill="#C8E6D0" opacity="0.15" />
        </g>
        {/* Cherry blossoms */}
        <g transform="translate(1130,45)">
          <ellipse cx="0" cy="-4.5" rx="3.5" ry="5" fill="#F2C4CE" opacity="0.28" />
          <ellipse cx="0" cy="4.5" rx="3.5" ry="5" fill="#F2C4CE" opacity="0.28" />
          <ellipse cx="-5" cy="0" rx="5" ry="3.5" fill="#F2C4CE" opacity="0.25" />
          <ellipse cx="5" cy="0" rx="5" ry="3.5" fill="#F2C4CE" opacity="0.25" />
          <circle cx="0" cy="0" r="2.2" fill="#E8CA7A" opacity="0.32" />
        </g>
        <g transform="translate(1075,125)">
          <ellipse cx="0" cy="-3.5" rx="2.8" ry="4" fill="#F2C4CE" opacity="0.20" />
          <ellipse cx="0" cy="3.5" rx="2.8" ry="4" fill="#F2C4CE" opacity="0.20" />
          <ellipse cx="-4" cy="0" rx="4" ry="2.8" fill="#F2C4CE" opacity="0.18" />
          <ellipse cx="4" cy="0" rx="4" ry="2.8" fill="#F2C4CE" opacity="0.18" />
          <circle cx="0" cy="0" r="1.8" fill="#E8CA7A" opacity="0.25" />
        </g>

        {/* Bottom-left branch */}
        <path d="M0 900 C70 820 150 740 240 650" stroke="#C8E6D0" strokeWidth="1.3" strokeLinecap="round" opacity="0.20" />
        <g transform="translate(100,790) rotate(-35)">
          <path d="M0,-12 C5,-7 5,7 0,12 C-5,7 -5,-7 0,-12 Z" fill="#C8E6D0" opacity="0.18" />
        </g>
        <g transform="translate(40,845)">
          <ellipse cx="0" cy="-4" rx="3" ry="4.5" fill="#F2C4CE" opacity="0.22" />
          <ellipse cx="0" cy="4" rx="3" ry="4.5" fill="#F2C4CE" opacity="0.22" />
          <ellipse cx="-4.5" cy="0" rx="4.5" ry="3" fill="#F2C4CE" opacity="0.20" />
          <ellipse cx="4.5" cy="0" rx="4.5" ry="3" fill="#F2C4CE" opacity="0.20" />
          <circle cx="0" cy="0" r="1.8" fill="#E8CA7A" opacity="0.28" />
        </g>

        {/* Birds */}
        <path d="M250 90 C260 75 275 75 285 90" stroke="#B8D8C4" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.18" />
        <path d="M320 65 C327 57 336 57 343 65" stroke="#B8D8C4" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.12" />
        <path d="M870 700 C878 690 888 690 896 700" stroke="#B8D8C4" strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.12" />

        {/* Butterfly */}
        <g transform="translate(400,180) rotate(-12)" className="butterfly-anim">
          <path d="M0,0 C-5,-9 -11,-7 -8,0 C-11,7 -5,9 0,0" fill="#F2C4CE" opacity="0.20" />
          <path d="M0,0 C5,-9 11,-7 8,0 C11,7 5,9 0,0" fill="#EDB8C8" opacity="0.16" />
          <line x1="0" y1="-3" x2="0" y2="3" stroke="#D4A0B4" strokeWidth="0.5" opacity="0.18" />
        </g>

        {/* Floating petals */}
        <ellipse cx="350" cy="350" rx="2.5" ry="4" fill="#F2C4CE" opacity="0.12" transform="rotate(25 350 350)" className="petal-drift" />
        <ellipse cx="750" cy="250" rx="2" ry="3.5" fill="#F2C4CE" opacity="0.10" transform="rotate(-30 750 250)" className="petal-drift-1" />
        <ellipse cx="550" cy="600" rx="2.5" ry="4" fill="#F2C4CE" opacity="0.09" transform="rotate(40 550 600)" className="petal-drift-2" />
        <ellipse cx="950" cy="550" rx="2" ry="3" fill="#F2C4CE" opacity="0.10" transform="rotate(-20 950 550)" className="petal-drift" />

        {/* Pollen dots */}
        <circle cx="450" cy="200" r="1.3" fill="#E8CA7A" opacity="0.12" />
        <circle cx="700" cy="380" r="1" fill="#E8CA7A" opacity="0.09" />
        <circle cx="250" cy="500" r="1.2" fill="#E8CA7A" opacity="0.10" />
      </svg>
    </div>
  );
}

/* ── Page content ── */

function MoodContent() {
  const { user } = useAuth();

  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      if (editingId) { await updateMoodEntry(editingId, selectedMood, note); }
      else { await addMoodEntry(user.uid, selectedMood, note); }
      setSelectedMood(null);
      setNote("");
      setEditingId(null);
      await fetchEntries();
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

  async function handleDelete(entryId: string) {
    if (!confirm("Delete this entry?")) return;
    try { await deleteMoodEntry(entryId); await fetchEntries(); }
    catch (err) { console.error("Failed to delete mood entry:", err); }
  }

  return (
    <div className="relative min-h-screen" style={{ background: "linear-gradient(135deg, #EFF7F1 0%, #FFF5F7 50%, #F0F7F2 100%)" }}>
      <MoodNatureBg />

      {/* Header */}
      <header className="relative z-10 mx-auto max-w-xl px-6 pt-8 pb-2">
        <Link href="/dashboard" className="pill-btn mb-5 inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium" style={{ color: "#6B9E85", backgroundColor: "rgba(255,255,255,0.7)", border: "1px solid rgba(200,230,208,0.5)", backdropFilter: "blur(8px)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          Dashboard
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
      <div className="relative z-10 mx-auto max-w-xl px-4 py-6">
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
              <button type="submit" disabled={!selectedMood || submitting} className="nature-btn rounded-lg px-6 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50" style={{ background: "linear-gradient(135deg, #7DB892 0%, #5EA88A 50%, #4A9474 100%)", boxShadow: "0 4px 14px rgba(93,168,138,0.25)" }}>
                {submitting ? "Saving..." : editingId ? "Save changes" : "Log mood"}
              </button>
              {editingId && (
                <button type="button" onClick={handleCancelEdit} className="text-sm font-medium transition-opacity hover:opacity-70" style={{ color: "#6B8B78" }}>Cancel</button>
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
            <div className="flex flex-col gap-2.5">
              {entries.map((entry, i) => (
                <div key={entry.id} className={`animate-fade-in-up${i < 3 ? `-${i + 1}` : "-3"} group rounded-xl border px-5 py-4 transition-all`} style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.55) 100%)", borderColor: "rgba(200,230,208,0.40)", backdropFilter: "blur(8px)" }}>
                  <div className="flex items-center gap-3">
                    <MoodFace mood={entry.mood} size={24} />
                    <div className="min-w-0 flex-1">
                      <span className="text-sm font-semibold capitalize" style={{ color: "#1A3D2B" }}>{entry.mood}</span>
                      <p className="text-[11px]" style={{ color: "#8DBFA5" }}>{formatDate(entry.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-1 opacity-40 transition-opacity group-hover:opacity-100">
                      <button onClick={() => handleEdit(entry)} className="rounded-lg p-2 transition-all hover:bg-white/60 hover:scale-110 active:scale-95" aria-label="Edit entry">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6B8B78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
                      </button>
                      <button onClick={() => handleDelete(entry.id)} className="rounded-lg p-2 transition-all hover:bg-red-50/60 hover:scale-110 active:scale-95" aria-label="Delete entry">
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
    </div>
  );
}

export default function MoodPage() {
  return (
    <ProtectedRoute>
      <MoodContent />
    </ProtectedRoute>
  );
}

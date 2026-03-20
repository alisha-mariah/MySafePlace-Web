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

/* ═══════════════════════════════════════════════════════
   MOOD DEFINITIONS
═══════════════════════════════════════════════════════ */
const MOODS = [
  { name: "happy",       color: "#E8B931" },
  { name: "calm",        color: "#6DB89A" },
  { name: "relaxed",     color: "#8DC9A8" },
  { name: "grateful",    color: "#D4899A" },
  { name: "motivated",   color: "#4BA67A" },
  { name: "sad",         color: "#7EA4BE" },
  { name: "anxious",     color: "#C99A4E" },
  { name: "stressed",    color: "#C47E62" },
  { name: "angry",       color: "#BE6B6B" },
  { name: "lonely",      color: "#9A82AE" },
  { name: "overwhelmed", color: "#7E6E96" },
  { name: "tired",       color: "#8EA2A8" },
  { name: "insecure",    color: "#A882AE" },
  { name: "frustrated",  color: "#B88252" },
  { name: "bored",       color: "#A0A098" },
];

function mc(mood: string) {
  return MOODS.find((m) => m.name === mood)?.color ?? "#A8D5B5";
}

/* ═══════════════════════════════════════════════════════
   SVG MOOD FACES — each mood gets a unique expression
═══════════════════════════════════════════════════════ */
function faceFeatures(mood: string, c: string) {
  switch (mood) {
    /* ── HAPPY: bright eyes, big smile ── */
    case "happy":
      return (
        <>
          <circle cx="14" cy="16" r="2.2" fill={c} />
          <circle cx="26" cy="16" r="2.2" fill={c} />
          <path d="M11 23 Q20 31 29 23" stroke={c} strokeWidth="2.2" strokeLinecap="round" fill="none" />
          {/* rosy cheeks */}
          <circle cx="9" cy="22" r="2.5" fill={c} opacity="0.15" />
          <circle cx="31" cy="22" r="2.5" fill={c} opacity="0.15" />
        </>
      );

    /* ── CALM: peaceful closed eyes, gentle smile ── */
    case "calm":
      return (
        <>
          <path d="M10 17 Q14 13 18 17" stroke={c} strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M22 17 Q26 13 30 17" stroke={c} strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M14 25 Q20 29 26 25" stroke={c} strokeWidth="2" strokeLinecap="round" fill="none" />
        </>
      );

    /* ── RELAXED: content half-moon eyes, soft smile ── */
    case "relaxed":
      return (
        <>
          <path d="M10 18 Q14 15 18 18" stroke={c} strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M22 18 Q26 15 30 18" stroke={c} strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M15 25 Q20 28 25 25" stroke={c} strokeWidth="2" strokeLinecap="round" fill="none" />
          <circle cx="10" cy="22" r="2" fill={c} opacity="0.12" />
          <circle cx="30" cy="22" r="2" fill={c} opacity="0.12" />
        </>
      );

    /* ── GRATEFUL: sparkling eyes, warm smile, heart ── */
    case "grateful":
      return (
        <>
          <circle cx="14" cy="17" r="2" fill={c} />
          <circle cx="26" cy="17" r="2" fill={c} />
          {/* sparkle highlights */}
          <circle cx="16" cy="15" r="1" fill={c} opacity="0.5" />
          <circle cx="28" cy="15" r="1" fill={c} opacity="0.5" />
          <path d="M12 23 Q20 30 28 23" stroke={c} strokeWidth="2" strokeLinecap="round" fill="none" />
          {/* tiny heart */}
          <path d="M18.5 8 Q19 6 20 8 Q21 6 21.5 8 Q21.5 10 20 12 Q18.5 10 18.5 8Z" fill={c} opacity="0.55" />
        </>
      );

    /* ── MOTIVATED: determined brow, confident grin ── */
    case "motivated":
      return (
        <>
          <path d="M10 13 L18 14.5" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M30 13 L22 14.5" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="14" cy="18" r="2" fill={c} />
          <circle cx="26" cy="18" r="2" fill={c} />
          <path d="M12 24 Q20 30 28 24" stroke={c} strokeWidth="2.2" strokeLinecap="round" fill="none" />
        </>
      );

    /* ── SAD: droopy eyes, frown, teardrop ── */
    case "sad":
      return (
        <>
          <circle cx="14" cy="17" r="2" fill={c} />
          <circle cx="26" cy="17" r="2" fill={c} />
          <path d="M13 27 Q20 23 27 27" stroke={c} strokeWidth="2" strokeLinecap="round" fill="none" />
          {/* tear track + drop */}
          <path d="M28 19 Q29 23 28 25" stroke={c} strokeWidth="1.2" strokeLinecap="round" opacity="0.5" fill="none" />
          <ellipse cx="28" cy="26.5" rx="1.5" ry="2" fill={c} opacity="0.4" />
        </>
      );

    /* ── ANXIOUS: wide worried eyes, wavy mouth, sweat ── */
    case "anxious":
      return (
        <>
          <circle cx="14" cy="17" r="3" stroke={c} strokeWidth="1.6" fill="none" />
          <circle cx="14" cy="17" r="1.3" fill={c} />
          <circle cx="26" cy="17" r="3" stroke={c} strokeWidth="1.6" fill="none" />
          <circle cx="26" cy="17" r="1.3" fill={c} />
          <path d="M12 26 Q16 24 20 26 Q24 28 28 26" stroke={c} strokeWidth="1.8" strokeLinecap="round" fill="none" />
          {/* sweat drop */}
          <ellipse cx="31" cy="13" rx="1.5" ry="2.2" fill={c} opacity="0.3" />
        </>
      );

    /* ── STRESSED: squeezed eyes, grimace ── */
    case "stressed":
      return (
        <>
          <path d="M11 15 L14 18 L17 15" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M23 15 L26 18 L29 15" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M12 26 Q16 24 20 26 Q24 24 28 26" stroke={c} strokeWidth="2" strokeLinecap="round" fill="none" />
        </>
      );

    /* ── ANGRY: V-brows, intense eyes, frown ── */
    case "angry":
      return (
        <>
          <path d="M9 12 L17 16" stroke={c} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M31 12 L23 16" stroke={c} strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="14" cy="19" r="2" fill={c} />
          <circle cx="26" cy="19" r="2" fill={c} />
          <path d="M13 28 Q20 24 27 28" stroke={c} strokeWidth="2.2" strokeLinecap="round" fill="none" />
        </>
      );

    /* ── LONELY: big soft eyes, tiny frown, tear ── */
    case "lonely":
      return (
        <>
          <circle cx="14" cy="17" r="2.8" fill={c} />
          <circle cx="26" cy="17" r="2.8" fill={c} />
          {/* eye highlights make them look watery */}
          <circle cx="15.2" cy="15.8" r="1" fill="white" opacity="0.7" />
          <circle cx="27.2" cy="15.8" r="1" fill="white" opacity="0.7" />
          <path d="M16 26 Q20 24 24 26" stroke={c} strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <ellipse cx="28.5" cy="23" rx="1.2" ry="1.8" fill={c} opacity="0.35" />
        </>
      );

    /* ── OVERWHELMED: spiral eyes, O mouth ── */
    case "overwhelmed":
      return (
        <>
          {/* spiral-ish eyes */}
          <circle cx="14" cy="17" r="3.5" stroke={c} strokeWidth="1.4" fill="none" />
          <circle cx="14" cy="17" r="1.5" stroke={c} strokeWidth="1.2" fill="none" />
          <circle cx="26" cy="17" r="3.5" stroke={c} strokeWidth="1.4" fill="none" />
          <circle cx="26" cy="17" r="1.5" stroke={c} strokeWidth="1.2" fill="none" />
          <ellipse cx="20" cy="27" rx="3.5" ry="3" stroke={c} strokeWidth="1.8" fill="none" />
        </>
      );

    /* ── TIRED: droopy closed eyes, flat mouth ── */
    case "tired":
      return (
        <>
          <path d="M10 18 Q14 20 18 18" stroke={c} strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M22 18 Q26 20 30 18" stroke={c} strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M15 26 L25 26" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
          {/* zzz */}
          <path d="M30 9 L33 9 L30 12 L33 12" stroke={c} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.45" fill="none" />
          <path d="M33 6 L35 6 L33 8 L35 8" stroke={c} strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" fill="none" />
        </>
      );

    /* ── INSECURE: uneven worried eyes, wavy mouth ── */
    case "insecure":
      return (
        <>
          <path d="M10 14 L18 13.5" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="14" cy="18" r="2.2" fill={c} />
          <circle cx="26" cy="17" r="1.6" fill={c} />
          <path d="M14 26 Q17 24 20 26 Q23 28 26 26" stroke={c} strokeWidth="1.6" strokeLinecap="round" fill="none" />
        </>
      );

    /* ── FRUSTRATED: furrowed brows, clenched frown ── */
    case "frustrated":
      return (
        <>
          <path d="M10 14 L17 16" stroke={c} strokeWidth="2" strokeLinecap="round" />
          <path d="M30 14 L23 16" stroke={c} strokeWidth="2" strokeLinecap="round" />
          <circle cx="14" cy="19" r="1.8" fill={c} />
          <circle cx="26" cy="19" r="1.8" fill={c} />
          <path d="M13 27 Q20 23 27 27" stroke={c} strokeWidth="2.2" strokeLinecap="round" fill="none" />
          {/* steam puffs */}
          <circle cx="8" cy="10" r="1.5" stroke={c} strokeWidth="1" opacity="0.25" fill="none" />
          <circle cx="32" cy="10" r="1.5" stroke={c} strokeWidth="1" opacity="0.25" fill="none" />
        </>
      );

    /* ── BORED: half-closed line eyes, flat mouth ── */
    case "bored":
      return (
        <>
          <path d="M10 17 L18 17" stroke={c} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M22 17 L30 17" stroke={c} strokeWidth="2.2" strokeLinecap="round" />
          {/* tiny pupils peeking from below the line */}
          <circle cx="14" cy="18.5" r="1" fill={c} opacity="0.6" />
          <circle cx="26" cy="18.5" r="1" fill={c} opacity="0.6" />
          <path d="M15 26 L25 26" stroke={c} strokeWidth="2" strokeLinecap="round" />
        </>
      );

    default:
      return null;
  }
}

function MoodFace({ mood, size = 36 }: { mood: string; size?: number }) {
  const c = mc(mood);
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="20" cy="20" r="18" fill={c} opacity="0.18" />
      <circle cx="20" cy="20" r="18" stroke={c} strokeWidth="1.5" opacity="0.3" />
      {faceFeatures(mood, c)}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════
   DECORATIVE SVGs
═══════════════════════════════════════════════════════ */
function HeaderDecoration() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 800 180"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden="true"
    >
      {/* Left branch */}
      <g stroke="rgba(255,255,255,0.16)" strokeWidth="1.5" fill="none" strokeLinecap="round">
        <path d="M-10 160 Q40 120 90 100 Q140 80 180 50" />
        <path d="M90 100 Q85 80 95 65" />
        <path d="M140 75 Q145 55 135 42" />
      </g>
      {/* Left leaves */}
      <g>
        <ellipse cx="97" cy="62" rx="5" ry="9" fill="rgba(255,255,255,0.12)" transform="rotate(-20 97 62)" />
        <ellipse cx="133" cy="40" rx="4" ry="8" fill="rgba(255,255,255,0.10)" transform="rotate(15 133 40)" />
      </g>
      {/* Right branch */}
      <g stroke="rgba(255,255,255,0.12)" strokeWidth="1.2" fill="none" strokeLinecap="round">
        <path d="M810 170 Q760 130 710 115 Q660 100 620 70" />
        <path d="M710 115 Q715 95 705 82" />
      </g>
      <ellipse cx="703" cy="79" rx="4" ry="7" fill="rgba(255,255,255,0.08)" transform="rotate(10 703 79)" />
      {/* Birds */}
      <path d="M500 40 C506 33 513 33 519 40" stroke="rgba(255,255,255,0.35)" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M530 28 C535 23 541 23 546 28" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M555 42 C559 38 563 38 567 42" stroke="rgba(255,255,255,0.18)" strokeWidth="1" strokeLinecap="round" />
      {/* Flower accent */}
      <g transform="translate(55,140)">
        <ellipse cx="0" cy="-4" rx="2.5" ry="4" fill="rgba(245,208,216,0.30)" />
        <ellipse cx="0" cy="4" rx="2.5" ry="4" fill="rgba(245,208,216,0.30)" />
        <ellipse cx="-4" cy="0" rx="4" ry="2.5" fill="rgba(245,208,216,0.30)" />
        <ellipse cx="4" cy="0" rx="4" ry="2.5" fill="rgba(245,208,216,0.30)" />
        <circle cx="0" cy="0" r="2" fill="rgba(232,201,122,0.40)" />
      </g>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════ */
function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/* ═══════════════════════════════════════════════════════
   MAIN CONTENT
═══════════════════════════════════════════════════════ */
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
      setError(
        "Could not load entries. Check the browser console — if you see a Firestore index error, click the link it provides to create the required index."
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedMood || !user) return;
    setSubmitting(true);
    try {
      if (editingId) {
        await updateMoodEntry(editingId, selectedMood, note);
      } else {
        await addMoodEntry(user.uid, selectedMood, note);
      }
      setSelectedMood(null);
      setNote("");
      setEditingId(null);
      await fetchEntries();
    } catch (err) {
      console.error("Failed to save mood entry:", err);
    } finally {
      setSubmitting(false);
    }
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
    if (!confirm("Delete this mood entry?")) return;
    try {
      await deleteMoodEntry(entryId);
      await fetchEntries();
    } catch (err) {
      console.error("Failed to delete mood entry:", err);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: "#EFF8F2" }}>
      {/* ── Background depth blobs ── */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: "30%",
          left: "-100px",
          width: 420,
          height: 420,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(168,213,186,0.24) 0%, transparent 70%)",
          filter: "blur(55px)",
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          top: "10%",
          right: "-80px",
          width: 360,
          height: 360,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(245,208,216,0.18) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          bottom: "-60px",
          left: "40%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(168,213,186,0.14) 0%, transparent 70%)",
          filter: "blur(45px)",
        }}
      />

      {/* ── Gradient header ── */}
      <header
        className="relative overflow-hidden px-5 pb-7 pt-5"
        style={{
          background: "linear-gradient(135deg, #52AB84 0%, #2D6A4F 55%, #1A3D2B 100%)",
          boxShadow: "0 4px 24px rgba(26,61,43,0.20)",
        }}
      >
        <HeaderDecoration />

        <div className="relative z-10 mx-auto max-w-2xl">
          {/* Back link */}
          <Link
            href="/dashboard"
            className="mb-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all"
            style={{
              color: "rgba(255,255,255,0.75)",
              backgroundColor: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Dashboard
          </Link>

          <h1 className="animate-fade-in-up text-2xl font-bold tracking-tight text-white">
            Mood Tracker
          </h1>
          <p className="animate-fade-in-up-1 mt-1 text-sm" style={{ color: "rgba(168,213,181,0.9)" }}>
            {editingId
              ? "Edit how you were feeling"
              : "Check in with yourself \u2014 how are you right now?"}
          </p>
        </div>
      </header>

      {/* ── Page content ── */}
      <div className="relative z-10 mx-auto max-w-2xl px-4 pb-16 pt-6">

        {/* ════════════════════════════════════════
            MOOD FORM
        ════════════════════════════════════════ */}
        <form onSubmit={handleSubmit}>
          <div
            className="animate-fade-in-up-1 rounded-3xl p-6"
            style={{
              backgroundColor: "rgba(255,255,255,0.72)",
              backdropFilter: "blur(22px)",
              WebkitBackdropFilter: "blur(22px)",
              border: "1px solid rgba(255,255,255,0.60)",
              boxShadow:
                "0 20px 60px rgba(45,106,79,0.10), 0 6px 20px rgba(45,106,79,0.06), inset 0 1px 0 rgba(255,255,255,0.80)",
            }}
          >
            <p className="mb-1 text-sm font-bold" style={{ color: "#1E4D38" }}>
              {editingId ? "Change your mood" : "How are you feeling?"}
            </p>
            <p className="mb-5 text-xs" style={{ color: "#6B9E85" }}>
              Tap the face that matches your mood
            </p>

            {/* ── Mood face grid ── */}
            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5">
              {MOODS.map((m) => {
                const active = selectedMood === m.name;
                return (
                  <button
                    key={m.name}
                    type="button"
                    onClick={() => setSelectedMood(m.name)}
                    className="flex flex-col items-center gap-1.5 rounded-2xl px-1 py-3 transition-all"
                    style={{
                      backgroundColor: active ? mc(m.name) + "18" : "rgba(255,255,255,0.45)",
                      border: `2px solid ${active ? mc(m.name) : "rgba(228,242,232,0.8)"}`,
                      boxShadow: active
                        ? `0 6px 20px ${mc(m.name)}28, 0 0 0 3px ${mc(m.name)}12`
                        : "0 2px 6px rgba(45,106,79,0.04)",
                      transform: active ? "scale(1.06)" : "scale(1)",
                    }}
                  >
                    <MoodFace mood={m.name} size={38} />
                    <span
                      className="text-[10px] font-semibold capitalize leading-tight"
                      style={{ color: active ? "#1E4D38" : "#6B9E85" }}
                    >
                      {m.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* ── Selected mood preview ── */}
            {selectedMood && (
              <div
                className="mt-5 flex items-center gap-3 rounded-2xl px-4 py-3"
                style={{
                  backgroundColor: mc(selectedMood) + "10",
                  border: `1px solid ${mc(selectedMood)}25`,
                }}
              >
                <MoodFace mood={selectedMood} size={28} />
                <p className="text-sm font-medium capitalize" style={{ color: "#1E4D38" }}>
                  Feeling <span style={{ color: mc(selectedMood) }}>{selectedMood}</span>
                </p>
              </div>
            )}

            {/* ── Note textarea ── */}
            <div className="mt-5 flex flex-col gap-1.5">
              <label
                htmlFor="mood-note"
                className="text-xs font-medium"
                style={{ color: "#2D6A4F" }}
              >
                Add a note{" "}
                <span style={{ color: "#9ABFAE" }}>(optional)</span>
              </label>
              <textarea
                id="mood-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What's on your mind today?"
                rows={3}
                className="auth-input w-full resize-none rounded-xl border px-4 py-3 text-sm"
                style={{
                  borderColor: "#B8DFC8",
                  backgroundColor: "#FDFFFE",
                  color: "#1E4D38",
                }}
              />
            </div>

            {/* ── Submit / cancel ── */}
            <div className="mt-5 flex items-center gap-3">
              <button
                type="submit"
                disabled={!selectedMood || submitting}
                className="nature-btn rounded-xl px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, #52AB84 0%, #2D6A4F 100%)",
                  boxShadow: "0 4px 18px rgba(45,106,79,0.28)",
                }}
              >
                {submitting
                  ? editingId
                    ? "Saving\u2026"
                    : "Logging\u2026"
                  : editingId
                    ? "Save changes"
                    : "Log mood"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="rounded-xl px-4 py-3 text-sm font-medium transition-opacity hover:opacity-70"
                  style={{ color: "#6B9E85" }}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>

        {/* ════════════════════════════════════════
            ENTRIES LIST
        ════════════════════════════════════════ */}
        <div className="mt-10">
          <div className="animate-fade-in-up-2 mb-5 flex items-center gap-2">
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "#6B9E85" }}
            >
              Your entries
            </p>
            <div className="flex-1 border-t" style={{ borderColor: "#C8E6C9" }} />
          </div>

          {/* Error */}
          {error && (
            <div
              className="mb-4 rounded-xl px-4 py-3 text-sm"
              style={{
                backgroundColor: "#FFF4F4",
                color: "#C0392B",
                border: "1px solid #F5C6C6",
              }}
            >
              {error}
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="flex justify-center py-16">
              <span className="text-xl nature-float">🌿</span>
            </div>
          ) : entries.length === 0 ? (
            /* ── Empty state ── */
            <div
              className="animate-fade-in-up-3 flex flex-col items-center gap-3 rounded-3xl py-14 text-center"
              style={{
                backgroundColor: "rgba(255,255,255,0.50)",
                border: "1px dashed #C8E6C9",
              }}
            >
              <MoodFace mood="calm" size={48} />
              <p className="text-sm font-medium" style={{ color: "#5A8A72" }}>
                No entries yet
              </p>
              <p className="text-xs" style={{ color: "#9ABFAE" }}>
                Select a mood above to log your first check-in
              </p>
            </div>
          ) : (
            /* ── Entry cards ── */
            <div className="flex flex-col gap-3">
              {entries.map((entry, i) => (
                <div
                  key={entry.id}
                  className={`animate-fade-in-up${i < 3 ? `-${i + 1}` : "-3"} group rounded-2xl p-5 transition-all`}
                  style={{
                    backgroundColor: "rgba(255,255,255,0.72)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border: "1px solid #E4F2E8",
                    boxShadow: "0 2px 10px rgba(45,106,79,0.05)",
                  }}
                >
                  {/* Top row */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <MoodFace mood={entry.mood} size={32} />
                      <div>
                        <span
                          className="text-sm font-semibold capitalize"
                          style={{ color: "#1E4D38" }}
                        >
                          {entry.mood}
                        </span>
                        <p className="text-[11px]" style={{ color: "#9ABFAE" }}>
                          {formatDate(entry.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Edit / Delete */}
                    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => handleEdit(entry)}
                        className="rounded-lg p-2 transition-colors hover:bg-black/5"
                        title="Edit"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6B9E85" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                          <path d="m15 5 4 4" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="rounded-lg p-2 transition-colors hover:bg-red-50"
                        title="Delete"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C07070" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Note */}
                  {entry.note && (
                    <p
                      className="mt-3 rounded-xl px-3.5 py-2.5 text-sm leading-relaxed"
                      style={{
                        color: "#4A7A62",
                        backgroundColor: "rgba(232,245,233,0.45)",
                        border: "1px solid rgba(200,230,201,0.4)",
                      }}
                    >
                      {entry.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PAGE EXPORT (auth-protected)
═══════════════════════════════════════════════════════ */
export default function MoodPage() {
  return (
    <ProtectedRoute>
      <MoodContent />
    </ProtectedRoute>
  );
}

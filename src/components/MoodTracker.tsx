"use client";

import { useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { addMoodEntry } from "@/src/services/moodService";

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

function MoodFace({ mood, size = 28 }: { mood: string; size?: number }) {
  const c = moodColor(mood);
  const sw = 1.5;
  const head = <circle cx="14" cy="14" r="11.5" stroke={c} strokeWidth={sw} fill={c + "15"} />;

  switch (mood) {
    case "happy":
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<path d="M8 12 Q10 10 12 12" stroke={c} strokeWidth={sw} strokeLinecap="round" /><path d="M16 12 Q18 10 20 12" stroke={c} strokeWidth={sw} strokeLinecap="round" /><path d="M8 17 Q14 22 20 17" stroke={c} strokeWidth={sw} strokeLinecap="round" /></svg>);
    case "calm":
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<path d="M8 12.5 L12 12.5" stroke={c} strokeWidth={sw} strokeLinecap="round" /><path d="M16 12.5 L20 12.5" stroke={c} strokeWidth={sw} strokeLinecap="round" /><path d="M11 17.5 Q14 19 17 17.5" stroke={c} strokeWidth={sw} strokeLinecap="round" /></svg>);
    case "relaxed":
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<circle cx="10" cy="12.5" r="1.2" fill={c} /><path d="M7.5 11 L12.5 11" stroke={c} strokeWidth={sw} strokeLinecap="round" /><circle cx="18" cy="12.5" r="1.2" fill={c} /><path d="M15.5 11 L20.5 11" stroke={c} strokeWidth={sw} strokeLinecap="round" /><path d="M10 17.5 Q14 20 18 17.5" stroke={c} strokeWidth={sw} strokeLinecap="round" /></svg>);
    case "grateful":
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<path d="M8 13 Q10 11 12 13" stroke={c} strokeWidth={sw} strokeLinecap="round" /><path d="M16 13 Q18 11 20 13" stroke={c} strokeWidth={sw} strokeLinecap="round" /><path d="M9 17 Q14 21 19 17" stroke={c} strokeWidth={sw} strokeLinecap="round" /><circle cx="7" cy="15" r="1.8" fill={c} opacity="0.25" /><circle cx="21" cy="15" r="1.8" fill={c} opacity="0.25" /></svg>);
    case "motivated":
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<circle cx="10" cy="12" r="1.5" fill={c} /><circle cx="18" cy="12" r="1.5" fill={c} /><path d="M9 16 L19 16 Q19 20.5 14 20.5 Q9 20.5 9 16 Z" stroke={c} strokeWidth={sw} fill={c + "20"} strokeLinejoin="round" /></svg>);
    case "sad":
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<path d="M8 10 L11.5 9" stroke={c} strokeWidth="1.4" strokeLinecap="round" /><path d="M20 10 L16.5 9" stroke={c} strokeWidth="1.4" strokeLinecap="round" /><circle cx="10" cy="12.5" r="1.2" fill={c} /><circle cx="18" cy="12.5" r="1.2" fill={c} /><path d="M9.5 19 Q14 16 18.5 19" stroke={c} strokeWidth={sw} strokeLinecap="round" /><circle cx="20" cy="16" r="1.2" fill={c} /></svg>);
    case "anxious":
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<circle cx="10" cy="12" r="2.2" stroke={c} strokeWidth="1.2" fill="none" /><circle cx="10" cy="12" r="0.9" fill={c} /><circle cx="18" cy="12" r="2.2" stroke={c} strokeWidth="1.2" fill="none" /><circle cx="18" cy="12" r="0.9" fill={c} /><path d="M9 18 Q11 16.5 14 18 Q17 19.5 19 18" stroke={c} strokeWidth={sw} strokeLinecap="round" fill="none" /><path d="M21.5 7.5 Q22 9.5 21.5 11 Q21 9.5 21.5 7.5 Z" fill={c} /></svg>);
    case "stressed":
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<path d="M8.5 11 L11.5 13.5" stroke={c} strokeWidth={sw} strokeLinecap="round" /><path d="M11.5 11 L8.5 13.5" stroke={c} strokeWidth={sw} strokeLinecap="round" /><path d="M16.5 11 L19.5 13.5" stroke={c} strokeWidth={sw} strokeLinecap="round" /><path d="M19.5 11 L16.5 13.5" stroke={c} strokeWidth={sw} strokeLinecap="round" /><path d="M8.5 18 L11 16.5 L14 18 L17 16.5 L19.5 18" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>);
    case "angry":
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<path d="M7 9.5 L12 11.5" stroke={c} strokeWidth="1.8" strokeLinecap="round" /><path d="M21 9.5 L16 11.5" stroke={c} strokeWidth="1.8" strokeLinecap="round" /><circle cx="10" cy="13.5" r="1.3" fill={c} /><circle cx="18" cy="13.5" r="1.3" fill={c} /><rect x="9" y="17" width="10" height="3" rx="0.5" stroke={c} strokeWidth="1.3" fill="none" /><path d="M12 17 L12 20" stroke={c} strokeWidth="1" /><path d="M15.5 17 L15.5 20" stroke={c} strokeWidth="1" /></svg>);
    case "lonely":
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<circle cx="10" cy="13" r="1" fill={c} /><circle cx="18" cy="13" r="1" fill={c} /><path d="M11 18 Q14 16.5 17 18" stroke={c} strokeWidth={sw} strokeLinecap="round" /></svg>);
    case "overwhelmed":
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<path d="M7.5 9 L12.5 9" stroke={c} strokeWidth="1.4" strokeLinecap="round" /><path d="M15.5 9 L20.5 9" stroke={c} strokeWidth="1.4" strokeLinecap="round" /><circle cx="10" cy="12.5" r="2.3" stroke={c} strokeWidth="1.3" fill="none" /><circle cx="10" cy="12.5" r="1" fill={c} /><circle cx="18" cy="12.5" r="2.3" stroke={c} strokeWidth="1.3" fill="none" /><circle cx="18" cy="12.5" r="1" fill={c} /><ellipse cx="14" cy="19" rx="2.2" ry="2" stroke={c} strokeWidth={sw} fill="none" /></svg>);
    case "tired":
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<path d="M8 13 Q10 11.5 12 13" stroke={c} strokeWidth="1.8" strokeLinecap="round" fill="none" /><path d="M16 13 Q18 11.5 20 13" stroke={c} strokeWidth="1.8" strokeLinecap="round" fill="none" /><ellipse cx="14" cy="19" rx="2.5" ry="2" stroke={c} strokeWidth={sw} fill={c + "15"} /><path d="M18 7 L20.5 7 L18 9.5 L20.5 9.5" stroke={c} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" fill="none" /><path d="M24 1.5 L26.5 1.5 L24 3.5 L26.5 3.5" stroke={c} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>);
    case "insecure":
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<path d="M8 11 L10.5 12.5 L8 14" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" /><path d="M20 11 L17.5 12.5 L20 14" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" /><path d="M10 17.5 Q12 18.5 14 17.5 Q16 16.8 18 17.8" stroke={c} strokeWidth={sw} strokeLinecap="round" fill="none" /></svg>);
    case "frustrated":
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<path d="M8 9 L12 10.5" stroke={c} strokeWidth="1.6" strokeLinecap="round" /><path d="M20 10 L16.5 11" stroke={c} strokeWidth="1.6" strokeLinecap="round" /><circle cx="10" cy="13" r="1.3" fill={c} /><circle cx="18" cy="13" r="1.3" fill={c} /><path d="M9 19.5 Q14 16 19 19.5" stroke={c} strokeWidth={sw} strokeLinecap="round" fill="none" /><circle cx="4.5" cy="14" r="1.8" fill={c + "30"} /><circle cx="3.5" cy="12" r="1.2" fill={c + "25"} /><circle cx="23.5" cy="14" r="1.8" fill={c + "30"} /><circle cx="24.5" cy="12" r="1.2" fill={c + "25"} /></svg>);
    case "bored":
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<circle cx="10" cy="12" r="2" stroke={c} strokeWidth="1.2" fill="none" /><circle cx="10" cy="11.2" r="0.9" fill={c} /><circle cx="18" cy="12" r="2" stroke={c} strokeWidth="1.2" fill="none" /><circle cx="18" cy="11.2" r="0.9" fill={c} /><path d="M10.5 18 L17.5 18" stroke={c} strokeWidth={sw} strokeLinecap="round" /></svg>);
    default:
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<circle cx="10" cy="12.5" r="1.2" fill={c} /><circle cx="18" cy="12.5" r="1.2" fill={c} /><path d="M10 17 L18 17" stroke={c} strokeWidth={sw} strokeLinecap="round" /></svg>);
  }
}

export default function MoodTracker() {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  async function handleSave() {
    if (!selectedMood || !user) return;
    setSubmitting(true);
    try {
      await addMoodEntry(user.uid, selectedMood, note);
      setSelectedMood(null);
      setNote("");
      setSavedMsg("Check-in saved!");
      setTimeout(() => setSavedMsg(null), 2500);
    } catch (err) {
      console.error("Failed to save mood:", err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="rounded-2xl border p-5"
      style={{
        backgroundColor: "white",
        borderColor: "rgba(200,230,208,0.5)",
        boxShadow: "0 1px 4px rgba(45,106,79,0.04)",
      }}
    >
      <h2 className="mb-1 text-[14px] font-bold" style={{ color: "#1A3D2B" }}>
        How are you feeling today?
      </h2>
      <p className="mb-4 text-[12px]" style={{ color: "#8DBFA5" }}>Select a mood to check in</p>

      <div className="grid grid-cols-5 gap-2">
        {MOODS.map((m) => {
          const active = selectedMood === m.name;
          return (
            <button
              key={m.name}
              type="button"
              onClick={() => setSelectedMood(m.name)}
              className="mood-btn flex flex-col items-center gap-1.5 rounded-xl py-2.5"
              style={{
                backgroundColor: active ? moodColor(m.name) + "18" : "rgba(245,249,246,0.8)",
                border: `1.5px solid ${active ? moodColor(m.name) : "rgba(200,230,208,0.4)"}`,
                color: active ? "#1A3D2B" : "#8A9E92",
                transform: active ? "scale(1.06)" : "scale(1)",
              }}
            >
              <MoodFace mood={m.name} size={28} />
              <span className="text-[10px] font-semibold capitalize leading-tight">{m.name}</span>
            </button>
          );
        })}
      </div>

      {/* Note */}
      <div className="mt-5">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note (optional)"
          rows={2}
          className="auth-input w-full resize-none rounded-xl border px-4 py-3 text-[13px]"
          style={{
            borderColor: "rgba(200,230,208,0.5)",
            backgroundColor: "rgba(245,249,246,0.6)",
            color: "#1A3D2B",
          }}
        />
      </div>

      {/* Save + confirmation */}
      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={!selectedMood || submitting}
          className="cta-glow nature-btn flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-[13px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            background: "linear-gradient(135deg, #4A9B7A 0%, #3D8B6A 40%, #2D6A4F 100%)",
            boxShadow: "0 4px 14px rgba(45,106,79,0.28)",
          }}
        >
          {submitting ? "Saving..." : "Save check-in"}
        </button>
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
  );
}

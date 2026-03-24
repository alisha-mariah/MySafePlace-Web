"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/src/context/AuthContext";
import { getMoodEntries, MoodEntry } from "@/src/services/moodService";
import MoodFace, { moodColor } from "@/src/components/MoodFace";

/* Get the 7 days of the current week (Mon–Sun) */
function getWeekDays(): Date[] {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + mondayOffset);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    return d;
  });
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function WeeklyMood() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const weekDays = getWeekDays();
  const today = new Date();

  useEffect(() => {
    if (!user) return;
    getMoodEntries(user.uid)
      .then(setEntries)
      .catch((err) => console.error("Failed to load mood entries:", err))
      .finally(() => setLoading(false));
  }, [user]);

  // For each day, find the latest mood entry
  function getMoodForDay(day: Date): MoodEntry | null {
    const dayEntries = entries.filter((e) => isSameDay(e.createdAt, day));
    return dayEntries.length > 0 ? dayEntries[0] : null; // already sorted newest first
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
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[14px] font-bold" style={{ color: "#1A3D2B" }}>This week&apos;s mood</h2>
        <Link
          href="/dashboard/mood"
          className="text-[12px] font-semibold transition-colors hover:underline"
          style={{ color: "#5EA88A" }}
        >
          View all
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="nature-float">
            <path d="M6 3 C10 7 12 13 10 19 C8 19 2 17 1 13 C-1 9 2 5 6 3 Z" fill="#7DB892" opacity="0.6" />
          </svg>
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, i) => {
            const entry = getMoodForDay(day);
            const isToday = isSameDay(day, today);
            const isFuture = day > today;
            const color = entry ? moodColor(entry.mood) : "#D4DFDA";
            const dateNum = day.getDate();

            return (
              <div key={i} className="flex flex-col items-center gap-2">
                {/* Day label */}
                <span
                  className="text-[11px] font-semibold"
                  style={{ color: isToday ? "#1A3D2B" : "#8DBFA5" }}
                >
                  {DAY_LABELS[i]}
                </span>

                {/* Mood face */}
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full transition-all"
                  style={{
                    backgroundColor: entry ? color + "15" : isFuture ? "rgba(220,230,224,0.3)" : "rgba(220,230,224,0.5)",
                    border: isToday ? `2px solid ${entry ? color : "#8DBFA5"}` : `1.5px solid ${entry ? color + "35" : "rgba(200,230,208,0.4)"}`,
                  }}
                >
                  {entry ? (
                    <MoodFace mood={entry.mood} size={30} />
                  ) : isFuture ? (
                    <span className="text-[10px]" style={{ color: "#C8D8CE" }}>—</span>
                  ) : (
                    <span className="text-[10px]" style={{ color: "#A8C4B4" }}>—</span>
                  )}
                </div>

                {/* Date number */}
                <span
                  className="text-[10px] font-medium"
                  style={{ color: isToday ? "#1A3D2B" : "#A8C4B4" }}
                >
                  {dateNum}
                </span>

                {/* Mood label */}
                {entry && (
                  <span
                    className="text-[9px] font-semibold capitalize"
                    style={{ color }}
                  >
                    {entry.mood}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { useNatureSound } from "@/src/context/NatureSoundContext";

export default function NatureSoundWidget() {
  const { playing, volume, start, stop, setVolume } = useNatureSound();
  const [showPanel, setShowPanel] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setShowPanel(false);
    }
    if (showPanel) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showPanel]);

  return (
    <div className="fixed top-4 right-4 z-50" ref={panelRef}>
      {/* Main button — top right, always visible */}
      <button
        onClick={() => {
          if (!playing) { start(); setShowPanel(true); }
          else setShowPanel(!showPanel);
        }}
        className={`pill-btn flex items-center gap-2.5 rounded-full px-5 py-3 text-[13px] font-semibold transition-all ${playing ? "sound-active" : ""}`}
        style={{
          backgroundColor: playing ? "rgba(94,168,138,0.22)" : "rgba(255,255,255,0.90)",
          border: `1.5px solid ${playing ? "rgba(94,168,138,0.5)" : "rgba(200,230,208,0.6)"}`,
          color: playing ? "#1A5C3A" : "#4A8C6A",
          backdropFilter: "blur(14px)",
          boxShadow: playing
            ? "0 4px 20px rgba(93,168,138,0.22), 0 0 0 1px rgba(93,168,138,0.08)"
            : "0 4px 20px rgba(45,106,79,0.12), 0 2px 8px rgba(45,106,79,0.06)",
        }}
        title={playing ? "Adjust nature sounds" : "Play nature sounds"}
      >
        {/* Leaf icon */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M6 3 C10 7 12 13 10 19 C8 19 2 17 1 13 C-1 9 2 5 6 3 Z" fill={playing ? "#3F9468" : "#7DB892"} opacity="0.85" />
          <path d="M6 3 C5 9 5 15 10 19" stroke={playing ? "rgba(63,148,104,0.5)" : "rgba(93,168,138,0.35)"} strokeWidth="0.8" fill="none" />
          {playing ? (
            <>
              <path d="M14 8.5 C16 10.5 16 13.5 14 15.5" stroke="#3F9468" strokeWidth="1.6" strokeLinecap="round" fill="none" />
              <path d="M17 6 C20 9 20 15 17 18" stroke="#3F9468" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.45" />
            </>
          ) : (
            <>
              <path d="M14 9.5 L14 14.5" stroke="#7DB892" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.5" />
              <path d="M17 11 L17 13" stroke="#7DB892" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.35" />
            </>
          )}
        </svg>
        {playing ? "Sounds on" : "Nature sounds"}
      </button>

      {/* Volume panel — opens below the button */}
      {showPanel && playing && (
        <div
          className="absolute right-0 top-full mt-2.5 animate-fade-in-up rounded-xl border px-5 py-4"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.85) 100%)",
            borderColor: "rgba(200,230,208,0.50)",
            boxShadow: "0 8px 32px rgba(45,106,79,0.12), 0 2px 8px rgba(45,106,79,0.06)",
            backdropFilter: "blur(16px)",
            width: 230,
          }}
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[12px] font-semibold" style={{ color: "#2D6A4F" }}>Volume</span>
            <span className="text-[11px] font-medium tabular-nums" style={{ color: "#8DBFA5" }}>{volume}%</span>
          </div>

          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="nature-slider w-full"
            style={{ accentColor: "#5EA88A" }}
          />

          <button
            onClick={() => { stop(); setShowPanel(false); }}
            className="pill-btn mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg py-2.5 text-[12px] font-semibold"
            style={{ color: "#C07070", backgroundColor: "rgba(242,196,206,0.18)", border: "1px solid rgba(242,196,206,0.35)" }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
            Stop sounds
          </button>
        </div>
      )}
    </div>
  );
}

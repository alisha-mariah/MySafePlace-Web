"use client";

<<<<<<< HEAD
import { useState, useEffect, useMemo, useRef } from "react";
=======
import { useState, useEffect, useRef, useMemo } from "react";
>>>>>>> feature/emergency-contacts
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { useNatureSound } from "@/src/context/NatureSoundContext";
import { logoutUser } from "@/src/services/authService";
import { getResources, Resource } from "@/src/services/resourceService";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function formatDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function Topbar() {
  const { user } = useAuth();
  const { playing, start, stop } = useNatureSound();
  const router = useRouter();
  const firstName = user?.displayName?.split(" ")[0] ?? null;

  const [query, setQuery] = useState("");
  const [allResources, setAllResources] = useState<Resource[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Load resources once for search
  useEffect(() => {
    getResources().then(setAllResources).catch(() => {});
  }, []);


  // Derive filtered results from query (no effect needed)
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allResources
      .filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q)
      )
      .slice(0, 5);

  // Filter as user types (derived state, no setState in effect)
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allResources.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
    ).slice(0, 5);
 feature/emergency-contacts
  }, [query, allResources]);

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleLogout() {
    await logoutUser();
    router.replace("/login");
  }

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between border-b px-6 py-3"
      style={{
        backgroundColor: "rgba(250,252,251,0.85)",
        borderColor: "rgba(200,230,208,0.4)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Left — greeting + date */}
      <div>
        <h2 className="text-[14px] font-semibold" style={{ color: "#1A3D2B" }}>
          {getGreeting()}{firstName ? `, ${firstName}` : ""}
        </h2>
        <p className="text-[11px]" style={{ color: "#8DBFA5" }}>{formatDate()}</p>
      </div>

      {/* Right group — search + controls */}
      <div className="flex items-center gap-3">

      {/* Search */}
      <div ref={searchRef} className="relative hidden max-w-xs md:block">
        <div className="relative">
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8DBFA5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="absolute left-3.5 top-1/2 -translate-y-1/2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowResults(e.target.value.trim().length > 0); }}
            onFocus={() => { if (query.trim()) setShowResults(true); }}
            placeholder="Search resources..."
            className="w-full rounded-full py-2 pl-10 pr-4 text-[13px] transition-all"
            style={{
              backgroundColor: "rgba(255,255,255,0.8)",
              border: "1.5px solid rgba(200,230,208,0.5)",
              color: "#1A3D2B",
              outline: "none",
            }}
          />
        </div>

        {/* Search results dropdown */}
        {showResults && (
          <div
            className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-xl border"
            style={{
              backgroundColor: "white",
              borderColor: "rgba(200,230,208,0.5)",
              boxShadow: "0 8px 24px rgba(45,106,79,0.10)",
            }}
          >
            {results.length === 0 ? (
              <p className="px-4 py-3 text-[13px]" style={{ color: "#8DBFA5" }}>No resources found.</p>
            ) : (
              results.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    setQuery("");
                    setShowResults(false);
                    router.push("/dashboard/resources");
                  }}
                  className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[#F5F9F6]"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8DBFA5" strokeWidth="1.8" strokeLinecap="round" className="mt-0.5 flex-shrink-0">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M10 9l5 3-5 3V9z" />
                  </svg>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold" style={{ color: "#1A3D2B" }}>{r.title}</p>
                    {r.category && (
                      <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#5EA88A" }}>{r.category}</span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>

        {/* Nature sound toggle */}
        <button
          onClick={() => (playing ? stop() : start())}
          className="flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition-all"
          style={{
            backgroundColor: playing ? "rgba(94,168,138,0.15)" : "rgba(255,255,255,0.8)",
            border: `1.5px solid ${playing ? "rgba(94,168,138,0.4)" : "rgba(200,230,208,0.5)"}`,
            color: playing ? "#1A5C3A" : "#6B9E85",
          }}
        >
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M2 12 C5 8 8 16 11 12 C14 8 17 16 20 12" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 3C10 7 12 13 10 19C8 19 2 17 1 13C-1 9 2 5 6 3Z" />
            </svg>
          )}
          {playing ? "Sound on" : "Nature sound"}
        </button>

        {/* Sign out */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-medium transition-all"
          style={{
            color: "#6B9E85",
            backgroundColor: "rgba(255,255,255,0.7)",
            border: "1px solid rgba(200,230,208,0.5)",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign out
        </button>
      </div>
    </header>
  );
}

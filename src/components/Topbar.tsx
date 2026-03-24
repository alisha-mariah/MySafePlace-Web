"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { useNatureSound } from "@/src/context/NatureSoundContext";
import { logoutUser } from "@/src/services/authService";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function Topbar() {
  const { user } = useAuth();
  const { playing, start, stop } = useNatureSound();
  const router = useRouter();
  const firstName = user?.displayName?.split(" ")[0] ?? null;

  async function handleLogout() {
    await logoutUser();
    router.replace("/login");
  }

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between border-b px-8 py-4"
      style={{
        backgroundColor: "rgba(250,252,251,0.85)",
        borderColor: "rgba(200,230,208,0.4)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Greeting */}
      <h2 className="text-[15px] font-semibold" style={{ color: "#1A3D2B" }}>
        {getGreeting()}{firstName ? `, ${firstName}` : ""}
      </h2>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Nature sounds toggle */}
        <button
          onClick={() => (playing ? stop() : start())}
          className="flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-semibold transition-all"
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
          {playing ? "Sounds on" : "Nature sounds"}
        </button>

        {/* Sign out */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-full px-4 py-2 text-[12px] font-medium transition-all"
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

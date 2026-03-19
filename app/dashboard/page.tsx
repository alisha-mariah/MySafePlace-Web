"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import { useAuth } from "@/src/context/AuthContext";
import { logoutUser } from "@/src/services/authService";

const navCards = [
  { label: "Journal",            description: "Write your thoughts",   href: "/journal",   bg: "#E6F4EA" },
  { label: "Mood Tracker",       description: "Track how you feel",    href: "/mood",      bg: "#E0EFEB" },
  { label: "Resources",          description: "Find helpful guides",   href: "/resources", bg: "#F2EDE4" },
  { label: "Videos",             description: "Watch calming content", href: "/videos",    bg: "#ECE4F2" },
  { label: "Emergency Contacts", description: "People who care",       href: "/emergency", bg: "#F2E6EA" },
  { label: "Profile",            description: "Your account settings", href: "/profile",   bg: "#E4EEE8" },
];

function CardIcon({ label }: { label: string }) {
  const c = "#2D6A4F";
  const p = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, stroke: c };
  switch (label) {
    case "Journal":
      return (
        <svg {...p}>
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5Z" />
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M8 7h8M8 11h5" />
        </svg>
      );
    case "Mood Tracker":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="10" opacity=".25" strokeWidth={1.4} />
          <path d="M3 12h3l3-6 3 12 3-6h6" />
        </svg>
      );
    case "Resources":
      return (
        <svg {...p}>
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      );
    case "Videos":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="10" />
          <path d="M10 8l6 4-6 4V8z" fill={c} stroke="none" />
        </svg>
      );
    case "Emergency Contacts":
      return (
        <svg {...p}>
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      );
    case "Profile":
      return (
        <svg {...p}>
          <circle cx="12" cy="8" r="4" />
          <path d="M20 21a8 8 0 0 0-16 0" />
        </svg>
      );
    default:
      return null;
  }
}

/* ── Header nature decoration – left branches ── */
function HeaderLeavesLeft() {
  return (
    <div className="pointer-events-none absolute bottom-0 left-0 top-0 overflow-hidden" style={{ width: 140 }}>
      <svg viewBox="0 0 140 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full" preserveAspectRatio="xMinYMid meet">
        <path d="M0 100 C40 70 80 50 140 20" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M0 120 C25 90 55 75 90 60" stroke="rgba(255,255,255,0.10)" strokeWidth="1.2" strokeLinecap="round" />
        <g transform="translate(35,78) rotate(-38)">
          <path d="M0,-15 C6,-9 6,9 0,15 C-6,9 -6,-9 0,-15 Z" fill="rgba(255,255,255,0.20)" />
          <line x1="0" y1="-11" x2="0" y2="11" stroke="rgba(255,255,255,0.28)" strokeWidth="0.7" />
        </g>
        <g transform="translate(72,55) rotate(-55)">
          <path d="M0,-12 C5,-7 5,7 0,12 C-5,7 -5,-7 0,-12 Z" fill="rgba(255,255,255,0.16)" />
        </g>
        <g transform="translate(110,35) rotate(-65)">
          <path d="M0,-10 C4,-6 4,6 0,10 C-4,6 -4,-6 0,-10 Z" fill="rgba(255,255,255,0.13)" />
        </g>
        {/* Small flower */}
        <g transform="translate(18,95)">
          <ellipse cx="0" cy="-5" rx="3" ry="5" fill="rgba(245,208,216,0.40)" />
          <ellipse cx="0" cy="5" rx="3" ry="5" fill="rgba(245,208,216,0.40)" />
          <ellipse cx="-5" cy="0" rx="5" ry="3" fill="rgba(245,208,216,0.40)" />
          <ellipse cx="5" cy="0" rx="5" ry="3" fill="rgba(245,208,216,0.40)" />
          <circle cx="0" cy="0" r="2.5" fill="rgba(232,201,122,0.55)" />
        </g>
      </svg>
    </div>
  );
}

/* ── Header nature decoration – right branches + birds ── */
function HeaderLeavesRight() {
  return (
    <div className="pointer-events-none absolute bottom-0 right-0 top-0 overflow-hidden" style={{ width: 180 }}>
      <svg viewBox="0 0 180 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full" preserveAspectRatio="xMaxYMid meet">
        <path d="M180 110 C140 75 95 50 30 18" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M180 120 C155 95 120 78 75 62" stroke="rgba(255,255,255,0.10)" strokeWidth="1.2" strokeLinecap="round" />
        <g transform="translate(148,88) rotate(38)">
          <path d="M0,-15 C6,-9 6,9 0,15 C-6,9 -6,-9 0,-15 Z" fill="rgba(255,255,255,0.20)" />
          <line x1="0" y1="-11" x2="0" y2="11" stroke="rgba(255,255,255,0.28)" strokeWidth="0.7" />
        </g>
        <g transform="translate(108,65) rotate(52)">
          <path d="M0,-12 C5,-7 5,7 0,12 C-5,7 -5,-7 0,-12 Z" fill="rgba(255,255,255,0.16)" />
        </g>
        <g transform="translate(68,42) rotate(62)">
          <path d="M0,-10 C4,-6 4,6 0,10 C-4,6 -4,-6 0,-10 Z" fill="rgba(255,255,255,0.13)" />
        </g>
        {/* Flower right side */}
        <g transform="translate(163,102)">
          <ellipse cx="0" cy="-5" rx="3" ry="5" fill="rgba(245,208,216,0.40)" />
          <ellipse cx="0" cy="5" rx="3" ry="5" fill="rgba(245,208,216,0.40)" />
          <ellipse cx="-5" cy="0" rx="5" ry="3" fill="rgba(245,208,216,0.40)" />
          <ellipse cx="5" cy="0" rx="5" ry="3" fill="rgba(245,208,216,0.40)" />
          <circle cx="0" cy="0" r="2.5" fill="rgba(232,201,122,0.55)" />
        </g>
        {/* Birds */}
        <path d="M55 22 C60 17 66 17 71 22" stroke="rgba(255,255,255,0.55)" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M75 12 C79 8 84 8 88 12" stroke="rgba(255,255,255,0.42)" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M94 22 C97 18 101 18 104 22" stroke="rgba(255,255,255,0.33)" strokeWidth="1" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/* ── User avatar with initials ── */
function UserAvatar({ displayName }: { displayName: string | null }) {
  const initials = displayName
    ? displayName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "🌿";

  return (
    <div
      className="relative mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full text-xl font-bold text-white"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.10) 100%)",
        border: "2.5px solid rgba(255,255,255,0.55)",
        boxShadow:
          "0 0 0 5px rgba(255,255,255,0.10), 0 8px 24px rgba(26,61,43,0.25)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      {/* Soft inner glow ring */}
      <div
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 38% 32%, rgba(255,255,255,0.28) 0%, transparent 65%)",
        }}
      />
      <span className="relative z-10">{initials}</span>

      {/* Small leaf badge */}
      <div
        className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full text-xs"
        style={{
          background: "linear-gradient(135deg, #A8D5BA 0%, #52AB84 100%)",
          border: "2px solid rgba(255,255,255,0.70)",
          boxShadow: "0 2px 6px rgba(45,106,79,0.30)",
        }}
      >
        🌿
      </div>
    </div>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const router = useRouter();

  const firstName = user?.displayName?.split(" ")[0] ?? null;
  const greeting = firstName ? `Welcome back, ${firstName}` : "Welcome back";

  async function handleLogout() {
    await logoutUser();
    router.replace("/login");
  }

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: "#EFF8F2" }}>
      {/* Background depth blobs */}
      <div
        className="pointer-events-none absolute"
        style={{
          bottom: "-100px",
          left: "-100px",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(168,213,186,0.22) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          top: "20%",
          right: "-80px",
          width: 380,
          height: 380,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(245,208,216,0.16) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      {/* ── Header ── */}
      <header
        className="relative overflow-hidden px-6 pb-8 pt-7 text-center"
        style={{
          background: "linear-gradient(135deg, #52AB84 0%, #2D6A4F 55%, #1A3D2B 100%)",
          boxShadow: "0 4px 24px rgba(26,61,43,0.20)",
        }}
      >
        <HeaderLeavesLeft />
        <HeaderLeavesRight />

        {/* Content */}
        <div className="relative animate-fade-in-up">
          {/* Brand tag */}
          <div className="mb-4 flex items-center justify-center gap-2">
            <span className="text-sm opacity-70">🍃</span>
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "rgba(168,213,181,0.9)" }}
            >
              MySafePlace
            </span>
            <span className="text-sm opacity-70">🍃</span>
          </div>

          {/* Avatar */}
          <UserAvatar displayName={user?.displayName ?? null} />

          <h1 className="text-3xl font-bold tracking-tight text-white">
            MySafePlace
          </h1>

          <p className="mt-1.5 text-sm" style={{ color: "rgba(168,213,181,0.95)" }}>
            {greeting} 🌸
          </p>

          <button
            onClick={handleLogout}
            className="mt-5 rounded-full px-5 py-2 text-xs font-semibold transition-all"
            style={{
              backgroundColor: "rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.88)",
              border: "1px solid rgba(255,255,255,0.22)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(255,255,255,0.22)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(255,255,255,0.12)";
            }}
          >
            Log out
          </button>
        </div>
      </header>

      {/* ── Section label ── */}
      <div className="animate-fade-in-up-1 mx-auto mt-8 max-w-2xl px-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-base">🌿</span>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#6B9E85" }}>
            Your space
          </p>
          <div className="flex-1 border-t" style={{ borderColor: "#C8E6C9" }} />
        </div>
      </div>

      {/* ── Nav Cards ── */}
      <main className="animate-fade-in-up-2 mx-auto max-w-2xl px-4 pb-12">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {navCards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="nature-card group relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl p-6 text-center"
              style={{
                background: "linear-gradient(145deg, #FFFFFF 0%, #F2FAF5 100%)",
                border: "1px solid #D4EDDC",
                boxShadow: "0 2px 8px rgba(45,106,79,0.07)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "#A8D5B5";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "#D4EDDC";
              }}
            >
              {/* Tiny corner leaf accent */}
              <div
                className="pointer-events-none absolute right-2 top-2 text-xs opacity-0 transition-opacity group-hover:opacity-100"
                style={{ color: "#C8E6C9" }}
              >
                🍃
              </div>

              {/* Icon container */}
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{ backgroundColor: card.bg }}
              >
                <CardIcon label={card.label} />
              </div>

              <span className="text-sm font-semibold" style={{ color: "#1E4D38" }}>
                {card.label}
              </span>
              <span className="text-xs leading-snug" style={{ color: "#6B9E85" }}>
                {card.description}
              </span>
            </Link>
          ))}
        </div>

        {/* Footer note */}
        <p className="mt-10 text-center text-xs" style={{ color: "#A8D5B5" }}>
          🌸 Take it one breath at a time 🌸
        </p>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

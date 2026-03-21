"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import { useAuth } from "@/src/context/AuthContext";
import { logoutUser } from "@/src/services/authService";

/* ── Helpers ── */

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function getTimeMessage() {
  const h = new Date().getHours();
  if (h < 12) return "Start your day with intention.";
  if (h < 17) return "Take a moment for yourself.";
  return "Wind down and reflect on your day.";
}

/* ── Icons ── */

function CardIcon({ label, color, size = 24 }: { label: string; color: string; size?: number }) {
  const p = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (label) {
    case "Journal":
      return (<svg {...p}><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5Z" /><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M8 7h8M8 11h5" /></svg>);
    case "Mood Tracker":
      return (<svg {...p}><circle cx="12" cy="12" r="10" opacity=".25" strokeWidth={1.4} /><path d="M3 12h3l3-6 3 12 3-6h6" /></svg>);
    case "Resource Library":
      return (<svg {...p}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>);
    case "Emergency Contacts":
      return (<svg {...p}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>);
    case "Profile":
      return (<svg {...p}><circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 0 0-16 0" /></svg>);
    default:
      return null;
  }
}

/* ── Full-page nature background ── */

function DashboardNatureBg() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <svg viewBox="0 0 1400 900" fill="none" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        {/* Warm glows */}
        <circle cx="1200" cy="100" r="280" fill="rgba(242,196,206,0.06)" />
        <circle cx="100" cy="750" r="220" fill="rgba(168,213,186,0.05)" />
        <circle cx="700" cy="400" r="320" fill="rgba(242,196,206,0.025)" />

        {/* Topographic contour lines */}
        <path d="M0 120 Q350 85 700 115 Q1050 145 1400 100" stroke="rgba(168,213,186,0.07)" strokeWidth="1" />
        <path d="M0 280 Q400 250 750 275 Q1100 300 1400 265" stroke="rgba(168,213,186,0.05)" strokeWidth="1" />
        <path d="M0 450 Q320 425 700 445 Q1050 465 1400 435" stroke="rgba(168,213,186,0.04)" strokeWidth="1" />
        <path d="M0 650 Q380 630 750 645 Q1100 660 1400 640" stroke="rgba(168,213,186,0.035)" strokeWidth="1" />

        {/* Top-right branch with leaves and blossoms */}
        <path d="M1400 0 C1320 90 1240 180 1150 280" stroke="#C8E6D0" strokeWidth="1.5" strokeLinecap="round" opacity="0.22" />
        <g transform="translate(1300,100) rotate(35)">
          <path d="M0,-14 C6,-8 6,8 0,14 C-6,8 -6,-8 0,-14 Z" fill="#C8E6D0" opacity="0.20" />
          <line x1="0" y1="-10" x2="0" y2="10" stroke="#A8D5BA" strokeWidth="0.5" opacity="0.22" />
        </g>
        <g transform="translate(1250,175) rotate(20)">
          <path d="M0,-12 C5,-7 5,7 0,12 C-5,7 -5,-7 0,-12 Z" fill="#C8E6D0" opacity="0.16" />
        </g>
        {/* Cherry blossoms */}
        <g transform="translate(1340,55)">
          <ellipse cx="0" cy="-5" rx="4" ry="5.5" fill="#F2C4CE" opacity="0.26" />
          <ellipse cx="0" cy="5" rx="4" ry="5.5" fill="#F2C4CE" opacity="0.26" />
          <ellipse cx="-5.5" cy="0" rx="5.5" ry="4" fill="#F2C4CE" opacity="0.24" />
          <ellipse cx="5.5" cy="0" rx="5.5" ry="4" fill="#F2C4CE" opacity="0.24" />
          <circle cx="0" cy="0" r="2.5" fill="#E8CA7A" opacity="0.32" />
        </g>
        <g transform="translate(1270,150)">
          <ellipse cx="0" cy="-4" rx="3" ry="4.5" fill="#F2C4CE" opacity="0.20" />
          <ellipse cx="0" cy="4" rx="3" ry="4.5" fill="#F2C4CE" opacity="0.20" />
          <ellipse cx="-4.5" cy="0" rx="4.5" ry="3" fill="#F2C4CE" opacity="0.18" />
          <ellipse cx="4.5" cy="0" rx="4.5" ry="3" fill="#F2C4CE" opacity="0.18" />
          <circle cx="0" cy="0" r="2" fill="#E8CA7A" opacity="0.25" />
        </g>

        {/* Bottom-left branch */}
        <path d="M0 900 C90 810 190 720 300 620" stroke="#C8E6D0" strokeWidth="1.5" strokeLinecap="round" opacity="0.20" />
        <g transform="translate(130,780) rotate(-40)">
          <path d="M0,-13 C6,-7 6,7 0,13 C-6,7 -6,-7 0,-13 Z" fill="#C8E6D0" opacity="0.18" />
          <line x1="0" y1="-9" x2="0" y2="9" stroke="#A8D5BA" strokeWidth="0.5" opacity="0.20" />
        </g>
        <g transform="translate(55,835)">
          <ellipse cx="0" cy="-4.5" rx="3.5" ry="4.5" fill="#F2C4CE" opacity="0.22" />
          <ellipse cx="0" cy="4.5" rx="3.5" ry="4.5" fill="#F2C4CE" opacity="0.22" />
          <ellipse cx="-4.5" cy="0" rx="4.5" ry="3.5" fill="#F2C4CE" opacity="0.20" />
          <ellipse cx="4.5" cy="0" rx="4.5" ry="3.5" fill="#F2C4CE" opacity="0.20" />
          <circle cx="0" cy="0" r="2" fill="#E8CA7A" opacity="0.28" />
        </g>

        {/* Birds */}
        <path d="M300 80 C312 60 328 60 340 80" stroke="#B8D8C4" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.17" />
        <path d="M380 55 C388 45 398 45 406 55" stroke="#B8D8C4" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.12" />
        <path d="M950 680 C960 668 972 668 982 680" stroke="#B8D8C4" strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.12" />

        {/* Butterfly */}
        <g transform="translate(450,160) rotate(-15)" className="butterfly-anim">
          <path d="M0,0 C-6,-10 -13,-8 -9,0 C-13,8 -6,10 0,0" fill="#F2C4CE" opacity="0.20" />
          <path d="M0,0 C6,-10 13,-8 9,0 C13,8 6,10 0,0" fill="#EDB8C8" opacity="0.16" />
          <line x1="0" y1="-3" x2="0" y2="3" stroke="#D4A0B4" strokeWidth="0.5" opacity="0.18" />
        </g>

        {/* Floating petals */}
        <ellipse cx="350" cy="320" rx="3" ry="5" fill="#F2C4CE" opacity="0.12" transform="rotate(30 350 320)" className="petal-drift" />
        <ellipse cx="850" cy="220" rx="2.5" ry="4" fill="#F2C4CE" opacity="0.10" transform="rotate(-20 850 220)" className="petal-drift-1" />
        <ellipse cx="550" cy="600" rx="2" ry="3.5" fill="#F2C4CE" opacity="0.09" transform="rotate(45 550 600)" className="petal-drift-2" />
        <ellipse cx="1100" cy="500" rx="2.5" ry="4" fill="#F2C4CE" opacity="0.10" transform="rotate(-35 1100 500)" className="petal-drift" />

        {/* Pollen dots */}
        <circle cx="500" cy="180" r="1.5" fill="#E8CA7A" opacity="0.12" />
        <circle cx="750" cy="350" r="1.2" fill="#E8CA7A" opacity="0.09" />
        <circle cx="250" cy="550" r="1.3" fill="#E8CA7A" opacity="0.10" />
        <circle cx="1050" cy="620" r="1.2" fill="#E8CA7A" opacity="0.09" />
      </svg>
    </div>
  );
}

/* ── Card data ── */

const featured = [
  { label: "Journal", desc: "Write your thoughts and feelings freely. A private space to process your day.", href: "/dashboard/journal", accent: "#5EA88A", iconBg: "rgba(200,230,208,0.35)" },
  { label: "Mood Tracker", desc: "Track patterns in how you feel. Small check-ins that reveal the bigger picture.", href: "/dashboard/mood", accent: "#4E9B78", iconBg: "rgba(184,216,196,0.30)" },
];

const tools = [
  { label: "Resource Library", desc: "Guides, videos & wellbeing content", href: "/dashboard/resources", accent: "#C4985A", iconBg: "rgba(232,202,122,0.18)" },
  { label: "Emergency Contacts", desc: "People who care about you", href: "/dashboard/emergency", accent: "#C07080", iconBg: "rgba(242,196,206,0.25)" },
  { label: "Profile", desc: "Account & preferences", href: "/dashboard/profile", accent: "#6B9E85", iconBg: "rgba(168,213,186,0.22)" },
];

/* ── Page ── */

function DashboardContent() {
  const { user } = useAuth();
  const router = useRouter();
  const firstName = user?.displayName?.split(" ")[0] ?? null;

  async function handleLogout() {
    await logoutUser();
    router.replace("/login");
  }

  return (
    <div className="relative min-h-screen" style={{ background: "linear-gradient(135deg, #EFF7F1 0%, #FFF5F7 50%, #F0F7F2 100%)" }}>
      <DashboardNatureBg />

      {/* Top bar */}
      <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-8 pt-7 pb-2">
        <div className="flex items-center gap-2.5">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <ellipse cx="10" cy="6" rx="3" ry="4" fill="#F2C4CE" opacity="0.6" />
            <ellipse cx="10" cy="14" rx="3" ry="4" fill="#F2C4CE" opacity="0.6" />
            <ellipse cx="6" cy="10" rx="4" ry="3" fill="#F2C4CE" opacity="0.55" />
            <ellipse cx="14" cy="10" rx="4" ry="3" fill="#F2C4CE" opacity="0.55" />
            <circle cx="10" cy="10" r="2.5" fill="#E8CA7A" opacity="0.7" />
          </svg>
          <span className="text-sm font-bold tracking-wide" style={{ color: "#1A3D2B" }}>MySafePlace</span>
        </div>
        <button
          onClick={handleLogout}
          className="pill-btn flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium"
          style={{ color: "#6B9E85", backgroundColor: "rgba(255,255,255,0.7)", border: "1px solid rgba(200,230,208,0.5)", backdropFilter: "blur(8px)" }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
          Log out
        </button>
      </nav>

      {/* Welcome card */}
      <div className="relative z-10 mx-auto mt-6 max-w-6xl px-8">
        <div
          className="animate-fade-in-up rounded-3xl px-8 py-8"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.55) 100%)",
            border: "1px solid rgba(200,230,208,0.45)",
            boxShadow: "0 8px 32px rgba(45,106,79,0.06), 0 2px 8px rgba(45,106,79,0.03)",
            backdropFilter: "blur(14px)",
          }}
        >
          <div className="flex items-center gap-5">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl text-lg font-bold tracking-wide"
              style={{
                background: "linear-gradient(135deg, #7DB892 0%, #5EA88A 50%, #4A9474 100%)",
                color: "white",
                boxShadow: "0 4px 14px rgba(93,168,138,0.25)",
              }}
            >
              {user?.displayName
                ? user.displayName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
                : "?"}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight" style={{ color: "#1A3D2B" }}>
                {getGreeting()}{firstName ? `, ${firstName}` : ""}
              </h1>
              <p className="mt-1 text-sm" style={{ color: "#6B9E85" }}>{getTimeMessage()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="relative z-10 mx-auto max-w-6xl px-8 pb-20">
        {/* Get Started */}
        <div className="mt-10">
          <p className="animate-fade-in-up-1 mb-4 text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: "#8DBFA5" }}>Get started</p>
          <div className="grid gap-5 sm:grid-cols-2">
            {featured.map((card, i) => (
              <Link
                key={card.label}
                href={card.href}
                className={`nature-card animate-fade-in-up-${Math.min(i + 1, 3)} group rounded-2xl border p-7 transition-all`}
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.60) 100%)",
                  borderColor: "rgba(200,230,208,0.45)",
                  boxShadow: "0 2px 8px rgba(45,106,79,0.04), 0 8px 24px rgba(45,106,79,0.04)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div
                  className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
                  style={{ backgroundColor: card.iconBg }}
                >
                  <CardIcon label={card.label} color={card.accent} />
                </div>
                <p className="text-base font-bold" style={{ color: "#1A3D2B" }}>{card.label}</p>
                <p className="mt-1.5 text-[13px] leading-relaxed" style={{ color: "#7A9688" }}>{card.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Your Tools */}
        <div className="mt-10">
          <p className="animate-fade-in-up-2 mb-4 text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: "#8DBFA5" }}>Your tools</p>
          <div className="grid gap-4 sm:grid-cols-3">
            {tools.map((card, i) => (
              <Link
                key={card.label}
                href={card.href}
                className={`nature-card animate-fade-in-up-${Math.min(i + 1, 3)} group flex items-start gap-4 rounded-2xl border px-5 py-5 transition-all`}
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.55) 100%)",
                  borderColor: "rgba(200,230,208,0.40)",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.02)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-105"
                  style={{ backgroundColor: card.iconBg }}
                >
                  <CardIcon label={card.label} color={card.accent} size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold" style={{ color: "#1A3D2B" }}>{card.label}</p>
                  <p className="mt-0.5 text-[12px]" style={{ color: "#8DBFA5" }}>{card.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
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
          <p className="text-[11px]" style={{ color: "#A8C4B4" }}>You&apos;re doing great. One step at a time.</p>
        </div>
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

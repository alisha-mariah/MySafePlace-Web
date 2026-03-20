"use client";

import { useEffect } from "react";
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
    case "Resources Library":
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
      <svg viewBox="0 0 1200 900" fill="none" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        {/* Warm glows */}
        <circle cx="1050" cy="100" r="250" fill="rgba(242,196,206,0.07)" />
        <circle cx="100" cy="750" r="200" fill="rgba(168,213,186,0.06)" />
        <circle cx="600" cy="400" r="300" fill="rgba(242,196,206,0.03)" />

        {/* Topographic contour lines */}
        <path d="M0 120 Q300 85 600 115 Q900 145 1200 100" stroke="rgba(168,213,186,0.08)" strokeWidth="1" />
        <path d="M0 240 Q350 210 650 235 Q950 260 1200 225" stroke="rgba(168,213,186,0.06)" strokeWidth="1" />
        <path d="M0 380 Q280 355 560 375 Q840 395 1200 365" stroke="rgba(168,213,186,0.05)" strokeWidth="1" />
        <path d="M0 520 Q320 495 640 515 Q960 535 1200 505" stroke="rgba(168,213,186,0.04)" strokeWidth="1" />
        <path d="M0 680 Q350 660 700 675 Q1000 690 1200 665" stroke="rgba(168,213,186,0.04)" strokeWidth="1" />

        {/* Top-right branch with leaves and blossoms */}
        <path d="M1200 0 C1130 80 1060 160 980 260" stroke="#C8E6D0" strokeWidth="1.5" strokeLinecap="round" opacity="0.25" />
        <path d="M1120 60 C1100 90 1090 130 1095 165" stroke="#C8E6D0" strokeWidth="1" strokeLinecap="round" opacity="0.18" />
        {/* Leaves on top-right branch */}
        <g transform="translate(1080,100) rotate(35)">
          <path d="M0,-14 C6,-8 6,8 0,14 C-6,8 -6,-8 0,-14 Z" fill="#C8E6D0" opacity="0.22" />
          <line x1="0" y1="-10" x2="0" y2="10" stroke="#A8D5BA" strokeWidth="0.5" opacity="0.25" />
        </g>
        <g transform="translate(1040,165) rotate(20)">
          <path d="M0,-12 C5,-7 5,7 0,12 C-5,7 -5,-7 0,-12 Z" fill="#C8E6D0" opacity="0.18" />
          <line x1="0" y1="-8" x2="0" y2="8" stroke="#A8D5BA" strokeWidth="0.5" opacity="0.20" />
        </g>
        <g transform="translate(1005,225) rotate(-10)">
          <path d="M0,-11 C5,-6 5,6 0,11 C-5,6 -5,-6 0,-11 Z" fill="#C8E6D0" opacity="0.15" />
        </g>
        {/* Cherry blossoms on top-right */}
        <g transform="translate(1110,55)">
          <ellipse cx="0" cy="-5" rx="4" ry="5.5" fill="#F2C4CE" opacity="0.30" />
          <ellipse cx="0" cy="5" rx="4" ry="5.5" fill="#F2C4CE" opacity="0.30" />
          <ellipse cx="-5.5" cy="0" rx="5.5" ry="4" fill="#F2C4CE" opacity="0.28" />
          <ellipse cx="5.5" cy="0" rx="5.5" ry="4" fill="#F2C4CE" opacity="0.28" />
          <circle cx="0" cy="0" r="2.5" fill="#E8CA7A" opacity="0.35" />
        </g>
        <g transform="translate(1055,140)">
          <ellipse cx="0" cy="-4" rx="3" ry="4.5" fill="#F2C4CE" opacity="0.22" />
          <ellipse cx="0" cy="4" rx="3" ry="4.5" fill="#F2C4CE" opacity="0.22" />
          <ellipse cx="-4.5" cy="0" rx="4.5" ry="3" fill="#F2C4CE" opacity="0.20" />
          <ellipse cx="4.5" cy="0" rx="4.5" ry="3" fill="#F2C4CE" opacity="0.20" />
          <circle cx="0" cy="0" r="2" fill="#E8CA7A" opacity="0.28" />
        </g>
        <g transform="translate(1020,200)">
          <ellipse cx="0" cy="-3.5" rx="2.5" ry="3.5" fill="#F2C4CE" opacity="0.18" />
          <ellipse cx="0" cy="3.5" rx="2.5" ry="3.5" fill="#F2C4CE" opacity="0.18" />
          <ellipse cx="-3.5" cy="0" rx="3.5" ry="2.5" fill="#F2C4CE" opacity="0.16" />
          <ellipse cx="3.5" cy="0" rx="3.5" ry="2.5" fill="#F2C4CE" opacity="0.16" />
          <circle cx="0" cy="0" r="1.5" fill="#E8CA7A" opacity="0.22" />
        </g>

        {/* Bottom-left branch with leaves and blossoms */}
        <path d="M0 900 C80 810 170 720 280 620" stroke="#C8E6D0" strokeWidth="1.5" strokeLinecap="round" opacity="0.22" />
        <path d="M60 850 C50 810 55 770 70 730" stroke="#C8E6D0" strokeWidth="1" strokeLinecap="round" opacity="0.15" />
        {/* Leaves on bottom-left */}
        <g transform="translate(120,780) rotate(-40)">
          <path d="M0,-13 C6,-7 6,7 0,13 C-6,7 -6,-7 0,-13 Z" fill="#C8E6D0" opacity="0.20" />
          <line x1="0" y1="-9" x2="0" y2="9" stroke="#A8D5BA" strokeWidth="0.5" opacity="0.22" />
        </g>
        <g transform="translate(200,700) rotate(-25)">
          <path d="M0,-11 C5,-6 5,6 0,11 C-5,6 -5,-6 0,-11 Z" fill="#C8E6D0" opacity="0.16" />
        </g>
        {/* Cherry blossoms on bottom-left */}
        <g transform="translate(50,830)">
          <ellipse cx="0" cy="-4.5" rx="3.5" ry="4.5" fill="#F2C4CE" opacity="0.25" />
          <ellipse cx="0" cy="4.5" rx="3.5" ry="4.5" fill="#F2C4CE" opacity="0.25" />
          <ellipse cx="-4.5" cy="0" rx="4.5" ry="3.5" fill="#F2C4CE" opacity="0.23" />
          <ellipse cx="4.5" cy="0" rx="4.5" ry="3.5" fill="#F2C4CE" opacity="0.23" />
          <circle cx="0" cy="0" r="2" fill="#E8CA7A" opacity="0.30" />
        </g>
        <g transform="translate(155,740)">
          <ellipse cx="0" cy="-3.5" rx="2.8" ry="3.5" fill="#F2C4CE" opacity="0.20" />
          <ellipse cx="0" cy="3.5" rx="2.8" ry="3.5" fill="#F2C4CE" opacity="0.20" />
          <ellipse cx="-3.5" cy="0" rx="3.5" ry="2.8" fill="#F2C4CE" opacity="0.18" />
          <ellipse cx="3.5" cy="0" rx="3.5" ry="2.8" fill="#F2C4CE" opacity="0.18" />
          <circle cx="0" cy="0" r="1.5" fill="#E8CA7A" opacity="0.25" />
        </g>

        {/* Birds scattered across */}
        <path d="M200 80 C212 60 228 60 240 80" stroke="#B8D8C4" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.20" />
        <path d="M280 55 C288 45 298 45 306 55" stroke="#B8D8C4" strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.14" />
        <path d="M160 120 C166 112 174 112 180 120" stroke="#B8D8C4" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.12" />
        <path d="M850 650 C860 638 872 638 882 650" stroke="#B8D8C4" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.14" />
        <path d="M920 680 C926 672 934 672 940 680" stroke="#B8D8C4" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.10" />

        {/* Butterflies */}
        <g transform="translate(350,150) rotate(-15)" className="butterfly-anim">
          <path d="M0,0 C-6,-10 -13,-8 -9,0 C-13,8 -6,10 0,0" fill="#F2C4CE" opacity="0.22" />
          <path d="M0,0 C6,-10 13,-8 9,0 C13,8 6,10 0,0" fill="#EDB8C8" opacity="0.18" />
          <line x1="0" y1="-3" x2="0" y2="3" stroke="#D4A0B4" strokeWidth="0.5" opacity="0.20" />
        </g>
        <g transform="translate(900,350) rotate(10)" className="butterfly-anim-1">
          <path d="M0,0 C-5,-8 -10,-6 -7,0 C-10,6 -5,8 0,0" fill="#F2C4CE" opacity="0.16" />
          <path d="M0,0 C5,-8 10,-6 7,0 C10,6 5,8 0,0" fill="#EDB8C8" opacity="0.14" />
          <line x1="0" y1="-2.5" x2="0" y2="2.5" stroke="#D4A0B4" strokeWidth="0.5" opacity="0.15" />
        </g>

        {/* Dragonfly */}
        <g transform="translate(750,130) rotate(-8)">
          <ellipse cx="0" cy="0" rx="2" ry="6" fill="#B8D8C4" opacity="0.18" />
          <ellipse cx="-5" cy="-2" rx="7" ry="2.5" fill="#C8E6D0" opacity="0.12" transform="rotate(-10)" />
          <ellipse cx="5" cy="-2" rx="7" ry="2.5" fill="#C8E6D0" opacity="0.12" transform="rotate(10)" />
          <ellipse cx="-4" cy="2" rx="5.5" ry="2" fill="#C8E6D0" opacity="0.10" transform="rotate(-5)" />
          <ellipse cx="4" cy="2" rx="5.5" ry="2" fill="#C8E6D0" opacity="0.10" transform="rotate(5)" />
        </g>

        {/* Ladybug on a leaf mid-right */}
        <g transform="translate(1100,450) rotate(-30)">
          <path d="M0,-16 C7,-9 7,9 0,16 C-7,9 -7,-9 0,-16 Z" fill="#C8E6D0" opacity="0.16" />
          <line x1="0" y1="-12" x2="0" y2="12" stroke="#A8D5BA" strokeWidth="0.5" opacity="0.18" />
        </g>
        <g transform="translate(1105,445)">
          <ellipse cx="0" cy="0" rx="4" ry="5" fill="#E8A0A0" opacity="0.20" />
          <circle cx="0" cy="-5" r="2.5" fill="#2D2D2D" opacity="0.12" />
          <line x1="0" y1="-2" x2="0" y2="5" stroke="#2D2D2D" strokeWidth="0.4" opacity="0.12" />
          <circle cx="-1.5" cy="0" r="0.8" fill="#2D2D2D" opacity="0.12" />
          <circle cx="1.5" cy="2" r="0.8" fill="#2D2D2D" opacity="0.12" />
        </g>

        {/* Floating petals */}
        <ellipse cx="300" cy="300" rx="3" ry="5" fill="#F2C4CE" opacity="0.14" transform="rotate(30 300 300)" className="petal-drift" />
        <ellipse cx="700" cy="200" rx="2.5" ry="4" fill="#F2C4CE" opacity="0.12" transform="rotate(-20 700 200)" className="petal-drift-1" />
        <ellipse cx="500" cy="600" rx="2" ry="3.5" fill="#F2C4CE" opacity="0.10" transform="rotate(45 500 600)" className="petal-drift-2" />
        <ellipse cx="900" cy="500" rx="2.5" ry="4" fill="#F2C4CE" opacity="0.11" transform="rotate(-35 900 500)" className="petal-drift" />
        <ellipse cx="150" cy="450" rx="2" ry="3" fill="#F2C4CE" opacity="0.10" transform="rotate(20 150 450)" className="petal-drift-1" />
        <ellipse cx="1050" cy="700" rx="2.5" ry="4" fill="#F2C4CE" opacity="0.09" transform="rotate(-15 1050 700)" className="petal-drift-2" />

        {/* Pollen / sparkle dots */}
        <circle cx="400" cy="180" r="1.5" fill="#E8CA7A" opacity="0.14" />
        <circle cx="650" cy="320" r="1.2" fill="#E8CA7A" opacity="0.10" />
        <circle cx="200" cy="550" r="1.3" fill="#E8CA7A" opacity="0.12" />
        <circle cx="850" cy="180" r="1" fill="#E8CA7A" opacity="0.10" />
        <circle cx="500" cy="450" r="1.4" fill="#E8CA7A" opacity="0.08" />
        <circle cx="1000" cy="600" r="1.2" fill="#E8CA7A" opacity="0.10" />

        {/* Small ground flowers bottom center */}
        <g transform="translate(550,860)">
          <line x1="0" y1="0" x2="0" y2="25" stroke="#A8D5BA" strokeWidth="0.8" opacity="0.15" />
          <ellipse cx="0" cy="-3" rx="2.5" ry="3.5" fill="#F2C4CE" opacity="0.18" />
          <ellipse cx="0" cy="3" rx="2.5" ry="3.5" fill="#F2C4CE" opacity="0.18" />
          <ellipse cx="-3.5" cy="0" rx="3.5" ry="2.5" fill="#F2C4CE" opacity="0.16" />
          <ellipse cx="3.5" cy="0" rx="3.5" ry="2.5" fill="#F2C4CE" opacity="0.16" />
          <circle cx="0" cy="0" r="1.5" fill="#E8CA7A" opacity="0.22" />
        </g>
        <g transform="translate(620,870)">
          <line x1="0" y1="0" x2="0" y2="20" stroke="#A8D5BA" strokeWidth="0.7" opacity="0.12" />
          <ellipse cx="0" cy="-2.5" rx="2" ry="3" fill="#F2C4CE" opacity="0.14" />
          <ellipse cx="0" cy="2.5" rx="2" ry="3" fill="#F2C4CE" opacity="0.14" />
          <ellipse cx="-3" cy="0" rx="3" ry="2" fill="#F2C4CE" opacity="0.12" />
          <ellipse cx="3" cy="0" rx="3" ry="2" fill="#F2C4CE" opacity="0.12" />
          <circle cx="0" cy="0" r="1.2" fill="#E8CA7A" opacity="0.18" />
        </g>
        {/* Small green leaves scattered at bottom */}
        <g transform="translate(480,880) rotate(15)">
          <path d="M0,-8 C3,-5 3,5 0,8 C-3,5 -3,-5 0,-8 Z" fill="#C8E6D0" opacity="0.14" />
        </g>
        <g transform="translate(680,875) rotate(-20)">
          <path d="M0,-7 C3,-4 3,4 0,7 C-3,4 -3,-4 0,-7 Z" fill="#C8E6D0" opacity="0.12" />
        </g>
      </svg>
    </div>
  );
}

/* ── Card data ── */

const featured = [
  { label: "Journal", desc: "Write your thoughts and feelings freely. A private space to process your day.", href: "/journal", accent: "#5EA88A", iconBg: "rgba(200,230,208,0.35)" },
  { label: "Mood Tracker", desc: "Track patterns in how you feel. Small check-ins that reveal the bigger picture.", href: "/dashboard/mood", accent: "#4E9B78", iconBg: "rgba(184,216,196,0.30)" },
];

const tools = [
  { label: "Resources Library", desc: "Guides, videos & wellbeing content", href: "/resources", accent: "#C4985A", iconBg: "rgba(232,202,122,0.18)" },
  { label: "Emergency Contacts", desc: "People who care about you", href: "/emergency", accent: "#C07080", iconBg: "rgba(242,196,206,0.25)" },
  { label: "Profile", desc: "Account & preferences", href: "/profile", accent: "#6B9E85", iconBg: "rgba(168,213,186,0.22)" },
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

      {/* Header area */}
      <header className="relative z-10 mx-auto max-w-2xl px-6 pt-8 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Brand with small flower */}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <ellipse cx="10" cy="6" rx="3" ry="4" fill="#F2C4CE" opacity="0.6" />
              <ellipse cx="10" cy="14" rx="3" ry="4" fill="#F2C4CE" opacity="0.6" />
              <ellipse cx="6" cy="10" rx="4" ry="3" fill="#F2C4CE" opacity="0.55" />
              <ellipse cx="14" cy="10" rx="4" ry="3" fill="#F2C4CE" opacity="0.55" />
              <circle cx="10" cy="10" r="2.5" fill="#E8CA7A" opacity="0.7" />
            </svg>
            <span className="text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ color: "#7EAE94" }}>MySafePlace</span>
          </div>
          <button onClick={handleLogout} className="pill-btn flex items-center gap-1.5 rounded-full px-4 py-2 text-[11px] font-medium" style={{ color: "#6B9E85", backgroundColor: "rgba(255,255,255,0.7)", border: "1px solid rgba(200,230,208,0.5)", backdropFilter: "blur(8px)" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
            Log out
          </button>
        </div>

        {/* Greeting card */}
        <div className="mt-8 animate-fade-in-up rounded-2xl px-7 py-7" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.55) 100%)", border: "1px solid rgba(200,230,208,0.45)", boxShadow: "0 8px 32px rgba(45,106,79,0.06), 0 2px 8px rgba(45,106,79,0.03)", backdropFilter: "blur(12px)" }}>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-sm font-bold tracking-wide" style={{ background: "linear-gradient(135deg, #7DB892 0%, #5EA88A 50%, #4A9474 100%)", color: "white", boxShadow: "0 4px 14px rgba(93,168,138,0.25)" }}>
              {user?.displayName ? user.displayName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() : "?"}
            </div>
            <div>
              <h1 className="text-[22px] font-bold tracking-tight" style={{ color: "#1A3D2B" }}>
                {getGreeting()}{firstName ? `, ${firstName}` : ""}
              </h1>
              <p className="mt-0.5 text-[13px]" style={{ color: "#6B9E85" }}>{getTimeMessage()}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 mx-auto max-w-2xl px-5 pb-16">
        {/* Featured */}
        <div className="mt-8">
          <p className="animate-fade-in-up-1 mb-3.5 text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: "#8DBFA5" }}>Get started</p>
          <div className="grid gap-3.5 sm:grid-cols-2">
            {featured.map((card, i) => (
              <Link key={card.label} href={card.href} className={`nature-card animate-fade-in-up-${Math.min(i + 1, 3)} group rounded-2xl border p-5 transition-all`} style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.80) 0%, rgba(255,255,255,0.60) 100%)", borderColor: "rgba(200,230,208,0.45)", boxShadow: "0 2px 8px rgba(45,106,79,0.04), 0 8px 24px rgba(45,106,79,0.04)", backdropFilter: "blur(8px)" }}>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl transition-transform group-hover:scale-105" style={{ backgroundColor: card.iconBg }}>
                  <CardIcon label={card.label} color={card.accent} />
                </div>
                <p className="text-[15px] font-bold" style={{ color: "#1A3D2B" }}>{card.label}</p>
                <p className="mt-1 text-[12px] leading-relaxed" style={{ color: "#7A9688" }}>{card.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Tools */}
        <div className="mt-8">
          <p className="animate-fade-in-up-2 mb-3.5 text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: "#8DBFA5" }}>Your tools</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {tools.map((card, i) => (
              <Link key={card.label} href={card.href} className={`nature-card animate-fade-in-up-${Math.min(i + 1, 3)} group flex items-start gap-3.5 rounded-xl border px-4 py-4 transition-all`} style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.55) 100%)", borderColor: "rgba(200,230,208,0.40)", boxShadow: "0 1px 4px rgba(0,0,0,0.02)", backdropFilter: "blur(8px)" }}>
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-105" style={{ backgroundColor: card.iconBg }}>
                  <CardIcon label={card.label} color={card.accent} size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold" style={{ color: "#1A3D2B" }}>{card.label}</p>
                  <p className="mt-0.5 text-[11px]" style={{ color: "#8DBFA5" }}>{card.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-14 text-center">
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

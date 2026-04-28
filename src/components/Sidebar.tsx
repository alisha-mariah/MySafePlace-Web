"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { isAdminUser } from "@/src/lib/adminConfig";

const navItems = [
  {
    label: "Homepage",
    href: "/dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    label: "Mood Tracking",
    href: "/dashboard/mood",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
  },
  {
    label: "Journal",
    href: "/dashboard/journal",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5Z" />
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      </svg>
    ),
  },
  {
    label: "Resource Library",
    href: "/dashboard/resources",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    label: "Emergency Contacts",
    href: "/dashboard/emergency",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    ),
  },
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M20 21a8 8 0 0 0-16 0" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const showAdmin = isAdminUser(user?.email);

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <aside
      className="fixed left-0 top-0 z-40 flex h-screen w-56 flex-col overflow-hidden"
      style={{
        background: "linear-gradient(165deg, #2D6A4F 0%, #1F4D38 35%, #1A3D2B 65%, #163025 100%)",
      }}
    >
      {/* ── Nature illustration layer ── */}
      <div className="pointer-events-none absolute inset-0">
        <svg viewBox="0 0 260 900" fill="none" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
          {/* Sun glow */}
          <defs>
            <radialGradient id="sidebar-sun" cx="80%" cy="5%" r="40%">
              <stop offset="0%" stopColor="rgba(255,245,200,0.25)" />
              <stop offset="100%" stopColor="rgba(255,245,200,0)" />
            </radialGradient>
          </defs>
          <rect width="260" height="900" fill="url(#sidebar-sun)" />

          {/* Contour lines */}
          <path d="M-10 100 Q60 80 130 95 Q200 110 270 90" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
          <path d="M-10 200 Q70 180 140 195 Q210 210 270 190" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <path d="M-10 320 Q50 300 120 315 Q200 330 270 310" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <path d="M-10 450 Q80 435 150 445 Q220 460 270 440" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <path d="M-10 580 Q60 565 130 575 Q200 590 270 570" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <path d="M-10 700 Q70 685 140 695 Q210 710 270 690" stroke="rgba(255,255,255,0.045)" strokeWidth="1" />

          {/* Right vine */}
          <path d="M260 860 C240 740 225 600 218 480 C212 380 214 300 225 180" stroke="rgba(255,255,255,0.14)" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M218 480 C195 455 170 445 145 452" stroke="rgba(255,255,255,0.10)" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M222 330 C238 310 250 280 256 252" stroke="rgba(255,255,255,0.08)" strokeWidth="1.1" strokeLinecap="round" />

          {/* Left vine */}
          <path d="M0 860 C20 750 38 630 48 520 C55 430 56 350 50 280" stroke="rgba(255,255,255,0.10)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M48 520 C65 500 82 490 100 495" stroke="rgba(255,255,255,0.08)" strokeWidth="1.1" strokeLinecap="round" />

          {/* Right vine leaves */}
          <g transform="translate(210,420) rotate(-55)">
            <path d="M0,-16 C7,-10 7,10 0,16 C-7,10 -7,-10 0,-16 Z" fill="rgba(140,200,168,0.38)" stroke="rgba(255,255,255,0.18)" strokeWidth="0.6" />
            <line x1="0" y1="-12" x2="0" y2="12" stroke="rgba(255,255,255,0.14)" strokeWidth="0.5" />
          </g>
          <g transform="translate(235,290) rotate(-65)">
            <path d="M0,-13 C6,-7 6,7 0,13 C-6,7 -6,-7 0,-13 Z" fill="rgba(140,200,168,0.32)" stroke="rgba(255,255,255,0.14)" strokeWidth="0.6" />
          </g>
          <g transform="translate(150,462) rotate(-18)">
            <path d="M0,-12 C5,-7 5,7 0,12 C-5,7 -5,-7 0,-12 Z" fill="rgba(140,200,168,0.28)" stroke="rgba(255,255,255,0.10)" strokeWidth="0.5" />
          </g>
          <g transform="translate(240,560) rotate(-42)">
            <path d="M0,-14 C6,-8 6,8 0,14 C-6,8 -6,-8 0,-14 Z" fill="rgba(140,200,168,0.34)" stroke="rgba(255,255,255,0.16)" strokeWidth="0.6" />
            <line x1="0" y1="-10" x2="0" y2="10" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
          </g>

          {/* Left vine leaves */}
          <g transform="translate(40,470) rotate(30)">
            <path d="M0,-14 C6,-8 6,8 0,14 C-6,8 -6,-8 0,-14 Z" fill="rgba(140,200,168,0.34)" stroke="rgba(255,255,255,0.16)" strokeWidth="0.6" />
            <line x1="0" y1="-10" x2="0" y2="10" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
          </g>
          <g transform="translate(55,370) rotate(45)">
            <path d="M0,-12 C5,-7 5,7 0,12 C-5,7 -5,-7 0,-12 Z" fill="rgba(140,200,168,0.28)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
          </g>
          <g transform="translate(95,505) rotate(12)">
            <path d="M0,-10 C4,-6 4,6 0,10 C-4,6 -4,-6 0,-10 Z" fill="rgba(140,200,168,0.24)" stroke="rgba(255,255,255,0.10)" strokeWidth="0.5" />
          </g>

          {/* ── Flowers ── */}

          {/* Hero bloom */}
          <g transform="translate(225,185)">
            <ellipse cx="0" cy="-10" rx="7" ry="10" fill="rgba(242,175,200,0.58)" stroke="rgba(255,255,255,0.26)" strokeWidth="0.6" />
            <ellipse cx="0" cy="10" rx="7" ry="10" fill="rgba(242,175,200,0.58)" stroke="rgba(255,255,255,0.26)" strokeWidth="0.6" />
            <ellipse cx="-10" cy="0" rx="10" ry="7" fill="rgba(242,175,200,0.55)" stroke="rgba(255,255,255,0.24)" strokeWidth="0.6" />
            <ellipse cx="10" cy="0" rx="10" ry="7" fill="rgba(242,175,200,0.55)" stroke="rgba(255,255,255,0.24)" strokeWidth="0.6" />
            <ellipse cx="-7" cy="-7" rx="6" ry="8" fill="rgba(242,175,200,0.40)" transform="rotate(45 -7 -7)" />
            <ellipse cx="7" cy="-7" rx="6" ry="8" fill="rgba(242,175,200,0.40)" transform="rotate(-45 7 -7)" />
            <circle cx="0" cy="0" r="4.5" fill="rgba(232,195,100,0.70)" stroke="rgba(255,255,255,0.30)" strokeWidth="0.5" />
            <circle cx="-1" cy="-1" r="0.8" fill="rgba(255,255,255,0.35)" />
          </g>

          {/* Left bloom */}
          <g transform="translate(55,330)">
            <ellipse cx="0" cy="-8" rx="5.5" ry="8" fill="rgba(242,175,200,0.50)" stroke="rgba(255,255,255,0.22)" strokeWidth="0.6" />
            <ellipse cx="0" cy="8" rx="5.5" ry="8" fill="rgba(242,175,200,0.50)" stroke="rgba(255,255,255,0.22)" strokeWidth="0.6" />
            <ellipse cx="-8" cy="0" rx="8" ry="5.5" fill="rgba(242,175,200,0.48)" stroke="rgba(255,255,255,0.20)" strokeWidth="0.6" />
            <ellipse cx="8" cy="0" rx="8" ry="5.5" fill="rgba(242,175,200,0.48)" stroke="rgba(255,255,255,0.20)" strokeWidth="0.6" />
            <circle cx="0" cy="0" r="3.5" fill="rgba(232,195,100,0.58)" stroke="rgba(255,255,255,0.24)" strokeWidth="0.5" />
          </g>

          {/* Small bloom */}
          <g transform="translate(180,600)">
            <ellipse cx="0" cy="-6" rx="4.5" ry="6" fill="rgba(242,175,200,0.42)" stroke="rgba(255,255,255,0.18)" strokeWidth="0.5" />
            <ellipse cx="0" cy="6" rx="4.5" ry="6" fill="rgba(242,175,200,0.42)" stroke="rgba(255,255,255,0.18)" strokeWidth="0.5" />
            <ellipse cx="-6" cy="0" rx="6" ry="4.5" fill="rgba(242,175,200,0.40)" stroke="rgba(255,255,255,0.16)" strokeWidth="0.5" />
            <ellipse cx="6" cy="0" rx="6" ry="4.5" fill="rgba(242,175,200,0.40)" stroke="rgba(255,255,255,0.16)" strokeWidth="0.5" />
            <circle cx="0" cy="0" r="2.5" fill="rgba(232,195,100,0.48)" />
          </g>

          {/* Tiny bloom left */}
          <g transform="translate(35,560)">
            <ellipse cx="0" cy="-5" rx="3.5" ry="5" fill="rgba(242,175,200,0.38)" />
            <ellipse cx="0" cy="5" rx="3.5" ry="5" fill="rgba(242,175,200,0.38)" />
            <ellipse cx="-5" cy="0" rx="5" ry="3.5" fill="rgba(242,175,200,0.35)" />
            <ellipse cx="5" cy="0" rx="5" ry="3.5" fill="rgba(242,175,200,0.35)" />
            <circle cx="0" cy="0" r="2" fill="rgba(232,195,100,0.40)" />
          </g>

          {/* ── Butterfly ── */}
          <g transform="translate(120,240) rotate(-15)">
            <path d="M0,0 C-6,-10 -14,-8 -10,0 C-14,8 -6,10 0,0" fill="rgba(242,180,210,0.45)" stroke="rgba(255,255,255,0.20)" strokeWidth="0.5" />
            <path d="M0,0 C6,-10 14,-8 10,0 C14,8 6,10 0,0" fill="rgba(235,165,195,0.40)" stroke="rgba(255,255,255,0.16)" strokeWidth="0.5" />
            <line x1="0" y1="-4" x2="0" y2="4" stroke="rgba(200,150,170,0.45)" strokeWidth="0.8" />
            <path d="M0,-4 C-2,-8 -3,-9 -4,-8" stroke="rgba(200,150,170,0.30)" strokeWidth="0.4" fill="none" />
            <path d="M0,-4 C2,-8 3,-9 4,-8" stroke="rgba(200,150,170,0.30)" strokeWidth="0.4" fill="none" />
          </g>

          {/* ── Ladybug on a leaf ── */}
          <g transform="translate(215,410) rotate(25)">
            <ellipse cx="0" cy="0" rx="4.5" ry="5.5" fill="rgba(210,90,85,0.50)" stroke="rgba(170,65,65,0.25)" strokeWidth="0.5" />
            <line x1="0" y1="-5.5" x2="0" y2="5.5" stroke="rgba(40,25,25,0.25)" strokeWidth="0.5" />
            <circle cx="-1.5" cy="-1.5" r="0.8" fill="rgba(40,25,25,0.22)" />
            <circle cx="1.5" cy="0" r="0.7" fill="rgba(40,25,25,0.20)" />
            <circle cx="-1" cy="2.5" r="0.6" fill="rgba(40,25,25,0.18)" />
            <circle cx="0" cy="-6.8" r="2" fill="rgba(40,25,25,0.25)" />
          </g>

          {/* ── Dragonfly ── */}
          <g transform="translate(90,155) rotate(-20)">
            <line x1="0" y1="-8" x2="0" y2="8" stroke="rgba(100,175,140,0.38)" strokeWidth="1" strokeLinecap="round" />
            <ellipse cx="-6" cy="-2" rx="6.5" ry="2" fill="rgba(195,225,215,0.28)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.4" transform="rotate(-10 -6 -2)" />
            <ellipse cx="6" cy="-2" rx="6.5" ry="2" fill="rgba(195,225,215,0.28)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.4" transform="rotate(10 6 -2)" />
            <ellipse cx="-5" cy="2.5" rx="5" ry="1.5" fill="rgba(195,225,215,0.22)" />
            <ellipse cx="5" cy="2.5" rx="5" ry="1.5" fill="rgba(195,225,215,0.22)" />
            <circle cx="0" cy="-9.5" r="1.8" fill="rgba(100,175,140,0.35)" />
          </g>

          {/* ── Birds ── */}
          <path d="M150 65 C160 52 172 52 182 65" stroke="rgba(255,255,255,0.32)" strokeWidth="1.4" strokeLinecap="round" fill="none" />
          <path d="M195 45 C202 36 212 36 219 45" stroke="rgba(255,255,255,0.24)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          <path d="M60 85 C65 78 73 78 78 85" stroke="rgba(255,255,255,0.18)" strokeWidth="1" strokeLinecap="round" fill="none" />

          {/* ── Floating petals ── */}
          <ellipse cx="100" cy="140" rx="3" ry="5" fill="rgba(242,175,200,0.35)" transform="rotate(30 100 140)" />
          <ellipse cx="180" cy="310" rx="2.5" ry="4.5" fill="rgba(242,175,200,0.28)" transform="rotate(-25 180 310)" />
          <ellipse cx="80" cy="450" rx="2" ry="4" fill="rgba(242,175,200,0.25)" transform="rotate(45 80 450)" />
          <ellipse cx="200" cy="500" rx="2" ry="3.5" fill="rgba(242,175,200,0.22)" transform="rotate(-15 200 500)" />
          <ellipse cx="120" cy="650" rx="2.5" ry="4" fill="rgba(242,175,200,0.20)" transform="rotate(35 120 650)" />

          {/* ── Pollen ── */}
          <circle cx="140" cy="200" r="1.8" fill="rgba(255,255,255,0.12)" />
          <circle cx="90" cy="380" r="1.5" fill="rgba(242,175,200,0.20)" />
          <circle cx="200" cy="440" r="1.3" fill="rgba(255,255,255,0.10)" />
          <circle cx="60" cy="600" r="1.4" fill="rgba(242,175,200,0.16)" />
          <circle cx="170" cy="700" r="1.2" fill="rgba(168,213,186,0.16)" />

          {/* ── Meadow at bottom ── */}
          <path d="M0 820 Q50 808 130 815 Q210 822 260 810 L260 900 L0 900 Z" fill="rgba(20,55,35,0.20)" />
          <path d="M0 840 Q70 832 150 838 Q220 844 260 835 L260 900 L0 900 Z" fill="rgba(25,60,38,0.14)" />
          <path d="M20 900 Q24 870 18 845" stroke="rgba(140,200,168,0.22)" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M45 900 Q42 875 48 848" stroke="rgba(140,200,168,0.18)" strokeWidth="1" strokeLinecap="round" />
          <path d="M110 900 Q114 878 108 855" stroke="rgba(140,200,168,0.16)" strokeWidth="0.9" strokeLinecap="round" />
          <path d="M200 900 Q204 876 198 850" stroke="rgba(140,200,168,0.20)" strokeWidth="1.1" strokeLinecap="round" />
          <path d="M240 900 Q237 878 243 852" stroke="rgba(140,200,168,0.14)" strokeWidth="0.9" strokeLinecap="round" />

          {/* Meadow flowers */}
          <g transform="translate(75,828)">
            <ellipse cx="0" cy="-3.5" rx="2.5" ry="3.5" fill="rgba(242,175,200,0.32)" />
            <ellipse cx="0" cy="3.5" rx="2.5" ry="3.5" fill="rgba(242,175,200,0.32)" />
            <ellipse cx="-3.5" cy="0" rx="3.5" ry="2.5" fill="rgba(242,175,200,0.30)" />
            <ellipse cx="3.5" cy="0" rx="3.5" ry="2.5" fill="rgba(242,175,200,0.30)" />
            <circle cx="0" cy="0" r="1.5" fill="rgba(232,195,100,0.38)" />
          </g>
          <g transform="translate(170,822)">
            <ellipse cx="0" cy="-3" rx="2" ry="3" fill="rgba(242,175,200,0.28)" />
            <ellipse cx="0" cy="3" rx="2" ry="3" fill="rgba(242,175,200,0.28)" />
            <ellipse cx="-3" cy="0" rx="3" ry="2" fill="rgba(242,175,200,0.25)" />
            <ellipse cx="3" cy="0" rx="3" ry="2" fill="rgba(242,175,200,0.25)" />
            <circle cx="0" cy="0" r="1.2" fill="rgba(232,195,100,0.32)" />
          </g>
        </svg>
      </div>

      {/* Dark overlay for text readability */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "linear-gradient(180deg, rgba(10,25,18,0.08) 0%, rgba(10,25,18,0.12) 60%, rgba(10,25,18,0.18) 100%)",
        }}
      />

      {/* ── Content ── */}

      {/* Logo */}
      <div className="relative z-10 flex items-center gap-2.5 px-4 pt-5 pb-4">
        <img
          src="/mysafeplace-logo.png"
          alt="MySafePlace"
          className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
          style={{
            boxShadow: "0 2px 8px rgba(0,0,0,0.25), 0 0 0 1.5px rgba(255,255,255,0.18)",
          }}
        />
        <span className="text-[13px] font-bold tracking-tight text-white leading-tight">
          MySafePlace
        </span>
      </div>

      {/* Nav links */}
      <nav className="relative z-10 flex-1 space-y-1.5 px-2.5">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-semibold transition-all cursor-pointer"
              style={{
                backgroundColor: active ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.95)",
                textShadow: "0 1px 2px rgba(0,0,0,0.15)",
                border: active ? "1px solid rgba(255,255,255,0.25)" : "1px solid rgba(255,255,255,0.08)",
                boxShadow: active ? "0 2px 8px rgba(0,0,0,0.10)" : "none",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.16)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
                  e.currentTarget.style.transform = "translateX(4px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.transform = "translateX(0)";
                }
              }}
            >
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md" style={{ backgroundColor: active ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.12)" }}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}

        {/* Admin link — only visible to admin users */}
        {showAdmin && (
          <>
            <div className="mx-3 my-2" style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }} />
            <Link
              href="/admin"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-semibold transition-all cursor-pointer"
              style={{
                backgroundColor: pathname.startsWith("/admin") ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.95)",
                textShadow: "0 1px 2px rgba(0,0,0,0.15)",
                border: pathname.startsWith("/admin") ? "1px solid rgba(255,255,255,0.25)" : "1px solid rgba(255,255,255,0.08)",
                boxShadow: pathname.startsWith("/admin") ? "0 2px 8px rgba(0,0,0,0.10)" : "none",
              }}
              onMouseEnter={(e) => {
                if (!pathname.startsWith("/admin")) {
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.16)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
                  e.currentTarget.style.transform = "translateX(4px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!pathname.startsWith("/admin")) {
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.transform = "translateX(0)";
                }
              }}
            >
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md" style={{ backgroundColor: pathname.startsWith("/admin") ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.12)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </span>
              Admin Panel
            </Link>
          </>
        )}
      </nav>

      {/* Bottom section */}
      <div className="relative z-10 border-t px-5 py-4" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
        <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.50)" }}>
          Your safe space
        </p>
      </div>
    </aside>
  );
}

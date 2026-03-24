"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    label: "Home",
    href: "/dashboard",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    label: "Mood Tracking",
    href: "/dashboard/mood",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5Z" />
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      </svg>
    ),
  },
  {
    label: "Resource Library",
    href: "/dashboard/resources",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    label: "Emergency Contacts",
    href: "/dashboard/emergency",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    ),
  },
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M20 21a8 8 0 0 0-16 0" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <aside
      className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col border-r"
      style={{
        backgroundColor: "#FAFCFB",
        borderColor: "rgba(200,230,208,0.5)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 pt-7 pb-6">
        <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
          <ellipse cx="10" cy="6" rx="3" ry="4" fill="#F2C4CE" opacity="0.7" />
          <ellipse cx="10" cy="14" rx="3" ry="4" fill="#F2C4CE" opacity="0.7" />
          <ellipse cx="6" cy="10" rx="4" ry="3" fill="#F2C4CE" opacity="0.65" />
          <ellipse cx="14" cy="10" rx="4" ry="3" fill="#F2C4CE" opacity="0.65" />
          <circle cx="10" cy="10" r="2.5" fill="#E8CA7A" opacity="0.8" />
        </svg>
        <span className="text-[15px] font-bold tracking-tight" style={{ color: "#1A3D2B" }}>
          mysafeplace
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all"
              style={{
                backgroundColor: active ? "rgba(125,184,146,0.12)" : "transparent",
                color: active ? "#1A3D2B" : "#6B9E85",
              }}
            >
              <span style={{ color: active ? "#4A9474" : "#8DBFA5" }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t px-5 py-4" style={{ borderColor: "rgba(200,230,208,0.4)" }}>
        <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "#A8C4B4" }}>
          Your safe space
        </p>
      </div>
    </aside>
  );
}

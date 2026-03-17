"use client";

import Link from "next/link";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import { useAuth } from "@/src/context/AuthContext";

const navCards = [
  {
    label: "Journal",
    icon: "📓",
    description: "Write your thoughts",
    href: "/journal",
  },
  {
    label: "Mood Tracker",
    icon: "🌿",
    description: "Track how you feel",
    href: "/mood",
  },
  {
    label: "Resources",
    icon: "📚",
    description: "Find helpful guides",
    href: "/resources",
  },
  {
    label: "Videos",
    icon: "🎬",
    description: "Watch calming content",
    href: "/videos",
  },
  {
    label: "Emergency Contacts",
    icon: "🫂",
    description: "People who care",
    href: "/emergency",
  },
  {
    label: "Profile",
    icon: "🌱",
    description: "Your account settings",
    href: "/profile",
  },
];

function DashboardContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#E6F4EA" }}>
      {/* Header */}
      <header
        className="px-6 py-8 text-center"
        style={{ backgroundColor: "#A8D5BA" }}
      >
        <h1 className="text-3xl font-semibold tracking-tight" style={{ color: "#2D6A4F" }}>
          My Safe Place
        </h1>
        <p className="mt-2 text-sm" style={{ color: "#3D8B6E" }}>
          {user?.email ? `Welcome, ${user.email}` : "Welcome"}
        </p>
      </header>

      {/* Nav Cards */}
      <main className="mx-auto max-w-2xl px-4 py-10">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {navCards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="flex flex-col items-center gap-2 rounded-2xl p-6 text-center shadow-sm transition-transform hover:scale-105 hover:shadow-md"
              style={{ backgroundColor: "#ffffff", border: "1px solid #C8E6C9" }}
            >
              <span className="text-3xl">{card.icon}</span>
              <span className="text-sm font-semibold" style={{ color: "#2D6A4F" }}>
                {card.label}
              </span>
              <span className="text-xs" style={{ color: "#6BAF8E" }}>
                {card.description}
              </span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return <DashboardContent />;
}

"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getAllResources } from "@/src/services/adminResourceService";

export default function AdminPage() {
  const [totalResources, setTotalResources] = useState(0);
  const [featuredCount, setFeaturedCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      const resources = await getAllResources();
      setTotalResources(resources.length);
      setFeaturedCount(resources.filter((r) => r.featured).length);
      setCategoryCount(new Set(resources.map((r) => r.category).filter(Boolean)).size);
    } catch (err) {
      console.error("Failed to load stats:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const stats = [
    {
      label: "Total Resources",
      value: totalResources,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4E9B78" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      ),
      bg: "rgba(184,216,196,0.20)",
    },
    {
      label: "Featured",
      value: featuredCount,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D4A017" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
      bg: "rgba(232,202,122,0.15)",
    },
    {
      label: "Categories",
      value: categoryCount,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A8607A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect width="7" height="7" x="3" y="3" rx="1" />
          <rect width="7" height="7" x="14" y="3" rx="1" />
          <rect width="7" height="7" x="14" y="14" rx="1" />
          <rect width="7" height="7" x="3" y="14" rx="1" />
        </svg>
      ),
      bg: "rgba(242,196,206,0.15)",
    },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Header */}
      <header className="relative z-10 mx-auto max-w-5xl px-6 pt-8 pb-2">
        <Link
          href="/dashboard"
          className="mb-5 inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium transition-all"
          style={{
            color: "#6B9E85",
            backgroundColor: "rgba(255,255,255,0.7)",
            border: "1px solid rgba(200,230,208,0.5)",
            backdropFilter: "blur(8px)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Dashboard
        </Link>

        <div
          className="animate-fade-in-up rounded-2xl px-7 py-6"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.55) 100%)",
            border: "1px solid rgba(200,230,208,0.45)",
            boxShadow: "0 8px 32px rgba(45,106,79,0.06), 0 2px 8px rgba(45,106,79,0.03)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="flex items-center gap-3.5">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl"
              style={{
                background: "linear-gradient(135deg, rgba(184,216,196,0.35) 0%, rgba(200,230,208,0.25) 100%)",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4E9B78" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight" style={{ color: "#1A3D2B" }}>
                Admin Panel
              </h1>
              <p className="mt-0.5 text-sm" style={{ color: "#6B9E85" }}>
                Manage your resource library
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 py-6">
        {/* Stats */}
        <div className="animate-fade-in-up-1 mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl px-5 py-5"
              style={{
                background: "linear-gradient(145deg, #FFFFFF 0%, #F8FCF9 100%)",
                border: "1px solid rgba(200,230,208,0.4)",
                boxShadow: "0 2px 8px rgba(45,106,79,0.04)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: stat.bg }}
                >
                  {stat.icon}
                </div>
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: "#8DBFA5" }}>
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold" style={{ color: "#1A3D2B" }}>
                    {loading ? "\u2014" : stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="animate-fade-in-up-2">
          <h2 className="mb-4 text-[14px] font-bold uppercase tracking-wider" style={{ color: "#8DBFA5" }}>
            Quick Actions
          </h2>

          <Link
            href="/admin/resources"
            className="group block rounded-2xl px-6 py-5 transition-all"
            style={{
              background: "linear-gradient(145deg, #FFFFFF 0%, #F2FAF5 100%)",
              border: "1px solid rgba(200,230,208,0.4)",
              boxShadow: "0 2px 8px rgba(45,106,79,0.04)",
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, rgba(94,168,138,0.15) 0%, rgba(74,152,116,0.10) 100%)",
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4E9B78" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-[15px] font-bold" style={{ color: "#1A3D2B" }}>
                    Manage Resources
                  </h3>
                  <p className="mt-0.5 text-[13px]" style={{ color: "#6B9E85" }}>
                    Add, edit, delete, and organize your resource library
                  </p>
                </div>
              </div>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#A8D5BA"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform group-hover:translate-x-1"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-14 text-center">
          <div className="mx-auto mb-3 flex items-center justify-center gap-3">
            <div className="h-px w-10" style={{ backgroundColor: "rgba(200,230,208,0.5)" }} />
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8E6D0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <div className="h-px w-10" style={{ backgroundColor: "rgba(200,230,208,0.5)" }} />
          </div>
          <p className="text-[11px]" style={{ color: "#A8C4B4" }}>
            Admin access is restricted to authorized users.
          </p>
        </div>
      </div>
    </div>
  );
}

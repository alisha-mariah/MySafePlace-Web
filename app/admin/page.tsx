"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getAllResources } from "@/src/services/adminResourceService";

export default function AdminPage() {
  const [totalResources, setTotalResources] = useState(0);
  const [featuredCount, setFeaturedCount] = useState(0);
  const [hiddenCount, setHiddenCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      const resources = await getAllResources();
      setTotalResources(resources.length);
      setFeaturedCount(resources.filter((r) => r.featured).length);
      setHiddenCount(resources.filter((r) => r.hidden).length);
      setCategoryCount(new Set(resources.map((r) => r.category).filter(Boolean)).size);
    } catch (err) {
      console.error("Failed to load stats:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadStats(); }, [loadStats]);

  const stats = [
    {
      label: "Total Resources", sub: "Visible in app", value: totalResources, bg: "rgba(184,216,196,0.20)",
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4E9B78" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>,
    },
    {
      label: "Featured", sub: "Highlighted to users", value: featuredCount, bg: "rgba(232,202,122,0.15)",
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D4A017" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
    },
    {
      label: "Hidden", sub: "Currently hidden", value: hiddenCount, bg: "rgba(180,180,180,0.12)",
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>,
    },
    {
      label: "Categories", sub: "Organized groups", value: categoryCount, bg: "rgba(242,196,206,0.15)",
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A8607A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>,
    },
  ];

  const actions = [
    {
      href: "/admin/resources", title: "Manage Resources",
      desc: "Add, edit, delete, and organize your resource library",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4E9B78" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>,
    },
    {
      href: "/admin/categories", title: "Manage Categories",
      desc: "Create and organize categories and subcategories",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4E9B78" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>,
    },
    {
      href: "/admin/crisis-contacts", title: "Crisis Contacts",
      desc: "Manage crisis hotlines shown on the emergency page",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C07080" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>,
    },
  ];

  return (
    <div className="relative min-h-screen">
      <header className="relative z-10 mx-auto max-w-5xl px-6 pt-8 pb-2">
        <Link href="/dashboard" className="pill-btn mb-5 inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium" style={{ color: "#6B9E85", backgroundColor: "rgba(255,255,255,0.7)", border: "1px solid rgba(200,230,208,0.5)", backdropFilter: "blur(8px)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          Homepage
        </Link>
        <div className="animate-fade-in-up rounded-2xl px-7 py-6" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.55) 100%)", border: "1px solid rgba(200,230,208,0.45)", boxShadow: "0 8px 32px rgba(45,106,79,0.06), 0 2px 8px rgba(45,106,79,0.03)", backdropFilter: "blur(12px)" }}>
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: "linear-gradient(135deg, rgba(184,216,196,0.35) 0%, rgba(200,230,208,0.25) 100%)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4E9B78" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight" style={{ color: "#1A3D2B" }}>Admin Panel</h1>
              <p className="mt-0.5 text-sm" style={{ color: "#6B9E85" }}>Manage resources, categories, and crisis contacts</p>
            </div>
          </div>
          <p className="mt-4 text-[13px] leading-relaxed" style={{ color: "#8DBFA5" }}>
            Your central hub for managing MySafePlace. View stats at a glance, then use the quick actions below to manage your resource library, organize categories, or update the crisis contacts shown to all users.
          </p>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-6">

        {/* Stats */}
        <div className="animate-fade-in-up-1 mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl px-4 py-4 transition-all duration-200 hover:shadow-md sm:px-5 sm:py-5"
              style={{ background: "linear-gradient(145deg, #FFFFFF 0%, #F8FCF9 100%)", border: "1px solid rgba(200,230,208,0.4)", boxShadow: "0 2px 8px rgba(45,106,79,0.04)" }}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl sm:h-10 sm:w-10" style={{ backgroundColor: s.bg }}>{s.icon}</div>
              <p className="mt-3 text-2xl font-bold leading-none" style={{ color: "#1A3D2B" }}>{loading ? "\u2014" : s.value}</p>
              <p className="mt-1 text-[11px] font-semibold" style={{ color: "#8DBFA5" }}>{s.label}</p>
              <p className="mt-0.5 text-[10px]" style={{ color: "#A8C4B4" }}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="animate-fade-in-up-2">
          <h2 className="mb-5 text-[13px] font-bold uppercase tracking-wider" style={{ color: "#8DBFA5" }}>Quick Actions</h2>
          <div className="space-y-3">
            {actions.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="group block cursor-pointer rounded-2xl px-6 py-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                style={{ background: "linear-gradient(145deg, #FFFFFF 0%, #F2FAF5 100%)", border: "1px solid rgba(200,230,208,0.4)", boxShadow: "0 2px 8px rgba(45,106,79,0.04)" }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105" style={{ background: "linear-gradient(135deg, rgba(94,168,138,0.15) 0%, rgba(74,152,116,0.10) 100%)" }}>
                      {a.icon}
                    </div>
                    <div>
                      <h3 className="text-[15px] font-bold" style={{ color: "#1A3D2B" }}>{a.title}</h3>
                      <p className="mt-0.5 text-[13px]" style={{ color: "#6B9E85" }}>{a.desc}</p>
                    </div>
                  </div>
                  <div
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-all duration-200 group-hover:translate-x-1"
                    style={{ backgroundColor: "rgba(200,230,208,0.15)" }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B9E85" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-14 text-center">
          <div className="mx-auto mb-3 flex items-center justify-center gap-3">
            <div className="h-px w-10" style={{ backgroundColor: "rgba(200,230,208,0.5)" }} />
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8E6D0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            <div className="h-px w-10" style={{ backgroundColor: "rgba(200,230,208,0.5)" }} />
          </div>
          <p className="text-[11px]" style={{ color: "#A8C4B4" }}>Admin access is restricted to authorized users.</p>
        </div>
      </div>
    </div>
  );
}

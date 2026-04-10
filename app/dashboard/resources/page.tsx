"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getResources, getYouTubeId, Resource } from "@/src/services/resourceService";


/* ── Category filter pills ── */

function CategoryPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-full px-4 py-2 text-[13px] font-semibold transition-all"
      style={{
        backgroundColor: active ? "rgba(82,171,132,0.15)" : "rgba(255,255,255,0.7)",
        border: `1.5px solid ${active ? "#52AB84" : "rgba(200,230,208,0.5)"}`,
        color: active ? "#1A3D2B" : "#6B9E85",
        backdropFilter: "blur(8px)",
      }}
    >
      {label}
    </button>
  );
}

/* ── Video card ── */

function ResourceCard({ resource }: { resource: Resource }) {
  const [playing, setPlaying] = useState(false);
  const videoId = getYouTubeId(resource.url);
  const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;

  return (
    <div
      className="nature-card group overflow-hidden rounded-2xl"
      style={{
        background: "linear-gradient(145deg, #FFFFFF 0%, #F2FAF5 100%)",
        border: "1px solid #D4EDDC",
        boxShadow: "0 2px 8px rgba(45,106,79,0.07)",
      }}
    >
      {/* Video / Thumbnail area */}
      <div className="relative aspect-video w-full overflow-hidden bg-black/5">
        {playing && videoId ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
            loading="lazy"
          />
        ) : thumbnail ? (
          <button
            onClick={() => setPlaying(true)}
            className="group/play relative block h-full w-full"
            aria-label={`Play ${resource.title}`}
          >
            <img
              src={thumbnail}
              alt={resource.title}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-300 group-hover/play:scale-105"
            />
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors group-hover/play:bg-black/20">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full transition-transform group-hover/play:scale-110"
                style={{
                  background: "rgba(255,255,255,0.92)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#2D6A4F">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </button>
        ) : (
          <div className="flex h-full w-full items-center justify-center" style={{ backgroundColor: "rgba(200,230,208,0.2)" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#A8D5BA" strokeWidth="1.5" strokeLinecap="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M10 9l5 3-5 3V9z" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5">
        {/* Tags */}
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          <span
            className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
            style={{ backgroundColor: "rgba(168,213,186,0.20)", color: "#3D8B6E" }}
          >
            {resource.category}
          </span>
          {resource.type && (
            <span
              className="inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
              style={{ backgroundColor: "rgba(242,196,206,0.20)", color: "#A8607A" }}
            >
              {resource.type}
            </span>
          )}
        </div>

        <h3 className="mt-1 text-[15px] font-bold leading-snug" style={{ color: "#1A3D2B" }}>
          {resource.title}
        </h3>

        {resource.description && (
          <p className="mt-1.5 text-[13px] leading-relaxed" style={{ color: "#6B9E85" }}>
            {resource.description}
          </p>
        )}
      </div>
    </div>
  );
}

/* ── Page content ── */

function ResourcesContent() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const fetchResources = useCallback(async () => {
    try {
      const data = await getResources();
      setResources(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch resources:", err);
      setError("Could not load resources.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchResources(); }, [fetchResources]);

  const categories = ["All", ...Array.from(new Set(resources.map((r) => r.category).filter(Boolean)))];
  const filtered = activeCategory === "All" ? resources : resources.filter((r) => r.category === activeCategory);
  const featuredResources = filtered.filter((r) => r.featured);

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
              style={{ background: "linear-gradient(135deg, rgba(184,216,196,0.35) 0%, rgba(200,230,208,0.25) 100%)" }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4E9B78" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight" style={{ color: "#1A3D2B" }}>
                Resource Library
              </h1>
              <p className="mt-0.5 text-sm" style={{ color: "#6B9E85" }}>
                Helpful videos and guides for your wellbeing
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 py-6">
        {/* Category filters */}
        {categories.length > 1 && (
          <div className="animate-fade-in-up-1 mb-6 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <CategoryPill
                key={cat}
                label={cat}
                active={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
              />
            ))}
          </div>
        )}

        {/* Featured Resources */}
        {!loading && featuredResources.length > 0 && (
          <div
            className="animate-fade-in-up-1 mb-8 rounded-2xl p-5"
            style={{
              background: "linear-gradient(135deg, rgba(252,250,242,0.9) 0%, rgba(255,253,248,0.85) 50%, rgba(252,248,244,0.9) 100%)",
              border: "1px solid rgba(232,202,122,0.22)",
              boxShadow: "0 2px 12px rgba(232,202,122,0.06)",
            }}
          >
            <div className="mb-4 flex items-center gap-3">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ background: "rgba(232,202,122,0.18)" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#D4A017" stroke="none">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <div>
                <span className="text-[14px] font-bold" style={{ color: "#1A3D2B" }}>
                  Featured Resources
                </span>
                <p className="text-[11px]" style={{ color: "#B8941A" }}>
                  Handpicked for your wellbeing
                </p>
              </div>
              <span
                className="ml-auto rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
                style={{ backgroundColor: "rgba(232,202,122,0.15)", color: "#B8941A" }}
              >
                {featuredResources.length}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredResources.map((resource) => (
                <div key={resource.id} className="relative">
                  {/* Gold star badge */}
                  <div
                    className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full"
                    style={{
                      background: "linear-gradient(135deg, #F0D060 0%, #E8CA7A 100%)",
                      boxShadow: "0 2px 8px rgba(212,160,23,0.30)",
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="white" stroke="none">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                  <ResourceCard resource={resource} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: "rgba(254,242,242,0.8)", color: "#DC3545", border: "1px solid #FECACA" }}>
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center py-20">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="nature-float">
              <path d="M6 3 C10 7 12 13 10 19 C8 19 2 17 1 13 C-1 9 2 5 6 3 Z" fill="#7DB892" opacity="0.6" />
              <path d="M6 3 C5 9 5 15 10 19" stroke="#5EA88A" strokeWidth="0.8" fill="none" opacity="0.4" />
            </svg>
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="animate-fade-in-up-2 rounded-2xl border border-dashed py-16 text-center"
            style={{ borderColor: "rgba(200,230,208,0.5)", background: "rgba(255,255,255,0.4)" }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#A8D5BA" strokeWidth="1.5" strokeLinecap="round" className="mx-auto mb-3">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M10 9l5 3-5 3V9z" />
            </svg>
            <p className="text-sm" style={{ color: "#8DBFA5" }}>
              {activeCategory === "All" ? "No resources yet." : `No resources in "${activeCategory}".`}
            </p>
          </div>
        ) : (
          /* Resources grouped by subcategory */
          <div className="animate-fade-in-up-2 space-y-8">
            {(() => {
              // Group filtered resources by subcategory
              const groups: { label: string; items: Resource[] }[] = [];
              const seen = new Set<string>();
              for (const r of filtered) {
                const key = r.subcategory || "General";
                if (!seen.has(key)) {
                  seen.add(key);
                  groups.push({ label: key, items: filtered.filter((x) => (x.subcategory || "General") === key) });
                }
              }
              return groups.map((group) => (
                <div
                  key={group.label}
                  className="rounded-2xl border p-5"
                  style={{
                    backgroundColor: "white",
                    borderColor: "rgba(200,230,208,0.5)",
                    boxShadow: "0 1px 4px rgba(45,106,79,0.04)",
                  }}
                >
                  <div className="mb-4 flex items-center gap-3">
                    <span className="text-[14px] font-bold" style={{ color: "#1A3D2B" }}>{group.label}</span>
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: "rgba(200,230,208,0.3)", color: "#6B9E85" }}>
                      {group.items.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {group.items.map((resource) => (
                      <ResourceCard key={resource.id} resource={resource} />
                    ))}
                  </div>
                </div>
              ));
            })()}
          </div>
        )}

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
          <p className="text-[11px]" style={{ color: "#A8C4B4" }}>Knowledge is a gentle kind of power.</p>
        </div>
      </div>
    </div>
  );
}

export default function ResourcesPage() {
  return <ResourcesContent />;
}

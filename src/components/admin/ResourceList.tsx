"use client";

import { AdminResource } from "@/src/services/adminResourceService";

interface ResourceListProps {
  resources: AdminResource[];
  onEdit: (resource: AdminResource) => void;
  onDelete: (resource: AdminResource) => void;
  onToggleFeatured: (resource: AdminResource) => void;
  onToggleHidden: (resource: AdminResource) => void;
  emptyMessage?: string;
}

function formatTimestamp(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

export default function ResourceList({
  resources,
  onEdit,
  onDelete,
  onToggleFeatured,
  onToggleHidden,
  emptyMessage = "No resources yet. Add your first resource to get started.",
}: ResourceListProps) {
  if (resources.length === 0) {
    return (
      <div
        className="animate-fade-in-up-2 rounded-2xl border border-dashed py-16 text-center"
        style={{ borderColor: "rgba(200,230,208,0.5)", background: "rgba(255,255,255,0.4)" }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#A8D5BA" strokeWidth="1.5" strokeLinecap="round" className="mx-auto mb-3">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M10 9l5 3-5 3V9z" />
        </svg>
        <p className="text-sm" style={{ color: "#8DBFA5" }}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {resources.map((resource, index) => (
        <div
          key={resource.id}
          className="group flex items-start gap-4 rounded-xl px-5 py-4 transition-all"
          style={{
            background: resource.hidden
              ? "linear-gradient(145deg, #FEFEFE 0%, #F9F9F9 100%)"
              : "linear-gradient(145deg, #FFFFFF 0%, #F8FCF9 100%)",
            border: `1px solid ${resource.hidden ? "rgba(200,200,200,0.4)" : "rgba(200,230,208,0.4)"}`,
            boxShadow: "0 1px 3px rgba(45,106,79,0.04)",
            opacity: resource.hidden ? 0.7 : 1,
            animation: `fadeInUp 0.3s ease-out ${index * 0.03}s both`,
          }}
        >
          {/* Toggle buttons */}
          <div className="flex flex-shrink-0 flex-col items-center gap-1.5 pt-0.5">
            {/* Featured star */}
            <button
              onClick={() => onToggleFeatured(resource)}
              className="transition-transform hover:scale-110"
              title={resource.featured ? "Remove from featured" : "Mark as featured"}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill={resource.featured ? "#E8CA7A" : "none"} stroke={resource.featured ? "#D4A017" : "#C8E6D0"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </button>
            {/* Hidden eye */}
            <button
              onClick={() => onToggleHidden(resource)}
              className="transition-transform hover:scale-110"
              title={resource.hidden ? "Make visible" : "Hide from users"}
            >
              {resource.hidden ? (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#B0B0B0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#A8D5BA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-[14px] font-bold" style={{ color: "#1A3D2B" }}>
                {resource.title}
              </h3>
              {resource.featured && (
                <span className="flex-shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider" style={{ backgroundColor: "rgba(232,202,122,0.20)", color: "#B8941A" }}>
                  Featured
                </span>
              )}
              {resource.hidden && (
                <span className="flex-shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider" style={{ backgroundColor: "rgba(180,180,180,0.20)", color: "#888" }}>
                  Hidden
                </span>
              )}
            </div>

            {/* Tags */}
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              {resource.category && (
                <span className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: "rgba(168,213,186,0.20)", color: "#3D8B6E" }}>
                  {resource.category}
                </span>
              )}
              {resource.subcategory && (
                <span className="inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: "rgba(200,230,208,0.20)", color: "#6B9E85" }}>
                  {resource.subcategory}
                </span>
              )}
              {resource.type && (
                <span className="inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: "rgba(242,196,206,0.20)", color: "#A8607A" }}>
                  {resource.type}
                </span>
              )}
            </div>

            {/* Timestamps */}
            {(resource.createdAt || resource.updatedAt) && (
              <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[10px]" style={{ color: "#A8C4B4" }}>
                {resource.createdAt && <span>Created {formatTimestamp(resource.createdAt)}</span>}
                {resource.updatedAt && <span>&middot; Updated {formatTimestamp(resource.updatedAt)}</span>}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-shrink-0 items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
            {/* Open link */}
            <button
              onClick={() => window.open(resource.url, "_blank", "noopener")}
              className="rounded-lg p-1.5 transition-all"
              style={{ backgroundColor: "rgba(200,230,208,0.12)", border: "1px solid rgba(200,230,208,0.2)" }}
              title="Open link in new tab"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B9E85" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </button>
            <button
              onClick={() => onEdit(resource)}
              className="rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-all"
              style={{ backgroundColor: "rgba(168,213,186,0.15)", color: "#4E9B78", border: "1px solid rgba(168,213,186,0.3)" }}
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(resource)}
              className="rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-all"
              style={{ backgroundColor: "rgba(254,242,242,0.6)", color: "#C46050", border: "1px solid rgba(252,202,202,0.5)" }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

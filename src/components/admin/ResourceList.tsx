"use client";

import { AdminResource } from "@/src/services/adminResourceService";

interface ResourceListProps {
  resources: AdminResource[];
  onEdit: (resource: AdminResource) => void;
  onDelete: (resource: AdminResource) => void;
  onToggleFeatured: (resource: AdminResource) => void;
}

export default function ResourceList({
  resources,
  onEdit,
  onDelete,
  onToggleFeatured,
}: ResourceListProps) {
  if (resources.length === 0) {
    return (
      <div
        className="animate-fade-in-up-2 rounded-2xl border border-dashed py-16 text-center"
        style={{
          borderColor: "rgba(200,230,208,0.5)",
          background: "rgba(255,255,255,0.4)",
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#A8D5BA"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="mx-auto mb-3"
        >
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M10 9l5 3-5 3V9z" />
        </svg>
        <p className="text-sm" style={{ color: "#8DBFA5" }}>
          No resources yet. Add your first resource to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {resources.map((resource, index) => (
        <div
          key={resource.id}
          className="group flex items-center gap-4 rounded-xl px-5 py-4 transition-all"
          style={{
            background: "linear-gradient(145deg, #FFFFFF 0%, #F8FCF9 100%)",
            border: "1px solid rgba(200,230,208,0.4)",
            boxShadow: "0 1px 3px rgba(45,106,79,0.04)",
            animation: `fadeInUp 0.3s ease-out ${index * 0.03}s both`,
          }}
        >
          {/* Featured star */}
          <button
            onClick={() => onToggleFeatured(resource)}
            className="flex-shrink-0 transition-transform hover:scale-110"
            title={resource.featured ? "Remove from featured" : "Mark as featured"}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={resource.featured ? "#E8CA7A" : "none"}
              stroke={resource.featured ? "#D4A017" : "#C8E6D0"}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3
                className="truncate text-[14px] font-bold"
                style={{ color: "#1A3D2B" }}
              >
                {resource.title}
              </h3>
              {resource.featured && (
                <span
                  className="flex-shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: "rgba(232,202,122,0.20)",
                    color: "#B8941A",
                  }}
                >
                  Featured
                </span>
              )}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              {resource.category && (
                <span
                  className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: "rgba(168,213,186,0.20)",
                    color: "#3D8B6E",
                  }}
                >
                  {resource.category}
                </span>
              )}
              {resource.subcategory && (
                <span
                  className="inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold"
                  style={{
                    backgroundColor: "rgba(200,230,208,0.20)",
                    color: "#6B9E85",
                  }}
                >
                  {resource.subcategory}
                </span>
              )}
              {resource.type && (
                <span
                  className="inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: "rgba(242,196,206,0.20)",
                    color: "#A8607A",
                  }}
                >
                  {resource.type}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-shrink-0 items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={() => onEdit(resource)}
              className="rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-all"
              style={{
                backgroundColor: "rgba(168,213,186,0.15)",
                color: "#4E9B78",
                border: "1px solid rgba(168,213,186,0.3)",
              }}
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(resource)}
              className="rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-all"
              style={{
                backgroundColor: "rgba(254,242,242,0.6)",
                color: "#C46050",
                border: "1px solid rgba(252,202,202,0.5)",
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getResources, getYouTubeId, Resource } from "@/src/services/resourceService";

function ResourceCard({ resource }: { resource: Resource }) {
  const videoId = getYouTubeId(resource.url);
  const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;

  return (
    <div
      className="overflow-hidden rounded-xl border transition-all hover:shadow-md"
      style={{
        backgroundColor: "white",
        borderColor: "rgba(200,230,208,0.5)",
      }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-black/5">
        {thumbnail ? (
          <img src={thumbnail} alt={resource.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center" style={{ backgroundColor: "rgba(200,230,208,0.15)" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A8D5BA" strokeWidth="1.5" strokeLinecap="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M10 9l5 3-5 3V9z" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        {resource.category && (
          <span
            className="mb-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
            style={{ backgroundColor: "rgba(168,213,186,0.15)", color: "#3D8B6E" }}
          >
            {resource.category}
          </span>
        )}
        <h3 className="text-[14px] font-semibold leading-snug" style={{ color: "#1A3D2B" }}>
          {resource.title}
        </h3>
        {resource.description && (
          <p className="mt-1 text-[12px] leading-relaxed" style={{ color: "#6B9E85" }}>
            {resource.description.length > 80 ? resource.description.slice(0, 80) + "..." : resource.description}
          </p>
        )}
      </div>
    </div>
  );
}

export default function ResourcePreview() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getResources()
      .then((data) => setResources(data.slice(0, 4)))
      .catch((err) => console.error("Failed to fetch resources:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      className="rounded-2xl border p-5"
      style={{
        backgroundColor: "white",
        borderColor: "rgba(200,230,208,0.5)",
        boxShadow: "0 1px 4px rgba(45,106,79,0.04)",
      }}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[14px] font-bold" style={{ color: "#1A3D2B" }}>Explore resources</h2>
        <Link
          href="/dashboard/resources"
          className="text-[12px] font-semibold transition-colors hover:underline"
          style={{ color: "#5EA88A" }}
        >
          View all
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="nature-float">
            <path d="M6 3 C10 7 12 13 10 19 C8 19 2 17 1 13 C-1 9 2 5 6 3 Z" fill="#7DB892" opacity="0.6" />
          </svg>
        </div>
      ) : resources.length === 0 ? (
        <p className="py-6 text-center text-[13px]" style={{ color: "#8DBFA5" }}>
          No resources yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {resources.map((r) => (
            <ResourceCard key={r.id} resource={r} />
          ))}
        </div>
      )}
    </div>
  );
}

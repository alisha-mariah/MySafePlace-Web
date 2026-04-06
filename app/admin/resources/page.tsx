"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  AdminResource,
  ResourceFormData,
  getAllResources,
  addResource,
  updateResource,
  deleteResource,
} from "@/src/services/adminResourceService";
import ResourceForm from "@/src/components/admin/ResourceForm";
import ResourceList from "@/src/components/admin/ResourceList";

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<AdminResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");

  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<AdminResource | null>(null);

  // Delete state
  const [deletingResource, setDeletingResource] = useState<AdminResource | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadResources = useCallback(async () => {
    try {
      const data = await getAllResources();
      data.sort((a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title));
      setResources(data);
      setError(null);
    } catch (err) {
      console.error("Failed to load resources:", err);
      setError("Could not load resources.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadResources();
  }, [loadResources]);

  const categories = [
    "All",
    ...Array.from(new Set(resources.map((r) => r.category).filter(Boolean))),
  ];
  const filtered =
    activeCategory === "All"
      ? resources
      : resources.filter((r) => r.category === activeCategory);

  function handleAdd() {
    setEditingResource(null);
    setFormOpen(true);
  }

  function handleEdit(resource: AdminResource) {
    setEditingResource(resource);
    setFormOpen(true);
  }

  function handleCancelForm() {
    setFormOpen(false);
    setEditingResource(null);
  }

  async function handleSave(data: ResourceFormData) {
    if (editingResource) {
      await updateResource(editingResource.id, data);
    } else {
      await addResource(data);
    }
    setFormOpen(false);
    setEditingResource(null);
    await loadResources();
  }

  async function confirmDelete() {
    if (!deletingResource) return;
    setDeleting(true);
    try {
      await deleteResource(deletingResource.id);
      setDeletingResource(null);
      await loadResources();
    } catch (err) {
      console.error("Failed to delete:", err);
      setError("Failed to delete resource.");
    } finally {
      setDeleting(false);
    }
  }

  async function handleToggleFeatured(resource: AdminResource) {
    await updateResource(resource.id, { featured: !resource.featured });
    await loadResources();
  }

  return (
    <div className="relative min-h-screen">
      {/* Header */}
      <header className="relative z-10 mx-auto max-w-5xl px-6 pt-8 pb-2">
        <Link
          href="/admin"
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
          Admin Panel
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl"
                style={{
                  background: "linear-gradient(135deg, rgba(184,216,196,0.35) 0%, rgba(200,230,208,0.25) 100%)",
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4E9B78" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight" style={{ color: "#1A3D2B" }}>
                  Resource Management
                </h1>
                <p className="mt-0.5 text-sm" style={{ color: "#6B9E85" }}>
                  {loading ? "Loading..." : `${resources.length} resource${resources.length !== 1 ? "s" : ""}`}
                </p>
              </div>
            </div>
            <button
              onClick={handleAdd}
              className="nature-btn flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #5EA88A 0%, #4A9874 100%)",
                boxShadow: "0 4px 14px rgba(93,168,138,0.25)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Resource
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 py-6">
        {/* Category filters */}
        {categories.length > 1 && (
          <div className="animate-fade-in-up-1 mb-6 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="rounded-full px-4 py-2 text-[13px] font-semibold transition-all"
                style={{
                  backgroundColor:
                    activeCategory === cat ? "rgba(82,171,132,0.15)" : "rgba(255,255,255,0.7)",
                  border: `1.5px solid ${activeCategory === cat ? "#52AB84" : "rgba(200,230,208,0.5)"}`,
                  color: activeCategory === cat ? "#1A3D2B" : "#6B9E85",
                  backdropFilter: "blur(8px)",
                }}
              >
                {cat}
                {cat !== "All" && (
                  <span className="ml-1.5 text-[11px] opacity-60">
                    {resources.filter((r) => r.category === cat).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            className="mb-6 rounded-lg px-4 py-3 text-sm"
            style={{
              backgroundColor: "rgba(254,242,242,0.8)",
              color: "#DC3545",
              border: "1px solid #FECACA",
            }}
          >
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
        ) : (
          <div className="animate-fade-in-up-2">
            <ResourceList
              resources={filtered}
              onEdit={handleEdit}
              onDelete={setDeletingResource}
              onToggleFeatured={handleToggleFeatured}
            />
          </div>
        )}
      </div>

      {/* Resource Form Modal */}
      {formOpen && (
        <ResourceForm
          resource={editingResource}
          onSave={handleSave}
          onCancel={handleCancelForm}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingResource && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(26,61,43,0.3)", backdropFilter: "blur(4px)" }}
        >
          <div
            className="animate-fade-in-up w-full max-w-sm rounded-2xl p-6"
            style={{
              background: "linear-gradient(145deg, #FFFFFF 0%, #FFF8F8 100%)",
              border: "1px solid rgba(252,202,202,0.5)",
              boxShadow: "0 20px 60px rgba(45,106,79,0.12), 0 8px 24px rgba(196,96,80,0.08)",
            }}
          >
            <div className="mb-4 flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: "rgba(254,242,242,0.8)" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C46050" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              </div>
              <h3 className="text-lg font-bold" style={{ color: "#1A3D2B" }}>
                Delete Resource
              </h3>
            </div>
            <p className="text-[13px] leading-relaxed" style={{ color: "#6B9E85" }}>
              Are you sure you want to delete{" "}
              <strong style={{ color: "#1A3D2B" }}>&ldquo;{deletingResource.title}&rdquo;</strong>?
              This action cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setDeletingResource(null)}
                disabled={deleting}
                className="rounded-xl px-5 py-2.5 text-[13px] font-semibold transition-all"
                style={{
                  color: "#6B9E85",
                  backgroundColor: "rgba(255,255,255,0.8)",
                  border: "1.5px solid rgba(200,230,208,0.5)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="nature-btn rounded-xl px-5 py-2.5 text-[13px] font-bold text-white"
                style={{
                  backgroundColor: "#C46050",
                  boxShadow: "0 4px 14px rgba(196,96,80,0.25)",
                  opacity: deleting ? 0.7 : 1,
                }}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

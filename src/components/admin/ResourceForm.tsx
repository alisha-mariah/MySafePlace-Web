"use client";

import { useState, useEffect } from "react";
import { AdminResource, ResourceFormData } from "@/src/services/adminResourceService";

interface ResourceFormProps {
  resource?: AdminResource | null;
  onSave: (data: ResourceFormData) => Promise<void>;
  onCancel: () => void;
}

export default function ResourceForm({ resource, onSave, onCancel }: ResourceFormProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [type, setType] = useState("");
  const [featured, setFeatured] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (resource) {
      setTitle(resource.title);
      setCategory(resource.category);
      setSubcategory(resource.subcategory);
      setDescription(resource.description);
      setUrl(resource.url);
      setType(resource.type);
      setFeatured(resource.featured);
    }
  }, [resource]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({ title, category, subcategory, description, url, type, featured });
    } finally {
      setSaving(false);
    }
  }

  const isEditing = !!resource;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(26,61,43,0.3)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="animate-fade-in-up w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{
          background: "linear-gradient(145deg, #FFFFFF 0%, #F2FAF5 100%)",
          border: "1px solid rgba(200,230,208,0.5)",
          boxShadow: "0 20px 60px rgba(45,106,79,0.12), 0 8px 24px rgba(45,106,79,0.06)",
        }}
      >
        {/* Header */}
        <div className="border-b px-6 py-4" style={{ borderColor: "rgba(200,230,208,0.4)" }}>
          <h2 className="text-lg font-bold" style={{ color: "#1A3D2B" }}>
            {isEditing ? "Edit Resource" : "Add New Resource"}
          </h2>
          <p className="mt-0.5 text-[13px]" style={{ color: "#6B9E85" }}>
            {isEditing ? "Update the resource details below" : "Fill in the details to add a new resource"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          {/* Title */}
          <div>
            <label className="mb-1 block text-[13px] font-semibold" style={{ color: "#1A3D2B" }}>
              Title <span style={{ color: "#C46050" }}>*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="auth-input w-full rounded-xl px-4 py-2.5 text-[14px]"
              style={{
                border: "1.5px solid rgba(200,230,208,0.6)",
                backgroundColor: "rgba(255,255,255,0.8)",
                color: "#1A3D2B",
              }}
              placeholder="e.g. Morning Meditation Guide"
            />
          </div>

          {/* Category + Subcategory */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[13px] font-semibold" style={{ color: "#1A3D2B" }}>
                Category <span style={{ color: "#C46050" }}>*</span>
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="auth-input w-full rounded-xl px-4 py-2.5 text-[14px]"
                style={{
                  border: "1.5px solid rgba(200,230,208,0.6)",
                  backgroundColor: "rgba(255,255,255,0.8)",
                  color: "#1A3D2B",
                }}
                placeholder="e.g. Meditation"
              />
            </div>
            <div>
              <label className="mb-1 block text-[13px] font-semibold" style={{ color: "#1A3D2B" }}>
                Subcategory
              </label>
              <input
                type="text"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="auth-input w-full rounded-xl px-4 py-2.5 text-[14px]"
                style={{
                  border: "1.5px solid rgba(200,230,208,0.6)",
                  backgroundColor: "rgba(255,255,255,0.8)",
                  color: "#1A3D2B",
                }}
                placeholder="e.g. Beginner Meditation"
              />
            </div>
          </div>

          {/* Type + URL */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[13px] font-semibold" style={{ color: "#1A3D2B" }}>
                Type
              </label>
              <input
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="auth-input w-full rounded-xl px-4 py-2.5 text-[14px]"
                style={{
                  border: "1.5px solid rgba(200,230,208,0.6)",
                  backgroundColor: "rgba(255,255,255,0.8)",
                  color: "#1A3D2B",
                }}
                placeholder="e.g. Video"
              />
            </div>
            <div>
              <label className="mb-1 block text-[13px] font-semibold" style={{ color: "#1A3D2B" }}>
                URL <span style={{ color: "#C46050" }}>*</span>
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="auth-input w-full rounded-xl px-4 py-2.5 text-[14px]"
                style={{
                  border: "1.5px solid rgba(200,230,208,0.6)",
                  backgroundColor: "rgba(255,255,255,0.8)",
                  color: "#1A3D2B",
                }}
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-[13px] font-semibold" style={{ color: "#1A3D2B" }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="auth-input w-full resize-none rounded-xl px-4 py-2.5 text-[14px]"
              style={{
                border: "1.5px solid rgba(200,230,208,0.6)",
                backgroundColor: "rgba(255,255,255,0.8)",
                color: "#1A3D2B",
              }}
              placeholder="Brief description of this resource..."
            />
          </div>

          {/* Featured toggle */}
          <label
            className="flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3"
            style={{
              backgroundColor: featured ? "rgba(232,202,122,0.10)" : "rgba(200,230,208,0.12)",
              border: `1px solid ${featured ? "rgba(232,202,122,0.30)" : "rgba(200,230,208,0.3)"}`,
            }}
          >
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="sr-only"
            />
            <div
              className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md transition-all"
              style={{
                border: featured ? "none" : "2px solid rgba(200,230,208,0.8)",
                backgroundColor: featured ? "#5EA88A" : "white",
              }}
            >
              {featured && (
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                  <path d="M5 10l3 3 7-7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <div>
              <span className="text-[13px] font-semibold" style={{ color: "#1A3D2B" }}>
                Featured Resource
              </span>
              <p className="text-[11px]" style={{ color: "#6B9E85" }}>
                Featured resources appear highlighted in the library
              </p>
            </div>
          </label>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
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
              type="submit"
              disabled={saving}
              className="nature-btn rounded-xl px-6 py-2.5 text-[13px] font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #5EA88A 0%, #4A9874 100%)",
                boxShadow: "0 4px 14px rgba(93,168,138,0.25)",
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? "Saving..." : isEditing ? "Update Resource" : "Add Resource"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

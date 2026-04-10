"use client";

import { useState, useEffect, useMemo } from "react";
import { AdminResource, ResourceFormData } from "@/src/services/adminResourceService";
import { Category } from "@/src/services/adminCategoryService";

interface ResourceFormProps {
  resource?: AdminResource | null;
  categories: Category[];
  onSave: (data: ResourceFormData) => Promise<void>;
  onCancel: () => void;
}

interface FormErrors {
  title?: string;
  category?: string;
  subcategory?: string;
  type?: string;
  url?: string;
}

const inputBase = "auth-input w-full rounded-xl px-4 py-2.5 text-[14px]";

function fieldStyle(hasError: boolean) {
  return {
    border: `1.5px solid ${hasError ? "rgba(196,96,80,0.5)" : "rgba(200,230,208,0.6)"}`,
    backgroundColor: "rgba(255,255,255,0.8)",
    color: "#1A3D2B",
  };
}

export default function ResourceForm({ resource, categories, onSave, onCancel }: ResourceFormProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [type, setType] = useState("");
  const [featured, setFeatured] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (resource) {
      setTitle(resource.title);
      setCategory(resource.category);
      setSubcategory(resource.subcategory);
      setDescription(resource.description);
      setUrl(resource.url);
      setType(resource.type);
      setFeatured(resource.featured);
      setHidden(resource.hidden);
    }
  }, [resource]);

  const subcategoriesForCategory = useMemo(() => {
    const cat = categories.find((c) => c.name === category);
    return cat?.subcategories ?? [];
  }, [category, categories]);

  function validate(): FormErrors {
    const e: FormErrors = {};
    if (!title.trim()) e.title = "Title is required";
    if (!category.trim()) e.category = "Category is required";
    if (!subcategory.trim()) e.subcategory = "Subcategory is required";
    if (!type.trim()) e.type = "Type is required";
    if (!url.trim()) e.url = "URL is required";
    else if (!/^https?:\/\/.+/.test(url.trim())) e.url = "Must be a valid URL (http:// or https://)";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;
    setSaving(true);
    try {
      await onSave({
        title: title.trim(),
        category: category.trim(),
        subcategory: subcategory.trim(),
        description: description.trim(),
        url: url.trim(),
        type: type.trim(),
        featured,
        hidden,
      });
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
              className={inputBase}
              style={fieldStyle(!!errors.title)}
              placeholder="e.g. Morning Meditation Guide"
            />
            {errors.title && <p className="mt-1 text-[11px]" style={{ color: "#C46050" }}>{errors.title}</p>}
          </div>

          {/* Category + Subcategory */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[13px] font-semibold" style={{ color: "#1A3D2B" }}>
                Category <span style={{ color: "#C46050" }}>*</span>
              </label>
              <select
                value={category}
                onChange={(e) => { setCategory(e.target.value); setSubcategory(""); }}
                className={inputBase + " appearance-none"}
                style={fieldStyle(!!errors.category)}
              >
                <option value="">Select category...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-[11px]" style={{ color: "#C46050" }}>{errors.category}</p>}
              {categories.length === 0 && (
                <p className="mt-1 text-[11px]" style={{ color: "#8DBFA5" }}>
                  No categories yet — create them in Category Management.
                </p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-[13px] font-semibold" style={{ color: "#1A3D2B" }}>
                Subcategory <span style={{ color: "#C46050" }}>*</span>
              </label>
              <select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className={inputBase + " appearance-none"}
                style={fieldStyle(!!errors.subcategory)}
                disabled={!category}
              >
                <option value="">Select subcategory...</option>
                {subcategoriesForCategory.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.subcategory && <p className="mt-1 text-[11px]" style={{ color: "#C46050" }}>{errors.subcategory}</p>}
            </div>
          </div>

          {/* Type + URL */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[13px] font-semibold" style={{ color: "#1A3D2B" }}>
                Type <span style={{ color: "#C46050" }}>*</span>
              </label>
              <input
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className={inputBase}
                style={fieldStyle(!!errors.type)}
                placeholder="e.g. Video"
              />
              {errors.type && <p className="mt-1 text-[11px]" style={{ color: "#C46050" }}>{errors.type}</p>}
            </div>
            <div>
              <label className="mb-1 block text-[13px] font-semibold" style={{ color: "#1A3D2B" }}>
                URL <span style={{ color: "#C46050" }}>*</span>
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className={inputBase}
                style={fieldStyle(!!errors.url)}
                placeholder="https://..."
              />
              {errors.url && <p className="mt-1 text-[11px]" style={{ color: "#C46050" }}>{errors.url}</p>}
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
              className={inputBase + " resize-none"}
              style={fieldStyle(false)}
              placeholder="Brief description of this resource..."
            />
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-2 gap-3">
            {/* Featured */}
            <label
              className="flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3"
              style={{
                backgroundColor: featured ? "rgba(232,202,122,0.10)" : "rgba(200,230,208,0.12)",
                border: `1px solid ${featured ? "rgba(232,202,122,0.30)" : "rgba(200,230,208,0.3)"}`,
              }}
            >
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="sr-only" />
              <div
                className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md transition-all"
                style={{ border: featured ? "none" : "2px solid rgba(200,230,208,0.8)", backgroundColor: featured ? "#5EA88A" : "white" }}
              >
                {featured && (
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                    <path d="M5 10l3 3 7-7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <div>
                <span className="text-[13px] font-semibold" style={{ color: "#1A3D2B" }}>Featured</span>
                <p className="text-[10px]" style={{ color: "#6B9E85" }}>Highlighted in library</p>
              </div>
            </label>

            {/* Hidden */}
            <label
              className="flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3"
              style={{
                backgroundColor: hidden ? "rgba(196,96,80,0.06)" : "rgba(200,230,208,0.12)",
                border: `1px solid ${hidden ? "rgba(196,96,80,0.20)" : "rgba(200,230,208,0.3)"}`,
              }}
            >
              <input type="checkbox" checked={hidden} onChange={(e) => setHidden(e.target.checked)} className="sr-only" />
              <div
                className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md transition-all"
                style={{ border: hidden ? "none" : "2px solid rgba(200,230,208,0.8)", backgroundColor: hidden ? "#C46050" : "white" }}
              >
                {hidden && (
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                    <path d="M5 10l3 3 7-7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <div>
                <span className="text-[13px] font-semibold" style={{ color: "#1A3D2B" }}>Hidden</span>
                <p className="text-[10px]" style={{ color: "#6B9E85" }}>Not visible to users</p>
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl px-5 py-2.5 text-[13px] font-semibold transition-all"
              style={{ color: "#6B9E85", backgroundColor: "rgba(255,255,255,0.8)", border: "1.5px solid rgba(200,230,208,0.5)" }}
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

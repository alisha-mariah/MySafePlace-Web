"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  AdminResource,
  ResourceFormData,
  getAllResources,
  addResource,
  updateResource,
  deleteResource,
} from "@/src/services/adminResourceService";
import { Category, getCategories, syncCategoriesFromResources } from "@/src/services/adminCategoryService";
import ResourceForm from "@/src/components/admin/ResourceForm";
import ResourceList from "@/src/components/admin/ResourceList";
import AdminMessage from "@/src/components/admin/AdminMessage";
import ConfirmDeleteModal from "@/src/components/ui/ConfirmDeleteModal";

type Msg = { text: string; type: "success" | "error" };

const selectClass = "auth-input cursor-pointer rounded-lg pl-3 pr-8 py-2 text-[12px] font-semibold appearance-none";
const selectStyle: React.CSSProperties = {
  backgroundColor: "rgba(255,255,255,0.7)",
  border: "1.5px solid rgba(200,230,208,0.5)",
  color: "#1A3D2B",
  backdropFilter: "blur(8px)",
  minHeight: 0,
  backgroundImage:
    "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B9E85' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3e%3cpath d='M6 9l6 6 6-6'/%3e%3c/svg%3e\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 0.6rem center",
  backgroundSize: "12px",
};

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<AdminResource[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Search + Filters + Sort
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterSubcategory, setFilterSubcategory] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [filterFeatured, setFilterFeatured] = useState("all");
  const [filterVisibility, setFilterVisibility] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Form
  const [formOpen, setFormOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<AdminResource | null>(null);

  // Delete
  const [deletingResource, setDeletingResource] = useState<AdminResource | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Messages
  const [message, setMessage] = useState<Msg | null>(null);

  const loadData = useCallback(async () => {
    try {
      await syncCategoriesFromResources();
      const [res, cats] = await Promise.all([getAllResources(), getCategories()]);
      setResources(res);
      setCategories(cats);
    } catch (err) {
      console.error("Failed to load:", err);
      setMessage({ text: "Failed to load resources.", type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // Derived filter options
  const uniqueTypes = useMemo(() => Array.from(new Set(resources.map((r) => r.type).filter(Boolean))).sort(), [resources]);
  const subcategoriesForFilter = useMemo(() => {
    if (filterCategory === "All") return [];
    const cat = categories.find((c) => c.name === filterCategory);
    return cat?.subcategories ?? [];
  }, [filterCategory, categories]);

  // Filter + Sort pipeline
  const displayed = useMemo(() => {
    let r = [...resources];
    if (searchQuery.trim()) { const q = searchQuery.toLowerCase(); r = r.filter((x) => x.title.toLowerCase().includes(q)); }
    if (filterCategory !== "All") r = r.filter((x) => x.category === filterCategory);
    if (filterSubcategory !== "All") r = r.filter((x) => x.subcategory === filterSubcategory);
    if (filterType !== "All") r = r.filter((x) => x.type === filterType);
    if (filterFeatured === "featured") r = r.filter((x) => x.featured);
    else if (filterFeatured === "not-featured") r = r.filter((x) => !x.featured);
    if (filterVisibility === "visible") r = r.filter((x) => !x.hidden);
    else if (filterVisibility === "hidden") r = r.filter((x) => x.hidden);
    if (sortBy === "newest") r.sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
    else if (sortBy === "oldest") r.sort((a, b) => (a.createdAt ?? "").localeCompare(b.createdAt ?? ""));
    else if (sortBy === "title") r.sort((a, b) => a.title.localeCompare(b.title));
    return r;
  }, [resources, searchQuery, filterCategory, filterSubcategory, filterType, filterFeatured, filterVisibility, sortBy]);

  const hasActiveFilters = searchQuery || filterCategory !== "All" || filterSubcategory !== "All" || filterType !== "All" || filterFeatured !== "all" || filterVisibility !== "all";

  // Handlers
  function handleAdd() { setEditingResource(null); setFormOpen(true); }
  function handleEdit(r: AdminResource) { setEditingResource(r); setFormOpen(true); }
  function handleCancelForm() { setFormOpen(false); setEditingResource(null); }

  async function handleSave(data: ResourceFormData) {
    try {
      if (editingResource) {
        await updateResource(editingResource.id, data);
        setMessage({ text: "Resource updated successfully.", type: "success" });
      } else {
        await addResource(data);
        setMessage({ text: "Resource added successfully.", type: "success" });
      }
      setFormOpen(false);
      setEditingResource(null);
      await loadData();
    } catch {
      setMessage({ text: "Failed to save resource.", type: "error" });
    }
  }

  async function confirmDelete() {
    if (!deletingResource) return;
    setDeleting(true);
    try {
      await deleteResource(deletingResource.id);
      setMessage({ text: `"${deletingResource.title}" deleted.`, type: "success" });
      setDeletingResource(null);
      await loadData();
    } catch {
      setMessage({ text: "Failed to delete resource.", type: "error" });
    } finally {
      setDeleting(false);
    }
  }

  async function handleToggleFeatured(r: AdminResource) {
    try {
      await updateResource(r.id, { featured: !r.featured });
      setMessage({ text: r.featured ? "Removed from featured." : "Marked as featured.", type: "success" });
      await loadData();
    } catch { setMessage({ text: "Failed to update.", type: "error" }); }
  }

  async function handleToggleHidden(r: AdminResource) {
    const newHidden = !r.hidden;
    setResources((prev) => prev.map((x) => (x.id === r.id ? { ...x, hidden: newHidden } : x)));
    try {
      await updateResource(r.id, { hidden: newHidden });
      setMessage({ text: newHidden ? "Resource is now hidden." : "Resource is now visible.", type: "success" });
    } catch {
      setResources((prev) => prev.map((x) => (x.id === r.id ? { ...x, hidden: r.hidden } : x)));
      setMessage({ text: "Failed to update.", type: "error" });
    }
  }

  return (
    <div className="relative min-h-screen">
      {/* Header */}
      <header className="relative z-10 mx-auto max-w-5xl px-6 pt-8 pb-2">
        <Link href="/admin" className="pill-btn mb-5 inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium" style={{ color: "#6B9E85", backgroundColor: "rgba(255,255,255,0.7)", border: "1px solid rgba(200,230,208,0.5)", backdropFilter: "blur(8px)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          Admin Panel
        </Link>

        <div className="animate-fade-in-up rounded-2xl px-7 py-6" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.55) 100%)", border: "1px solid rgba(200,230,208,0.45)", boxShadow: "0 8px 32px rgba(45,106,79,0.06), 0 2px 8px rgba(45,106,79,0.03)", backdropFilter: "blur(12px)" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: "linear-gradient(135deg, rgba(184,216,196,0.35) 0%, rgba(200,230,208,0.25) 100%)" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4E9B78" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight" style={{ color: "#1A3D2B" }}>Resource Management</h1>
                <p className="mt-0.5 text-sm" style={{ color: "#6B9E85" }}>
                  {loading ? "Loading..." : `${resources.length} resource${resources.length !== 1 ? "s" : ""}`}
                </p>
              </div>
            </div>
            <button onClick={handleAdd} className="nature-btn flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-bold text-white" style={{ background: "linear-gradient(135deg, #3D8B6A 0%, #2D6A4F 100%)", boxShadow: "0 4px 14px rgba(45,106,79,0.28)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              Add Resource
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 py-6">
        {/* Message */}
        {message && <AdminMessage message={message.text} type={message.type} onDismiss={() => setMessage(null)} />}

        {/* Search */}
        <div className="animate-fade-in-up-1 mb-4">
          <div className="relative">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8DBFA5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resources by title..."
              className="auth-input w-full rounded-xl py-2.5 pl-10 pr-4 text-[13px]"
              style={{ backgroundColor: "rgba(255,255,255,0.8)", border: "1.5px solid rgba(200,230,208,0.5)", color: "#1A3D2B", outline: "none", minHeight: 0 }}
            />
          </div>
        </div>

        {/* Filters + Sort */}
        <div className="animate-fade-in-up-1 mb-6 flex flex-wrap items-center gap-2">
          <select value={filterCategory} onChange={(e) => { setFilterCategory(e.target.value); setFilterSubcategory("All"); }} className={selectClass} style={selectStyle}>
            <option value="All">All categories</option>
            {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>

          {subcategoriesForFilter.length > 0 && (
            <select value={filterSubcategory} onChange={(e) => setFilterSubcategory(e.target.value)} className={selectClass} style={selectStyle}>
              <option value="All">All subcategories</option>
              {subcategoriesForFilter.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          )}

          {uniqueTypes.length > 0 && (
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className={selectClass} style={selectStyle}>
              <option value="All">All types</option>
              {uniqueTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          )}

          <select value={filterFeatured} onChange={(e) => setFilterFeatured(e.target.value)} className={selectClass} style={selectStyle}>
            <option value="all">All featured</option>
            <option value="featured">Featured only</option>
            <option value="not-featured">Not featured</option>
          </select>

          <select value={filterVisibility} onChange={(e) => setFilterVisibility(e.target.value)} className={selectClass} style={selectStyle}>
            <option value="all">All visibility</option>
            <option value="visible">Visible only</option>
            <option value="hidden">Hidden only</option>
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={selectClass} style={{ ...selectStyle, marginLeft: "auto" }}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="title">Title A–Z</option>
          </select>
        </div>

        {/* Loading / List */}
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
              resources={displayed}
              onEdit={handleEdit}
              onDelete={setDeletingResource}
              onToggleFeatured={handleToggleFeatured}
              onToggleHidden={handleToggleHidden}
              emptyMessage={hasActiveFilters ? "No resources match your current filters." : "No resources yet. Add your first resource to get started."}
            />
            {displayed.length > 0 && displayed.length !== resources.length && (
              <p className="mt-3 text-center text-[11px]" style={{ color: "#A8C4B4" }}>
                Showing {displayed.length} of {resources.length} resources
              </p>
            )}
          </div>
        )}
      </div>

      {/* Form modal */}
      {formOpen && (
        <ResourceForm resource={editingResource} categories={categories} onSave={handleSave} onCancel={handleCancelForm} />
      )}

      {/* Delete modal */}
      {deletingResource && (
        <ConfirmDeleteModal
          title="Delete Resource"
          itemName={deletingResource.title}
          onConfirm={confirmDelete}
          onCancel={() => setDeletingResource(null)}
          confirming={deleting}
        />
      )}
    </div>
  );
}

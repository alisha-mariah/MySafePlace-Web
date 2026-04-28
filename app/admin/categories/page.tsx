"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Category,
  getCategories,
  addCategory,
  updateCategoryName,
  deleteCategory,
  addSubcategory,
  removeSubcategory,
  renameSubcategory,
  syncCategoriesFromResources,
} from "@/src/services/adminCategoryService";
import AdminMessage from "@/src/components/admin/AdminMessage";
import ConfirmDeleteModal from "@/src/components/ui/ConfirmDeleteModal";

type Msg = { text: string; type: "success" | "error" };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<Msg | null>(null);

  // Expand/collapse
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Add category
  const [showAddCat, setShowAddCat] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [addingCat, setAddingCat] = useState(false);

  // Edit category
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState("");

  // Add subcategory
  const [addingSubTo, setAddingSubTo] = useState<string | null>(null);
  const [newSubName, setNewSubName] = useState("");

  // Edit subcategory
  const [editingSub, setEditingSub] = useState<{ catId: string; oldName: string } | null>(null);
  const [editingSubName, setEditingSubName] = useState("");

  // Delete
  const [deletingItem, setDeletingItem] = useState<{ type: "category" | "subcategory"; catId: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      await syncCategoriesFromResources();
      const cats = await getCategories();
      setCategories(cats);
      // Auto-expand all on first load
      if (expandedIds.size === 0 && cats.length > 0) {
        setExpandedIds(new Set(cats.map((c) => c.id)));
      }
    } catch {
      setMessage({ text: "Failed to load categories.", type: "error" });
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { load(); }, [load]);

  const totalSubs = categories.reduce((sum, c) => sum + c.subcategories.length, 0);

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  // ── Category CRUD ──

  async function handleAddCategory() {
    if (!newCatName.trim()) return;
    setAddingCat(true);
    try {
      await addCategory(newCatName.trim());
      setNewCatName("");
      setShowAddCat(false);
      setMessage({ text: "Category added.", type: "success" });
      await load();
    } catch {
      setMessage({ text: "Failed to add category.", type: "error" });
    } finally {
      setAddingCat(false);
    }
  }

  async function handleSaveCategoryName() {
    if (!editingCatId || !editingCatName.trim()) return;
    try {
      await updateCategoryName(editingCatId, editingCatName.trim());
      setEditingCatId(null);
      setMessage({ text: "Category renamed.", type: "success" });
      await load();
    } catch {
      setMessage({ text: "Failed to rename.", type: "error" });
    }
  }

  // ── Subcategory CRUD ──

  async function handleAddSub(catId: string) {
    if (!newSubName.trim()) return;
    try {
      await addSubcategory(catId, newSubName.trim());
      setNewSubName("");
      setAddingSubTo(null);
      setMessage({ text: "Subcategory added.", type: "success" });
      await load();
    } catch {
      setMessage({ text: "Failed to add subcategory.", type: "error" });
    }
  }

  async function handleSaveSubName() {
    if (!editingSub || !editingSubName.trim()) return;
    try {
      await renameSubcategory(editingSub.catId, editingSub.oldName, editingSubName.trim());
      setEditingSub(null);
      setMessage({ text: "Subcategory renamed.", type: "success" });
      await load();
    } catch {
      setMessage({ text: "Failed to rename.", type: "error" });
    }
  }

  // ── Delete ──

  async function confirmDelete() {
    if (!deletingItem) return;
    setDeleting(true);
    try {
      if (deletingItem.type === "category") {
        await deleteCategory(deletingItem.catId);
        setMessage({ text: `Category "${deletingItem.name}" deleted.`, type: "success" });
      } else {
        await removeSubcategory(deletingItem.catId, deletingItem.name);
        setMessage({ text: `Subcategory "${deletingItem.name}" removed.`, type: "success" });
      }
      setDeletingItem(null);
      await load();
    } catch {
      setMessage({ text: "Failed to delete.", type: "error" });
    } finally {
      setDeleting(false);
    }
  }

  const inputStyle = {
    border: "1.5px solid rgba(200,230,208,0.6)",
    backgroundColor: "rgba(255,255,255,0.8)",
    color: "#1A3D2B",
  };

  return (
    <div className="relative min-h-screen">
      {/* Header */}
      <header className="relative z-10 mx-auto max-w-5xl px-6 pt-8 pb-2">
        <Link
          href="/admin"
          className="pill-btn mb-5 inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium"
          style={{ color: "#6B9E85", backgroundColor: "rgba(255,255,255,0.7)", border: "1px solid rgba(200,230,208,0.5)", backdropFilter: "blur(8px)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          Admin Panel
        </Link>

        <div
          className="animate-fade-in-up rounded-2xl px-7 py-6"
          style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.55) 100%)", border: "1px solid rgba(200,230,208,0.45)", boxShadow: "0 8px 32px rgba(45,106,79,0.06), 0 2px 8px rgba(45,106,79,0.03)", backdropFilter: "blur(12px)" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: "linear-gradient(135deg, rgba(184,216,196,0.35) 0%, rgba(200,230,208,0.25) 100%)" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4E9B78" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight" style={{ color: "#1A3D2B" }}>Category Management</h1>
                <p className="mt-0.5 text-sm" style={{ color: "#6B9E85" }}>
                  {loading ? "Loading..." : `${categories.length} categor${categories.length !== 1 ? "ies" : "y"} \u00B7 ${totalSubs} subcategor${totalSubs !== 1 ? "ies" : "y"}`}
                </p>
              </div>
            </div>
            <button
              onClick={() => { setShowAddCat(true); setTimeout(() => document.getElementById("new-cat-input")?.focus(), 50); }}
              className="nature-btn flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-bold text-white"
              style={{ background: "linear-gradient(135deg, #3D8B6A 0%, #2D6A4F 100%)", boxShadow: "0 4px 14px rgba(45,106,79,0.28)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              Add Category
            </button>
          </div>
          <p className="mt-4 text-[13px] leading-relaxed" style={{ color: "#8DBFA5" }}>
            Categories and subcategories organize your resource library. When adding or editing a resource, the admin selects from these options. Create a category first, then add subcategories within it.
          </p>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-6">
        {message && <AdminMessage message={message.text} type={message.type} onDismiss={() => setMessage(null)} />}

        {/* Add category — inline reveal */}
        {showAddCat && (
          <div
            className="animate-fade-in-up mb-6 rounded-2xl px-5 py-4"
            style={{ background: "linear-gradient(145deg, #FFFFFF 0%, #F2FAF5 100%)", border: "1px solid rgba(200,230,208,0.4)", boxShadow: "0 2px 8px rgba(45,106,79,0.04)" }}
          >
            <p className="mb-2.5 text-[12px] font-semibold uppercase tracking-wider" style={{ color: "#8DBFA5" }}>New category</p>
            <div className="flex gap-2">
              <input
                id="new-cat-input"
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleAddCategory(); if (e.key === "Escape") { setShowAddCat(false); setNewCatName(""); } }}
                placeholder="e.g. Meditation, Yoga, Breathing..."
                className="auth-input flex-1 rounded-xl px-4 py-2.5 text-[14px]"
                style={inputStyle}
              />
              <button
                onClick={handleAddCategory}
                disabled={addingCat || !newCatName.trim()}
                className="nature-btn cursor-pointer rounded-xl px-5 py-2.5 text-[13px] font-bold text-white"
                style={{ background: "linear-gradient(135deg, #3D8B6A 0%, #2D6A4F 100%)", opacity: addingCat || !newCatName.trim() ? 0.5 : 1 }}
              >
                {addingCat ? "Adding..." : "Create"}
              </button>
              <button
                onClick={() => { setShowAddCat(false); setNewCatName(""); }}
                className="cursor-pointer rounded-xl px-4 py-2.5 text-[13px] font-semibold transition-all duration-150 hover:opacity-70"
                style={{ color: "#6B9E85" }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center py-20">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="nature-float">
              <path d="M6 3 C10 7 12 13 10 19 C8 19 2 17 1 13 C-1 9 2 5 6 3 Z" fill="#7DB892" opacity="0.6" />
            </svg>
          </div>
        ) : categories.length === 0 ? (
          <div className="animate-fade-in-up-2 rounded-2xl border border-dashed py-16 text-center" style={{ borderColor: "rgba(200,230,208,0.5)", background: "rgba(255,255,255,0.4)" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#A8D5BA" strokeWidth="1.5" strokeLinecap="round" className="mx-auto mb-3"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>
            <p className="text-[14px] font-semibold" style={{ color: "#6B9E85" }}>No categories yet</p>
            <p className="mt-1 text-[12px]" style={{ color: "#8DBFA5" }}>Click &ldquo;Add Category&rdquo; above to get started.</p>
          </div>
        ) : (
          <div className="animate-fade-in-up-2 space-y-3">
            {categories.map((cat, i) => {
              const isExpanded = expandedIds.has(cat.id);
              const isEditingThis = editingCatId === cat.id;

              return (
                <div
                  key={cat.id}
                  className="overflow-hidden rounded-2xl transition-all duration-200 hover:shadow-md"
                  style={{ background: "linear-gradient(145deg, #FFFFFF 0%, #F8FCF9 100%)", border: "1px solid rgba(200,230,208,0.4)", boxShadow: "0 2px 8px rgba(45,106,79,0.04)", animation: `fadeInUp 0.3s ease-out ${i * 0.04}s both` }}
                >
                  {/* ── Category header ── */}
                  <div
                    className="flex items-center gap-3 px-5 py-4"
                    style={{ borderBottom: isExpanded ? "1px solid rgba(200,230,208,0.25)" : "none" }}
                  >
                    {isEditingThis ? (
                      <div className="flex flex-1 items-center gap-2">
                        <input
                          type="text"
                          value={editingCatName}
                          onChange={(e) => setEditingCatName(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") handleSaveCategoryName(); if (e.key === "Escape") setEditingCatId(null); }}
                          autoFocus
                          className="auth-input flex-1 rounded-lg px-3 py-1.5 text-[14px]"
                          style={inputStyle}
                        />
                        <button onClick={handleSaveCategoryName} className="cursor-pointer rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-all duration-150 hover:brightness-90" style={{ backgroundColor: "rgba(168,213,186,0.15)", color: "#4E9B78", border: "1px solid rgba(168,213,186,0.3)" }}>Save</button>
                        <button onClick={() => setEditingCatId(null)} className="cursor-pointer rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-all duration-150 hover:opacity-70" style={{ color: "#6B9E85" }}>Cancel</button>
                      </div>
                    ) : (
                      <>
                        {/* Expand toggle */}
                        <button
                          onClick={() => toggleExpand(cat.id)}
                          className="flex h-9 w-9 flex-shrink-0 cursor-pointer items-center justify-center rounded-lg transition-all duration-200 hover:bg-[rgba(168,213,186,0.25)]"
                          style={{ backgroundColor: "rgba(168,213,186,0.12)" }}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#4E9B78"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="transition-transform duration-200"
                            style={{ transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)" }}
                          >
                            <path d="M9 18l6-6-6-6" />
                          </svg>
                        </button>

                        {/* Name + count */}
                        <button
                          onClick={() => toggleExpand(cat.id)}
                          className="flex flex-1 cursor-pointer items-center gap-3 text-left"
                        >
                          <h3 className="text-[15px] font-bold" style={{ color: "#1A3D2B" }}>{cat.name}</h3>
                          <span className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: "rgba(200,230,208,0.25)", color: "#6B9E85" }}>
                            {cat.subcategories.length} subcategor{cat.subcategories.length !== 1 ? "ies" : "y"}
                          </span>
                        </button>

                        {/* Actions */}
                        <button
                          onClick={() => { setEditingCatId(cat.id); setEditingCatName(cat.name); }}
                          className="cursor-pointer rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all duration-200 hover:brightness-90"
                          style={{ backgroundColor: "rgba(168,213,186,0.10)", color: "#4E9B78", border: "1px solid rgba(168,213,186,0.25)" }}
                        >
                          Rename
                        </button>
                        <button
                          onClick={() => setDeletingItem({ type: "category", catId: cat.id, name: cat.name })}
                          className="cursor-pointer rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all duration-200 hover:brightness-90"
                          style={{ backgroundColor: "rgba(254,242,242,0.5)", color: "#C46050", border: "1px solid rgba(252,202,202,0.4)" }}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>

                  {/* ── Subcategories (collapsible) ── */}
                  <div
                    className="transition-all duration-200 ease-in-out"
                    style={{
                      maxHeight: isExpanded ? "1000px" : "0px",
                      opacity: isExpanded ? 1 : 0,
                      overflow: "hidden",
                    }}
                  >
                    <div className="px-5 pb-4 pt-2">
                      {cat.subcategories.length === 0 && addingSubTo !== cat.id && (
                        <p className="py-3 text-center text-[12px]" style={{ color: "#A8C4B4" }}>No subcategories yet. Add one below.</p>
                      )}

                      <div className="space-y-1">
                        {cat.subcategories.map((sub) => (
                          <div
                            key={sub}
                            className="flex items-center gap-3 rounded-xl px-4 py-2.5 transition-all duration-150"
                            style={{ backgroundColor: "rgba(200,230,208,0.04)" }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(200,230,208,0.10)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(200,230,208,0.04)"; }}
                          >
                            {editingSub?.catId === cat.id && editingSub?.oldName === sub ? (
                              <div className="flex flex-1 items-center gap-2">
                                <input
                                  type="text"
                                  value={editingSubName}
                                  onChange={(e) => setEditingSubName(e.target.value)}
                                  onKeyDown={(e) => { if (e.key === "Enter") handleSaveSubName(); if (e.key === "Escape") setEditingSub(null); }}
                                  autoFocus
                                  className="auth-input flex-1 rounded-lg px-3 py-1 text-[13px]"
                                  style={inputStyle}
                                />
                                <button onClick={handleSaveSubName} className="cursor-pointer rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all duration-150 hover:brightness-90" style={{ backgroundColor: "rgba(168,213,186,0.15)", color: "#4E9B78", border: "1px solid rgba(168,213,186,0.3)" }}>Save</button>
                                <button onClick={() => setEditingSub(null)} className="cursor-pointer text-[11px] font-semibold transition-all duration-150 hover:opacity-70" style={{ color: "#6B9E85" }}>Cancel</button>
                              </div>
                            ) : (
                              <>
                                <div className="h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ backgroundColor: "#B8D8C4" }} />
                                <span className="flex-1 text-[13px] font-medium" style={{ color: "#1A3D2B" }}>{sub}</span>
                                <button
                                  onClick={() => { setEditingSub({ catId: cat.id, oldName: sub }); setEditingSubName(sub); }}
                                  className="cursor-pointer rounded-lg p-1.5 transition-all duration-150 hover:bg-[rgba(168,213,186,0.15)]"
                                  style={{ color: "#4E9B78" }}
                                  title="Rename"
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
                                </button>
                                <button
                                  onClick={() => setDeletingItem({ type: "subcategory", catId: cat.id, name: sub })}
                                  className="cursor-pointer rounded-lg p-1.5 transition-all duration-150 hover:bg-[rgba(254,242,242,0.5)]"
                                  style={{ color: "#C46050" }}
                                  title="Remove"
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                </button>
                              </>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Add subcategory */}
                      {addingSubTo === cat.id ? (
                        <div className="mt-2 flex items-center gap-2">
                          <input
                            type="text"
                            value={newSubName}
                            onChange={(e) => setNewSubName(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") handleAddSub(cat.id); if (e.key === "Escape") { setAddingSubTo(null); setNewSubName(""); } }}
                            autoFocus
                            placeholder="Subcategory name..."
                            className="auth-input flex-1 rounded-lg px-3 py-1.5 text-[13px]"
                            style={inputStyle}
                          />
                          <button
                            onClick={() => handleAddSub(cat.id)}
                            disabled={!newSubName.trim()}
                            className="cursor-pointer rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-all duration-150 hover:brightness-90"
                            style={{ backgroundColor: "rgba(168,213,186,0.15)", color: "#4E9B78", border: "1px solid rgba(168,213,186,0.3)", opacity: newSubName.trim() ? 1 : 0.5 }}
                          >
                            Add
                          </button>
                          <button onClick={() => { setAddingSubTo(null); setNewSubName(""); }} className="cursor-pointer text-[12px] font-semibold transition-all duration-150 hover:opacity-70" style={{ color: "#6B9E85" }}>Cancel</button>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setAddingSubTo(cat.id); setNewSubName(""); }}
                          className="mt-2 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl py-2.5 text-[12px] font-semibold transition-all duration-200"
                          style={{ color: "#5EA88A", backgroundColor: "rgba(94,168,138,0.04)", border: "1px dashed rgba(94,168,138,0.25)" }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(94,168,138,0.10)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(94,168,138,0.04)"; }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                          Add subcategory
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      {deletingItem && (
        <ConfirmDeleteModal
          title={deletingItem.type === "category" ? "Delete Category" : "Remove Subcategory"}
          itemName={deletingItem.name}
          onConfirm={confirmDelete}
          onCancel={() => setDeletingItem(null)}
          confirming={deleting}
        />
      )}
    </div>
  );
}

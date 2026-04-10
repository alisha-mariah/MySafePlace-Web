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
import ConfirmDeleteModal from "@/src/components/admin/ConfirmDeleteModal";

type Msg = { text: string; type: "success" | "error" };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<Msg | null>(null);

  // Add category
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
      setCategories(await getCategories());
    } catch { setMessage({ text: "Failed to load categories.", type: "error" }); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Category CRUD ──

  async function handleAddCategory() {
    if (!newCatName.trim()) return;
    setAddingCat(true);
    try {
      await addCategory(newCatName.trim());
      setNewCatName("");
      setMessage({ text: "Category added.", type: "success" });
      await load();
    } catch { setMessage({ text: "Failed to add category.", type: "error" }); }
    finally { setAddingCat(false); }
  }

  async function handleSaveCategoryName() {
    if (!editingCatId || !editingCatName.trim()) return;
    try {
      await updateCategoryName(editingCatId, editingCatName.trim());
      setEditingCatId(null);
      setMessage({ text: "Category renamed.", type: "success" });
      await load();
    } catch { setMessage({ text: "Failed to rename category.", type: "error" }); }
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
    } catch { setMessage({ text: "Failed to add subcategory.", type: "error" }); }
  }

  async function handleSaveSubName() {
    if (!editingSub || !editingSubName.trim()) return;
    try {
      await renameSubcategory(editingSub.catId, editingSub.oldName, editingSubName.trim());
      setEditingSub(null);
      setMessage({ text: "Subcategory renamed.", type: "success" });
      await load();
    } catch { setMessage({ text: "Failed to rename subcategory.", type: "error" }); }
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
    } catch { setMessage({ text: "Failed to delete.", type: "error" }); }
    finally { setDeleting(false); }
  }

  const inputStyle = {
    border: "1.5px solid rgba(200,230,208,0.6)",
    backgroundColor: "rgba(255,255,255,0.8)",
    color: "#1A3D2B",
  };

  return (
    <div className="relative min-h-screen">
      {/* Header */}
      <header className="relative z-10 mx-auto max-w-3xl px-6 pt-8 pb-2">
        <Link href="/admin" className="mb-5 inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium transition-all" style={{ color: "#6B9E85", backgroundColor: "rgba(255,255,255,0.7)", border: "1px solid rgba(200,230,208,0.5)", backdropFilter: "blur(8px)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          Admin Panel
        </Link>

        <div className="animate-fade-in-up rounded-2xl px-7 py-6" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.55) 100%)", border: "1px solid rgba(200,230,208,0.45)", boxShadow: "0 8px 32px rgba(45,106,79,0.06), 0 2px 8px rgba(45,106,79,0.03)", backdropFilter: "blur(12px)" }}>
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: "linear-gradient(135deg, rgba(184,216,196,0.35) 0%, rgba(200,230,208,0.25) 100%)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4E9B78" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight" style={{ color: "#1A3D2B" }}>Category Management</h1>
              <p className="mt-0.5 text-sm" style={{ color: "#6B9E85" }}>
                {loading ? "Loading..." : `${categories.length} categor${categories.length !== 1 ? "ies" : "y"}`}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-6">
        {message && <AdminMessage message={message.text} type={message.type} onDismiss={() => setMessage(null)} />}

        {/* Add category */}
        <div className="animate-fade-in-up-1 mb-6 flex gap-2">
          <input
            type="text"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleAddCategory(); }}
            placeholder="New category name..."
            className="auth-input flex-1 rounded-xl px-4 py-2.5 text-[14px]"
            style={inputStyle}
          />
          <button
            onClick={handleAddCategory}
            disabled={addingCat || !newCatName.trim()}
            className="nature-btn flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-bold text-white"
            style={{ background: "linear-gradient(135deg, #5EA88A 0%, #4A9874 100%)", boxShadow: "0 4px 14px rgba(93,168,138,0.25)", opacity: addingCat || !newCatName.trim() ? 0.6 : 1 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            Add
          </button>
        </div>

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
            <p className="text-sm" style={{ color: "#8DBFA5" }}>No categories yet. Create your first category above.</p>
          </div>
        ) : (
          <div className="animate-fade-in-up-2 space-y-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="rounded-2xl"
                style={{ background: "linear-gradient(145deg, #FFFFFF 0%, #F8FCF9 100%)", border: "1px solid rgba(200,230,208,0.4)", boxShadow: "0 2px 8px rgba(45,106,79,0.04)" }}
              >
                {/* Category header */}
                <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: "1px solid rgba(200,230,208,0.25)" }}>
                  {editingCatId === cat.id ? (
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
                      <button onClick={handleSaveCategoryName} className="rounded-lg px-3 py-1.5 text-[12px] font-semibold" style={{ backgroundColor: "rgba(168,213,186,0.15)", color: "#4E9B78", border: "1px solid rgba(168,213,186,0.3)" }}>Save</button>
                      <button onClick={() => setEditingCatId(null)} className="rounded-lg px-3 py-1.5 text-[12px] font-semibold" style={{ color: "#6B9E85" }}>Cancel</button>
                    </div>
                  ) : (
                    <>
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: "rgba(168,213,186,0.15)" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4E9B78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
                      </div>
                      <h3 className="flex-1 text-[15px] font-bold" style={{ color: "#1A3D2B" }}>{cat.name}</h3>
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: "rgba(200,230,208,0.25)", color: "#6B9E85" }}>
                        {cat.subcategories.length} sub
                      </span>
                      <button
                        onClick={() => { setEditingCatId(cat.id); setEditingCatName(cat.name); }}
                        className="rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all"
                        style={{ backgroundColor: "rgba(168,213,186,0.12)", color: "#4E9B78", border: "1px solid rgba(168,213,186,0.25)" }}
                      >
                        Rename
                      </button>
                      <button
                        onClick={() => setDeletingItem({ type: "category", catId: cat.id, name: cat.name })}
                        className="rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all"
                        style={{ backgroundColor: "rgba(254,242,242,0.5)", color: "#C46050", border: "1px solid rgba(252,202,202,0.4)" }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>

                {/* Subcategories */}
                <div className="px-5 py-3 space-y-1.5">
                  {cat.subcategories.length === 0 && addingSubTo !== cat.id && (
                    <p className="py-2 text-[12px]" style={{ color: "#A8C4B4" }}>No subcategories yet.</p>
                  )}

                  {cat.subcategories.map((sub) => (
                    <div key={sub} className="group flex items-center gap-2 rounded-lg px-3 py-2 transition-all" style={{ backgroundColor: "rgba(200,230,208,0.06)" }}>
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
                          <button onClick={handleSaveSubName} className="text-[11px] font-semibold" style={{ color: "#4E9B78" }}>Save</button>
                          <button onClick={() => setEditingSub(null)} className="text-[11px] font-semibold" style={{ color: "#6B9E85" }}>Cancel</button>
                        </div>
                      ) : (
                        <>
                          <span className="flex-1 text-[13px]" style={{ color: "#1A3D2B" }}>{sub}</span>
                          <div className="flex items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                            <button
                              onClick={() => { setEditingSub({ catId: cat.id, oldName: sub }); setEditingSubName(sub); }}
                              className="text-[11px] font-semibold" style={{ color: "#4E9B78" }}
                            >
                              Rename
                            </button>
                            <button
                              onClick={() => setDeletingItem({ type: "subcategory", catId: cat.id, name: sub })}
                              className="text-[11px] font-semibold" style={{ color: "#C46050" }}
                            >
                              Remove
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}

                  {/* Add subcategory inline */}
                  {addingSubTo === cat.id ? (
                    <div className="flex items-center gap-2 pt-1">
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
                        className="rounded-lg px-3 py-1.5 text-[12px] font-semibold"
                        style={{ backgroundColor: "rgba(168,213,186,0.15)", color: "#4E9B78", border: "1px solid rgba(168,213,186,0.3)", opacity: newSubName.trim() ? 1 : 0.5 }}
                      >
                        Add
                      </button>
                      <button onClick={() => { setAddingSubTo(null); setNewSubName(""); }} className="text-[12px] font-semibold" style={{ color: "#6B9E85" }}>Cancel</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setAddingSubTo(cat.id); setNewSubName(""); }}
                      className="mt-1 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-all"
                      style={{ color: "#5EA88A", backgroundColor: "rgba(94,168,138,0.06)", border: "1px dashed rgba(94,168,138,0.25)" }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                      Add subcategory
                    </button>
                  )}
                </div>
              </div>
            ))}
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

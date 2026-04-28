"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  AdminCrisisContact,
  CrisisContactFormData,
  getAllCrisisContacts,
  addCrisisContact,
  updateCrisisContact,
  deleteCrisisContact,
  seedDefaultCrisisContacts,
} from "@/src/services/adminCrisisContactService";
import CrisisContactForm from "@/src/components/admin/CrisisContactForm";
import AdminMessage from "@/src/components/admin/AdminMessage";
import ConfirmDeleteModal from "@/src/components/ui/ConfirmDeleteModal";

type Msg = { text: string; type: "success" | "error" };

export default function AdminCrisisContactsPage() {
  const [contacts, setContacts] = useState<AdminCrisisContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminCrisisContact | null>(null);
  const [deletingContact, setDeletingContact] = useState<AdminCrisisContact | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState<Msg | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const load = useCallback(async () => {
    try {
      await seedDefaultCrisisContacts();
      setContacts(await getAllCrisisContacts());
    } catch {
      setMessage({ text: "Failed to load contacts.", type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const activeContacts = contacts.filter((c) => c.active);
  const primaryContact = activeContacts.find((c) => c.category === "primary");
  const generalContacts = activeContacts.filter((c) => c.category !== "primary");

  async function handleSave(data: CrisisContactFormData) {
    try {
      if (editing) {
        await updateCrisisContact(editing.id, data);
        setMessage({ text: "Contact updated.", type: "success" });
      } else {
        await addCrisisContact(data);
        setMessage({ text: "Contact added.", type: "success" });
      }
      setFormOpen(false);
      setEditing(null);
      await load();
    } catch {
      setMessage({ text: "Failed to save.", type: "error" });
    }
  }

  async function confirmDelete() {
    if (!deletingContact) return;
    setDeleting(true);
    try {
      await deleteCrisisContact(deletingContact.id);
      setMessage({ text: `"${deletingContact.name}" has been deleted.`, type: "success" });
      setDeletingContact(null);
      await load();
    } catch {
      setMessage({ text: "Failed to delete.", type: "error" });
    } finally {
      setDeleting(false);
    }
  }

  async function handleToggleActive(c: AdminCrisisContact) {
    const newActive = !c.active;
    // Optimistic: update UI instantly
    setContacts((prev) => prev.map((x) => (x.id === c.id ? { ...x, active: newActive } : x)));
    try {
      await updateCrisisContact(c.id, { active: newActive });
      setMessage({ text: newActive ? `"${c.name}" is now visible to users.` : `"${c.name}" is now hidden from users.`, type: "success" });
    } catch {
      // Revert on failure
      setContacts((prev) => prev.map((x) => (x.id === c.id ? { ...x, active: c.active } : x)));
      setMessage({ text: "Failed to update.", type: "error" });
    }
  }

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
          style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.55) 100%)", border: "1px solid rgba(200,230,208,0.45)", boxShadow: "0 8px 32px rgba(45,106,79,0.06)", backdropFilter: "blur(12px)" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: "linear-gradient(135deg, rgba(242,196,206,0.25) 0%, rgba(200,230,208,0.20) 100%)" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C07080" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight" style={{ color: "#1A3D2B" }}>Crisis Contacts</h1>
                <p className="mt-0.5 text-sm" style={{ color: "#6B9E85" }}>
                  {loading ? "Loading..." : `${contacts.length} contact${contacts.length !== 1 ? "s" : ""} \u00B7 ${activeContacts.length} active`}
                </p>
              </div>
            </div>
            <button
              onClick={() => { setEditing(null); setFormOpen(true); }}
              className="nature-btn flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-bold text-white"
              style={{ background: "linear-gradient(135deg, #3D8B6A 0%, #2D6A4F 100%)", boxShadow: "0 4px 14px rgba(45,106,79,0.28)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              Add Contact
            </button>
          </div>
          <p className="mt-4 text-[13px] leading-relaxed" style={{ color: "#8DBFA5" }}>
            These contacts are shown to all users on the public Emergency Contacts page. The contact marked as &ldquo;Primary&rdquo; appears prominently at the top. Use Sort Order to control the display order, and toggle visibility to show or hide individual contacts.
          </p>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-6">
        {message && <AdminMessage message={message.text} type={message.type} onDismiss={() => setMessage(null)} />}

        {/* Preview toggle */}
        {!loading && activeContacts.length > 0 && (
          <div className="mb-4">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg px-3.5 py-2 text-[12px] font-semibold transition-all duration-150 hover:-translate-y-0.5 hover:border-[rgba(125,184,146,0.6)] hover:bg-white hover:text-[#2D6A4F] hover:shadow-[0_4px_12px_rgba(45,106,79,0.12)]"
              style={{ color: "#6B9E85", backgroundColor: "rgba(255,255,255,0.7)", border: "1.5px solid rgba(200,230,208,0.4)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
              </svg>
              {showPreview ? "Hide Preview" : "Preview Public Page"}
            </button>
          </div>
        )}

        {/* Preview section */}
        {showPreview && (
          <div
            className="animate-fade-in-up mb-6 rounded-2xl p-5"
            style={{ backgroundColor: "rgba(245,249,246,0.6)", border: "1px dashed rgba(200,230,208,0.5)" }}
          >
            <p className="mb-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: "#8DBFA5" }}>
              User preview — how this looks on the Emergency Contacts page
            </p>

            {/* Primary preview */}
            {primaryContact && (
              <div
                className="mb-3 rounded-xl border-2 px-5 py-4"
                style={{ background: "linear-gradient(135deg, rgba(94,172,134,0.06) 0%, rgba(242,196,206,0.04) 100%)", borderColor: "rgba(94,172,134,0.20)" }}
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider" style={{ backgroundColor: "rgba(94,172,134,0.12)", color: "#2D6A4F" }}>Primary resource</span>
                </div>
                <h3 className="text-[16px] font-bold" style={{ color: "#1A3D2B" }}>{primaryContact.name}</h3>
                <p className="mt-0.5 text-[12px]" style={{ color: "#6B9E85" }}>{primaryContact.description}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {primaryContact.phone && <span className="rounded-lg px-2.5 py-1 text-[11px] font-semibold" style={{ backgroundColor: "rgba(94,172,134,0.08)", color: "#2D6A4F" }}>Call {primaryContact.phone}</span>}
                  {primaryContact.sms && <span className="rounded-lg px-2.5 py-1 text-[11px] font-semibold" style={{ backgroundColor: "rgba(242,196,206,0.12)", color: "#A8607A" }}>Text {primaryContact.sms}</span>}
                  {primaryContact.chatUrl && <span className="rounded-lg px-2.5 py-1 text-[11px] font-semibold text-white" style={{ background: "linear-gradient(135deg, #4A9B7A 0%, #3D8B6A 50%, #2D6A4F 100%)" }}>Chat</span>}
                </div>
              </div>
            )}

            {/* General previews */}
            {generalContacts.length > 0 && (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {generalContacts.slice(0, 3).map((c) => (
                  <div key={c.id} className="rounded-xl border px-4 py-3" style={{ backgroundColor: "white", borderColor: "rgba(200,230,208,0.4)" }}>
                    <h4 className="text-[13px] font-bold" style={{ color: "#1A3D2B" }}>{c.name}</h4>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {c.phone && <span className="rounded px-1.5 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: "rgba(94,172,134,0.08)", color: "#2D6A4F" }}>Call {c.phone}</span>}
                      {c.sms && <span className="rounded px-1.5 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: "rgba(242,196,206,0.12)", color: "#A8607A" }}>Text {c.sms}</span>}
                      {c.chatUrl && <span className="rounded px-1.5 py-0.5 text-[10px] font-semibold text-white" style={{ backgroundColor: "#5EA88A" }}>Chat</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {generalContacts.length > 3 && (
              <p className="mt-2 text-center text-[11px]" style={{ color: "#A8C4B4" }}>
                + {generalContacts.length - 3} more contact{generalContacts.length - 3 !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        )}

        {/* Contact list */}
        {loading ? (
          <div className="flex justify-center py-20">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="nature-float">
              <path d="M6 3 C10 7 12 13 10 19 C8 19 2 17 1 13 C-1 9 2 5 6 3 Z" fill="#7DB892" opacity="0.6" />
            </svg>
          </div>
        ) : contacts.length === 0 ? (
          <div className="animate-fade-in-up-2 rounded-2xl border border-dashed py-16 text-center" style={{ borderColor: "rgba(200,230,208,0.5)", background: "rgba(255,255,255,0.4)" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#A8D5BA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            <p className="text-[14px] font-semibold" style={{ color: "#6B9E85" }}>No crisis contacts yet</p>
            <p className="mt-1 text-[12px]" style={{ color: "#8DBFA5" }}>Add your first contact to get started.</p>
          </div>
        ) : (
          <div className="animate-fade-in-up-2 space-y-2">
            {contacts.map((c, i) => (
              <div
                key={c.id}
                className="group rounded-xl px-5 py-4 transition-all"
                style={{
                  background: c.active
                    ? "linear-gradient(145deg, #FFFFFF 0%, #F8FCF9 100%)"
                    : "linear-gradient(145deg, #FAFAFA 0%, #F5F5F5 100%)",
                  border: `1px solid ${c.active ? "rgba(200,230,208,0.4)" : "rgba(200,200,200,0.3)"}`,
                  boxShadow: "0 1px 3px rgba(45,106,79,0.04)",
                  animation: `fadeInUp 0.3s ease-out ${i * 0.03}s both`,
                }}
              >
                <div className="flex items-start gap-4">
                  {/* Sort order badge */}
                  <div
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-[11px] font-bold"
                    style={{
                      backgroundColor: c.active ? "rgba(200,230,208,0.20)" : "rgba(200,200,200,0.15)",
                      color: c.active ? "#4E9B78" : "#AAA",
                    }}
                  >
                    #{c.sortOrder}
                  </div>

                  {/* Main info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-[14px] font-bold" style={{ color: c.active ? "#1A3D2B" : "#888" }}>
                        {c.name}
                      </h3>
                      {c.category === "primary" && (
                        <span className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider" style={{ backgroundColor: "rgba(94,168,138,0.12)", color: "#2D6A4F" }}>
                          Primary
                        </span>
                      )}
                    </div>

                    {c.description && (
                      <p className="mt-0.5 text-[12px] line-clamp-1" style={{ color: "#6B9E85" }}>
                        {c.description}
                      </p>
                    )}

                    {/* Contact method pills */}
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      {c.phone && (
                        <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: "rgba(94,168,138,0.08)", color: "#2D6A4F" }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3" /></svg>
                          {c.phone}
                        </span>
                      )}
                      {c.sms && (
                        <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: "rgba(242,196,206,0.10)", color: "#A8607A" }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                          {c.sms}
                        </span>
                      )}
                      {c.chatUrl && (
                        <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: "rgba(94,168,138,0.08)", color: "#2D6A4F" }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                          Chat
                        </span>
                      )}
                      {c.availability && (
                        <span className="rounded-md px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: "rgba(200,230,208,0.12)", color: "#6B9E85" }}>
                          {c.availability}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Active toggle + actions */}
                  <div className="flex flex-shrink-0 items-center gap-3">
                    {/* Toggle with label */}
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => handleToggleActive(c)}
                        className="relative flex-shrink-0 rounded-full transition-colors"
                        title={c.active ? "Click to hide from users" : "Click to show on public page"}
                        style={{
                          width: 40,
                          height: 24,
                          backgroundColor: c.active ? "#5EA88A" : "#D1D5DB",
                        }}
                      >
                        <span
                          className="absolute top-[2px] block h-[20px] w-[20px] rounded-full bg-white transition-all"
                          style={{ left: c.active ? 18 : 2, boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }}
                        />
                      </button>
                      <span className="text-[9px] font-semibold" style={{ color: c.active ? "#4E9B78" : "#999" }}>
                        {c.active ? "Visible" : "Hidden"}
                      </span>
                    </div>

                    {/* Edit / Delete — always visible */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => { setEditing(c); setFormOpen(true); }}
                        className="cursor-pointer rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-all duration-150 hover:-translate-y-0.5 hover:bg-[rgba(168,213,186,0.30)] hover:text-[#2D6A4F] hover:shadow-[0_4px_10px_rgba(45,106,79,0.15)]"
                        style={{ backgroundColor: "rgba(168,213,186,0.15)", color: "#4E9B78", border: "1px solid rgba(168,213,186,0.3)" }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeletingContact(c)}
                        className="cursor-pointer rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-all duration-150 hover:-translate-y-0.5 hover:bg-[rgba(254,226,226,0.9)] hover:text-[#A83A2A] hover:shadow-[0_4px_10px_rgba(196,96,80,0.18)]"
                        style={{ backgroundColor: "rgba(254,242,242,0.6)", color: "#C46050", border: "1px solid rgba(252,202,202,0.5)" }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form modal */}
      {formOpen && (
        <CrisisContactForm
          contact={editing}
          onSave={handleSave}
          onCancel={() => { setFormOpen(false); setEditing(null); }}
        />
      )}

      {/* Delete confirmation */}
      {deletingContact && (
        <ConfirmDeleteModal
          title="Delete Crisis Contact"
          itemName={deletingContact.name}
          onConfirm={confirmDelete}
          onCancel={() => setDeletingContact(null)}
          confirming={deleting}
        />
      )}
    </div>
  );
}

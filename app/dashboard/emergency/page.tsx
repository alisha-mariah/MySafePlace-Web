"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import { useAuth } from "@/src/context/AuthContext";
import EmergencyPrimaryCard from "@/src/components/EmergencyPrimaryCard";
import EmergencyCard from "@/src/components/EmergencyCard";
import {
  addContact,
  getContacts,
  updateContact,
  deleteContact,
  PersonalContact,
} from "@/src/services/contactService";
import { getActiveCrisisContacts, CrisisContact } from "@/src/services/crisisContactService";

/* ── Personal contact card ── */

function PersonalContactCard({
  contact,
  onEdit,
  onDelete,
}: {
  contact: PersonalContact;
  onEdit: (c: PersonalContact) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div
      className="group rounded-2xl border p-5 transition-all hover:shadow-md"
      style={{ backgroundColor: "white", borderColor: "rgba(200,230,208,0.5)", boxShadow: "0 1px 4px rgba(45,106,79,0.04)" }}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] font-bold" style={{ color: "#1A3D2B" }}>{contact.name}</h3>
          {contact.relationship && (
            <span className="mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: "rgba(242,196,206,0.18)", color: "#A8607A" }}>
              {contact.relationship}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button onClick={() => onEdit(contact)} className="rounded-lg p-2 transition-all hover:bg-white/60 hover:scale-110" aria-label="Edit contact">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B8B78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
          </button>
          <button onClick={() => onDelete(contact.id)} className="rounded-lg p-2 transition-all hover:bg-red-50/60 hover:scale-110" aria-label="Delete contact">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C07070" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
          </button>
        </div>
      </div>

      <div className="mt-3">
        <div className="inline-flex items-center gap-2 rounded-lg px-3 py-2" style={{ backgroundColor: "rgba(94,172,134,0.06)", border: "1px solid rgba(94,172,134,0.15)" }}>
          <div className="flex h-6 w-6 items-center justify-center rounded-md" style={{ backgroundColor: "rgba(94,172,134,0.12)" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4A9474" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </div>
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: "#6B9E85" }}>Phone</p>
            <p className="text-[13px] font-bold" style={{ color: "#1A3D2B" }}>{contact.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Page ── */

function EmergencyContent() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<PersonalContact[]>([]);
  const [loading, setLoading] = useState(true);

  // Crisis contacts from Firestore
  const [crisisContacts, setCrisisContacts] = useState<CrisisContact[]>([]);
  const [crisisLoading, setCrisisLoading] = useState(true);

  useEffect(() => {
    getActiveCrisisContacts()
      .then(setCrisisContacts)
      .catch(() => {})
      .finally(() => setCrisisLoading(false));
  }, []);

  const primaryContact = crisisContacts.find((c) => c.category === "primary") ?? null;
  const additionalContacts = crisisContacts.filter((c) => c.category !== "primary");

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [relationship, setRelationship] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchContacts = useCallback(async () => {
    if (!user) return;
    try {
      const data = await getContacts(user.uid);
      setContacts(data);
    } catch (err) {
      console.error("Failed to load contacts:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  function resetForm() {
    setFirstName("");
    setLastName("");
    setPhone("");
    setRelationship("");
    setEditingId(null);
    setShowForm(false);
  }

  function handleEdit(c: PersonalContact) {
    const parts = c.name.split(" ");
    setFirstName(parts[0] || "");
    setLastName(parts.slice(1).join(" ") || "");
    setPhone(c.phone);
    setRelationship(c.relationship);
    setEditingId(c.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this contact?")) return;
    try {
      await deleteContact(id);
      await fetchContacts();
    } catch (err) {
      console.error("Failed to delete contact:", err);
    }
  }

  async function handleSave() {
    if (!firstName.trim() || !lastName.trim() || !phone.trim() || !user) return;
    setSaving(true);
    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    try {
      if (editingId) {
        await updateContact(editingId, fullName, phone.trim(), relationship.trim());
      } else {
        await addContact(user.uid, fullName, phone.trim(), relationship.trim());
      }
      resetForm();
      await fetchContacts();
    } catch (err) {
      console.error("Failed to save contact:", err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="relative min-h-screen">
      {/* Header */}
      <header className="mx-auto max-w-5xl px-6 pt-8 pb-2">
        <Link
          href="/dashboard"
          className="pill-btn mb-5 inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium"
          style={{ color: "#6B9E85", backgroundColor: "rgba(255,255,255,0.7)", border: "1px solid rgba(200,230,208,0.5)", backdropFilter: "blur(8px)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          Homepage
        </Link>
        <div
          className="card-drop rounded-2xl border p-6"
          style={{ backgroundColor: "white", borderColor: "rgba(200,230,208,0.5)", boxShadow: "0 1px 4px rgba(45,106,79,0.04)" }}
        >
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: "linear-gradient(135deg, rgba(242,196,206,0.25) 0%, rgba(200,230,208,0.20) 100%)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C07080" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>
            <div>
              <h1 className="text-[18px] font-bold tracking-tight" style={{ color: "#1A3D2B" }}>You are not alone</h1>
              <p className="mt-0.5 text-[13px]" style={{ color: "#6B9E85" }}>If you need immediate support, these resources are here for you</p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-6 space-y-6">
        {/* Primary contact */}
        {!crisisLoading && primaryContact && (
          <div className="card-drop-1">
            <EmergencyPrimaryCard
              name={primaryContact.name}
              description={primaryContact.description}
              phone={primaryContact.phone || undefined}
              sms={primaryContact.sms || undefined}
              chatUrl={primaryContact.chatUrl || undefined}
            />
          </div>
        )}

        {/* ── My People section ── */}
        <div className="card-drop-2">
          <div
            className="rounded-2xl border p-5"
            style={{ backgroundColor: "white", borderColor: "rgba(200,230,208,0.5)", boxShadow: "0 1px 4px rgba(45,106,79,0.04)" }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[14px] font-bold" style={{ color: "#1A3D2B" }}>My people</h2>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-bold transition-all"
                  style={{ color: "#4A9474", backgroundColor: "rgba(94,172,134,0.10)", border: "1.5px solid rgba(94,172,134,0.20)" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                  Add contact
                </button>
              )}
            </div>

            {/* Add/Edit form */}
            {showForm && (
              <div
                className="mb-5 rounded-xl border p-4"
                style={{ backgroundColor: "rgba(245,249,246,0.6)", borderColor: "rgba(200,230,208,0.4)" }}
              >
                <p className="mb-3 text-[13px] font-semibold" style={{ color: "#1A3D2B" }}>
                  {editingId ? "Edit contact" : "Add someone you trust"}
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    className="auth-input rounded-lg border px-3 py-2.5 text-[13px]"
                    style={{ borderColor: "rgba(200,230,208,0.5)", backgroundColor: "white", color: "#1A3D2B" }}
                  />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    className="auth-input rounded-lg border px-3 py-2.5 text-[13px]"
                    style={{ borderColor: "rgba(200,230,208,0.5)", backgroundColor: "white", color: "#1A3D2B" }}
                  />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone number"
                    className="auth-input rounded-lg border px-3 py-2.5 text-[13px]"
                    style={{ borderColor: "rgba(200,230,208,0.5)", backgroundColor: "white", color: "#1A3D2B" }}
                  />
                  <input
                    type="text"
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    placeholder="Relationship (e.g. Mom, Friend)"
                    className="auth-input rounded-lg border px-3 py-2.5 text-[13px]"
                    style={{ borderColor: "rgba(200,230,208,0.5)", backgroundColor: "white", color: "#1A3D2B" }}
                  />
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={handleSave}
                    disabled={!firstName.trim() || !lastName.trim() || !phone.trim() || saving}
                    className="rounded-lg px-4 py-2 text-[12px] font-bold text-white disabled:opacity-50"
                    style={{ background: "linear-gradient(135deg, #4A9B7A 0%, #3D8B6A 50%, #2D6A4F 100%)" }}
                  >
                    {saving ? "Saving..." : editingId ? "Save changes" : "Add contact"}
                  </button>
                  <button
                    onClick={resetForm}
                    className="text-[12px] font-medium"
                    style={{ color: "#6B9E85" }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Personal contacts list */}
            {loading ? (
              <div className="flex justify-center py-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="nature-float">
                  <path d="M6 3 C10 7 12 13 10 19 C8 19 2 17 1 13 C-1 9 2 5 6 3 Z" fill="#7DB892" opacity="0.6" />
                </svg>
              </div>
            ) : contacts.length === 0 && !showForm ? (
              <div className="rounded-xl border border-dashed py-8 text-center" style={{ borderColor: "rgba(200,230,208,0.5)" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A8D5BA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="19" y1="8" x2="19" y2="14" />
                  <line x1="22" y1="11" x2="16" y2="11" />
                </svg>
                <p className="text-[13px]" style={{ color: "#8DBFA5" }}>Add people you trust so you can reach them quickly.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {contacts.map((c) => (
                  <PersonalContactCard key={c.id} contact={c} onEdit={handleEdit} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Additional resources */}
        {!crisisLoading && additionalContacts.length > 0 && (
          <div className="card-drop-3">
            <div
              className="rounded-2xl border p-5"
              style={{ backgroundColor: "white", borderColor: "rgba(200,230,208,0.5)", boxShadow: "0 1px 4px rgba(45,106,79,0.04)" }}
            >
              <h2 className="mb-4 text-[14px] font-bold" style={{ color: "#1A3D2B" }}>More resources</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {additionalContacts.map((c) => (
                  <EmergencyCard
                    key={c.id}
                    name={c.name}
                    description={c.description}
                    phone={c.phone || undefined}
                    sms={c.sms || undefined}
                    chatUrl={c.chatUrl || undefined}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Supportive footer */}
        <div className="card-drop-4 pt-4 pb-8 text-center">
          <div className="mx-auto mb-3 flex items-center justify-center gap-3">
            <div className="h-px w-10" style={{ backgroundColor: "rgba(200,230,208,0.5)" }} />
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C07080" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            <div className="h-px w-10" style={{ backgroundColor: "rgba(200,230,208,0.5)" }} />
          </div>
          <p className="text-[12px] font-medium" style={{ color: "#8DBFA5" }}>Reaching out is a strong and important step</p>
        </div>
      </div>
    </div>
  );
}

export default function EmergencyPage() {
  return (
    <ProtectedRoute>
      <EmergencyContent />
    </ProtectedRoute>
  );
}

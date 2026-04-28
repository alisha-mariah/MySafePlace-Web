"use client";

import { useState, useEffect } from "react";
import { AdminCrisisContact, CrisisContactFormData } from "@/src/services/adminCrisisContactService";

interface Props {
  contact?: AdminCrisisContact | null;
  onSave: (data: CrisisContactFormData) => Promise<void>;
  onCancel: () => void;
}

const inputBase = "auth-input w-full rounded-xl px-4 py-2.5 text-[14px]";

function fieldStyle(hasError: boolean) {
  return {
    border: `1.5px solid ${hasError ? "rgba(196,96,80,0.5)" : "rgba(200,230,208,0.6)"}`,
    backgroundColor: "rgba(255,255,255,0.8)",
    color: "#1A3D2B",
  };
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-1 block text-[13px] font-semibold" style={{ color: "#1A3D2B" }}>
      {children}
      {required && <span style={{ color: "#C46050" }}> *</span>}
    </label>
  );
}

function HelperText({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-[11px]" style={{ color: "#8DBFA5" }}>{children}</p>;
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 pb-1">
      <span style={{ color: "#6B9E85" }}>{icon}</span>
      <span className="text-[12px] font-bold uppercase tracking-wider" style={{ color: "#8DBFA5" }}>{title}</span>
    </div>
  );
}

export default function CrisisContactForm({ contact, onSave, onCancel }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [sms, setSms] = useState("");
  const [chatUrl, setChatUrl] = useState("");
  const [availability, setAvailability] = useState("");
  const [category, setCategory] = useState("general");
  const [sortOrder, setSortOrder] = useState(0);
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (contact) {
      setName(contact.name);
      setDescription(contact.description);
      setPhone(contact.phone);
      setSms(contact.sms);
      setChatUrl(contact.chatUrl);
      setAvailability(contact.availability);
      setCategory(contact.category);
      setSortOrder(contact.sortOrder);
      setActive(contact.active);
    }
  }, [contact]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!phone.trim() && !sms.trim() && !chatUrl.trim()) errs.contact = "Provide at least one way to reach this resource (phone, text, or chat)";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSaving(true);
    try {
      await onSave({
        name: name.trim(),
        description: description.trim(),
        phone: phone.trim(),
        sms: sms.trim(),
        chatUrl: chatUrl.trim(),
        availability: availability.trim(),
        category,
        sortOrder,
        active,
      });
    } finally {
      setSaving(false);
    }
  }

  const isEditing = !!contact;

  return (
    <div
      className="fixed top-0 right-0 bottom-0 left-56 z-50 flex items-center justify-center p-3"
      style={{ backgroundColor: "rgba(26,61,43,0.3)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="animate-fade-in-up flex w-full max-w-[95vw] flex-col rounded-2xl sm:max-w-2xl"
        style={{
          background: "linear-gradient(145deg, #FFFFFF 0%, #F2FAF5 100%)",
          border: "1px solid rgba(200,230,208,0.5)",
          boxShadow: "0 20px 60px rgba(45,106,79,0.12), 0 8px 24px rgba(45,106,79,0.06)",
          maxHeight: "90vh",
        }}
      >
        {/* Header — fixed */}
        <div className="flex-shrink-0 border-b px-5 py-5 sm:px-7" style={{ borderColor: "rgba(200,230,208,0.4)" }}>
          <h2 className="text-lg font-bold" style={{ color: "#1A3D2B" }}>
            {isEditing ? "Edit Crisis Contact" : "Add Crisis Contact"}
          </h2>
          <p className="mt-0.5 text-[13px]" style={{ color: "#6B9E85" }}>
            {isEditing
              ? "Update the information for this crisis resource."
              : "Add a new crisis resource that will appear on the public Emergency Contacts page for all users."}
          </p>
        </div>

        {/* Scrollable form body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-6 sm:px-7">
          <div className="space-y-6">
            {/* ── Section: Basic info ── */}
            <div className="space-y-4">
              <SectionHeader
                icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>}
                title="Basic Information"
              />
              <div>
                <FieldLabel required>Organization / Resource Name</FieldLabel>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputBase}
                  style={fieldStyle(!!errors.name)}
                  placeholder="e.g. 988 Suicide & Crisis Lifeline"
                />
                {errors.name && <p className="mt-1 text-[11px]" style={{ color: "#C46050" }}>{errors.name}</p>}
              </div>
              <div>
                <FieldLabel>Description</FieldLabel>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className={inputBase + " resize-none"}
                  style={fieldStyle(false)}
                  placeholder="What does this resource offer? Who is it for?"
                />
                <HelperText>A brief summary shown to users under the contact name.</HelperText>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px" style={{ backgroundColor: "rgba(200,230,208,0.3)" }} />

            {/* ── Section: Contact methods ── */}
            <div className="space-y-4">
              <SectionHeader
                icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72" /></svg>}
                title="Contact Methods"
              />
              {errors.contact && (
                <div className="rounded-lg px-3 py-2 text-[12px]" style={{ backgroundColor: "rgba(196,96,80,0.06)", color: "#C46050", border: "1px solid rgba(196,96,80,0.15)" }}>
                  {errors.contact}
                </div>
              )}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <FieldLabel>Phone Number</FieldLabel>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={inputBase}
                    style={fieldStyle(false)}
                    placeholder="e.g. 988"
                  />
                  <HelperText>The number users can call directly.</HelperText>
                </div>
                <div>
                  <FieldLabel>SMS / Text Number</FieldLabel>
                  <input
                    type="text"
                    value={sms}
                    onChange={(e) => setSms(e.target.value)}
                    className={inputBase}
                    style={fieldStyle(false)}
                    placeholder="e.g. 741741"
                  />
                  <HelperText>The number users can text for support.</HelperText>
                </div>
              </div>
              <div>
                <FieldLabel>Chat / Website URL</FieldLabel>
                <input
                  type="text"
                  value={chatUrl}
                  onChange={(e) => setChatUrl(e.target.value)}
                  className={inputBase}
                  style={fieldStyle(false)}
                  placeholder="https://example.org/chat"
                />
                <HelperText>A link to an online chat or the organization&apos;s website.</HelperText>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px" style={{ backgroundColor: "rgba(200,230,208,0.3)" }} />

            {/* ── Section: Display settings ── */}
            <div className="space-y-4">
              <SectionHeader
                icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4" /></svg>}
                title="Display Settings"
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <FieldLabel>Availability</FieldLabel>
                  <input
                    type="text"
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className={inputBase}
                    style={fieldStyle(false)}
                    placeholder="e.g. 24/7"
                  />
                  <HelperText>When this resource is available.</HelperText>
                </div>
                <div>
                  <FieldLabel>Display Type</FieldLabel>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={inputBase + " appearance-none"}
                    style={fieldStyle(false)}
                  >
                    <option value="primary">Primary (large card)</option>
                    <option value="general">General (grid card)</option>
                  </select>
                  <HelperText>Primary shows as a featured card.</HelperText>
                </div>
                <div>
                  <FieldLabel>Sort Order</FieldLabel>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className={inputBase}
                    style={fieldStyle(false)}
                    min={0}
                  />
                  <HelperText>Lower numbers appear first.</HelperText>
                </div>
              </div>

              {/* Active toggle switch */}
              <div
                className="flex items-center justify-between rounded-xl px-5 py-4"
                style={{
                  backgroundColor: active ? "rgba(94,168,138,0.06)" : "rgba(180,180,180,0.06)",
                  border: `1px solid ${active ? "rgba(94,168,138,0.20)" : "rgba(180,180,180,0.18)"}`,
                }}
              >
                <div>
                  <p className="text-[14px] font-semibold" style={{ color: "#1A3D2B" }}>
                    {active ? "Visible to all users" : "Hidden from users"}
                  </p>
                  <p className="mt-0.5 text-[12px]" style={{ color: "#6B9E85" }}>
                    {active
                      ? "This contact is live on the public Emergency Contacts page."
                      : "This contact is saved but won't appear on the public page."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActive(!active)}
                  className="relative flex-shrink-0 rounded-full transition-colors"
                  style={{
                    width: 48,
                    height: 28,
                    backgroundColor: active ? "#5EA88A" : "#D1D5DB",
                  }}
                >
                  <span
                    className="absolute top-[3px] block h-[22px] w-[22px] rounded-full bg-white transition-all"
                    style={{
                      left: active ? 23 : 3,
                      boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                    }}
                  />
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Footer — fixed */}
        <div
          className="flex flex-shrink-0 items-center justify-end gap-3 border-t px-5 py-4 sm:px-7"
          style={{ borderColor: "rgba(200,230,208,0.4)" }}
        >
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
            onClick={handleSubmit}
            disabled={saving}
            className="nature-btn rounded-xl px-7 py-2.5 text-[13px] font-bold text-white"
            style={{
              background: "linear-gradient(135deg, #3D8B6A 0%, #2D6A4F 100%)",
              boxShadow: "0 4px 14px rgba(45,106,79,0.28)",
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? "Saving..." : isEditing ? "Save Changes" : "Add Contact"}
          </button>
        </div>
      </div>
    </div>
  );
}

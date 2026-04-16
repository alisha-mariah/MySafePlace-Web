"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import {
  reauthenticate,
  updateDisplayName,
  updateUserEmail,
  changeUserPassword,
  deleteUserAccount,
} from "@/src/services/profileService";

/* ── Shared helpers ── */

function validatePassword(pw: string): string | null {
  if (pw.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(pw)) return "Password must include at least one uppercase letter.";
  if (!/[a-z]/.test(pw)) return "Password must include at least one lowercase letter.";
  if (!/[^A-Za-z0-9]/.test(pw)) return "Password must include at least one special character.";
  return null;
}

function isFirebaseReauthError(err: unknown): boolean {
  if (err && typeof err === "object" && "code" in err) {
    const code = (err as { code: string }).code;
    return code === "auth/requires-recent-login";
  }
  return false;
}

function firebaseErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "code" in err) {
    const code = (err as { code: string }).code;
    switch (code) {
      case "auth/wrong-password": return "Incorrect password. Please try again.";
      case "auth/invalid-credential": return "Incorrect password. Please try again.";
      case "auth/too-many-requests": return "Too many attempts. Please try again later.";
      case "auth/email-already-in-use": return "This email is already in use by another account.";
      case "auth/invalid-email": return "Please enter a valid email address.";
      case "auth/requires-recent-login": return "Please verify your current password to continue.";
      case "auth/weak-password": return "Password is too weak.";
    }
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong. Please try again.";
}

type Msg = { text: string; type: "success" | "error" } | null;

const cardStyle = {
  background: "linear-gradient(145deg, #FFFFFF 0%, #F8FCF9 100%)",
  border: "1px solid rgba(200,230,208,0.4)",
  boxShadow: "0 2px 8px rgba(45,106,79,0.04)",
};

const inputClass = "auth-input w-full rounded-xl px-4 py-2.5 text-[14px]";
const inputStyle = { border: "1.5px solid rgba(200,230,208,0.6)", backgroundColor: "rgba(255,255,255,0.8)", color: "#1A3D2B" };
const errInputStyle = { border: "1.5px solid rgba(196,96,80,0.5)", backgroundColor: "rgba(255,255,255,0.8)", color: "#1A3D2B" };

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[16px] font-bold" style={{ color: "#1A3D2B" }}>{children}</h2>;
}

function SectionDesc({ children }: { children: React.ReactNode }) {
  return <p className="mt-0.5 text-[13px]" style={{ color: "#6B9E85" }}>{children}</p>;
}

function MessageBanner({ msg, onDismiss }: { msg: Msg; onDismiss: () => void }) {
  useEffect(() => {
    if (msg?.type === "success") {
      const timer = setTimeout(() => onDismiss(), 4000);
      return () => clearTimeout(timer);
    }
  }, [msg, onDismiss]);

  if (!msg) return null;
  const ok = msg.type === "success";
  return (
    <div
      className="mb-4 flex items-center justify-between rounded-xl px-4 py-3 text-[13px] font-semibold"
      style={{
        backgroundColor: ok ? "rgba(94,168,138,0.08)" : "rgba(196,96,80,0.08)",
        border: `1px solid ${ok ? "rgba(94,168,138,0.25)" : "rgba(196,96,80,0.25)"}`,
        color: ok ? "#2D6A4F" : "#9B2C2C",
      }}
    >
      {msg.text}
      <button onClick={onDismiss} className="ml-3 cursor-pointer text-[11px] opacity-60 hover:opacity-100">✕</button>
    </div>
  );
}

/* ── Re-auth modal ── */

function ReauthModal({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const { user } = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !password.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await reauthenticate(user, password);
      onSuccess();
    } catch (err) {
      setError(firebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed top-0 right-0 bottom-0 left-56 z-50 flex items-center justify-center p-3" style={{ backgroundColor: "rgba(26,61,43,0.3)", backdropFilter: "blur(4px)" }}>
      <div className="animate-fade-in-up w-full max-w-sm rounded-2xl p-6" style={{ ...cardStyle, boxShadow: "0 20px 60px rgba(45,106,79,0.12)" }}>
        <h3 className="text-lg font-bold" style={{ color: "#1A3D2B" }}>Verify your identity</h3>
        <p className="mt-1 text-[13px]" style={{ color: "#6B9E85" }}>Enter your current password to continue.</p>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Current password"
            autoFocus
            className={inputClass}
            style={error ? errInputStyle : inputStyle}
          />
          {error && <p className="text-[12px]" style={{ color: "#C46050" }}>{error}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onCancel} className="cursor-pointer rounded-xl px-4 py-2 text-[13px] font-semibold transition-all duration-150 hover:opacity-70" style={{ color: "#6B9E85" }}>Cancel</button>
            <button type="submit" disabled={loading || !password.trim()} className="nature-btn cursor-pointer rounded-xl px-5 py-2 text-[13px] font-bold text-white" style={{ background: "linear-gradient(135deg, #5EA88A 0%, #4A9874 100%)", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Verifying..." : "Continue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Page ── */

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();

  // Display name
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [nameMsg, setNameMsg] = useState<Msg>(null);
  const [nameSaving, setNameSaving] = useState(false);

  // Email
  const [newEmail, setNewEmail] = useState("");
  const [emailMsg, setEmailMsg] = useState<Msg>(null);
  const [emailSaving, setEmailSaving] = useState(false);

  // Password
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwError, setPwError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [pwMsg, setPwMsg] = useState<Msg>(null);
  const [pwSaving, setPwSaving] = useState(false);

  // Delete
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState<Msg>(null);
  const [deleting, setDeleting] = useState(false);

  // Re-auth
  const [pendingAction, setPendingAction] = useState<(() => Promise<void>) | null>(null);

  async function withReauth(action: () => Promise<void>) {
    try {
      await action();
    } catch (err) {
      if (isFirebaseReauthError(err)) {
        setPendingAction(() => action);
      } else {
        throw err;
      }
    }
  }

  // ── Display name ──

  async function handleSaveName() {
    if (!user || !displayName.trim()) return;
    setNameSaving(true);
    setNameMsg(null);
    try {
      await updateDisplayName(user, displayName.trim());
      setNameMsg({ text: "Display name updated.", type: "success" });
    } catch (err) {
      setNameMsg({ text: firebaseErrorMessage(err), type: "error" });
    } finally {
      setNameSaving(false);
    }
  }

  // ── Email ──

  async function handleSaveEmail() {
    if (!user || !newEmail.trim()) return;
    setEmailSaving(true);
    setEmailMsg(null);
    try {
      await withReauth(async () => {
        await updateUserEmail(user, newEmail.trim());
        setEmailMsg({ text: "Verification email sent to your new address. Check your inbox.", type: "success" });
        setNewEmail("");
      });
    } catch (err) {
      setEmailMsg({ text: firebaseErrorMessage(err), type: "error" });
    } finally {
      setEmailSaving(false);
    }
  }

  // ── Password ──

  async function handleChangePassword() {
    if (!user) return;
    const v = validatePassword(newPw);
    if (v) { setPwError(v); return; }
    if (newPw !== confirmPw) { setConfirmError("Passwords do not match."); return; }
    setPwError(null);
    setConfirmError(null);
    setPwSaving(true);
    setPwMsg(null);
    try {
      await reauthenticate(user, currentPw);
      await changeUserPassword(user, newPw);
      setPwMsg({ text: "Password changed successfully.", type: "success" });
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
    } catch (err) {
      setPwMsg({ text: firebaseErrorMessage(err), type: "error" });
    } finally {
      setPwSaving(false);
    }
  }

  // ── Delete ──

  async function handleDeleteAccount() {
    if (!user) return;
    setDeleting(true);
    setDeleteMsg(null);
    try {
      await withReauth(async () => {
        await deleteUserAccount(user);
        router.replace("/login");
      });
    } catch (err) {
      setDeleteMsg({ text: firebaseErrorMessage(err), type: "error" });
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  }

  if (!user) return null;

  return (
    <div className="relative min-h-screen">
      {/* Header */}
      <header className="mx-auto max-w-2xl px-6 pt-8 pb-2">
        <div
          className="animate-fade-in-up rounded-2xl px-7 py-6"
          style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.55) 100%)", border: "1px solid rgba(200,230,208,0.45)", boxShadow: "0 8px 32px rgba(45,106,79,0.06), 0 2px 8px rgba(45,106,79,0.03)", backdropFilter: "blur(12px)" }}
        >
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: "linear-gradient(135deg, rgba(184,216,196,0.35) 0%, rgba(200,230,208,0.25) 100%)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4E9B78" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 0 0-16 0" /></svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight" style={{ color: "#1A3D2B" }}>Profile & Settings</h1>
              <p className="mt-0.5 text-sm" style={{ color: "#6B9E85" }}>Manage your account and preferences</p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-2xl space-y-6 px-6 py-6">

        {/* ═══ Profile Information ═══ */}
        <div className="animate-fade-in-up-1 rounded-2xl px-6 py-5" style={cardStyle}>
          <SectionTitle>Profile Information</SectionTitle>
          <SectionDesc>Your name and email address</SectionDesc>

          <div className="mt-5 space-y-4">
            <MessageBanner msg={nameMsg} onDismiss={() => setNameMsg(null)} />

            {/* Display name */}
            <div>
              <label className="mb-1 block text-[13px] font-semibold" style={{ color: "#1A3D2B" }}>Display Name</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  className={inputClass + " flex-1"}
                  style={inputStyle}
                />
                <button
                  onClick={handleSaveName}
                  disabled={nameSaving || !displayName.trim() || displayName.trim() === user.displayName}
                  className="nature-btn cursor-pointer rounded-xl py-2.5 text-center text-[13px] font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #5EA88A 0%, #4A9874 100%)", opacity: nameSaving || !displayName.trim() || displayName.trim() === user.displayName ? 0.5 : 1, minWidth: 130 }}
                >
                  {nameSaving ? "Saving..." : "Save"}
                </button>
              </div>
              <p className="mt-1 text-[11px]" style={{ color: "#8DBFA5" }}>This is how your name appears across the app.</p>
            </div>

            {/* Email */}
            <div>
              <label className="mb-1 block text-[13px] font-semibold" style={{ color: "#1A3D2B" }}>Email Address</label>
              <p className="mb-2 rounded-xl px-4 py-2.5 text-[14px]" style={{ backgroundColor: "rgba(200,230,208,0.08)", border: "1px solid rgba(200,230,208,0.2)", color: "#1A3D2B" }}>
                {user.email}
              </p>

              <MessageBanner msg={emailMsg} onDismiss={() => setEmailMsg(null)} />

              <label className="mb-1 block text-[12px] font-semibold" style={{ color: "#8DBFA5" }}>Change email</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="New email address"
                  className={inputClass + " flex-1"}
                  style={inputStyle}
                />
                <button
                  onClick={handleSaveEmail}
                  disabled={emailSaving || !newEmail.trim()}
                  className="nature-btn cursor-pointer rounded-xl py-2.5 text-center text-[13px] font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #5EA88A 0%, #4A9874 100%)", opacity: emailSaving || !newEmail.trim() ? 0.5 : 1, minWidth: 130 }}
                >
                  {emailSaving ? "Sending..." : "Update"}
                </button>
              </div>
              <p className="mt-1 text-[11px]" style={{ color: "#8DBFA5" }}>A verification email will be sent to the new address. You may need to verify your current password.</p>
            </div>
          </div>
        </div>

        {/* ═══ Account & Security ═══ */}
        <div className="animate-fade-in-up-2 rounded-2xl px-6 py-5" style={cardStyle}>
          <SectionTitle>Account Security</SectionTitle>
          <SectionDesc>Change your password</SectionDesc>

          <div className="mt-6 space-y-5">
            <MessageBanner msg={pwMsg} onDismiss={() => setPwMsg(null)} />

            <div>
              <label className="mb-1.5 block text-[13px] font-semibold" style={{ color: "#1A3D2B" }}>Current Password</label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  placeholder="Enter current password"
                  className={inputClass + " flex-1"}
                  style={inputStyle}
                />
                <div style={{ minWidth: 130 }} />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-[13px] font-semibold" style={{ color: "#1A3D2B" }}>New Password</label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={newPw}
                  onChange={(e) => { setNewPw(e.target.value); if (pwError) setPwError(null); }}
                  onBlur={() => { if (newPw) setPwError(validatePassword(newPw)); }}
                  placeholder="Enter new password"
                  className={inputClass + " flex-1"}
                  style={pwError ? errInputStyle : inputStyle}
                />
                <div style={{ minWidth: 130 }} />
              </div>
              {pwError ? (
                <p className="mt-1 text-[12px]" style={{ color: "#C46050" }}>{pwError}</p>
              ) : (
                <p className="mt-1 text-[11px]" style={{ color: "#8DBFA5" }}>8+ characters with uppercase, lowercase &amp; special character.</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-[13px] font-semibold" style={{ color: "#1A3D2B" }}>Confirm New Password</label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={confirmPw}
                  onChange={(e) => { setConfirmPw(e.target.value); if (confirmError) setConfirmError(null); }}
                  onBlur={() => { if (confirmPw && newPw !== confirmPw) setConfirmError("Passwords do not match."); }}
                  placeholder="Repeat new password"
                  className={inputClass + " flex-1"}
                  style={confirmError ? errInputStyle : inputStyle}
                />
                <button
                  onClick={handleChangePassword}
                  disabled={pwSaving || !currentPw.trim() || !newPw.trim() || !confirmPw.trim()}
                  className="nature-btn cursor-pointer rounded-xl py-2.5 text-center text-[13px] font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #5EA88A 0%, #4A9874 100%)", opacity: pwSaving || !currentPw.trim() || !newPw.trim() || !confirmPw.trim() ? 0.5 : 1, minWidth: 130 }}
                >
                  {pwSaving ? "Changing..." : "Update"}
                </button>
              </div>
              {confirmError && <p className="mt-1 text-[12px]" style={{ color: "#C46050" }}>{confirmError}</p>}
            </div>
          </div>
        </div>

        {/* ═══ Your Safe Space Preferences ═══ */}
        <div className="animate-fade-in-up-3 rounded-2xl px-6 py-5" style={cardStyle}>
          <SectionTitle>Your Safe Space Preferences</SectionTitle>
          <SectionDesc>Personalization settings for your experience</SectionDesc>

          <div className="my-4 h-px" style={{ backgroundColor: "rgba(200,230,208,0.25)" }} />

          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-xl px-4 py-4" style={{ backgroundColor: "rgba(200,230,208,0.05)", border: "1px solid rgba(200,230,208,0.15)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8DBFA5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0">
                <path d="M6 3C10 7 12 13 10 19C8 19 2 17 1 13C-1 9 2 5 6 3Z" />
                <path d="M6 3C5 9 5 15 10 19" />
              </svg>
              <div>
                <p className="text-[13px] font-semibold" style={{ color: "#1A3D2B" }}>Your space is set up</p>
                <p className="mt-0.5 text-[12px] leading-relaxed" style={{ color: "#8DBFA5" }}>
                  More personalization options will appear here as MySafePlace grows. For now, your safe space is ready to use.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl px-4 py-3" style={{ backgroundColor: "rgba(232,202,122,0.04)", border: "1px solid rgba(232,202,122,0.12)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4A017" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0">
                <path d="M2 12 C5 8 8 16 11 12 C14 8 17 16 20 12" />
              </svg>
              <p className="text-[12px]" style={{ color: "#8DBFA5" }}>
                <strong style={{ color: "#6B9E85" }}>Nature sounds</strong> can be toggled from the top bar on any page.
              </p>
            </div>
          </div>
        </div>

        {/* ═══ Danger Zone ═══ */}
        <div className="animate-fade-in-up-3 rounded-2xl px-6 py-5" style={{ background: "linear-gradient(145deg, #FFFFFF 0%, #FFFAFA 100%)", border: "1px solid rgba(196,96,80,0.15)", boxShadow: "0 2px 8px rgba(196,96,80,0.04)" }}>
          <SectionTitle>Danger Zone</SectionTitle>
          <SectionDesc>Permanent actions that cannot be undone</SectionDesc>

          <div className="mt-5">
            <MessageBanner msg={deleteMsg} onDismiss={() => setDeleteMsg(null)} />

            {!showDeleteConfirm ? (
              <div className="flex items-center justify-between rounded-xl px-4 py-4" style={{ backgroundColor: "rgba(196,96,80,0.04)", border: "1px solid rgba(196,96,80,0.12)" }}>
                <div>
                  <p className="text-[14px] font-semibold" style={{ color: "#1A3D2B" }}>Delete your account</p>
                  <p className="mt-0.5 text-[12px]" style={{ color: "#8DBFA5" }}>Permanently remove your account and all associated data.</p>
                </div>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="cursor-pointer rounded-xl px-4 py-2 text-[13px] font-semibold transition-all duration-150 hover:brightness-90"
                  style={{ backgroundColor: "rgba(196,96,80,0.08)", color: "#C46050", border: "1px solid rgba(196,96,80,0.20)" }}
                >
                  Delete Account
                </button>
              </div>
            ) : (
              <div className="rounded-xl px-5 py-5" style={{ backgroundColor: "rgba(196,96,80,0.04)", border: "1px solid rgba(196,96,80,0.18)" }}>
                <div className="mb-3 flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C46050" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                  <p className="text-[14px] font-bold" style={{ color: "#9B2C2C" }}>Are you sure?</p>
                </div>
                <p className="text-[13px] leading-relaxed" style={{ color: "#6B9E85" }}>
                  This will permanently delete your account, mood entries, journal entries, and all personal data. This action <strong style={{ color: "#C46050" }}>cannot be undone</strong>.
                </p>
                <p className="mt-2 text-[12px]" style={{ color: "#8DBFA5" }}>You may be asked to verify your password.</p>
                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleting}
                    className="nature-btn cursor-pointer rounded-xl px-5 py-2.5 text-[13px] font-bold text-white transition-all duration-150"
                    style={{ backgroundColor: "#C46050", boxShadow: "0 4px 14px rgba(196,96,80,0.25)", opacity: deleting ? 0.7 : 1 }}
                  >
                    {deleting ? "Deleting..." : "Yes, delete my account"}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="cursor-pointer rounded-xl px-4 py-2.5 text-[13px] font-semibold transition-all duration-150 hover:opacity-70"
                    style={{ color: "#6B9E85" }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 pb-8 text-center">
          <div className="mx-auto mb-3 flex items-center justify-center gap-3">
            <div className="h-px w-10" style={{ backgroundColor: "rgba(200,230,208,0.5)" }} />
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8E6D0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 0 0-16 0" /></svg>
            <div className="h-px w-10" style={{ backgroundColor: "rgba(200,230,208,0.5)" }} />
          </div>
          <p className="text-[11px]" style={{ color: "#A8C4B4" }}>Your data is stored securely.</p>
        </div>
      </div>

      {/* Re-auth modal */}
      {pendingAction && (
        <ReauthModal
          onSuccess={async () => {
            const action = pendingAction;
            setPendingAction(null);
            try { await action(); } catch (err) {
              setDeleteMsg({ text: firebaseErrorMessage(err), type: "error" });
            }
          }}
          onCancel={() => setPendingAction(null)}
        />
      )}
    </div>
  );
}

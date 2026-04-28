"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/src/services/authService";
import { useAuth } from "@/src/context/AuthContext";
import AuthLeftPanel from "@/src/components/ui/AuthLeftPanel";

function getFirebaseError(error: unknown): string {
  if (error && typeof error === "object" && "code" in error) {
    const code = (error as { code: string }).code;
    switch (code) {
      case "auth/email-already-in-use":
        return "An account with this email already exists.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/weak-password":
        return "Password must be at least 6 characters.";
      case "auth/too-many-requests":
        return "Too many requests. Please try again later.";
    }
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}

/* Corner decoration — bottom right */
function BottomRightDecor() {
  return (
    <div className="pointer-events-none absolute bottom-0 right-0" style={{ width: 160, height: 160 }}>
      <svg viewBox="0 0 160 160" fill="none" className="h-full w-full">
        <path d="M160 160 C125 115 92 78 40 30" stroke="#B8D8C4" strokeWidth="1.2" strokeLinecap="round" opacity="0.45" />
        <g transform="translate(118,118) rotate(45)">
          <path d="M0,-11 C5,-6 5,6 0,11 C-5,6 -5,-6 0,-11 Z" fill="#C8E6D0" opacity="0.42" />
        </g>
        <g transform="translate(138,145)">
          <ellipse cx="0" cy="-3.5" rx="2.5" ry="3.5" fill="#F2C4CE" opacity="0.45" />
          <ellipse cx="0" cy="3.5" rx="2.5" ry="3.5" fill="#F2C4CE" opacity="0.45" />
          <ellipse cx="-3.5" cy="0" rx="3.5" ry="2.5" fill="#F2C4CE" opacity="0.42" />
          <ellipse cx="3.5" cy="0" rx="3.5" ry="2.5" fill="#F2C4CE" opacity="0.42" />
          <circle cx="0" cy="0" r="1.5" fill="#E8CA7A" opacity="0.55" />
        </g>
        <path d="M65 38 C70 32 77 32 82 38" stroke="#B8D8C4" strokeWidth="0.9" strokeLinecap="round" opacity="0.30" />
        <ellipse cx="95" cy="85" rx="2" ry="3" fill="#F2C4CE" opacity="0.25" transform="rotate(-20 95 85)" />
      </svg>
    </div>
  );
}

/* Corner decoration — top left */
function TopLeftDecor() {
  return (
    <div className="pointer-events-none absolute left-0 top-0" style={{ width: 140, height: 140 }}>
      <svg viewBox="0 0 140 140" fill="none" className="h-full w-full">
        <path d="M0 0 C35 40 65 72 110 115" stroke="#B8D8C4" strokeWidth="1.1" strokeLinecap="round" opacity="0.35" />
        <g transform="translate(35,42) rotate(-30)">
          <path d="M0,-10 C4,-6 4,6 0,10 C-4,6 -4,-6 0,-10 Z" fill="#C8E6D0" opacity="0.38" />
        </g>
        <g transform="translate(15,18)">
          <ellipse cx="0" cy="-3" rx="2.2" ry="3" fill="#F2C4CE" opacity="0.42" />
          <ellipse cx="0" cy="3" rx="2.2" ry="3" fill="#F2C4CE" opacity="0.42" />
          <ellipse cx="-3" cy="0" rx="3" ry="2.2" fill="#F2C4CE" opacity="0.40" />
          <ellipse cx="3" cy="0" rx="3" ry="2.2" fill="#F2C4CE" opacity="0.40" />
          <circle cx="0" cy="0" r="1.3" fill="#E8CA7A" opacity="0.50" />
        </g>
        {/* Butterfly */}
        <g transform="translate(80,25) rotate(15)" className="butterfly-anim-1">
          <path d="M0,0 C-4,-7 -9,-5 -6,0 C-9,5 -4,7 0,0" fill="#F2C4CE" opacity="0.38" />
          <path d="M0,0 C4,-7 9,-5 6,0 C9,5 4,7 0,0" fill="#EDB8C8" opacity="0.34" />
          <line x1="0" y1="-2.5" x2="0" y2="2.5" stroke="#D4A0B4" strokeWidth="0.5" opacity="0.35" />
        </g>
        <ellipse cx="55" cy="70" rx="1.8" ry="3" fill="#F2C4CE" opacity="0.22" transform="rotate(35 55 70)" />
      </svg>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function validatePassword(pw: string): string | null {
    if (pw.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(pw)) return "Password must include at least one uppercase letter.";
    if (!/[a-z]/.test(pw)) return "Password must include at least one lowercase letter.";
    if (!/[^A-Za-z0-9]/.test(pw)) return "Password must include at least one special character.";
    return null;
  }

  useEffect(() => {
    if (!authLoading && user) router.replace("/dashboard");
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "linear-gradient(135deg, #EFF7F1 0%, #FFF5F7 100%)" }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="nature-float"><path d="M6 3 C10 7 12 13 10 19 C8 19 2 17 1 13 C-1 9 2 5 6 3 Z" fill="#7DB892" opacity="0.6" /><path d="M6 3 C5 9 5 15 10 19" stroke="#5EA88A" strokeWidth="0.8" fill="none" opacity="0.4" /></svg>
      </div>
    );
  }

  if (user) return null;

  function handleConfirmBlur() {
    if (confirmPassword && password !== confirmPassword) {
      setConfirmError("Passwords do not match.");
    } else {
      setConfirmError(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const pwErr = validatePassword(password);
    if (pwErr) { setPasswordError(pwErr); return; }
    if (password !== confirmPassword) { setConfirmError("Passwords do not match."); return; }
    setConfirmError(null);
    setLoading(true);
    try {
      await registerUser(email, password, firstName, lastName);
      router.replace("/dashboard");
    } catch (err) {
      setError(getFirebaseError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col md:flex-row">
      <div className="md:w-[45%] md:flex-shrink-0">
        <AuthLeftPanel />
      </div>

      <div
        className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-12 md:px-10"
        style={{ background: "linear-gradient(135deg, #EFF7F1 0%, #FFF5F7 100%)" }}
      >
        {/* Blobs */}
        <div className="pointer-events-none absolute" style={{ top: "-60px", left: "-60px", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(242,196,206,0.14) 0%, transparent 70%)", filter: "blur(45px)" }} />
        <div className="pointer-events-none absolute" style={{ bottom: "-50px", right: "-50px", width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(168,213,186,0.16) 0%, transparent 70%)", filter: "blur(50px)" }} />

        <TopLeftDecor />
        <BottomRightDecor />

        <div className="relative z-10 w-full max-w-[420px]">
          <div className="mb-7 animate-fade-in-up">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest" style={{ color: "#8DBFA5" }}>
              Get started
            </p>
            <h2 className="text-2xl font-bold tracking-tight" style={{ color: "#1A3D2B" }}>
              Create your account
            </h2>
            <p className="mt-1.5 text-sm" style={{ color: "#6B9E85" }}>
              Your safe space starts here.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 animate-fade-in-up-1">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="first-name" className="text-sm font-medium" style={{ color: "#2D6A4F" }}>First name</label>
                <input id="first-name" type="text" required autoComplete="given-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Emma" className="auth-input w-full rounded-lg border px-4 py-3 text-sm" style={{ borderColor: "#C8DDD0", backgroundColor: "#FAFDFB", color: "#1A3D2B" }} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="last-name" className="text-sm font-medium" style={{ color: "#2D6A4F" }}>Last name</label>
                <input id="last-name" type="text" required autoComplete="family-name" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Green" className="auth-input w-full rounded-lg border px-4 py-3 text-sm" style={{ borderColor: "#C8DDD0", backgroundColor: "#FAFDFB", color: "#1A3D2B" }} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium" style={{ color: "#2D6A4F" }}>Email address</label>
              <input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="auth-input w-full rounded-lg border px-4 py-3 text-sm" style={{ borderColor: "#C8DDD0", backgroundColor: "#FAFDFB", color: "#1A3D2B" }} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium" style={{ color: "#2D6A4F" }}>Password</label>
              <input id="password" type="password" required minLength={8} autoComplete="new-password" value={password} onChange={(e) => { setPassword(e.target.value); if (passwordError) setPasswordError(null); }} onBlur={() => setPasswordError(validatePassword(password))} placeholder="Min. 8 characters" className="auth-input w-full rounded-lg border px-4 py-3 text-sm" style={{ borderColor: passwordError ? "#FECACA" : "#C8DDD0", backgroundColor: "#FAFDFB", color: "#1A3D2B" }} />
              {passwordError ? (
                <p className="text-xs" style={{ color: "#DC3545" }}>{passwordError}</p>
              ) : (
                <p className="text-xs" style={{ color: "#94A89C" }}>8+ characters with uppercase, lowercase &amp; special character.</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirm-password" className="text-sm font-medium" style={{ color: "#2D6A4F" }}>Confirm password</label>
              <input id="confirm-password" type="password" required autoComplete="new-password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); if (confirmError) setConfirmError(null); }} onBlur={handleConfirmBlur} placeholder="Repeat your password" className="auth-input w-full rounded-lg border px-4 py-3 text-sm" style={{ borderColor: confirmError ? "#FECACA" : "#C8DDD0", backgroundColor: "#FAFDFB", color: "#1A3D2B" }} />
              {confirmError && <p className="text-xs" style={{ color: "#DC3545" }}>{confirmError}</p>}
            </div>

            {error && (
              <div className="rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: "#FEF2F2", color: "#DC3545", border: "1px solid #FECACA" }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="nature-btn mt-1 w-full rounded-lg px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60" style={{ background: "linear-gradient(135deg, #4A9B7A 0%, #3D8B6A 50%, #2D6A4F 100%)", boxShadow: "0 4px 14px rgba(45,106,79,0.28)" }}>
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 animate-fade-in-up-2">
            <div className="flex-1 border-t" style={{ borderColor: "#E2EDE6" }} />
            <span className="text-[10px]" style={{ color: "#C8DDD0" }}>🌸</span>
            <div className="flex-1 border-t" style={{ borderColor: "#E2EDE6" }} />
          </div>

          <p className="text-center text-sm animate-fade-in-up-2" style={{ color: "#6B9E85" }}>
            Already have an account?{" "}
            <Link href="/login" className="font-semibold transition-opacity hover:opacity-70" style={{ color: "#2D6A4F" }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

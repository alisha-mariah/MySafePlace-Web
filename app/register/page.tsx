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

/* ═══════════════════════════════════════════
   REGISTER PAGE
═══════════════════════════════════════════ */
export default function RegisterPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [firstName,       setFirstName]       = useState("");
  const [lastName,        setLastName]        = useState("");
  const [email,           setEmail]           = useState("");
  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmError,    setConfirmError]    = useState<string | null>(null);
  const [passwordError,   setPasswordError]   = useState<string | null>(null);
  const [error,           setError]           = useState<string | null>(null);
  const [loading,         setLoading]         = useState(false);

  function validatePassword(pw: string): string | null {
    if (pw.length < 8)           return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(pw))       return "Password must include at least one uppercase letter.";
    if (!/[a-z]/.test(pw))       return "Password must include at least one lowercase letter.";
    if (!/[^A-Za-z0-9]/.test(pw)) return "Password must include at least one special character.";
    return null;
  }

  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/dashboard");
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: "#EFF8F2" }}
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-2xl nature-float">🌿</span>
          <p className="text-sm" style={{ color: "#3D8B6E" }}>Loading…</p>
        </div>
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
    if (pwErr) {
      setPasswordError(pwErr);
      return;
    }

    if (password !== confirmPassword) {
      setConfirmError("Passwords do not match.");
      return;
    }

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
      {/* ── Left panel ── */}
      <div className="md:w-[45%] md:flex-shrink-0">
        <AuthLeftPanel />
      </div>

      {/* ── Right panel ── */}
      <div
        className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-5 py-10 md:px-8"
        style={{ backgroundColor: "#EFF8F2" }}
      >
        {/* Depth blobs */}
        <div
          className="pointer-events-none absolute"
          style={{
            bottom: "-80px",
            left: "-80px",
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(168,213,186,0.28) 0%, transparent 70%)",
            filter: "blur(48px)",
          }}
        />
        <div
          className="pointer-events-none absolute"
          style={{
            top: "-60px",
            right: "-60px",
            width: 340,
            height: 340,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(245,208,216,0.22) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="pointer-events-none absolute"
          style={{
            top: "38%",
            left: "55%",
            width: 260,
            height: 260,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(168,213,186,0.13) 0%, transparent 70%)",
            filter: "blur(38px)",
          }}
        />

        {/* ── Auth card ── */}
        <div className="animate-fade-in-up relative w-full max-w-md">
          <div
            className="rounded-3xl px-8 py-9"
            style={{
              backgroundColor: "rgba(255,255,255,0.72)",
              backdropFilter: "blur(22px)",
              WebkitBackdropFilter: "blur(22px)",
              boxShadow:
                "0 20px 60px rgba(45,106,79,0.12), 0 6px 20px rgba(45,106,79,0.07), inset 0 1px 0 rgba(255,255,255,0.80)",
              border: "1px solid rgba(255,255,255,0.60)",
            }}
          >
            {/* Heading */}
            <div className="animate-fade-in-up-1 mb-7">
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "#A8D5B5" }}
                >
                  new beginning
                </span>
              </div>
              <h2
                className="text-[1.65rem] font-bold tracking-tight"
                style={{ color: "#1E4D38" }}
              >
                Join MySafePlace
              </h2>
              <p className="mt-1.5 text-sm" style={{ color: "#6B9E85" }}>
                Your safe space starts here. It only takes a moment.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="animate-fade-in-up-2 flex flex-col gap-4">
              {/* First name + Last name — side by side */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="first-name"
                    className="text-sm font-medium"
                    style={{ color: "#2D6A4F" }}
                  >
                    First name
                  </label>
                  <input
                    id="first-name"
                    type="text"
                    required
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Emma"
                    className="auth-input w-full rounded-xl border px-4 py-3.5 text-sm"
                    style={{
                      borderColor: "#B8DFC8",
                      backgroundColor: "#FDFFFE",
                      color: "#1E4D38",
                    }}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="last-name"
                    className="text-sm font-medium"
                    style={{ color: "#2D6A4F" }}
                  >
                    Last name
                  </label>
                  <input
                    id="last-name"
                    type="text"
                    required
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Green"
                    className="auth-input w-full rounded-xl border px-4 py-3.5 text-sm"
                    style={{
                      borderColor: "#B8DFC8",
                      backgroundColor: "#FDFFFE",
                      color: "#1E4D38",
                    }}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="text-sm font-medium"
                  style={{ color: "#2D6A4F" }}
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="auth-input w-full rounded-xl border px-4 py-3.5 text-sm"
                  style={{
                    borderColor: "#B8DFC8",
                    backgroundColor: "#FDFFFE",
                    color: "#1E4D38",
                  }}
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="password"
                  className="text-sm font-medium"
                  style={{ color: "#2D6A4F" }}
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError(null);
                  }}
                  onBlur={() => setPasswordError(validatePassword(password))}
                  placeholder="Min. 8 characters"
                  className="auth-input w-full rounded-xl border px-4 py-3.5 text-sm"
                  style={{
                    borderColor: passwordError ? "#F5C6C6" : "#B8DFC8",
                    backgroundColor: "#FDFFFE",
                    color: "#1E4D38",
                  }}
                />
                {passwordError ? (
                  <p className="text-xs" style={{ color: "#C0392B" }}>{passwordError}</p>
                ) : (
                  <p className="text-xs" style={{ color: "#9ABFAE" }}>
                    Must be 8+ characters with uppercase, lowercase &amp; a special character.
                  </p>
                )}
              </div>

              {/* Confirm password */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="confirm-password"
                  className="text-sm font-medium"
                  style={{ color: "#2D6A4F" }}
                >
                  Confirm password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (confirmError) setConfirmError(null);
                  }}
                  onBlur={handleConfirmBlur}
                  placeholder="Repeat your password"
                  className="auth-input w-full rounded-xl border px-4 py-3.5 text-sm"
                  style={{
                    borderColor: confirmError ? "#F5C6C6" : "#B8DFC8",
                    backgroundColor: "#FDFFFE",
                    color: "#1E4D38",
                  }}
                />
                {confirmError && (
                  <p className="text-xs" style={{ color: "#C0392B" }}>
                    {confirmError}
                  </p>
                )}
              </div>

              {/* Firebase error */}
              {error && (
                <div
                  className="rounded-xl px-4 py-3 text-sm"
                  style={{
                    backgroundColor: "#FFF4F4",
                    color: "#C0392B",
                    border: "1px solid #F5C6C6",
                  }}
                >
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="nature-btn mt-1 w-full rounded-xl px-4 py-3.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  background: "linear-gradient(135deg, #52AB84 0%, #2D6A4F 100%)",
                  boxShadow: "0 4px 18px rgba(45,106,79,0.30)",
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "linear-gradient(135deg, #5EBC92 0%, #3D8B6E 100%)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "0 6px 24px rgba(45,106,79,0.40)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "linear-gradient(135deg, #52AB84 0%, #2D6A4F 100%)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "0 4px 18px rgba(45,106,79,0.30)";
                  }
                }}
              >
                {loading ? "Creating account…" : "Create account"}
              </button>
            </form>

            {/* Divider */}
            <div className="animate-fade-in-up-3 my-5 flex items-center gap-3">
              <div className="flex-1 border-t" style={{ borderColor: "#E0F0E8" }} />
              <span className="text-sm" style={{ color: "#C8E6C9" }}>🌿</span>
              <div className="flex-1 border-t" style={{ borderColor: "#E0F0E8" }} />
            </div>

            {/* Footer link */}
            <p className="animate-fade-in-up-3 text-center text-sm" style={{ color: "#6B9E85" }}>
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold transition-opacity hover:opacity-70"
                style={{ color: "#2D6A4F" }}
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser } from "@/src/services/authService";
import { useAuth } from "@/src/context/AuthContext";
import AuthLeftPanel from "@/src/components/ui/AuthLeftPanel";

function getFirebaseError(error: unknown): string {
  if (error && typeof error === "object" && "code" in error) {
    const code = (error as { code: string }).code;
    switch (code) {
      case "auth/user-not-found":
      case "auth/invalid-credential":
      case "auth/wrong-password":
        return "Invalid email or password. Please try again.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/too-many-requests":
        return "Too many failed attempts. Please try again later.";
      case "auth/user-disabled":
        return "This account has been disabled. Please contact support.";
    }
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}

/* ─────────────────────────────────────────────
   CORNER NATURE DECORATIONS (unchanged visually, kept intact)
───────────────────────────────────────────── */
function TopRightDecor() {
  return (
    <div className="pointer-events-none absolute right-0 top-0 overflow-hidden" style={{ width: 260, height: 260 }}>
      <svg viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        <path d="M260 0 C210 52 168 110 128 178" stroke="#B8DEC9" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M260 0 C230 32 220 72 228 118" stroke="#B8DEC9" strokeWidth="1.1" strokeLinecap="round" opacity="0.55" />
        <g transform="translate(200,54) rotate(33)">
          <path d="M0,-20 C8,-12 8,12 0,20 C-8,12 -8,-12 0,-20 Z" fill="#C8E6C9" opacity="0.60" />
          <line x1="0" y1="-16" x2="0" y2="16" stroke="#A8D5B5" strokeWidth="0.8" opacity="0.74" />
        </g>
        <g transform="translate(177,95) rotate(20)">
          <path d="M0,-16 C7,-9 7,9 0,16 C-7,9 -7,-9 0,-16 Z" fill="#C8E6C9" opacity="0.50" />
          <line x1="0" y1="-12" x2="0" y2="12" stroke="#A8D5B5" strokeWidth="0.7" opacity="0.64" />
        </g>
        <g transform="translate(150,138) rotate(9)">
          <path d="M0,-14 C6,-8 6,8 0,14 C-6,8 -6,-8 0,-14 Z" fill="#C8E6C9" opacity="0.42" />
        </g>
        <g transform="translate(238,82) rotate(58)">
          <path d="M0,-13 C5,-7 5,7 0,13 C-5,7 -5,-7 0,-13 Z" fill="#C8E6C9" opacity="0.40" />
        </g>
        <g transform="translate(222,32) rotate(22)">
          <path d="M0,-9 C4,-5 4,5 0,9 C-4,5 -4,-5 0,-9 Z" fill="#C8E6C9" opacity="0.36" />
        </g>
        <g transform="translate(232,22)">
          <ellipse cx="0"  cy="-8"   rx="4.5" ry="8"   fill="#F5D0D8" opacity="0.80" />
          <ellipse cx="0"  cy="8"    rx="4.5" ry="8"   fill="#F5D0D8" opacity="0.80" />
          <ellipse cx="-8" cy="0"    rx="8"   ry="4.5" fill="#F5D0D8" opacity="0.80" />
          <ellipse cx="8"  cy="0"    rx="8"   ry="4.5" fill="#F5D0D8" opacity="0.80" />
          <ellipse cx="-5.5" cy="-5.5" rx="4.5" ry="7" fill="#F5D0D8" opacity="0.60" transform="rotate(45 -5.5 -5.5)" />
          <ellipse cx="5.5"  cy="-5.5" rx="4.5" ry="7" fill="#F5D0D8" opacity="0.60" transform="rotate(-45 5.5 -5.5)" />
          <circle  cx="0"    cy="0"  r="4" fill="#E8C97A" opacity="0.92" />
        </g>
        <g transform="translate(248,88)">
          <ellipse cx="0"    cy="-5.5" rx="3.2" ry="5.5" fill="#F5D0D8" opacity="0.65" />
          <ellipse cx="0"    cy="5.5"  rx="3.2" ry="5.5" fill="#F5D0D8" opacity="0.65" />
          <ellipse cx="-5.5" cy="0"    rx="5.5" ry="3.2" fill="#F5D0D8" opacity="0.65" />
          <ellipse cx="5.5"  cy="0"    rx="5.5" ry="3.2" fill="#F5D0D8" opacity="0.65" />
          <circle  cx="0"    cy="0"    r="2.8"             fill="#E8C97A" opacity="0.84" />
        </g>
        <path d="M65 35  C71 29 78 29 84 35"  stroke="#B8DEC9" strokeWidth="1.4" strokeLinecap="round" opacity="0.62" />
        <path d="M86 22  C91 17 97 17 102 22" stroke="#B8DEC9" strokeWidth="1.2" strokeLinecap="round" opacity="0.52" />
        <path d="M48 50  C52 45 57 45 61 50"  stroke="#B8DEC9" strokeWidth="1.0" strokeLinecap="round" opacity="0.42" />
      </svg>
    </div>
  );
}

function BottomLeftDecor() {
  return (
    <div className="pointer-events-none absolute bottom-0 left-0 overflow-hidden" style={{ width: 200, height: 200 }}>
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        <path d="M0 200 C56 148 104 106 170 58" stroke="#B8DEC9" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M0 200 C32 168 60 148 98 134" stroke="#B8DEC9" strokeWidth="1" strokeLinecap="round" opacity="0.52" />
        <g transform="translate(56,148) rotate(-44)">
          <path d="M0,-17 C7,-10 7,10 0,17 C-7,10 -7,-10 0,-17 Z" fill="#C8E6C9" opacity="0.58" />
          <line x1="0" y1="-13" x2="0" y2="13" stroke="#A8D5B5" strokeWidth="0.8" opacity="0.70" />
        </g>
        <g transform="translate(100,114) rotate(-58)">
          <path d="M0,-15 C6,-9 6,9 0,15 C-6,9 -6,-9 0,-15 Z" fill="#C8E6C9" opacity="0.48" />
          <line x1="0" y1="-11" x2="0" y2="11" stroke="#A8D5B5" strokeWidth="0.7" opacity="0.60" />
        </g>
        <g transform="translate(144,78) rotate(-68)">
          <path d="M0,-13 C5,-7 5,7 0,13 C-5,7 -5,-7 0,-13 Z" fill="#C8E6C9" opacity="0.40" />
        </g>
        <g transform="translate(74,150) rotate(-28)">
          <path d="M0,-11 C4,-6 4,6 0,11 C-4,6 -4,-6 0,-11 Z" fill="#C8E6C9" opacity="0.37" />
        </g>
        <g transform="translate(24,172)">
          <ellipse cx="0"  cy="-7" rx="4"  ry="7"  fill="#F5D0D8" opacity="0.70" />
          <ellipse cx="0"  cy="7"  rx="4"  ry="7"  fill="#F5D0D8" opacity="0.70" />
          <ellipse cx="-7" cy="0"  rx="7"  ry="4"  fill="#F5D0D8" opacity="0.70" />
          <ellipse cx="7"  cy="0"  rx="7"  ry="4"  fill="#F5D0D8" opacity="0.70" />
          <circle  cx="0"  cy="0"  r="3.2"          fill="#E8C97A" opacity="0.88" />
        </g>
        <g transform="translate(118,105)">
          <ellipse cx="0"  cy="-5" rx="3" ry="5" fill="#F5D0D8" opacity="0.56" />
          <ellipse cx="0"  cy="5"  rx="3" ry="5" fill="#F5D0D8" opacity="0.56" />
          <ellipse cx="-5" cy="0"  rx="5" ry="3" fill="#F5D0D8" opacity="0.56" />
          <ellipse cx="5"  cy="0"  rx="5" ry="3" fill="#F5D0D8" opacity="0.56" />
          <circle  cx="0"  cy="0"  r="2.4"        fill="#E8C97A" opacity="0.76" />
        </g>
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════
   LOGIN PAGE
═══════════════════════════════════════════ */
export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState<string | null>(null);
  const [loading,  setLoading]  = useState(false);

  useEffect(() => {
    if (!authLoading && user) router.replace("/dashboard");
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(168,213,186,0.18) 0%, transparent 65%), #EFF8F2",
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-2xl nature-float">🌿</span>
          <p className="text-sm font-medium" style={{ color: "#3D8B6E" }}>Loading…</p>
        </div>
      </div>
    );
  }

  if (user) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await loginUser(email, password);
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
        {/* ── Depth: blurred organic blobs ── */}
        <div
          className="pointer-events-none absolute"
          style={{
            bottom: -90, left: -90,
            width: 380, height: 380,
            borderRadius: "50%",
            background: "rgba(168,213,186,0.24)",
            filter: "blur(75px)",
          }}
        />
        <div
          className="pointer-events-none absolute"
          style={{
            top: -60, right: -60,
            width: 320, height: 320,
            borderRadius: "50%",
            background: "rgba(245,208,216,0.18)",
            filter: "blur(65px)",
          }}
        />
        <div
          className="pointer-events-none absolute"
          style={{
            top: "20%", left: "35%",
            width: 260, height: 200,
            borderRadius: "50%",
            background: "rgba(168,213,186,0.10)",
            filter: "blur(50px)",
          }}
        />

        {/* SVG corner nature accents */}
        <TopRightDecor />
        <BottomLeftDecor />

        {/* ── Auth card ── */}
        <div className="relative w-full max-w-[420px] animate-fade-in-up">
          <div
            className="rounded-3xl px-8 py-10"
            style={{
              backgroundColor: "rgba(255,255,255,0.72)",
              backdropFilter: "blur(22px)",
              WebkitBackdropFilter: "blur(22px)",
              border: "1px solid rgba(255,255,255,0.60)",
              boxShadow:
                "0 24px 64px rgba(45,106,79,0.12), " +
                "0 6px 20px rgba(45,106,79,0.07), " +
                "inset 0 1px 0 rgba(255,255,255,0.90)",
            }}
          >
            {/* Heading */}
            <div className="mb-8 animate-fade-in-up-1">
              <div className="mb-2.5 flex items-center gap-2">
                <span className="text-lg">🌸</span>
                <span
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "#8DC9A8", letterSpacing: "0.11em" }}
                >
                  welcome back
                </span>
              </div>
              <h2
                className="text-[1.65rem] font-bold tracking-tight"
                style={{ color: "#1A3D2B", lineHeight: 1.2 }}
              >
                Sign in to MySafePlace
              </h2>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "#5A8A72" }}>
                Your journey continues here.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5 animate-fade-in-up-2">
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-semibold" style={{ color: "#2D6A4F" }}>
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
                  style={{ borderColor: "#B8DFC8", backgroundColor: "#FDFFFE", color: "#1A3D2B" }}
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-semibold" style={{ color: "#2D6A4F" }}>
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium transition-opacity hover:opacity-70"
                    style={{ color: "#3D8B6E" }}
                  >
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="auth-input w-full rounded-xl border px-4 py-3.5 text-sm"
                  style={{ borderColor: "#B8DFC8", backgroundColor: "#FDFFFE", color: "#1A3D2B" }}
                />
              </div>

              {/* Error */}
              {error && (
                <div
                  className="rounded-xl px-4 py-3 text-sm"
                  style={{ backgroundColor: "#FFF4F4", color: "#C0392B", border: "1px solid #F5C6C6" }}
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
                  boxShadow: "0 4px 16px rgba(45,106,79,0.30), 0 1px 4px rgba(45,106,79,0.18)",
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "linear-gradient(135deg, #3D9B72 0%, #1E4D38 100%)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "0 6px 22px rgba(45,106,79,0.42), 0 2px 6px rgba(45,106,79,0.22)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "linear-gradient(135deg, #52AB84 0%, #2D6A4F 100%)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "0 4px 16px rgba(45,106,79,0.30), 0 1px 4px rgba(45,106,79,0.18)";
                  }
                }}
              >
                {loading ? "Signing in…" : "Sign in"}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3 animate-fade-in-up-3">
              <div className="flex-1 border-t" style={{ borderColor: "#D8EEE2" }} />
              <span className="text-sm" style={{ color: "#C8E6C9" }}>🍃</span>
              <div className="flex-1 border-t" style={{ borderColor: "#D8EEE2" }} />
            </div>

            {/* Footer link */}
            <p className="text-center text-sm animate-fade-in-up-3" style={{ color: "#5A8A72" }}>
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold underline-offset-2 transition-opacity hover:opacity-75 hover:underline"
                style={{ color: "#2D6A4F" }}
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

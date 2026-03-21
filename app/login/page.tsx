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
        return "Invalid email or password.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/too-many-requests":
        return "Too many attempts. Try again later.";
      case "auth/user-disabled":
        return "This account has been disabled.";
    }
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}

/* Corner decoration — top right */
function TopRightDecor() {
  return (
    <div className="pointer-events-none absolute right-0 top-0" style={{ width: 220, height: 220 }}>
      <svg viewBox="0 0 220 220" fill="none" className="h-full w-full">
        {/* Branch */}
        <path d="M220 0 C175 50 135 95 85 150" stroke="#B8D8C4" strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
        <path d="M220 0 C200 30 195 65 200 105" stroke="#B8D8C4" strokeWidth="1" strokeLinecap="round" opacity="0.35" />
        {/* Leaves */}
        <g transform="translate(165,52) rotate(30)">
          <path d="M0,-14 C6,-8 6,8 0,14 C-6,8 -6,-8 0,-14 Z" fill="#C8E6D0" opacity="0.50" />
          <line x1="0" y1="-10" x2="0" y2="10" stroke="#A8D5BA" strokeWidth="0.6" opacity="0.55" />
        </g>
        <g transform="translate(130,95) rotate(15)">
          <path d="M0,-11 C5,-6 5,6 0,11 C-5,6 -5,-6 0,-11 Z" fill="#C8E6D0" opacity="0.40" />
        </g>
        {/* Cherry blossom */}
        <g transform="translate(195,35)">
          <ellipse cx="0" cy="-5" rx="3.5" ry="5" fill="#F2C4CE" opacity="0.60" />
          <ellipse cx="0" cy="5" rx="3.5" ry="5" fill="#F2C4CE" opacity="0.60" />
          <ellipse cx="-5" cy="0" rx="5" ry="3.5" fill="#F2C4CE" opacity="0.58" />
          <ellipse cx="5" cy="0" rx="5" ry="3.5" fill="#F2C4CE" opacity="0.58" />
          <circle cx="0" cy="0" r="2.5" fill="#E8CA7A" opacity="0.70" />
        </g>
        <g transform="translate(155,78)">
          <ellipse cx="0" cy="-4" rx="2.8" ry="4" fill="#F2C4CE" opacity="0.45" />
          <ellipse cx="0" cy="4" rx="2.8" ry="4" fill="#F2C4CE" opacity="0.45" />
          <ellipse cx="-4" cy="0" rx="4" ry="2.8" fill="#F2C4CE" opacity="0.42" />
          <ellipse cx="4" cy="0" rx="4" ry="2.8" fill="#F2C4CE" opacity="0.42" />
          <circle cx="0" cy="0" r="2" fill="#E8CA7A" opacity="0.55" />
        </g>
        {/* Butterfly */}
        <g transform="translate(105,42) rotate(-20)" className="butterfly-anim">
          <path d="M0,0 C-5,-8 -11,-6 -8,0 C-11,6 -5,8 0,0" fill="#F2C4CE" opacity="0.45" />
          <path d="M0,0 C5,-8 11,-6 8,0 C11,6 5,8 0,0" fill="#EDB8C8" opacity="0.40" />
          <line x1="0" y1="-3" x2="0" y2="3" stroke="#D4A0B4" strokeWidth="0.6" opacity="0.4" />
        </g>
        {/* Birds */}
        <path d="M60 28 C65 23 71 23 76 28" stroke="#B8D8C4" strokeWidth="1.1" strokeLinecap="round" opacity="0.45" />
        <path d="M80 16 C83 12 88 12 91 16" stroke="#B8D8C4" strokeWidth="0.9" strokeLinecap="round" opacity="0.32" />
        {/* Floating petals */}
        <ellipse cx="45" cy="60" rx="2" ry="3.5" fill="#F2C4CE" opacity="0.30" transform="rotate(25 45 60)" />
        <ellipse cx="120" cy="140" rx="1.8" ry="3" fill="#F2C4CE" opacity="0.25" transform="rotate(-30 120 140)" />
      </svg>
    </div>
  );
}

/* Corner decoration — bottom left */
function BottomLeftDecor() {
  return (
    <div className="pointer-events-none absolute bottom-0 left-0" style={{ width: 180, height: 180 }}>
      <svg viewBox="0 0 180 180" fill="none" className="h-full w-full">
        {/* Branch */}
        <path d="M0 180 C40 135 78 92 130 45" stroke="#B8D8C4" strokeWidth="1.3" strokeLinecap="round" opacity="0.50" />
        {/* Leaves */}
        <g transform="translate(45,132) rotate(-40)">
          <path d="M0,-13 C6,-7 6,7 0,13 C-6,7 -6,-7 0,-13 Z" fill="#C8E6D0" opacity="0.45" />
          <line x1="0" y1="-9" x2="0" y2="9" stroke="#A8D5BA" strokeWidth="0.6" opacity="0.50" />
        </g>
        <g transform="translate(82,90) rotate(-55)">
          <path d="M0,-10 C4,-6 4,6 0,10 C-4,6 -4,-6 0,-10 Z" fill="#C8E6D0" opacity="0.35" />
        </g>
        {/* Small flower */}
        <g transform="translate(22,155)">
          <ellipse cx="0" cy="-4" rx="3" ry="4" fill="#F2C4CE" opacity="0.48" />
          <ellipse cx="0" cy="4" rx="3" ry="4" fill="#F2C4CE" opacity="0.48" />
          <ellipse cx="-4" cy="0" rx="4" ry="3" fill="#F2C4CE" opacity="0.45" />
          <ellipse cx="4" cy="0" rx="4" ry="3" fill="#F2C4CE" opacity="0.45" />
          <circle cx="0" cy="0" r="1.8" fill="#E8CA7A" opacity="0.60" />
        </g>
        {/* Bird */}
        <path d="M110 55 C115 48 122 48 127 55" stroke="#B8D8C4" strokeWidth="1" strokeLinecap="round" opacity="0.35" />
        {/* Petal */}
        <ellipse cx="70" cy="155" rx="2" ry="3" fill="#F2C4CE" opacity="0.28" transform="rotate(40 70 155)" />
      </svg>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
      {/* Left panel */}
      <div className="md:w-[45%] md:flex-shrink-0">
        <AuthLeftPanel />
      </div>

      {/* Right — sign in form */}
      <div
        className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-12 md:px-10"
        style={{ background: "linear-gradient(135deg, #EFF7F1 0%, #FFF5F7 100%)" }}
      >
        {/* Background blobs */}
        <div
          className="pointer-events-none absolute"
          style={{
            bottom: "-70px",
            left: "-70px",
            width: 340,
            height: 340,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(168,213,186,0.18) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />
        <div
          className="pointer-events-none absolute"
          style={{
            top: "-50px",
            right: "-50px",
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(242,196,206,0.16) 0%, transparent 70%)",
            filter: "blur(45px)",
          }}
        />

        <TopRightDecor />
        <BottomLeftDecor />

        {/* Form container */}
        <div className="relative z-10 w-full max-w-[400px] animate-fade-in-up">
          <div
            className="rounded-2xl bg-white px-8 py-9"
            style={{
              boxShadow: "0 8px 32px rgba(45,106,79,0.06), 0 2px 8px rgba(45,106,79,0.03)",
              border: "1px solid rgba(200,230,209,0.50)",
            }}
          >
            <div className="mb-7 animate-fade-in-up-1">
              <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.1em]" style={{ color: "#8DBFA5" }}>
                Welcome back
              </p>
              <h2 className="text-[22px] font-bold tracking-tight" style={{ color: "#1A3D2B" }}>
                Sign in
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5 animate-fade-in-up-2">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-[13px] font-medium" style={{ color: "#2D6A4F" }}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="auth-input w-full rounded-xl border px-4 py-3 text-[14px]"
                  style={{ borderColor: "#C8DDD0", backgroundColor: "#FAFDFB", color: "#1A3D2B" }}
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="password" className="text-[13px] font-medium" style={{ color: "#2D6A4F" }}>
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-[12px] transition-opacity hover:opacity-70" style={{ color: "#6B9E85" }}>
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
                  className="auth-input w-full rounded-xl border px-4 py-3 text-[14px]"
                  style={{ borderColor: "#C8DDD0", backgroundColor: "#FAFDFB", color: "#1A3D2B" }}
                />
              </div>

              {error && (
                <p className="text-[13px]" style={{ color: "#D44040" }}>{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="nature-btn mt-1 w-full rounded-xl py-3 text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, #7DB892 0%, #5EA88A 50%, #4A9474 100%)",
                  boxShadow: "0 4px 14px rgba(93,168,138,0.25)",
                }}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3 animate-fade-in-up-3">
              <div className="flex-1 border-t" style={{ borderColor: "#E2EDE6" }} />
              <span className="text-[10px]" style={{ color: "#C8DDD0" }}>🌸</span>
              <div className="flex-1 border-t" style={{ borderColor: "#E2EDE6" }} />
            </div>

            <p className="text-center text-[13px] animate-fade-in-up-3" style={{ color: "#6B9E85" }}>
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-semibold transition-opacity hover:opacity-70" style={{ color: "#2D6A4F" }}>
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

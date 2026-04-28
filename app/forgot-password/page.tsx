"use client";

import { useState } from "react";
import Link from "next/link";
import { resetPassword } from "@/src/services/authService";

function getFirebaseError(error: unknown): string {
  if (error && typeof error === "object" && "code" in error) {
    const code = (error as { code: string }).code;
    switch (code) {
      case "auth/user-not-found":
        return "No account found with that email address.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/too-many-requests":
        return "Too many requests. Please wait a moment and try again.";
    }
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}

/* Background nature decoration */
function NatureDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg viewBox="0 0 800 600" fill="none" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        {/* Warm glow */}
        <circle cx="650" cy="80" r="180" fill="rgba(242,196,206,0.08)" />
        <circle cx="150" cy="480" r="160" fill="rgba(168,213,186,0.08)" />
        {/* Contour lines */}
        <path d="M0 100 Q200 70 400 95 Q600 120 800 85" stroke="rgba(168,213,186,0.08)" strokeWidth="1" />
        <path d="M0 250 Q250 225 450 245 Q650 265 800 235" stroke="rgba(168,213,186,0.07)" strokeWidth="1" />
        <path d="M0 400 Q180 375 380 395 Q580 415 800 385" stroke="rgba(168,213,186,0.06)" strokeWidth="1" />
        <path d="M0 520 Q220 505 440 515 Q620 528 800 510" stroke="rgba(168,213,186,0.05)" strokeWidth="1" />
        {/* Top-right branch + flower */}
        <path d="M800 0 C740 60 690 110 620 180" stroke="#C8E6D0" strokeWidth="1.3" strokeLinecap="round" opacity="0.30" />
        <g transform="translate(680,80) rotate(-20)">
          <path d="M0,-12 C5,-7 5,7 0,12 C-5,7 -5,-7 0,-12 Z" fill="#C8E6D0" opacity="0.30" />
        </g>
        <g transform="translate(740,40)">
          <ellipse cx="0" cy="-5" rx="3.5" ry="5" fill="#F2C4CE" opacity="0.35" />
          <ellipse cx="0" cy="5" rx="3.5" ry="5" fill="#F2C4CE" opacity="0.35" />
          <ellipse cx="-5" cy="0" rx="5" ry="3.5" fill="#F2C4CE" opacity="0.32" />
          <ellipse cx="5" cy="0" rx="5" ry="3.5" fill="#F2C4CE" opacity="0.32" />
          <circle cx="0" cy="0" r="2" fill="#E8CA7A" opacity="0.40" />
        </g>
        {/* Bottom-left branch + flower */}
        <path d="M0 600 C60 540 110 490 180 420" stroke="#C8E6D0" strokeWidth="1.3" strokeLinecap="round" opacity="0.30" />
        <g transform="translate(80,520) rotate(30)">
          <path d="M0,-10 C4,-6 4,6 0,10 C-4,6 -4,-6 0,-10 Z" fill="#C8E6D0" opacity="0.28" />
        </g>
        <g transform="translate(35,565)">
          <ellipse cx="0" cy="-4" rx="3" ry="4" fill="#F2C4CE" opacity="0.30" />
          <ellipse cx="0" cy="4" rx="3" ry="4" fill="#F2C4CE" opacity="0.30" />
          <ellipse cx="-4" cy="0" rx="4" ry="3" fill="#F2C4CE" opacity="0.28" />
          <ellipse cx="4" cy="0" rx="4" ry="3" fill="#F2C4CE" opacity="0.28" />
          <circle cx="0" cy="0" r="1.5" fill="#E8CA7A" opacity="0.35" />
        </g>
        {/* Birds */}
        <path d="M580 60 C590 48 600 48 610 60" stroke="#B8D8C4" strokeWidth="1.2" strokeLinecap="round" opacity="0.28" />
        <path d="M630 42 C636 36 644 36 650 42" stroke="#B8D8C4" strokeWidth="1" strokeLinecap="round" opacity="0.20" />
        {/* Butterfly */}
        <g transform="translate(200,120) rotate(10)">
          <path d="M0,0 C-5,-8 -10,-6 -7,0 C-10,6 -5,8 0,0" fill="#F2C4CE" opacity="0.25" />
          <path d="M0,0 C5,-8 10,-6 7,0 C10,6 5,8 0,0" fill="#EDB8C8" opacity="0.22" />
          <line x1="0" y1="-2.5" x2="0" y2="2.5" stroke="#D4A0B4" strokeWidth="0.5" opacity="0.20" />
        </g>
        {/* Floating petals */}
        <ellipse cx="150" cy="200" rx="2.5" ry="4" fill="#F2C4CE" opacity="0.18" transform="rotate(30 150 200)" />
        <ellipse cx="650" cy="350" rx="2" ry="3.5" fill="#F2C4CE" opacity="0.15" transform="rotate(-25 650 350)" />
        <ellipse cx="350" cy="500" rx="2" ry="3" fill="#F2C4CE" opacity="0.14" transform="rotate(45 350 500)" />
      </svg>
    </div>
  );
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await resetPassword(email);
      setSubmitted(true);
    } catch (err) {
      setError(getFirebaseError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16"
      style={{ background: "linear-gradient(135deg, #EFF7F1 0%, #FFF5F7 100%)" }}
    >
      <NatureDecor />

      <div
        className="relative z-10 w-full max-w-md animate-fade-in-up rounded-2xl bg-white px-8 py-10"
        style={{
          border: "1px solid rgba(200,230,209,0.50)",
          boxShadow: "0 8px 32px rgba(45,106,79,0.06), 0 2px 8px rgba(45,106,79,0.03)",
        }}
      >
        {submitted ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full text-sm" style={{ backgroundColor: "#E6F4EA", color: "#2D6A4F" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h2 className="text-xl font-bold" style={{ color: "#1A3D2B" }}>Check your inbox</h2>
            <p className="text-sm leading-relaxed" style={{ color: "#6B9E85" }}>
              We&apos;ve sent a password reset link to{" "}
              <span className="font-semibold" style={{ color: "#2D6A4F" }}>{email}</span>.
              Check your spam folder if you don&apos;t see it.
            </p>
            <Link href="/login" className="nature-btn mt-2 inline-block rounded-lg px-6 py-2.5 text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #4A9B7A 0%, #3D8B6A 50%, #2D6A4F 100%)" }}>
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-7">
              <h2 className="text-2xl font-bold tracking-tight" style={{ color: "#1A3D2B" }}>Reset your password</h2>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "#6B9E85" }}>
                Enter your email and we&apos;ll send you a reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium" style={{ color: "#2D6A4F" }}>Email address</label>
                <input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="auth-input w-full rounded-lg border px-4 py-3 text-sm" style={{ borderColor: "#C8DDD0", backgroundColor: "#FAFDFB", color: "#1A3D2B" }} />
              </div>

              {error && (
                <div className="rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: "#FEF2F2", color: "#DC3545", border: "1px solid #FECACA" }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} className="nature-btn w-full rounded-lg px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60" style={{ background: "linear-gradient(135deg, #4A9B7A 0%, #3D8B6A 50%, #2D6A4F 100%)", boxShadow: "0 4px 14px rgba(45,106,79,0.28)" }}>
                {loading ? "Sending..." : "Send reset link"}
              </button>
            </form>

            <p className="mt-7 text-center text-sm" style={{ color: "#6B9E85" }}>
              Remember your password?{" "}
              <Link href="/login" className="font-semibold transition-opacity hover:opacity-70" style={{ color: "#2D6A4F" }}>
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>

      <p className="relative z-10 mt-8 text-xs" style={{ color: "#B0C4B6" }}>MySafePlace</p>
    </main>
  );
}

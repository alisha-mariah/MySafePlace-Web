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
      className="flex min-h-screen flex-col items-center justify-center px-6 py-16"
      style={{ backgroundColor: "#FAFDFB" }}
    >
      {/* Decorative top accent */}
      <div
        className="mb-8 flex h-14 w-14 items-center justify-center rounded-full text-2xl"
        style={{ backgroundColor: "#D4EDD8" }}
      >
        🪷
      </div>

      <div
        className="w-full max-w-md rounded-3xl bg-white px-8 py-10"
        style={{
          boxShadow:
            "0 4px 24px rgba(61, 139, 110, 0.10), 0 1px 4px rgba(61, 139, 110, 0.06)",
          border: "1px solid #E4F2E8",
        }}
      >
        {submitted ? (
          /* Success state */
          <div className="flex flex-col items-center gap-4 text-center">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full text-xl"
              style={{ backgroundColor: "#D4EDD8" }}
            >
              ✉️
            </div>
            <h2
              className="text-xl font-bold"
              style={{ color: "#1E4D38" }}
            >
              Check your inbox
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "#6B9E85" }}>
              We&apos;ve sent a password reset link to{" "}
              <span className="font-semibold" style={{ color: "#2D6A4F" }}>
                {email}
              </span>
              . Check your spam folder if you don&apos;t see it.
            </p>
            <Link
              href="/login"
              className="mt-2 inline-block rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-all"
              style={{
                backgroundColor: "#3D8B6E",
                boxShadow: "0 2px 8px rgba(61, 139, 110, 0.25)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                  "#2D6A4F";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                  "#3D8B6E";
              }}
            >
              Back to sign in
            </Link>
          </div>
        ) : (
          /* Form state */
          <>
            <div className="mb-7">
              <h2
                className="text-2xl font-bold tracking-tight"
                style={{ color: "#1E4D38" }}
              >
                Reset your password
              </h2>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "#6B9E85" }}>
                Enter the email address associated with your account and
                we&apos;ll send you a reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
                  className="auth-input w-full rounded-xl border px-4 py-3 text-sm transition-all"
                  style={{
                    borderColor: "#C8E6C9",
                    backgroundColor: "#FFFFFF",
                    color: "#1E4D38",
                  }}
                />
              </div>

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

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  backgroundColor: "#3D8B6E",
                  boxShadow: "0 2px 8px rgba(61, 139, 110, 0.25)",
                }}
                onMouseEnter={(e) => {
                  if (!loading)
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = "#2D6A4F";
                }}
                onMouseLeave={(e) => {
                  if (!loading)
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = "#3D8B6E";
                }}
              >
                {loading ? "Sending…" : "Send reset link"}
              </button>
            </form>

            <p
              className="mt-7 text-center text-sm"
              style={{ color: "#6B9E85" }}
            >
              Remember your password?{" "}
              <Link
                href="/login"
                className="font-semibold transition-opacity hover:opacity-70"
                style={{ color: "#2D6A4F" }}
              >
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>

      {/* Branding footer */}
      <p className="mt-8 text-xs" style={{ color: "#A8D5B5" }}>
        MySafePlace — your wellness companion 🌿
      </p>
    </main>
  );
}

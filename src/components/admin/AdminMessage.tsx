"use client";

import { useEffect } from "react";

interface AdminMessageProps {
  message: string;
  type: "success" | "error";
  onDismiss: () => void;
}

export default function AdminMessage({ message, type, onDismiss }: AdminMessageProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  const ok = type === "success";

  return (
    <div
      className="animate-fade-in-up mb-4 flex items-center justify-between rounded-xl px-4 py-3"
      style={{
        backgroundColor: ok ? "rgba(94,168,138,0.08)" : "rgba(196,96,80,0.08)",
        border: `1px solid ${ok ? "rgba(94,168,138,0.25)" : "rgba(196,96,80,0.25)"}`,
      }}
    >
      <div className="flex items-center gap-2.5">
        {ok ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4E9B78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C46050" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        )}
        <span className="text-[13px] font-semibold" style={{ color: ok ? "#2D6A4F" : "#9B2C2C" }}>
          {message}
        </span>
      </div>
      <button onClick={onDismiss} className="ml-4 flex-shrink-0 p-1 transition-opacity hover:opacity-70">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={ok ? "#4E9B78" : "#C46050"} strokeWidth="2" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}

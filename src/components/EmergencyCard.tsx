"use client";

interface Props {
  name: string;
  description: string;
  phone?: string;
  sms?: string;
  chatUrl?: string;
}

export default function EmergencyCard({ name, description, phone, sms, chatUrl }: Props) {
  return (
    <div
      className="rounded-2xl border p-5 transition-all hover:shadow-md"
      style={{
        backgroundColor: "white",
        borderColor: "rgba(200,230,208,0.5)",
        boxShadow: "0 1px 4px rgba(45,106,79,0.04)",
      }}
    >
      <h3 className="text-[15px] font-bold" style={{ color: "#1A3D2B" }}>{name}</h3>
      <p className="mt-1 text-[13px] leading-relaxed" style={{ color: "#6B9E85" }}>{description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {phone && (
          <a
            href={`tel:${phone}`}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-[12px] font-bold text-white transition-all hover:brightness-110"
            style={{ background: "linear-gradient(135deg, #6DC09A 0%, #4A9474 100%)", boxShadow: "0 2px 8px rgba(93,168,138,0.25)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            Call {phone}
          </a>
        )}
        {sms && (
          <a
            href={`sms:${sms}`}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-[12px] font-bold transition-all"
            style={{
              color: "#2D6A4F",
              backgroundColor: "rgba(94,172,134,0.08)",
              border: "1.5px solid rgba(94,172,134,0.20)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Text {sms}
          </a>
        )}
        {chatUrl && (
          <a
            href={chatUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-[12px] font-bold transition-all"
            style={{
              color: "#2D6A4F",
              backgroundColor: "rgba(94,172,134,0.08)",
              border: "1.5px solid rgba(94,172,134,0.20)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Chat online
          </a>
        )}
      </div>
    </div>
  );
}

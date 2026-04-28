"use client";

interface Props {
  name: string;
  description: string;
  phone?: string;
  sms?: string;
  chatUrl?: string;
}

export default function EmergencyPrimaryCard({ name, description, phone, sms, chatUrl }: Props) {
  return (
    <div
      className="rounded-2xl border-2 p-8"
      style={{
        background: "linear-gradient(135deg, rgba(94,172,134,0.08) 0%, rgba(242,196,206,0.06) 100%)",
        borderColor: "rgba(94,172,134,0.25)",
        boxShadow: "0 4px 20px rgba(45,106,79,0.08), 0 1px 4px rgba(45,106,79,0.04)",
      }}
    >
      {/* Badge */}
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ backgroundColor: "rgba(94,172,134,0.15)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A9474" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </div>
        <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: "rgba(94,172,134,0.12)", color: "#2D6A4F" }}>
          Primary resource
        </span>
      </div>

      <h2 className="text-[20px] font-bold" style={{ color: "#1A3D2B" }}>{name}</h2>
      <p className="mt-1.5 text-[14px] leading-relaxed" style={{ color: "#6B9E85" }}>{description}</p>

      {/* Contact info */}
      <div className="mt-6 flex flex-wrap gap-3">
        {phone && (
          <div className="flex items-center gap-3 rounded-xl px-5 py-3.5" style={{ backgroundColor: "rgba(94,172,134,0.08)", border: "1.5px solid rgba(94,172,134,0.20)" }}>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: "rgba(94,172,134,0.15)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A9474" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#6B9E85" }}>Call</p>
              <p className="text-[16px] font-bold tracking-wide" style={{ color: "#1A3D2B" }}>{phone}</p>
            </div>
          </div>
        )}
        {sms && (
          <div className="flex items-center gap-3 rounded-xl px-5 py-3.5" style={{ backgroundColor: "rgba(242,196,206,0.10)", border: "1.5px solid rgba(242,196,206,0.30)" }}>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: "rgba(242,196,206,0.20)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C07080" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#A8607A" }}>Text</p>
              <p className="text-[16px] font-bold tracking-wide" style={{ color: "#1A3D2B" }}>{sms}</p>
            </div>
          </div>
        )}
        {chatUrl && (
          <a
            href={chatUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl px-5 py-3.5 transition-all hover:brightness-95"
            style={{ color: "white", background: "linear-gradient(135deg, #4A9B7A 0%, #3D8B6A 50%, #2D6A4F 100%)", boxShadow: "0 4px 14px rgba(45,106,79,0.30)" }}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.20)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.70)" }}>Online</p>
              <p className="text-[14px] font-bold">Chat now</p>
            </div>
          </a>
        )}
      </div>
    </div>
  );
}

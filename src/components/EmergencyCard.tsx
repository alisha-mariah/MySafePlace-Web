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
      <h3 className="text-[14px] font-bold" style={{ color: "#1A3D2B" }}>{name}</h3>
      <p className="mt-1 text-[12px] leading-relaxed" style={{ color: "#6B9E85" }}>{description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {phone && (
          <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ backgroundColor: "rgba(94,172,134,0.06)", border: "1px solid rgba(94,172,134,0.15)" }}>
            <div className="flex h-6 w-6 items-center justify-center rounded-md" style={{ backgroundColor: "rgba(94,172,134,0.12)" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4A9474" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: "#6B9E85" }}>Call</p>
              <p className="text-[13px] font-bold" style={{ color: "#1A3D2B" }}>{phone}</p>
            </div>
          </div>
        )}
        {sms && (
          <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ backgroundColor: "rgba(242,196,206,0.08)", border: "1px solid rgba(242,196,206,0.22)" }}>
            <div className="flex h-6 w-6 items-center justify-center rounded-md" style={{ backgroundColor: "rgba(242,196,206,0.18)" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C07080" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: "#A8607A" }}>Text</p>
              <p className="text-[13px] font-bold" style={{ color: "#1A3D2B" }}>{sms}</p>
            </div>
          </div>
        )}
        {chatUrl && (
          <a
            href={chatUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-white transition-all hover:brightness-110"
            style={{ background: "linear-gradient(135deg, #4A9B7A 0%, #3D8B6A 50%, #2D6A4F 100%)", boxShadow: "0 2px 8px rgba(45,106,79,0.22)" }}
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-md" style={{ backgroundColor: "rgba(255,255,255,0.20)" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </div>
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.70)" }}>Online</p>
              <p className="text-[12px] font-bold">Chat</p>
            </div>
          </a>
        )}
      </div>
    </div>
  );
}

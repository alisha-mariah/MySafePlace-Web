"use client";

import ProtectedRoute from "@/src/components/ProtectedRoute";
import EmergencyPrimaryCard from "@/src/components/EmergencyPrimaryCard";
import EmergencyCard from "@/src/components/EmergencyCard";

/*
  ── Contact data ──
  Edit this array to add/remove contacts.
  Each contact needs: name, description, and at least one of: phone, sms, chatUrl
*/

const PRIMARY_CONTACT = {
  name: "988 Suicide & Crisis Lifeline",
  description: "Free, confidential support available 24/7 for anyone in emotional distress or suicidal crisis. You don't have to go through this alone.",
  phone: "988",
  sms: "988",
  chatUrl: "https://988lifeline.org/chat/",
};

const CONTACTS = [
  {
    name: "Crisis Text Line",
    description: "Free crisis counseling via text message, 24/7. Trained counselors are ready to listen.",
    sms: "741741",
    chatUrl: "https://www.crisistextline.org/",
  },
  {
    name: "SAMHSA National Helpline",
    description: "Free referral service for substance abuse and mental health. Available 24/7, 365 days a year.",
    phone: "1-800-662-4357",
  },
  {
    name: "Veterans Crisis Line",
    description: "Confidential support for veterans and their loved ones. Call, text, or chat anytime.",
    phone: "988",
    sms: "838255",
    chatUrl: "https://www.veteranscrisisline.net/get-help-now/chat/",
  },
  {
    name: "National Domestic Violence Hotline",
    description: "Confidential support for anyone affected by domestic violence. Available 24/7.",
    phone: "1-800-799-7233",
    sms: "22233",
    chatUrl: "https://www.thehotline.org/",
  },
  {
    name: "Trevor Project (LGBTQ+ Youth)",
    description: "Crisis intervention and suicide prevention for LGBTQ+ young people under 25.",
    phone: "1-866-488-7386",
    sms: "678-678",
    chatUrl: "https://www.thetrevorproject.org/get-help/",
  },
  {
    name: "NAMI Helpline",
    description: "Information and support for mental health conditions. Monday–Friday, 10am–10pm ET.",
    phone: "1-800-950-6264",
    sms: "62640",
  },
];

function EmergencyContent() {
  return (
    <div className="relative min-h-screen">
      {/* Header */}
      <header className="mx-auto max-w-5xl px-6 pt-8 pb-2">
        <div
          className="card-drop rounded-2xl border p-6"
          style={{
            backgroundColor: "white",
            borderColor: "rgba(200,230,208,0.5)",
            boxShadow: "0 1px 4px rgba(45,106,79,0.04)",
          }}
        >
          <div className="flex items-center gap-3.5">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl"
              style={{ background: "linear-gradient(135deg, rgba(242,196,206,0.25) 0%, rgba(200,230,208,0.20) 100%)" }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C07080" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>
            <div>
              <h1 className="text-[18px] font-bold tracking-tight" style={{ color: "#1A3D2B" }}>
                You are not alone
              </h1>
              <p className="mt-0.5 text-[13px]" style={{ color: "#6B9E85" }}>
                If you need immediate support, these resources are here for you
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-6 py-6 space-y-6">
        {/* Primary contact */}
        <div className="card-drop-1">
          <EmergencyPrimaryCard {...PRIMARY_CONTACT} />
        </div>

        {/* Additional resources */}
        <div className="card-drop-2">
          <div
            className="rounded-2xl border p-5"
            style={{
              backgroundColor: "white",
              borderColor: "rgba(200,230,208,0.5)",
              boxShadow: "0 1px 4px rgba(45,106,79,0.04)",
            }}
          >
            <h2 className="mb-4 text-[14px] font-bold" style={{ color: "#1A3D2B" }}>
              More resources
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {CONTACTS.map((c) => (
                <EmergencyCard key={c.name} {...c} />
              ))}
            </div>
          </div>
        </div>

        {/* Supportive footer */}
        <div className="card-drop-3 pt-4 pb-8 text-center">
          <div className="mx-auto mb-3 flex items-center justify-center gap-3">
            <div className="h-px w-10" style={{ backgroundColor: "rgba(200,230,208,0.5)" }} />
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C07080" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            <div className="h-px w-10" style={{ backgroundColor: "rgba(200,230,208,0.5)" }} />
          </div>
          <p className="text-[12px] font-medium" style={{ color: "#8DBFA5" }}>
            Reaching out is a strong and important step
          </p>
        </div>
      </div>
    </div>
  );
}

export default function EmergencyPage() {
  return (
    <ProtectedRoute>
      <EmergencyContent />
    </ProtectedRoute>
  );
}

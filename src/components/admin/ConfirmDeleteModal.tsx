"use client";

interface ConfirmDeleteModalProps {
  title: string;
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirming?: boolean;
}

export default function ConfirmDeleteModal({
  title,
  itemName,
  onConfirm,
  onCancel,
  confirming = false,
}: ConfirmDeleteModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(26,61,43,0.3)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="animate-fade-in-up w-full max-w-sm rounded-2xl p-6"
        style={{
          background: "linear-gradient(145deg, #FFFFFF 0%, #FFF8F8 100%)",
          border: "1px solid rgba(252,202,202,0.5)",
          boxShadow: "0 20px 60px rgba(45,106,79,0.12), 0 8px 24px rgba(196,96,80,0.08)",
        }}
      >
        <div className="mb-4 flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ backgroundColor: "rgba(254,242,242,0.8)" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C46050" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </div>
          <h3 className="text-lg font-bold" style={{ color: "#1A3D2B" }}>{title}</h3>
        </div>
        <p className="text-[13px] leading-relaxed" style={{ color: "#6B9E85" }}>
          Are you sure you want to delete{" "}
          <strong style={{ color: "#1A3D2B" }}>&ldquo;{itemName}&rdquo;</strong>?
          This action cannot be undone.
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={confirming}
            className="rounded-xl px-5 py-2.5 text-[13px] font-semibold transition-all"
            style={{ color: "#6B9E85", backgroundColor: "rgba(255,255,255,0.8)", border: "1.5px solid rgba(200,230,208,0.5)" }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={confirming}
            className="nature-btn rounded-xl px-5 py-2.5 text-[13px] font-bold text-white"
            style={{ backgroundColor: "#C46050", boxShadow: "0 4px 14px rgba(196,96,80,0.25)", opacity: confirming ? 0.7 : 1 }}
          >
            {confirming ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

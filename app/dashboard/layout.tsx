"use client";

import ProtectedRoute from "@/src/components/ProtectedRoute";
import Sidebar from "@/src/components/Sidebar";
import Topbar from "@/src/components/Topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen" style={{ backgroundColor: "#F5F9F6" }}>
        <Sidebar />
        <div className="ml-60 flex flex-1 flex-col">
          <Topbar />
          <main className="flex-1 px-8 py-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

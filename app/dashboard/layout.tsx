"use client";

import { usePathname } from "next/navigation";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import Sidebar from "@/src/components/Sidebar";
import Topbar from "@/src/components/Topbar";

function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div
      key={pathname}
      style={{ animation: "pageSlideIn 0.12s ease-out both" }}
    >
      {children}
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="relative flex min-h-screen">
        <Sidebar />
        <div className="relative z-10 ml-56 flex flex-1 flex-col">
          <Topbar />
          <main className="flex-1 px-8 py-5">
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

"use client";

import ProtectedRoute from "@/src/components/ProtectedRoute";
import { useAuth } from "@/src/context/AuthContext";
import { logoutUser } from "@/src/services/authService";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logoutUser();
    router.replace("/login");
  }

  return (
    <ProtectedRoute>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-md text-center">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">My Safe Place</h1>
          <p className="text-sm text-gray-500 mb-6">Signed in as {user?.email}</p>
          <button
            onClick={handleLogout}
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Log out
          </button>
        </div>
      </main>
    </ProtectedRoute>
  );
}

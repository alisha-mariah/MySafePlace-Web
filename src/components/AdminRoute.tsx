"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { isAdminUser } from "@/src/lib/adminConfig";

export default function AdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
      } else if (!isAdminUser(user.email)) {
        router.replace("/dashboard");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: "#E6F4EA" }}
      >
        <p className="text-sm" style={{ color: "#3D8B6E" }}>
          Loading...
        </p>
      </div>
    );
  }

  if (!user || !isAdminUser(user.email)) return null;

  return <>{children}</>;
}

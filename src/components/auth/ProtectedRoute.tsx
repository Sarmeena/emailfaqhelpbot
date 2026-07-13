"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
      } else if (!role || role === "error") {
        console.warn(`[ProtectedRoute] Blocking access because user role could not be loaded. UID: ${user.uid}, Role: ${role}`);
        router.replace("/unauthorized");
      } else if (allowedRoles && !allowedRoles.includes(role)) {
        router.replace("/unauthorized");
      }
    }
  }, [user, role, loading, router, allowedRoles]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-700 border-t-transparent mx-auto"></div>
          <p className="text-lg font-semibold text-gray-700">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user || !role || role === "error" || (allowedRoles && !allowedRoles.includes(role))) {
    return null;
  }

  return <>{children}</>;
}
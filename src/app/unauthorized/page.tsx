"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { logout } from "../../services/auth/auth";
import { ShieldAlert, ArrowLeft, LogOut } from "lucide-react";

export default function UnauthorizedPage() {
  const router = useRouter();
  const { user, role } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F9FC] p-4 md:p-6">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl text-center border border-gray-100 flex flex-col items-center">
        
        {/* Shield Icon Container */}
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-600">
          <ShieldAlert size={48} className="animate-pulse" />
        </div>

        {/* Security Alert Header */}
        <span className="inline-block rounded-full bg-red-100 px-4 py-1 text-xs font-bold uppercase tracking-wider text-red-800">
          Security Alert
        </span>

        <h1 className="mt-4 text-3xl font-extrabold text-gray-900">
          Access Denied
        </h1>

        <p className="mt-4 text-base text-gray-600 max-w-md">
          You do not have the required permissions to access this page. 
          Your current account is registered as a <span className="font-bold text-gray-800 capitalize">{role || "viewer"}</span>.
        </p>

        {/* User context information */}
        {user && (
          <div className="mt-6 w-full rounded-xl bg-gray-50 p-4 text-left text-sm border border-gray-100">
            <p className="text-gray-500 font-medium">Logged in as:</p>
            <p className="font-semibold text-gray-800 mt-1 break-all">{user.email}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full justify-center">
          <button
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3.5 text-white font-semibold shadow hover:bg-blue-800 transition active:scale-95 duration-150 cursor-pointer text-sm w-full sm:w-auto"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>

          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3.5 text-gray-700 font-semibold shadow hover:bg-gray-50 transition active:scale-95 duration-150 cursor-pointer text-sm w-full sm:w-auto"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>

      </div>
    </div>
  );
}

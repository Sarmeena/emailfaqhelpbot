"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, LogOut, ShieldCheck, Mail, Send, Check } from "lucide-react";
import { changePassword, resetPassword, logout } from "../../services/auth/auth";

export default function SettingsSecurity() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updating, setUpdating] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);

  async function handlePasswordUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!newPassword.trim()) {
      alert("Please enter a new password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    setUpdating(true);
    try {
      await changePassword(newPassword);
      alert("Password changed successfully.");
      setNewPassword("");
      setConfirmPassword("");
      setShowForm(false);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to update password. Try logging in again first.");
    } finally {
      setUpdating(false);
    }
  }

  async function handleSendResetEmail() {
    setSendingReset(true);
    try {
      // Direct reset to system email
      await resetPassword("emailfaqhelpbot@gmail.com");
      alert("Password reset email sent to emailfaqhelpbot@gmail.com successfully.");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to send reset email.");
    } finally {
      setSendingReset(false);
    }
  }

  async function handleLogout() {
    try {
      await logout();
      router.push("/login");
    } catch (err) {
      console.error(err);
      alert("Error logging out.");
    }
  }

  return (
    <>
      {/* Security */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-blue-100 p-2">
            <ShieldCheck className="h-5 w-5 text-blue-750" />
          </div>

          <h2 className="text-lg font-bold text-gray-900">
            Security & Access
          </h2>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setShowForm(!showForm)}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white px-5 py-3 text-sm font-semibold transition active:scale-95 cursor-pointer"
              >
                <KeyRound className="h-4 w-4" />
                Change Password
              </button>

              <button
                type="button"
                onClick={handleSendResetEmail}
                disabled={sendingReset}
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 px-5 py-3 text-sm font-semibold transition active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Mail className="h-4 w-4" />
                {sendingReset ? "Sending Reset Email..." : "Send Reset Email"}
              </button>
            </div>

            <p className="max-w-md text-sm text-gray-500 font-medium">
              Update your account credentials directly or trigger a standard Firebase verification reset link.
            </p>
          </div>

          {/* Change Password Form */}
          {showForm && (
            <form onSubmit={handlePasswordUpdate} className="border-t pt-6 space-y-4 max-w-md animate-fade-in">
              <h3 className="text-sm font-bold text-gray-800">Change Account Password</h3>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-500">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min. 6 characters)"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-500">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={updating}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 text-xs font-bold transition disabled:opacity-50 cursor-pointer"
              >
                {updating ? "Updating Password..." : "Update Password"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Logout */}
      <section className="pt-6">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-red-50 hover:bg-red-100 py-4 font-bold text-red-700 border border-red-200 transition active:scale-95 cursor-pointer shadow-sm"
        >
          <LogOut className="h-5 w-5" />
          Logout Session
        </button>

        <p className="mt-4 text-center text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400">
          Version 2.4.0-build.82
        </p>
      </section>
    </>
  );
}
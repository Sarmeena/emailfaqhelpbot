"use client";

import { useState } from "react";
import Link from "next/link";
import { resetPassword } from "../../services/auth/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      await resetPassword(email);

      setMessage(
        "Password reset email sent successfully. Please check your inbox."
      );
    } catch (err) {
  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError("Failed to send reset email.");
  }
} finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F7F9FC] p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

        <h1 className="text-3xl font-bold text-center text-blue-700">
          Forgot Password
        </h1>

        <p className="mt-3 text-center text-gray-500">
          Enter your registered email address.
        </p>

        {message && (
          <div className="mt-5 rounded-lg bg-green-100 p-3 text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-5 rounded-lg bg-red-100 p-3 text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleResetPassword}
          className="mt-6 space-y-5"
        >
          <div>
            <label className="mb-2 block font-medium">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 w-full rounded-lg border px-4 outline-none focus:border-blue-700"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-lg bg-blue-700 text-white font-semibold hover:bg-blue-800 disabled:opacity-60"
          >
            {loading
              ? "Sending..."
              : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-blue-700 hover:underline"
          >
            ← Back to Login
          </Link>
        </div>

      </div>
    </main>
  );
}
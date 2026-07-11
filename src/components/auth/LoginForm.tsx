"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../services/auth/auth";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await login(email, password, rememberMe);
      router.push("/dashboard");
    } catch (err) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

      {/* Mobile Logo */}

      <div className="mb-8 text-center lg:hidden">

        <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center text-4xl">
          📧
        </div>

        <h1 className="text-3xl font-bold text-blue-700">
          Email FAQ Help Bot
        </h1>

      </div>

      <h2 className="text-3xl font-bold">
        Welcome Back
      </h2>

      <p className="mt-2 text-gray-500">
        Sign in to manage customer support requests
      </p>
      {error && (
  <p className="mt-4 text-sm text-red-600">
    {error}
  </p>
)}
      <form onSubmit={handleLogin} className="mt-8 space-y-5">

        <div>

          <label className="mb-2 block text-sm font-medium">
            Email
          </label>

          <input
            type="email"
placeholder="Enter Your Email"
value={email}
onChange={(e) => setEmail(e.target.value)}
className="h-12 w-full rounded-lg border px-4 focus:border-blue-600 outline-none"
/>

        </div>

        <div>

          <label className="mb-2 block text-sm font-medium">
            Password
          </label>

          <input
            type={showPassword ? "text" : "password"}
placeholder="********"
value={password}
onChange={(e)=>setPassword(e.target.value)}
className="h-12 w-full rounded-lg border px-4 focus:border-blue-600 outline-none"
/>

        </div>

        <div className="flex items-center justify-between">

          <label className="flex items-center gap-2 text-sm">

            <input
  type="checkbox"
  checked={rememberMe}
  onChange={(e) => setRememberMe(e.target.checked)}
/>

            Remember me

          </label>

          <Link
  href="/forgot-password"
  className="text-sm text-blue-700 hover:underline"
>
  Forgot Password?
</Link>

        </div>

        <button
  type="submit"
  disabled={loading}
  className="h-12 w-full rounded-lg bg-blue-700 text-white font-semibold hover:bg-blue-800 disabled:opacity-50"
>
  {loading ? "Signing In..." : "Sign In"}
</button>

      </form>

    </div>
  );
}
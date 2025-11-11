"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://campuseats-backend-production.up.railway.app/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);

      if (data.user.role === "CUSTOMER") {
        router.push("/dashboard");
      } else if (data.user.role === "CAFE_OWNER") {
        router.push("/owner/dashboard");
      } else {
        router.push("/");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-pink-500">
              <span className="text-xl font-bold text-white">CE</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              CampusEats
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/signup">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Login Section */}
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md p-8 transition-colors duration-300">
          <h2 className="mb-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
            Welcome Back 👋
          </h2>
          <p className="mb-8 text-center text-gray-600 dark:text-gray-400">
            Sign in to continue ordering your favorite campus meals.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Email */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-4 py-2 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:border-orange-500 focus:outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-4 py-2 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:border-orange-500 focus:outline-none"
              />
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <input type="checkbox" className="rounded border-gray-300 dark:border-gray-700" />
                Remember me
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-orange-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-2 font-semibold text-white shadow-md hover:opacity-90 disabled:opacity-50 transition"
            >
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-orange-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-8">
        <div className="container mx-auto text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; 2025 CampusEats. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

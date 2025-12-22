"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import Cookies from "js-cookie";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });
      Cookies.set("token", res.data.token, { expires: 7 });

      localStorage.setItem("user", JSON.stringify(res.data.user));

      setTimeout(() => {
        window.location.replace("/");
      }, 150);
      router.refresh();
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;

      setError(
        axiosError.response?.data?.message || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-slate-50 dark:bg-[#101622] min-h-screen">
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-8 sm:p-10">
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
                Welcome back
              </h1>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium border border-red-100 dark:border-red-800">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-gray-200 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-3 px-4 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="name@company.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-gray-200 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-3 px-4 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? "visibility" : "visibility_off"}
                    </span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-lg bg-blue-600 py-3 px-4 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

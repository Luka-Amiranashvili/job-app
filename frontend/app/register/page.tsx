"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import Link from "next/link";
import Cookies from "js-cookie";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    userType: "jobseeker",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUserTypeChange = (type: string) => {
    setFormData({ ...formData, userType: type });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/register", formData);

      Cookies.set("token", res.data.token, { expires: 7 });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);

      window.location.href = "/";
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#101622] min-h-screen">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-8 sm:p-10">
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                Create Account
              </h1>
              <p className="text-slate-500 text-sm">
                Select your account type to get started.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4 p-1 bg-slate-100 dark:bg-gray-800 rounded-xl mb-6">
                <button
                  type="button"
                  onClick={() => handleUserTypeChange("jobseeker")}
                  className={`py-2 text-sm font-bold rounded-lg transition-all ${
                    formData.userType === "jobseeker"
                      ? "bg-white dark:bg-gray-700 text-blue-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-700 dark:hover:text-gray-300"
                  }`}
                >
                  Job Seeker
                </button>
                <button
                  type="button"
                  onClick={() => handleUserTypeChange("employer")}
                  className={`py-2 text-sm font-bold rounded-lg transition-all ${
                    formData.userType === "employer"
                      ? "bg-white dark:bg-gray-700 text-blue-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-700 dark:hover:text-gray-300"
                  }`}
                >
                  Employer
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-gray-200 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-3 px-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-gray-200 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-3 px-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-gray-200 mb-1.5">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-3 px-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 mt-4"
              >
                {loading
                  ? "Creating account..."
                  : `Join as ${
                      formData.userType === "jobseeker"
                        ? "Job Seeker"
                        : "Employer"
                    }`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

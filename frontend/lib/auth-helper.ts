"use client";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export interface User {
  name: string;
  userType: string;
  role?: "job_seeker" | "employer";
}

export const protectAction = (
  router: AppRouterInstance,
  user: User | null,
  action: () => void,
  forEmployerOnly: boolean = false
) => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please log in to continue");
    router.push("/login");
    return;
  }

  if (forEmployerOnly && user?.role !== "employer") {
    alert("Only employers can perform this action.");
    return;
  }

  action();
};

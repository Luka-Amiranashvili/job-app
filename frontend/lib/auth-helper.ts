"use client";

import Cookies from "js-cookie";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const protectAction = (
  router: AppRouterInstance,
  action: () => void
) => {
  const token = Cookies.get("token");

  if (!token) {
    alert("Please log in to continue");
    router.push("/login");
    return;
  }

  action();
};

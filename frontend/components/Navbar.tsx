"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<{
    name: string;
    userType: string;
    role?: string;
  } | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const savedUser = localStorage.getItem("user");
      if (savedUser && savedUser !== "undefined" && savedUser !== "null") {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error("Auth parse error", e);
          localStorage.removeItem("user");
        }
      }
      setIsLoaded(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsOpen(false);
    router.push("/login");
  };

  const isEmployer =
    user?.userType?.toLowerCase() === "employer" ||
    user?.role?.toLowerCase() === "employer";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-blue-300 dark:border-gray-800 backdrop-blur-md bg-white/70 dark:bg-[#101622]/70">
      <div className="px-4 md:px-10 lg:px-40 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4">
          <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-white">
            <span className="material-symbols-outlined !text-[20px]">work</span>
          </div>
          <h2 className="text-lg font-bold">JobBoard</h2>
        </Link>

        <div className="hidden lg:flex flex-1 justify-end gap-8 items-center">
          <nav className="flex items-center gap-6">
            {!isLoaded ? (
              <span className="text-gray-300">Loading...</span>
            ) : (
              <>
                {!isEmployer && (
                  <Link
                    className="text-sm font-medium hover:text-blue-600 transition-colors"
                    href="/jobs"
                  >
                    Find Jobs
                  </Link>
                )}
                {isEmployer && (
                  <Link
                    className="text-sm font-medium hover:text-blue-600"
                    href="/post-job"
                  >
                    Post a Job
                  </Link>
                )}
              </>
            )}
          </nav>

          <div className="flex gap-3 justify-end">
            {isLoaded &&
              (user ? (
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <Link href={"/profile"}>
                      <p className="text-sm font-bold leading-none">
                        {user.name.charAt(0).toUpperCase() +
                          user.name.slice(1).toLowerCase()}
                      </p>
                      <p className="text-[10px] uppercase text-primary font-bold">
                        {user.userType}
                      </p>
                    </Link>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 h-9 rounded-lg bg-red-50 text-red-500 text-sm font-bold border border-red-100 hover:bg-red-500 hover:text-white transition-all"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 h-9 flex items-center text-sm font-bold text-primary"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 h-9 flex items-center bg-primary text-white rounded-lg text-sm font-bold"
                  >
                    Register
                  </Link>
                </>
              ))}
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden size-10 flex items-center justify-center rounded-full border border-gray-200"
        >
          <span className="material-symbols-outlined">
            {isOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-[#101622] border-b border-gray-300 p-6 shadow-2xl">
          <nav className="flex flex-col gap-4">
            {isLoaded &&
              user?.userType?.toLowerCase() !== "employer" &&
              user?.role?.toLowerCase() !== "employer" && (
                <Link
                  className="text-sm font-medium hover:text-primary transition-colors"
                  href="/jobs"
                >
                  Find Jobs
                </Link>
              )}
            {isLoaded &&
              (user?.userType?.toLowerCase() === "employer" ||
                user?.role?.toLowerCase() === "employer") && (
                <Link
                  onClick={() => setIsOpen(false)}
                  href="/post-job"
                  className="font-semibold"
                >
                  Post a Job
                </Link>
              )}
            <hr />
            {user ? (
              <>
                <div className="py-2">
                  <Link
                    href={"/profile"}
                    className="text-right hover:opacity-70 transition-opacity group"
                  >
                    <p className="text-sm font-bold leading-none">
                      {user.name.charAt(0).toUpperCase() +
                        user.name.slice(1).toLowerCase()}
                    </p>
                    <p className="text-[10px] uppercase text-primary font-bold">
                      {user.userType}
                    </p>
                  </Link>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full py-4 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  onClick={() => setIsOpen(false)}
                  href="/login"
                  className="w-full py-4 text-center border border-primary text-primary rounded-xl font-bold"
                >
                  Sign In
                </Link>
                <Link
                  onClick={() => setIsOpen(false)}
                  href="/register"
                  className="w-full py-4 text-center bg-primary text-white rounded-xl font-bold"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;

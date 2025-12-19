"use client";

import React, { useState } from "react";
import Link from "next/link";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-blue-300 dark:border-gray-800 dark:bg-background-dark/90 backdrop-blur-md ">
      <div className="px-4 md:px-10 lg:px-40 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4">
          <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-white">
            <span className="material-symbols-outlined !text-[20px]">work</span>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-tight">
            JobBoard
          </h2>
        </Link>

        <div className="hidden lg:flex flex-1 justify-end gap-8 items-center">
          <nav className="flex items-center gap-6">
            <Link
              className="text-sm font-medium hover:text-primary transition-colors"
              href="/jobs"
            >
              Find Jobs
            </Link>
            <Link
              className="text-sm font-medium hover:text-primary transition-colors"
              href="#"
            >
              Company Reviews
            </Link>
            <Link
              className="text-sm font-medium hover:text-primary transition-colors"
              href="/post-job"
            >
              Post a Job
            </Link>
          </nav>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="flex items-center justify-center rounded-lg h-9 px-4 text-sm font-bold text-primary hover:bg-primary/10 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="flex items-center justify-center rounded-lg h-9 px-4 bg-primary text-white text-sm font-bold shadow-sm hover:bg-blue-700 transition-colors"
            >
              Join Now
            </Link>
          </div>
        </div>

        <button
          onClick={toggleMenu}
          className="lg:hidden p-2 text-gray-600 dark:text-gray-300"
          aria-label="Toggle Menu"
        >
          <span className="material-symbols-outlined !text-[28px]">
            {isOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full  dark:bg-background-dark border-b border-[#f0f2f4] dark:border-gray-800 shadow-xl animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col p-6 gap-4">
            <Link
              onClick={() => setIsOpen(false)}
              className="text-base font-semibold py-2"
              href="/jobs"
            >
              Find Jobs
            </Link>
            <Link
              onClick={() => setIsOpen(false)}
              className="text-base font-semibold py-2"
              href="#"
            >
              Company Reviews
            </Link>
            <Link
              onClick={() => setIsOpen(false)}
              className="text-base font-semibold py-2"
              href="/post-job"
            >
              Post a Job
            </Link>
            <hr className="border-gray-100 dark:border-gray-800 my-2" />
            <div className="flex flex-col gap-3">
              <Link
                onClick={() => setIsOpen(false)}
                href="/login"
                className="flex items-center justify-center rounded-xl h-12 text-base font-bold text-primary border border-primary/20 bg-primary/5"
              >
                Sign In
              </Link>
              <Link
                onClick={() => setIsOpen(false)}
                href="/register"
                className="flex items-center justify-center rounded-xl h-12 bg-primary text-white text-base font-bold shadow-sm"
              >
                Join Now
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;

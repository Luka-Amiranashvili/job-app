"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import api from "@/lib/axios";

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  salary: number;
}

export default function Hero() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (!search.trim() && !location.trim()) {
        console.log("Please enter a search term");
      }

      setLoading(true);
      try {
        const params = new URLSearchParams({
          title: search.trim(),
          location: location.trim(),
        });

        const res = await api.get(`/job/getJobs?${params.toString()}`);
        setJobs(res.data.jobs);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setLoading(false);
      }
    },
    [search, location]
  );

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  return (
    <div className="flex flex-col text-[#111318] dark:text-white">
      <main className="flex-1">
        <section className="relative px-4 md:px-10 lg:px-40 pt-20 pb-20 md:pt-32 md:pb-32 flex flex-col items-center justify-center text-center overflow-hidden">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-blue-100/50 via-transparent to-transparent dark:from-blue-900/20 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 max-w-[960px] w-full flex flex-col items-center gap-8">
            <div className="flex flex-col gap-4">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-black leading-tight tracking-tight">
                Find your <span className="text-primary">next big break.</span>
              </h1>
              <p className="text-[#616f89] dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                Browse thousands of tech jobs with transparent salaries. Connect
                directly with top startups.
              </p>
            </div>

            <div className="w-full max-w-3xl">
              <form
                onSubmit={handleSearch}
                className="flex flex-col md:flex-row items-stretch bg-white dark:bg-gray-900 p-2 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800"
              >
                <div className="flex-1 flex items-center px-4 h-14 group">
                  <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary mr-2 py-3">
                    search
                  </span>
                  <input
                    className="w-full bg-transparent border-none focus:ring-0 text-base focus:outline-none"
                    placeholder="Job title or company"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="hidden md:block w-px h-8 bg-gray-200 self-center"></div>
                <div className="flex-1 flex items-center px-4 h-14 group">
                  <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary mr-2 py-3">
                    location_on
                  </span>
                  <input
                    className="w-full bg-transparent border-none focus:ring-0 text-base focus:outline-none"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </section>

        <section className="px-4 md:px-10 lg:px-40 py-16 bg-gray-50/50 dark:bg-gray-900/30 border-t border-gray-100 dark:border-gray-800">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold">Latest Opportunities</h3>
              <span className="text-sm text-gray-500">
                {jobs.length} jobs found
              </span>
            </div>

            <div className="grid gap-4">
              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                </div>
              ) : jobs.length > 0 ? (
                jobs.map((job) => (
                  <div
                    key={job._id}
                    className="group bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-primary/50 hover:shadow-xl transition-all flex flex-col md:flex-row justify-between items-center gap-4"
                  >
                    <div className="flex gap-4 items-center w-full">
                      <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined">
                          domain
                        </span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold group-hover:text-primary transition-colors">
                          {job.title}
                        </h4>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <span className="font-medium text-gray-900 dark:text-gray-200">
                            {job.company}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined !text-sm">
                              location_on
                            </span>
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined !text-sm">
                              payments
                            </span>
                            ${job.salary.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Link
                      href={`/jobs/${job._id}`}
                      className="w-full md:w-auto whitespace-nowrap px-6 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-primary hover:text-white text-sm font-bold rounded-xl transition-all text-center"
                    >
                      Details
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl">
                  <p className="text-gray-500">
                    No jobs found matching your criteria.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
        <section className="px-4 md:px-10 lg:px-40 py-16 bg-gray-50/50 dark:bg-gray-900/30 border-t border-gray-100 dark:border-gray-800">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold">Latest Opportunities</h3>
              <span className="text-sm text-gray-500">
                {jobs.length} jobs found
              </span>
            </div>

            {!loading && jobs.length > 0 && (
              <div className="mt-12 flex justify-center">
                <Link
                  href="/jobs"
                  className="group flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-8 py-4 rounded-2xl font-bold hover:border-primary hover:text-primary transition-all shadow-sm hover:shadow-md"
                >
                  Explore All Jobs
                  <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

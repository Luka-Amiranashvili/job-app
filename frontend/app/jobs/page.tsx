"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary: number;
  jobType: string;
}

const AllJobsPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get("/job/getJobs");

        const data = response.data;

        if (Array.isArray(data)) {
          setJobs(data);
        } else if (data.jobs && Array.isArray(data.jobs)) {
          setJobs(data.jobs);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-gray-900 mb-2">
          Explore Opportunities
        </h1>
        <p className="text-gray-500">
          Find the perfect role from our latest listings.
        </p>
      </header>

      {jobs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">No jobs have been posted yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="group bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 flex flex-col"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="size-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined">work</span>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {job.jobType}
                </span>
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {job.title}
                </h2>
                <p className="text-gray-600 font-medium mb-4">{job.company}</p>

                <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined !text-sm">
                      location_on
                    </span>
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined !text-sm">
                      payments
                    </span>
                    ${job.salary.toLocaleString()}
                  </div>
                </div>

                <p className="text-gray-500 text-sm line-clamp-2 mb-6">
                  {job.description}
                </p>
              </div>

              <Link
                href={`/jobs/${job._id}`}
                className="block w-full py-4 text-center bg-gray-900 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllJobsPage;

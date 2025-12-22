"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import Link from "next/link";
import { protectAction, User } from "@/lib/auth-helper";

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  salary: number;
  description: string;
  jobType: string;
}

const JobDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser && savedUser !== "undefined") {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const onApply = () => {
    console.log("Job applied");
  };

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/job/getJob/${id}`);

        console.log("Check this in console:", res.data);

        const data = res.data.job ? res.data.job : res.data;

        setJob(data);
      } catch (err) {
        console.error("Failed to fetch job", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-40">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-40">
        <h2 className="text-2xl font-bold">Job not found</h2>
        <Link href="/" className="text-primary hover:underline mt-4 block">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#101622] pb-20">
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <button
            onClick={() => router.back()}
            className="flex items-center text-sm text-gray-500 hover:text-primary mb-6 transition-colors"
          >
            <span className="material-symbols-outlined !text-base mr-1">
              arrow_back
            </span>
            Back to results
          </button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">
                {job.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-gray-600 dark:text-gray-400 font-medium">
                <span className="text-primary">{job.company}</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined !text-sm">
                    location_on
                  </span>
                  {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined !text-sm">
                    work
                  </span>
                  {job.jobType}
                </span>
              </div>
            </div>
            <div className="text-left md:text-right">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                ${job.salary.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">
                Annual Salary
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="text-xl font-bold mb-4">Job Description</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm sticky top-24">
            <h4 className="font-bold mb-4">Interested in this role?</h4>
            <button
              onClick={() => protectAction(router, user, onApply)}
              className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg mb-3"
            >
              Apply Now
            </button>
            <button className="w-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 font-bold py-3 rounded-xl transition-all">
              Save Job
            </button>
            <p className="text-xs text-gray-500 mt-4 text-center">
              Please mention you found this on JobBoard
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default JobDetails;

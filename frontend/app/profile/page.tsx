"use client";
import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";
import { User, Briefcase, Users, Trash2 } from "lucide-react";

interface Job {
  _id: string;
  title: string;
  location: string;
  company?: string;
  salary?: number;
}

interface Applicant {
  _id: string;
  name: string;
  email: string;
}

interface Application {
  _id: string;
  applicant: Applicant;
  createdAt: string;
}

export default function ProfilePage() {
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [candidates, setCandidates] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [candidatesLoading, setCandidatesLoading] = useState(false);

  const fetchMyJobs = async () => {
    try {
      const res = await api.get("/applications/my-applications");
      console.log("Gios jobs:", res.data.data);

      if (res.data.success) {
        setMyJobs(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load jobs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const handleViewCandidates = async (job: Job) => {
    setSelectedJob(job);
    setCandidatesLoading(true);
    try {
      const res = await api.get(`/applications/candidates/${job._id}`);
      setCandidates(res.data.candidates);
    } catch (err) {
      console.error("Error fetching candidates", err);
      setCandidates([]);
    } finally {
      setCandidatesLoading(false);
    }
  };

  const deleteJob = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this job listing?")) return;
    try {
      await api.delete(`/job/${id}`);
      // Type safety for the filter function
      setMyJobs((prevJobs) => prevJobs.filter((j: Job) => j._id !== id));
      if (selectedJob?._id === id) setSelectedJob(null);
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-slate-900">
          Employer Dashboard
        </h1>
        <p className="text-slate-500">
          Manage your postings and review applicants
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: JOB LISTINGS */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Briefcase size={20} /> My Postings
            </h2>
            <Link
              href="/post-job"
              className="text-sm font-bold text-blue-600 hover:underline"
            >
              + Post New
            </Link>
          </div>

          {loading ? (
            <p>Loading jobs...</p>
          ) : myJobs.length > 0 ? (
            myJobs.map((job) => (
              <div
                key={job._id}
                onClick={() => handleViewCandidates(job)}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                  selectedJob?._id === job._id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-100 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{job.title}</h3>
                    <p className="text-sm text-gray-500">{job.location}</p>
                  </div>
                  <button
                    onClick={(e) => deleteJob(job._id, e)}
                    className="p-2 text-red-400 hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-10 border-2 border-dashed rounded-3xl text-center text-gray-400">
              No jobs posted yet.
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: CANDIDATES LIST */}
        <div className="lg:col-span-7">
          <div className="bg-slate-900 rounded-[2rem] p-8 text-white min-h-[500px]">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Users />{" "}
              {selectedJob
                ? `Applicants for ${selectedJob.title}`
                : "Select a job"}
            </h2>

            {candidatesLoading ? (
              <p className="text-slate-400">Fetching candidates...</p>
            ) : selectedJob ? (
              <div className="space-y-4">
                {candidates.length > 0 ? (
                  candidates.map((can) => (
                    <div
                      key={can._id}
                      className="bg-slate-800 p-5 rounded-2xl border border-slate-700 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-bold text-lg">
                          {can.applicant.name}
                        </p>
                        <p className="text-slate-400 text-sm">
                          {can.applicant.email}
                        </p>
                      </div>
                      <Link
                        href={`/profile/candidate/${can.applicant._id}`}
                        className="bg-white text-black px-4 py-2 rounded-xl text-xs font-bold"
                      >
                        View Resume
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center text-slate-500">
                    <User size={48} className="mx-auto mb-4 opacity-20" />
                    <p>No candidates have applied to this position yet.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full pt-20 text-slate-500">
                <p>Select a job from the left to view interested candidates.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

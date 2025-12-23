"use client";
import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";
import { User, Briefcase, Users, Trash2, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

interface Job {
  _id: string;
  title: string;
  location: string;
  company?: string;
  salary?: number;
}

interface Application {
  _id: string;
  job: Job;
  applicant: { name: string; email: string };
  createdAt: string;
  status?: string;
}

export default function ProfilePage() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [data, setData] = useState<(Job | Application)[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [candidates, setCandidates] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [candidatesLoading, setCandidatesLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token || !savedUser) {
      router.push("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUser);
      const role = parsedUser.role || parsedUser.userType;
      setUserRole(role);

      if (role === "employer") {
        fetchEmployerData();
      } else {
        fetchJobSeekerData();
      }
    } catch (err) {
      console.error("User parsing error", err);
      router.push("/login");
    }
  }, [router]);

  const fetchEmployerData = async () => {
    try {
      const res = await api.get("/applications/my-posted-jobs");
      setData(res.data.data || []);
    } catch (err) {
      console.error("Failed to load posted jobs", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobSeekerData = async () => {
    try {
      const res = await api.get("/applications/my-applications");
      setData(res.data.applications || res.data.data || []);
    } catch (err) {
      console.error("Failed to load applications", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCandidates = async (job: Job) => {
    setSelectedJob(job);
    setCandidatesLoading(true);
    try {
      const res = await api.get(`/applications/candidates/${job._id}`);
      setCandidates(res.data.candidates);
    } catch (err) {
      setCandidates([]);
    } finally {
      setCandidatesLoading(false);
    }
  };

  const deleteJob = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this job listing?")) return;
    try {
      await api.delete(`/job/deleteJob/${id}`);
      setData((prev) => (prev as Job[]).filter((j) => j._id !== id));
      if (selectedJob?._id === id) setSelectedJob(null);
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-white">
          {userRole === "employer" ? "Employer Dashboard" : "My Applications"}
        </h1>
        <p className="text-slate-500">
          {userRole === "employer"
            ? "Manage your postings and review applicants"
            : "Track the jobs you have applied for"}
        </p>
      </header>

      {userRole === "employer" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Briefcase size={20} /> My Postings
            </h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              (data as Job[]).map((job) => (
                <div
                  key={job._id}
                  onClick={() => handleViewCandidates(job)}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedJob?._id === job._id
                      ? "border-blue-500 bg-blue-50"
                      : "bg-white border-gray-100 hover:border-gray-300"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-black">
                        {job.title}
                      </h3>
                      <p className="text-sm text-gray-500">{job.location}</p>
                    </div>
                    <button
                      onClick={(e) => deleteJob(job._id, e)}
                      className="text-red-400 hover:text-red-600 p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="lg:col-span-7 bg-slate-900 rounded-[2rem] p-8 text-white min-h-[400px]">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Users />{" "}
              {selectedJob
                ? `Applicants for ${selectedJob.title}`
                : "Select a Job"}
            </h2>
            {candidatesLoading ? (
              <p className="text-slate-400">Loading candidates...</p>
            ) : selectedJob ? (
              candidates.length > 0 ? (
                candidates.map((can) => (
                  <div
                    key={can._id}
                    className="bg-slate-800 p-4 rounded-xl mb-2 border border-slate-700 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-bold">{can.applicant.name}</p>
                      <p className="text-xs text-slate-400">
                        {can.applicant.email}
                      </p>
                    </div>
                    <span className="text-xs text-slate-500">
                      {new Date(can.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-center py-10">
                  No applicants yet.
                </p>
              )
            ) : (
              <p className="text-slate-500 text-center py-10">
                Select a posting to see who applied.
              </p>
            )}
          </div>
        </div>
      ) : (
        /* --- JOB SEEKER VIEW --- */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p>Loading your applications...</p>
          ) : data.length > 0 ? (
            (data as Application[]).map((app) => (
              <div
                key={app._id}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                    <Briefcase size={24} />
                  </div>
                  <span className="text-xs font-bold px-3 py-1 bg-green-100 text-green-700 rounded-full capitalize">
                    Applied
                  </span>
                </div>
                <h3 className="font-bold text-xl mb-1">{app.job?.title}</h3>
                <p className="text-gray-500 text-sm mb-4">
                  {app.job?.company || "Company Name"}
                </p>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Clock size={16} />
                  <span>
                    Applied on {new Date(app.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed rounded-3xl">
              <p className="text-gray-400">
                You haven&apos;t applied for any jobs yet.
              </p>
              <Link
                href="/jobs"
                className="text-blue-600 font-bold mt-2 block hover:underline"
              >
                Browse Jobs
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

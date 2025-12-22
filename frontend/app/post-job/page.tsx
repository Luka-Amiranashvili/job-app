"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { protectAction } from "../../lib/auth-helper";
import { User } from "../../lib/auth-helper";
const PostJob = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    salary: "",
    jobType: "Remote",
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user");
      }
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    protectAction(router, user, async () => {
      setLoading(true);
      try {
        const token = Cookies.get("token");

        const payload = {
          title: formData.title,
          company: formData.company,
          location: formData.location,
          description: formData.description,
          salary: Number(formData.salary),
          jobType: formData.jobType,
        };

        const response = await fetch(
          "http://localhost:5000/api/job/createJob/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );

        if (response.ok) {
          alert("Job Created Successfully!");
          router.push("/jobs");
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.message || "Something went wrong"}`);
        }
      } catch (error) {
        console.error("Submission error:", error);
        alert("Server connection failed");
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-2xl bg-black rounded-xl shadow-lg p-8 border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-50 mb-2">Post a New Job</h1>
        <p className="text-gray-50 mb-8 text-sm">
          Fill in the details for your tech listing.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-50 mb-1">
              Job Title
            </label>
            <input
              name="title"
              required
              value={formData.title}
              placeholder="e.g. Junior Backend Developer"
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-50 mb-1">
                Company
              </label>
              <input
                name="company"
                required
                placeholder="Pulse AI"
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-50 mb-1">
                Location
              </label>
              <input
                name="location"
                required
                placeholder="Remote"
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-50 mb-1">
              Description
            </label>
            <textarea
              name="description"
              required
              rows={5}
              placeholder="Describe the role, tech stack, and responsibilities..."
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-50 mb-1">
                Salary (Annual $)
              </label>
              <input
                name="salary"
                type="number"
                required
                placeholder="85000"
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-50 mb-1">
                Job Type
              </label>
              <select
                name="jobType"
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              >
                <option value="Remote">Remote</option>
                <option value="Full-time">Full-time</option>
                <option value="Contract">Contract</option>
                <option value="Part-time">Part-time</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-md transition-all active:scale-[0.98] disabled:bg-gray-400"
          >
            {loading ? "Sending Data..." : "Create Job Post"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;

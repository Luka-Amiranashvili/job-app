"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { protectAction } from "../../lib/auth-helper";
import { User } from "../../lib/auth-helper";

interface ZodIssue {
  message: string;
  path: (string | number)[];
}

interface BackendErrorResponse {
  message?: string;
  errors?: ZodIssue[];
}

const PostJob = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    salary: "",
    jobType: "remote",
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
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

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
          const errorData: BackendErrorResponse = await response.json();

          if (errorData.errors) {
            const fieldErrors: { [key: string]: string } = {};
            errorData.errors.forEach((err) => {
              const fieldName = err.path[0] as string;
              fieldErrors[fieldName] = err.message;
            });
            setErrors(fieldErrors);
          } else {
            alert(`Error: ${errorData.message || "Something went wrong"}`);
          }
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
              value={formData.title}
              placeholder="e.g. Junior Backend Developer"
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg outline-none transition-all text-black ${
                errors.title
                  ? "border-red-500 ring-1 ring-red-500"
                  : "border-gray-200"
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1 font-semibold">
                {errors.title}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-50 mb-1">
                Company
              </label>
              <input
                name="company"
                value={formData.company}
                placeholder="Pulse AI"
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg outline-none transition-all text-black ${
                  errors.company
                    ? "border-red-500 ring-1 ring-red-500"
                    : "border-gray-200"
                }`}
              />
              {errors.company && (
                <p className="text-red-500 text-xs mt-1 font-semibold">
                  {errors.company}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-50 mb-1">
                Location
              </label>
              <input
                name="location"
                value={formData.location}
                placeholder="Remote"
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg outline-none transition-all text-black ${
                  errors.location
                    ? "border-red-500 ring-1 ring-red-500"
                    : "border-gray-200"
                }`}
              />
              {errors.location && (
                <p className="text-red-500 text-xs mt-1 font-semibold">
                  {errors.location}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-50 mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows={5}
              value={formData.description}
              placeholder="Describe the role..."
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg outline-none transition-all text-black ${
                errors.description
                  ? "border-red-500 ring-1 ring-red-500"
                  : "border-gray-200"
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1 font-semibold">
                {errors.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-50 mb-1">
                Salary (Annual $)
              </label>
              <input
                name="salary"
                type="number"
                value={formData.salary}
                placeholder="85000"
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg outline-none transition-all text-black ${
                  errors.salary
                    ? "border-red-500 ring-1 ring-red-500"
                    : "border-gray-200"
                }`}
              />
              {errors.salary && (
                <p className="text-red-500 text-xs mt-1 font-semibold">
                  {errors.salary}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-50 mb-1">
                Job Type
              </label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg outline-none transition-all text-black ${
                  errors.jobType
                    ? "border-red-500 ring-1 ring-red-500"
                    : "border-gray-200"
                }`}
              >
                <option value="remote">Remote</option>
                <option value="full-time">Full-time</option>
                <option value="contract">Contract</option>
                <option value="part-time">Part-time</option>
              </select>
              {errors.jobType && (
                <p className="text-red-500 text-xs mt-1 font-semibold">
                  {errors.jobType}
                </p>
              )}
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

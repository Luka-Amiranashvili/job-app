import { z } from "zod";

export const jobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description is too short"),
  salary: z.coerce.number().positive("Salary must be positive"),
  location: z.string().min(1, "Location is required"),
  jobType: z.enum(["full-time", "part-time", "remote", "contract"]),
});

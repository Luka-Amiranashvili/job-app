import mongoose, { Schema, Document } from "mongoose";

export enum UserType {
  JobSeeker = "job_seeker",
  Employer = "employer",
  Admin = "admin",
}

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: Object.values(UserType),
    default: UserType.JobSeeker,
  },
});

export const User = mongoose.model("User", userSchema);

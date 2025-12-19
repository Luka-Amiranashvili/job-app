import mongoose, { Schema, Document } from "mongoose";

export interface IJob extends Document {
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: number;
  jobType: "Full-time" | "Part-time" | "Remote" | "Contract";
  status: "open" | "closed";
  postedBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const JobSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a job title"],
      trim: true,
    },
    company: {
      type: String,
      required: [true, "Please add a company name"],
    },
    location: {
      type: String,
      required: [true, "Please add a location"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    salary: {
      type: Number,
    },
    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Remote", "Contract"],
      default: "Full-time",
    },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IJob>("Job", JobSchema);

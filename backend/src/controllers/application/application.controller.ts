import { Response, Request } from "express";
import Application from "../../models/Application";
import Job from "../../models/Job";

export const applyToJob = async (req: any, res: Response) => {
  try {
    const { jobId } = req.body;

    if (req.user.role !== "job_seeker") {
      return res
        .status(403)
        .json({ message: "Only job seekers can apply for jobs" });
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user.userId,
    });
    res.status(201).json({ message: "Applied successfully!", application });
  } catch (error: any) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "You have already applied for this job" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

export const myApplications = async (req: any, res: Response) => {
  try {
    const applications = await Application.find({ applicant: req.user.userId })
      .populate("job", "title company location")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching your applications",
    });
  }
};

export const getJobCandidates = async (req: any, res: Response) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    if (job.postedBy.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ mesage: "You can only view candidates for your jobs" });
    }
    const candidates = await Application.find({ job: jobId })
      .populate("applicant", "name email")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: candidates.length,
      candidates,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateApplicationStatus = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const application = await Application.findById(id);
    if (!application)
      return res.status(404).json({ message: "Application not found" });

    const job = await Job.findById(application.job);
    if (!job) return res.status(404).json({ message: "Job not found" });

    application.status = status;
    await application.save();

    if (status === "accepted") {
      job.status = "closed";
      await job.save();

      await Application.updateMany(
        { job: job._id, _id: { $ne: id } },
        { status: "rejected" }
      );

      return res.status(200).json({
        message:
          "Candidate accepted. Job is now closed and other applicants notified.",
      });
    }

    res.status(200).json({ success: true, status: application.status });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

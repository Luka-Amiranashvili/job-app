import { Response, Request } from "express";
import Job from "../../models/Job";

interface AuthRequest extends Request {
  user?: any;
}

export const createJob = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    const { title, company, location, description, salary, jobType } = req.body;

    const job = await Job.create({
      title,
      company,
      location,
      description,
      salary,
      jobType,
      postedBy: req.user.userId,
    });

    res.status(201).json({ message: "Job posted successfully", job });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const { title, company, location, jobType, postedBy, minSalary } =
      req.query;
    let query: any = { status: "open" };

    if (title) {
      query.title = { $regex: title, $options: "i" };
    }
    if (company) {
      query.company = { $regex: company, $options: "i" };
    }
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }
    if (jobType) {
      query.jobType = jobType;
    }
    if (postedBy) {
      query.postedBy = postedBy;
    }
    if (minSalary) {
      query.salary = { $gte: Number(minSalary) };
    }
    const jobs = await Job.find(query)
      .populate("postedBy", "name email")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while fetching jobs" });
  }
};

export const getJob = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id).populate("postedBy", "name email");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json(job);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Invalid Job ID" });
  }
};

export const deleteJob = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.postedBy.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "Access Denied. You can only delete your own job postings",
      });
    }

    await job.deleteOne();
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during deletion" });
  }
};

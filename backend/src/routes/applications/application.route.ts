import { Router } from "express";
import { protect } from "../../utils/protect";
import {
  applyToJob,
  getJobCandidates,
  getMyPostedJobs,
  myApplications,
  updateApplicationStatus,
} from "../../controllers/application/application.controller";

const router = Router();

router.post("/apply", protect(["job_seeker"]), applyToJob);
router.get("/my-applications", protect(["job_seeker"]), myApplications);
router.get(
  "/candidates/:jobId",
  protect(["employer", "admin"]),
  getJobCandidates
);
router.get("/my-posted-jobs", protect(["employer"]), getMyPostedJobs);
router.patch(
  "/status/:id",
  protect(["employer", "admin"]),
  updateApplicationStatus
);

export default router;

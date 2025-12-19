import { Router } from "express";
import {
  createJob,
  deleteJob,
  getAllJobs,
  getJob,
} from "../../controllers/job/job.controller";
import { protect } from "../../utils/protect";

const router = Router();

router.post("/createJob", protect(["employer", "admin"]), createJob);
router.get("/getJobs", getAllJobs);
router.get("/getJob/:id", getJob);
router.delete("/deleteJob/:id", protect(["employer", "admin"]), deleteJob);

export default router;

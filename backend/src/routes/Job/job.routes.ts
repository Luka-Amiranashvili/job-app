import { Router } from "express";
import {
  createJob,
  deleteJob,
  getAllJobs,
  getJob,
} from "../../controllers/job/createJob.controller";
import { protect } from "../../utils/protect";

const router = Router();

router.post("/createJob", protect(), createJob);
router.get("/getJobs", getAllJobs);
router.get("/getJob/:id", getJob);
router.get("/deleteJob/:id", protect(), deleteJob);

export default router;

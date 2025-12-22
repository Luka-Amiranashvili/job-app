import { Router } from "express";
import { register } from "../../controllers/auth/auth.controller";
import { login } from "../../controllers/auth/auth.controller";
import loginLimiter from "../../utils/rateLimit";

const router = Router();
router.post("/register", register);
router.post("/login", loginLimiter, login);

export default router;

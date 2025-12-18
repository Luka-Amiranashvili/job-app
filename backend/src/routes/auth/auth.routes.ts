import { Router } from "express";
import { register } from "../../controllers/auth/auth.controller";
import { login } from "../../controllers/auth/auth.controller";

const router = Router();
router.post("/register", register);
router.post("/login", login);

export default router;

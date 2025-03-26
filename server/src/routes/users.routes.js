import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/auth.js";
import { createUser, getUserProfile } from "../controllers/users.controller.js";

const router = Router();

router.post("/create-user", requireAuth, createUser);
router.get("/profile", requireAuth, getUserProfile);

router.get("/admin", requireAuth, requireRole("admin"), (req, res) => {
    res.status(200).json(new ApiResponse(200, null, "Welcome, Admin!"));
});

export default router;

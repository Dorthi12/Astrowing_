import express from "express";
import UserController from "../controllers/UserController.js";
import { authenticateToken } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = express.Router();

router.get(
  "/profile",
  authenticateToken,
  asyncHandler(UserController.getProfile),
);
router.put(
  "/profile",
  authenticateToken,
  asyncHandler(UserController.updateProfile),
);

export default router;

import express from "express";
import AuthController from "../controllers/AuthController.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = express.Router();

router.post("/register", asyncHandler(AuthController.register));
router.post("/login", asyncHandler(AuthController.login));
router.post("/refresh", asyncHandler(AuthController.refresh));
router.post("/logout", asyncHandler(AuthController.logout));

export default router;

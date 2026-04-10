import express from "express";
import ReviewController from "../controllers/ReviewController.js";
import { authenticateToken } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = express.Router();

router.post(
  "/:planetId",
  authenticateToken,
  asyncHandler(ReviewController.createReview),
);
router.get(
  "/",
  authenticateToken,
  asyncHandler(ReviewController.getUserReviews),
);
router.delete(
  "/:reviewId",
  authenticateToken,
  asyncHandler(ReviewController.deleteReview),
);

export default router;

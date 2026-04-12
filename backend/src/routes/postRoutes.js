import express from "express";
import PostController from "../controllers/PostController.js";
import { authenticateToken } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { upload, uploadImageHandler } from "../utils/uploadHandler.js";

const router = express.Router();

// Public routes
router.get("/", asyncHandler(PostController.getAllPosts));
router.get("/:postId", asyncHandler(PostController.getPostById));

// Image upload route (protected)
router.post(
  "/upload/image",
  authenticateToken,
  upload.single("image"),
  asyncHandler(uploadImageHandler),
);

// Protected routes
router.post("/", authenticateToken, asyncHandler(PostController.createPost));
router.delete(
  "/:postId",
  authenticateToken,
  asyncHandler(PostController.deletePost),
);
router.post(
  "/:postId/like",
  authenticateToken,
  asyncHandler(PostController.likePost),
);
router.post(
  "/:postId/comments",
  authenticateToken,
  asyncHandler(PostController.addComment),
);
router.delete(
  "/comments/:commentId",
  authenticateToken,
  asyncHandler(PostController.deleteComment),
);

export default router;

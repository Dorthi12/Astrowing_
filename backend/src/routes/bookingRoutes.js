import express from "express";
import BookingController from "../controllers/BookingController.js";
import { authenticateToken } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = express.Router();

router.post(
  "/",
  authenticateToken,
  asyncHandler(BookingController.createBooking),
);
router.get(
  "/",
  authenticateToken,
  asyncHandler(BookingController.getUserBookings),
);
router.get(
  "/:bookingId",
  authenticateToken,
  asyncHandler(BookingController.getBooking),
);
router.delete(
  "/:bookingId",
  authenticateToken,
  asyncHandler(BookingController.cancelBooking),
);

export default router;

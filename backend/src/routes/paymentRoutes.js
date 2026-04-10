import express from "express";
import PaymentController from "../controllers/PaymentController.js";
import { authenticateToken } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = express.Router();

router.post(
  "/",
  authenticateToken,
  asyncHandler(PaymentController.processPayment),
);
router.get(
  "/:paymentId",
  authenticateToken,
  asyncHandler(PaymentController.getPaymentStatus),
);
router.post(
  "/:paymentId/refund",
  authenticateToken,
  asyncHandler(PaymentController.refundPayment),
);

export default router;

import stripeImport from "stripe";
import Payment from "../models/Payment.js";
import Booking from "../models/Booking.js";
import {
  PAYMENT_STATUS,
  BOOKING_STATUS,
  HTTP_STATUS,
  ERRORS,
} from "../config/constants.js";

const stripe = stripeImport(process.env.STRIPE_SECRET_KEY);

const PaymentService = {
  processPayment: async (bookingId, amount, stripeTokenId) => {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      const error = new Error(ERRORS.NOT_FOUND);
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      error.code = "BOOKING_NOT_FOUND";
      throw error;
    }

    if (booking.total_price !== amount) {
      const error = new Error("Payment amount mismatch");
      error.statusCode = HTTP_STATUS.BAD_REQUEST;
      error.code = "AMOUNT_MISMATCH";
      throw error;
    }

    try {
      const charge = await stripe.charges.create({
        amount: Math.round(amount * 100),
        currency: "usd",
        source: stripeTokenId,
        description: `Booking ${bookingId} - Cybertron Webforge`,
      });

      const payment = await Payment.create(
        bookingId,
        amount,
        "stripe",
        charge.id,
      );

      await Payment.updateStatus(payment.id, PAYMENT_STATUS.COMPLETED);
      await Booking.updateStatus(bookingId, BOOKING_STATUS.CONFIRMED);

      return payment;
    } catch (error) {
      const payment = await Payment.create(
        bookingId,
        amount,
        "stripe",
        "failed",
      );
      await Payment.updateStatus(payment.id, PAYMENT_STATUS.FAILED);

      const err = new Error("Payment processing failed");
      err.statusCode = HTTP_STATUS.BAD_REQUEST;
      err.code = "PAYMENT_FAILED";
      throw err;
    }
  },

  getPaymentStatus: async (paymentId) => {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      const error = new Error(ERRORS.NOT_FOUND);
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      error.code = "PAYMENT_NOT_FOUND";
      throw error;
    }
    return payment;
  },

  refundPayment: async (paymentId) => {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      const error = new Error(ERRORS.NOT_FOUND);
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      error.code = "PAYMENT_NOT_FOUND";
      throw error;
    }

    try {
      await stripe.refunds.create({
        charge: payment.stripe_payment_id,
      });

      const refundedPayment = await Payment.updateStatus(
        paymentId,
        PAYMENT_STATUS.REFUNDED,
      );
      await Booking.updateStatus(payment.booking_id, BOOKING_STATUS.CANCELLED);

      return refundedPayment;
    } catch (error) {
      const err = new Error("Refund processing failed");
      err.statusCode = HTTP_STATUS.BAD_REQUEST;
      err.code = "REFUND_FAILED";
      throw err;
    }
  },
};

export default PaymentService;

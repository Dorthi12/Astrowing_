import PaymentService from "../services/PaymentService.js";
import { validate, schemas } from "../utils/validators.js";
import { HTTP_STATUS } from "../config/constants.js";

const PaymentController = {
  processPayment: async (req, res, next) => {
    try {
      const { bookingId, stripeTokenId } = validate(
        schemas.paymentProcess,
        req.body,
      );

      const payment = await PaymentService.processPayment(
        bookingId,
        req.body.amount,
        stripeTokenId,
      );

      res.status(HTTP_STATUS.CREATED).json({
        payment: {
          id: payment.id,
          bookingId: payment.booking_id,
          amount: payment.amount,
          status: payment.status,
          createdAt: payment.created_at,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  getPaymentStatus: async (req, res, next) => {
    try {
      const payment = await PaymentService.getPaymentStatus(
        req.params.paymentId,
      );

      res.json({
        payment: {
          id: payment.id,
          bookingId: payment.booking_id,
          amount: payment.amount,
          status: payment.status,
          createdAt: payment.created_at,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  refundPayment: async (req, res, next) => {
    try {
      const payment = await PaymentService.refundPayment(req.params.paymentId);

      res.json({
        payment: {
          id: payment.id,
          bookingId: payment.booking_id,
          amount: payment.amount,
          status: payment.status,
          createdAt: payment.created_at,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};

export default PaymentController;

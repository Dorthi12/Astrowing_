import prisma from "../config/prisma.js";
import { PAYMENT_STATUS } from "../config/constants.js";

const Payment = {
  create: async (bookingId, amount, method, stripePaymentId) => {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { userId: true },
    });

    return prisma.payment.create({
      data: {
        bookingId,
        userId: booking.userId,
        amount,
        method,
        stripePaymentId,
        status: PAYMENT_STATUS.PENDING,
      },
      select: {
        id: true,
        bookingId: true,
        amount: true,
        method: true,
        status: true,
        createdAt: true,
      },
    });
  },

  findById: async (paymentId) => {
    return prisma.payment.findUnique({ where: { id: paymentId } });
  },

  findByBooking: async (bookingId) => {
    return prisma.payment.findMany({
      where: { bookingId },
      orderBy: { createdAt: "desc" },
    });
  },

  updateStatus: async (paymentId, status) => {
    return prisma.payment.update({
      where: { id: paymentId },
      data: { status },
    });
  },

  getByStripeId: async (stripePaymentId) => {
    return prisma.payment.findUnique({
      where: { stripePaymentId },
    });
  },
};

export default Payment;

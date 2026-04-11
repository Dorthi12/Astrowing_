import prisma from "../config/database.js";
import { BOOKING_STATUS } from "../config/constants.js";

const Booking = {
  create: async (userId, flightId, passengers, totalPrice) => {
    return prisma.booking.create({
      data: {
        userId,
        flightId,
        passengers,
        totalPrice,
        status: BOOKING_STATUS.PENDING,
      },
      select: {
        id: true,
        userId: true,
        flightId: true,
        passengers: true,
        totalPrice: true,
        status: true,
        createdAt: true,
      },
    });
  },

  findById: async (bookingId) => {
    return prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        userId: true,
        flightId: true,
        passengers: true,
        totalPrice: true,
        status: true,
        createdAt: true,
      },
    });
  },

  findByUser: async (userId, limit = 50, offset = 0) => {
    return prisma.booking.findMany({
      where: { userId },
      take: limit,
      skip: offset,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        userId: true,
        flightId: true,
        passengers: true,
        totalPrice: true,
        status: true,
        createdAt: true,
      },
    });
  },

  updateStatus: async (bookingId, status) => {
    return prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    });
  },

  countByUser: async (userId) => {
    return prisma.booking.count({ where: { userId } });
  },
};

export default Booking;

import prisma from "../config/database.js";
import { SEAT_STATUS } from "../config/constants.js";

const Seat = {
  createBatch: async (bookingId, seatNumbers) => {
    return prisma.bookingSeat.createMany({
      data: seatNumbers.map((seatNumber) => ({
        bookingId,
        seatNumber,
        status: SEAT_STATUS.BOOKED,
      })),
    });
  },

  findByBooking: async (bookingId) => {
    return prisma.bookingSeat.findMany({
      where: { bookingId },
      orderBy: { seatNumber: "asc" },
      select: {
        id: true,
        bookingId: true,
        seatNumber: true,
        status: true,
      },
    });
  },

  updateStatus: async (seatId, status) => {
    return prisma.bookingSeat.update({
      where: { id: seatId },
      data: { status },
    });
  },

  findByFlightOccupied: async (flightId) => {
    const occupiedSeats = await prisma.bookingSeat.findMany({
      where: {
        booking: {
          flightId,
        },
        status: SEAT_STATUS.BOOKED,
      },
      select: { seatNumber: true },
      distinct: ["seatNumber"],
    });
    return occupiedSeats.map((seat) => seat.seatNumber);
  },
};

export default Seat;

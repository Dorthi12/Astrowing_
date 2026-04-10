import prisma from "../config/prisma.js";

const Flight = {
  findById: async (flightId) => {
    return prisma.flight.findUnique({
      where: { id: flightId },
      select: {
        id: true,
        fromPlanetId: true,
        toPlanetId: true,
        departureTime: true,
        arrivalTime: true,
        totalSeats: true,
        availableSeats: true,
        basePrice: true,
        createdAt: true,
      },
    });
  },

  search: async (
    fromPlanetId,
    toPlanetId,
    departureDate,
    limit = 50,
    offset = 0,
  ) => {
    const dateStart = new Date(departureDate);
    dateStart.setHours(0, 0, 0, 0);
    const dateEnd = new Date(departureDate);
    dateEnd.setHours(23, 59, 59, 999);

    return prisma.flight.findMany({
      where: {
        fromPlanetId,
        toPlanetId,
        departureTime: {
          gte: dateStart,
          lte: dateEnd,
        },
        availableSeats: { gt: 0 },
      },
      take: limit,
      skip: offset,
      orderBy: { departureTime: "asc" },
      select: {
        id: true,
        fromPlanetId: true,
        toPlanetId: true,
        departureTime: true,
        arrivalTime: true,
        totalSeats: true,
        availableSeats: true,
        basePrice: true,
        createdAt: true,
      },
    });
  },

  updateAvailableSeats: async (flightId, decrease) => {
    return prisma.flight.update({
      where: { id: flightId },
      data: { availableSeats: { decrement: decrease } },
      select: { availableSeats: true },
    });
  },

  getAll: async (limit = 50, offset = 0) => {
    return prisma.flight.findMany({
      take: limit,
      skip: offset,
      orderBy: { departureTime: "desc" },
      select: {
        id: true,
        fromPlanetId: true,
        toPlanetId: true,
        departureTime: true,
        arrivalTime: true,
        totalSeats: true,
        availableSeats: true,
        basePrice: true,
      },
    });
  },
};

export default Flight;

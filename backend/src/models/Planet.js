import prisma from "../config/database.js";

const Planet = {
  findAll: async (limit = 50, offset = 0) => {
    return prisma.planet.findMany({
      take: limit,
      skip: offset,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        description: true,
        imageUrl: true,
        basePrice: true,
        features: true,
        averageRating: true,
        totalReviews: true,
      },
    });
  },

  findById: async (planetId) => {
    return prisma.planet.findUnique({
      where: { id: planetId },
      select: {
        id: true,
        name: true,
        description: true,
        imageUrl: true,
        basePrice: true,
        features: true,
        averageRating: true,
        totalReviews: true,
      },
    });
  },

  search: async (searchTerm, limit = 50, offset = 0) => {
    return prisma.planet.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: "insensitive" } },
          { description: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
      take: limit,
      skip: offset,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        description: true,
        imageUrl: true,
        basePrice: true,
        features: true,
        averageRating: true,
        totalReviews: true,
      },
    });
  },

  countAll: async () => {
    return prisma.planet.count();
  },

  updateRating: async (planetId, averageRating, totalReviews) => {
    return prisma.planet.update({
      where: { id: planetId },
      data: { averageRating, totalReviews },
    });
  },
};

export default Planet;

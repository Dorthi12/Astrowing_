import prisma from "../config/prisma.js";

const Review = {
  create: async (userId, planetId, rating, title, content) => {
    return prisma.review.create({
      data: {
        userId,
        planetId,
        rating,
        title,
        content,
      },
      select: {
        id: true,
        userId: true,
        planetId: true,
        rating: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });
  },

  findByPlanet: async (planetId, limit = 50, offset = 0) => {
    return prisma.review.findMany({
      where: { planetId },
      take: limit,
      skip: offset,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { firstName: true, lastName: true },
        },
      },
      select: {
        id: true,
        userId: true,
        planetId: true,
        rating: true,
        title: true,
        content: true,
        createdAt: true,
        user: { select: { firstName: true, lastName: true } },
      },
    });
  },

  findByUser: async (userId, limit = 50, offset = 0) => {
    return prisma.review.findMany({
      where: { userId },
      take: limit,
      skip: offset,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        userId: true,
        planetId: true,
        rating: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });
  },

  countByPlanet: async (planetId) => {
    return prisma.review.count({ where: { planetId } });
  },

  getAverageRating: async (planetId) => {
    const result = await prisma.review.aggregate({
      where: { planetId },
      _avg: { rating: true },
    });
    return result._avg.rating || 0;
  },

  findById: async (reviewId) => {
    return prisma.review.findUnique({ where: { id: reviewId } });
  },

  delete: async (reviewId) => {
    return prisma.review.delete({ where: { id: reviewId } });
  },
};

export default Review;

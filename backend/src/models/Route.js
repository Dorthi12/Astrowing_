import prisma from "../config/database.js";

const Route = {
  findAll: async () => {
    return prisma.route.findMany({
      include: {
        sourcePlanet: {
          select: {
            id: true,
            externalId: true,
            name: true,
          },
        },
        destPlanet: {
          select: {
            id: true,
            externalId: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });
  },

  findByPlanetId: async (planetId) => {
    return prisma.route.findMany({
      where: {
        OR: [{ sourcePlanetId: planetId }, { destPlanetId: planetId }],
      },
      include: {
        sourcePlanet: true,
        destPlanet: true,
      },
    });
  },

  findBetweenPlanets: async (sourcePlanetId, destPlanetId) => {
    return prisma.route.findUnique({
      where: {
        sourcePlanetId_destPlanetId: {
          sourcePlanetId,
          destPlanetId,
        },
      },
      include: {
        sourcePlanet: true,
        destPlanet: true,
      },
    });
  },

  count: async () => {
    return prisma.route.count();
  },
};

export default Route;

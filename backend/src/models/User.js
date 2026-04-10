import prisma from "../config/prisma.js";

const User = {
  findByEmail: async (email) => {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  findById: async (userId) => {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        createdAt: true,
      },
    });
  },

  create: async (email, passwordHash, firstName, lastName) => {
    return prisma.user.create({
      data: {
        email,
        password: passwordHash,
        firstName,
        lastName,
      },
    });
  },

  updateRefreshToken: async (userId, refreshToken) => {
    return prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  },

  getRefreshToken: async (userId) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { refreshToken: true },
    });
    return user?.refreshToken;
  },

  update: async (userId, firstName, lastName, phone) => {
    return prisma.user.update({
      where: { id: userId },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(phone && { phone }),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
      },
    });
  },

  getPassword: async (userId) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });
    return user?.password;
  },
};

export default User;

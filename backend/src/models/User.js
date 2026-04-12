import prisma from "../config/database.js";

const User = {
  findByEmail: async (email) => {
    console.log("[User] 🔍 Finding user by email:", email);
    const result = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true,
        refreshToken: true,
      },
    });
    console.log("[User] Result:", result ? "User found" : "User NOT found");
    return result;
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
    console.log("[User] 💾 Creating user:", { email, firstName, lastName });
    try {
      const result = await prisma.user.create({
        data: {
          email,
          password: passwordHash,
          firstName,
          lastName,
        },
      });
      console.log("[User] ✅ User created successfully:", {
        id: result.id,
        email: result.email,
      });
      return result;
    } catch (error) {
      console.error("[User] ❌ Error creating user:", error.message);
      throw error;
    }
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

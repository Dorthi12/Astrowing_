import bcrypt from "bcryptjs";
import User from "../models/User.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/tokenHelper.js";
import { HTTP_STATUS, ERRORS } from "../config/constants.js";

const AuthService = {
  register: async (email, password, firstName, lastName) => {
    console.log("[AuthService] 1️⃣ Starting register for:", email);
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      console.log("[AuthService] Email already exists:", email);
      const error = new Error(ERRORS.CONFLICT);
      error.statusCode = HTTP_STATUS.CONFLICT;
      error.code = "EMAIL_EXISTS";
      throw error;
    }

    console.log("[AuthService] 2️⃣ Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("[AuthService] 3️⃣ Password hashed, creating user...");

    const user = await User.create(email, hashedPassword, firstName, lastName);
    console.log("[AuthService] 4️⃣ User created:", {
      id: user.id,
      email: user.email,
    });

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await User.updateRefreshToken(user.id, refreshToken);
    console.log("[AuthService] 5️⃣ Tokens generated and saved");

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  },

  login: async (email, password) => {
    console.log("[AuthService] 1️⃣ Starting login for:", email);
    const user = await User.findByEmail(email);
    if (!user) {
      console.log("[AuthService] ❌ User not found for email:", email);
      const error = new Error(ERRORS.INVALID_CREDENTIALS);
      error.statusCode = HTTP_STATUS.UNAUTHORIZED;
      error.code = "INVALID_CREDENTIALS";
      throw error;
    }
    console.log("[AuthService] 2️⃣ User found:", {
      id: user.id,
      email: user.email,
    });

    console.log("[AuthService] 3️⃣ Comparing passwords...");
    console.log("[AuthService] Password from form:", password);
    console.log(
      "[AuthService] Password hash from DB:",
      user.password?.substring(0, 20) + "...",
    );

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(
      "[AuthService] 4️⃣ Password comparison result:",
      isPasswordValid,
    );

    if (!isPasswordValid) {
      console.log("[AuthService] ❌ Password invalid for user:", email);
      const error = new Error(ERRORS.INVALID_CREDENTIALS);
      error.statusCode = HTTP_STATUS.UNAUTHORIZED;
      error.code = "INVALID_CREDENTIALS";
      throw error;
    }
    console.log("[AuthService] 5️⃣ Password valid, generating tokens...");

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await User.updateRefreshToken(user.id, refreshToken);
    console.log("[AuthService] 6️⃣ Tokens generated and saved");

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  },

  refreshAccessToken: async (userId, oldRefreshToken) => {
    const storedRefreshToken = await User.getRefreshToken(userId);
    if (storedRefreshToken !== oldRefreshToken) {
      const error = new Error(ERRORS.UNAUTHORIZED);
      error.statusCode = HTTP_STATUS.UNAUTHORIZED;
      error.code = "INVALID_REFRESH_TOKEN";
      throw error;
    }

    const accessToken = generateAccessToken(userId);
    return { accessToken };
  },
};

export default AuthService;

import bcrypt from "bcryptjs";
import User from "../models/User.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/tokenHelper.js";
import { HTTP_STATUS, ERRORS } from "../config/constants.js";

const AuthService = {
  register: async (email, password, firstName, lastName) => {
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      const error = new Error(ERRORS.CONFLICT);
      error.statusCode = HTTP_STATUS.CONFLICT;
      error.code = "EMAIL_EXISTS";
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create(email, hashedPassword, firstName, lastName);

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await User.updateRefreshToken(user.id, refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  },

  login: async (email, password) => {
    const user = await User.findByEmail(email);
    if (!user) {
      const error = new Error(ERRORS.INVALID_CREDENTIALS);
      error.statusCode = HTTP_STATUS.UNAUTHORIZED;
      error.code = "INVALID_CREDENTIALS";
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error(ERRORS.INVALID_CREDENTIALS);
      error.statusCode = HTTP_STATUS.UNAUTHORIZED;
      error.code = "INVALID_CREDENTIALS";
      throw error;
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await User.updateRefreshToken(user.id, refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
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

import { validate, schemas } from "../utils/validators.js";
import AuthService from "../services/AuthService.js";
import { HTTP_STATUS } from "../config/constants.js";

const AuthController = {
  register: async (req, res, next) => {
    try {
      const { email, password, firstName, lastName } = validate(
        schemas.userRegister,
        req.body,
      );
      const result = await AuthService.register(
        email,
        password,
        firstName,
        lastName,
      );

      res.status(HTTP_STATUS.CREATED).json(result);
    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = validate(schemas.userLogin, req.body);
      const result = await AuthService.login(email, password);

      res.cookie("refreshToken", result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({
        user: result.user,
        tokens: { accessToken: result.tokens.accessToken },
      });
    } catch (error) {
      next(error);
    }
  },

  refresh: async (req, res, next) => {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        const error = new Error("No refresh token provided");
        error.statusCode = HTTP_STATUS.UNAUTHORIZED;
        error.code = "NO_REFRESH_TOKEN";
        throw error;
      }

      const result = await AuthService.refreshAccessToken(
        req.userId,
        refreshToken,
      );
      res.json({ tokens: { accessToken: result.accessToken } });
    } catch (error) {
      next(error);
    }
  },

  logout: async (req, res) => {
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  },
};

export default AuthController;

import { verifyAccessToken } from "../utils/tokenHelper.js";
import { HTTP_STATUS, ERRORS } from "../config/constants.js";

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      error: ERRORS.UNAUTHORIZED,
      code: "NO_TOKEN",
    });
  }

  try {
    const decoded = verifyAccessToken(token);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        error: ERRORS.TOKEN_EXPIRED,
        code: "TOKEN_EXPIRED",
      });
    }
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      error: ERRORS.INVALID_TOKEN,
      code: "INVALID_TOKEN",
    });
  }
};

const optionalAuth = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (token) {
    try {
      const decoded = verifyAccessToken(token);
      req.userId = decoded.userId;
    } catch (error) {
      req.userId = null;
    }
  }

  next();
};

export { authenticateToken, optionalAuth };

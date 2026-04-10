import { HTTP_STATUS, ERRORS } from "../config/constants.js";

const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  if (err.errors && Array.isArray(err.errors)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: ERRORS.VALIDATION_ERROR,
      details: err.errors,
    });
  }

  if (err.statusCode) {
    return res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
    });
  }

  if (err.code === "UNIQUE_VIOLATION") {
    return res.status(HTTP_STATUS.CONFLICT).json({
      error: ERRORS.CONFLICT,
      field: err.detail,
    });
  }

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    error: ERRORS.INTERNAL_ERROR,
  });
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export { errorHandler, asyncHandler };

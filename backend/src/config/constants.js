export default {
  USER_ROLES: {
    TRAVELER: "traveler",
    ADMIN: "admin",
  },
  BOOKING_STATUS: {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    CANCELLED: "cancelled",
    COMPLETED: "completed",
  },
  PAYMENT_STATUS: {
    PENDING: "pending",
    COMPLETED: "completed",
    FAILED: "failed",
    REFUNDED: "refunded",
  },
  SEAT_STATUS: {
    AVAILABLE: "available",
    SELECTED: "selected",
    BOOKED: "booked",
  },
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
  },
  ERRORS: {
    INVALID_CREDENTIALS: "Invalid email or password",
    TOKEN_EXPIRED: "Token has expired",
    INVALID_TOKEN: "Invalid token",
    UNAUTHORIZED: "Unauthorized access",
    NOT_FOUND: "Resource not found",
    CONFLICT: "Resource already exists",
    VALIDATION_ERROR: "Validation error",
    INTERNAL_ERROR: "Internal server error",
  },
};

import User from "../models/User.js";
import { validate, schemas } from "../utils/validators.js";
import { HTTP_STATUS, ERRORS } from "../config/constants.js";

const UserController = {
  getProfile: async (req, res, next) => {
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        const error = new Error(ERRORS.NOT_FOUND);
        error.statusCode = HTTP_STATUS.NOT_FOUND;
        error.code = "USER_NOT_FOUND";
        throw error;
      }

      res.json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          phone: user.phone,
          createdAt: user.created_at,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  updateProfile: async (req, res, next) => {
    try {
      const updateData = validate(schemas.userUpdate, req.body);

      const user = await User.update(
        req.userId,
        updateData.firstName,
        updateData.lastName,
        updateData.phone,
      );

      res.json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          phone: user.phone,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};

export default UserController;

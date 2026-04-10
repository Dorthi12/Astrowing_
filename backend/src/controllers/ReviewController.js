import Review from "../models/Review.js";
import Planet from "../models/Planet.js";
import { validate, schemas } from "../utils/validators.js";
import { HTTP_STATUS, ERRORS } from "../config/constants.js";

const ReviewController = {
  createReview: async (req, res, next) => {
    try {
      const { rating, title, content } = validate(
        schemas.reviewCreate,
        req.body,
      );
      const planetId = req.params.planetId;

      const planet = await Planet.findById(planetId);
      if (!planet) {
        const error = new Error(ERRORS.NOT_FOUND);
        error.statusCode = HTTP_STATUS.NOT_FOUND;
        error.code = "PLANET_NOT_FOUND";
        throw error;
      }

      const review = await Review.create(
        req.userId,
        planetId,
        rating,
        title,
        content,
      );

      const avgRating = await Review.getAverageRating(planetId);
      const totalReviews = await Review.countByPlanet(planetId);
      await Planet.updateRating(planetId, avgRating, totalReviews);

      res.status(HTTP_STATUS.CREATED).json({
        review: {
          id: review.id,
          planetId: review.planet_id,
          rating: review.rating,
          title: review.title,
          content: review.content,
          createdAt: review.created_at,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  getUserReviews: async (req, res, next) => {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;

      const reviews = await Review.findByUser(req.userId, limit, offset);

      res.json({ reviews });
    } catch (error) {
      next(error);
    }
  },

  deleteReview: async (req, res, next) => {
    try {
      const review = await Review.findById(req.params.reviewId);
      if (!review) {
        const error = new Error(ERRORS.NOT_FOUND);
        error.statusCode = HTTP_STATUS.NOT_FOUND;
        error.code = "REVIEW_NOT_FOUND";
        throw error;
      }

      if (review.user_id !== req.userId) {
        const error = new Error("Unauthorized to delete this review");
        error.statusCode = HTTP_STATUS.FORBIDDEN;
        error.code = "FORBIDDEN";
        throw error;
      }

      await Review.delete(req.params.reviewId);

      const avgRating = await Review.getAverageRating(review.planet_id);
      const totalReviews = await Review.countByPlanet(review.planet_id);
      await Planet.updateRating(review.planet_id, avgRating, totalReviews);

      res.json({ message: "Review deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
};

export default ReviewController;

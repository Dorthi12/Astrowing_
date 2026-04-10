import Planet from "../models/Planet.js";
import Review from "../models/Review.js";
import { HTTP_STATUS, ERRORS } from "../config/constants.js";

const PlanetController = {
  getAllPlanets: async (req, res, next) => {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;

      const planets = await Planet.findAll(limit, offset);
      const total = await Planet.countAll();

      res.json({
        planets,
        pagination: { limit, offset, total },
      });
    } catch (error) {
      next(error);
    }
  },

  getPlanetById: async (req, res, next) => {
    try {
      const planet = await Planet.findById(req.params.planetId);
      if (!planet) {
        const error = new Error(ERRORS.NOT_FOUND);
        error.statusCode = HTTP_STATUS.NOT_FOUND;
        error.code = "PLANET_NOT_FOUND";
        throw error;
      }

      res.json({ planet });
    } catch (error) {
      next(error);
    }
  },

  searchPlanets: async (req, res, next) => {
    try {
      const { q } = req.query;
      if (!q) {
        const error = new Error("Search query required");
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        error.code = "MISSING_QUERY";
        throw error;
      }

      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;

      const planets = await Planet.search(q, limit, offset);

      res.json({ planets, query: q });
    } catch (error) {
      next(error);
    }
  },

  getPlanetReviews: async (req, res, next) => {
    try {
      const planet = await Planet.findById(req.params.planetId);
      if (!planet) {
        const error = new Error(ERRORS.NOT_FOUND);
        error.statusCode = HTTP_STATUS.NOT_FOUND;
        error.code = "PLANET_NOT_FOUND";
        throw error;
      }

      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;

      const reviews = await Review.findByPlanet(
        req.params.planetId,
        limit,
        offset,
      );
      const total = await Review.countByPlanet(req.params.planetId);

      res.json({
        reviews,
        pagination: { limit, offset, total },
      });
    } catch (error) {
      next(error);
    }
  },
};

export default PlanetController;

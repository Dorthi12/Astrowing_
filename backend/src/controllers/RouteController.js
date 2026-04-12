import Route from "../models/Route.js";
import { HTTP_STATUS, ERRORS } from "../config/constants.js";

const RouteController = {
  getAllRoutes: async (req, res, next) => {
    try {
      const routes = await Route.findAll();
      res.json({
        success: true,
        routes,
        total: routes.length,
      });
    } catch (error) {
      next(error);
    }
  },

  getRoutesByPlanet: async (req, res, next) => {
    try {
      const { planetId } = req.params;
      const routes = await Route.findByPlanetId(parseInt(planetId));

      if (!routes || routes.length === 0) {
        return res.json({
          success: true,
          routes: [],
          message: "No routes found for this planet",
        });
      }

      res.json({
        success: true,
        routes,
        total: routes.length,
      });
    } catch (error) {
      next(error);
    }
  },

  getRouteBetweenPlanets: async (req, res, next) => {
    try {
      const { sourceId, destId } = req.params;
      const route = await Route.findBetweenPlanets(
        parseInt(sourceId),
        parseInt(destId),
      );

      if (!route) {
        const error = new Error("Route not found");
        error.statusCode = HTTP_STATUS.NOT_FOUND;
        error.code = "ROUTE_NOT_FOUND";
        throw error;
      }

      res.json({
        success: true,
        route,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default RouteController;

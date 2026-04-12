import express from "express";
import RouteController from "../controllers/RouteController.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = express.Router();

// GET /api/routes - Get all routes
router.get("/", asyncHandler(RouteController.getAllRoutes));

// GET /api/routes/planet/:planetId - Get routes for a specific planet
router.get(
  "/planet/:planetId",
  asyncHandler(RouteController.getRoutesByPlanet),
);

// GET /api/routes/:sourceId/:destId - Get specific route between two planets
router.get(
  "/:sourceId/:destId",
  asyncHandler(RouteController.getRouteBetweenPlanets),
);

export default router;

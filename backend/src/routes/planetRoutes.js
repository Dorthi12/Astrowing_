import express from "express";
import PlanetController from "../controllers/PlanetController.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = express.Router();

router.get("/", asyncHandler(PlanetController.getAllPlanets));
router.get("/search", asyncHandler(PlanetController.searchPlanets));
router.get("/:planetId", asyncHandler(PlanetController.getPlanetById));
router.get(
  "/:planetId/reviews",
  asyncHandler(PlanetController.getPlanetReviews),
);

export default router;

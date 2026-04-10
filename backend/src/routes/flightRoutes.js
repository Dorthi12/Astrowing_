import express from "express";
import FlightController from "../controllers/FlightController.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = express.Router();

router.get("/", asyncHandler(FlightController.getAllFlights));
router.get("/search", asyncHandler(FlightController.searchFlights));
router.get("/:flightId", asyncHandler(FlightController.getFlightById));

export default router;

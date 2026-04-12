import express from "express";
import { seedPlanets } from "../controllers/SeedController.js";

const router = express.Router();

// POST /api/seed/planets - Admin endpoint to seed planets and routes
router.post("/planets", seedPlanets);

export default router;

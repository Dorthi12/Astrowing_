import Flight from "../models/Flight.js";
import BookingService from "../services/BookingService.js";
import { validate, schemas } from "../utils/validators.js";
import { HTTP_STATUS, ERRORS } from "../config/constants.js";

const FlightController = {
  getAllFlights: async (req, res, next) => {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;

      const flights = await Flight.getAll(limit, offset);
      res.json({ flights });
    } catch (error) {
      next(error);
    }
  },

  getFlightById: async (req, res, next) => {
    try {
      const flight = await Flight.findById(req.params.flightId);
      if (!flight) {
        const error = new Error(ERRORS.NOT_FOUND);
        error.statusCode = HTTP_STATUS.NOT_FOUND;
        error.code = "FLIGHT_NOT_FOUND";
        throw error;
      }

      const occupiedSeats = await BookingService.getFlightOccupiedSeats(
        flight.id,
      );

      res.json({
        flight,
        occupiedSeats,
      });
    } catch (error) {
      next(error);
    }
  },

  searchFlights: async (req, res, next) => {
    try {
      const { fromPlanet, toPlanet, departureDate, passengers } = validate(
        schemas.flightSearch,
        req.query,
      );

      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;

      const flights = await Flight.search(
        fromPlanet,
        toPlanet,
        departureDate,
        limit,
        offset,
      );

      res.json({
        flights: flights.map((flight) => ({
          ...flight,
          passengers: passengers || 1,
        })),
      });
    } catch (error) {
      next(error);
    }
  },
};

export default FlightController;

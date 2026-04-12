import Flight from "../models/Flight.js";
import Booking from "../models/Booking.js";
import Seat from "../models/Seat.js";
import { BOOKING_STATUS, HTTP_STATUS, ERRORS } from "../config/constants.js";

const BookingService = {
  createBooking: async (userId, flightId, passengers, selectedSeats) => {
    const flight = await Flight.findById(flightId);
    if (!flight) {
      const error = new Error(ERRORS.NOT_FOUND);
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      error.code = "FLIGHT_NOT_FOUND";
      throw error;
    }

    if (flight.availableSeats < passengers) {
      const error = new Error("Not enough available seats");
      error.statusCode = HTTP_STATUS.BAD_REQUEST;
      error.code = "INSUFFICIENT_SEATS";
      throw error;
    }

    const totalPrice = parseFloat(flight.basePrice) * passengers;

    const booking = await Booking.create(
      userId,
      flightId,
      passengers,
      totalPrice,
    );

    if (selectedSeats && selectedSeats.length > 0) {
      await Seat.createBatch(booking.id, selectedSeats);
    }

    await Flight.updateAvailableSeats(flightId, passengers);

    return booking;
  },

  getBooking: async (userId, bookingId) => {
    const booking = await Booking.findById(bookingId);
    if (!booking || booking.userId !== userId) {
      const error = new Error(ERRORS.NOT_FOUND);
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      error.code = "BOOKING_NOT_FOUND";
      throw error;
    }
    return booking;
  },

  getUserBookings: async (userId, limit = 50, offset = 0) => {
    return Booking.findByUser(userId, limit, offset);
  },

  updateBookingStatus: async (bookingId, status) => {
    const validStatuses = Object.values(BOOKING_STATUS);
    if (!validStatuses.includes(status)) {
      const error = new Error("Invalid booking status");
      error.statusCode = HTTP_STATUS.BAD_REQUEST;
      error.code = "INVALID_STATUS";
      throw error;
    }

    return Booking.updateStatus(bookingId, status);
  },

  getBookingSeats: async (bookingId) => {
    return Seat.findByBooking(bookingId);
  },

  getFlightOccupiedSeats: async (flightId) => {
    return Seat.findByFlightOccupied(flightId);
  },
};

export default BookingService;

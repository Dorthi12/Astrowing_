import BookingService from "../services/BookingService.js";
import { validate, schemas } from "../utils/validators.js";
import { HTTP_STATUS } from "../config/constants.js";

const BookingController = {
  createBooking: async (req, res, next) => {
    try {
      const { flightId, passengers, seatSelectedIndices } = validate(
        schemas.bookingCreate,
        req.body,
      );

      const booking = await BookingService.createBooking(
        req.userId,
        flightId,
        passengers,
        seatSelectedIndices,
      );

      res.status(HTTP_STATUS.CREATED).json({ booking });
    } catch (error) {
      next(error);
    }
  },

  getBooking: async (req, res, next) => {
    try {
      const booking = await BookingService.getBooking(
        req.userId,
        req.params.bookingId,
      );
      const seats = await BookingService.getBookingSeats(booking.id);

      res.json({
        booking: { ...booking, seats },
      });
    } catch (error) {
      next(error);
    }
  },

  getUserBookings: async (req, res, next) => {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;

      const bookings = await BookingService.getUserBookings(
        req.userId,
        limit,
        offset,
      );

      res.json({ bookings });
    } catch (error) {
      next(error);
    }
  },

  cancelBooking: async (req, res, next) => {
    try {
      const booking = await BookingService.getBooking(
        req.userId,
        req.params.bookingId,
      );

      const updatedBooking = await BookingService.updateBookingStatus(
        booking.id,
        "cancelled",
      );

      res.json({ booking: updatedBooking });
    } catch (error) {
      next(error);
    }
  },
};

export default BookingController;

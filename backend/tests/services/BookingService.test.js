import BookingService from "../../src/services/BookingService.js";
import Flight from "../../src/models/Flight.js";
import Booking from "../../src/models/Booking.js";
import Seat from "../../src/models/Seat.js";

jest.mock("../../src/models/Flight");
jest.mock("../../src/models/Booking");
jest.mock("../../src/models/Seat");

describe("BookingService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createBooking", () => {
    it("should create booking with available seats", async () => {
      const mockFlight = {
        id: 1,
        available_seats: 10,
        base_price: 100,
      };

      const mockBooking = {
        id: 1,
        user_id: 1,
        flight_id: 1,
        passengers: 2,
        total_price: 200,
        status: "pending",
      };

      Flight.findById.mockResolvedValue(mockFlight);
      Booking.create.mockResolvedValue(mockBooking);
      Seat.createBatch.mockResolvedValue([]);
      Flight.updateAvailableSeats.mockResolvedValue();

      const result = await BookingService.createBooking(1, 1, 2, [1, 2]);

      expect(result.total_price).toBe(200);
      expect(Booking.create).toHaveBeenCalled();
      expect(Flight.updateAvailableSeats).toHaveBeenCalledWith(1, 2);
    });

    it("should throw error if insufficient seats", async () => {
      const mockFlight = {
        id: 1,
        available_seats: 1,
        base_price: 100,
      };

      Flight.findById.mockResolvedValue(mockFlight);

      await expect(BookingService.createBooking(1, 1, 5, [])).rejects.toThrow();
    });
  });

  describe("getBooking", () => {
    it("should return booking if user owns it", async () => {
      const mockBooking = {
        id: 1,
        user_id: 1,
        flight_id: 1,
        status: "pending",
      };

      Booking.findById.mockResolvedValue(mockBooking);

      const result = await BookingService.getBooking(1, 1);

      expect(result.id).toBe(1);
    });

    it("should throw error if user does not own booking", async () => {
      const mockBooking = {
        id: 1,
        user_id: 2,
        flight_id: 1,
      };

      Booking.findById.mockResolvedValue(mockBooking);

      await expect(BookingService.getBooking(1, 1)).rejects.toThrow();
    });
  });
});

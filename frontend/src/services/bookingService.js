import api from "./api";

const bookingService = {
  /**
   * Create a new booking
   * @param {object} bookingData
   * @param {number} bookingData.flightId - Flight ID
   * @param {number} bookingData.passengers - Number of passengers
   * @param {array} bookingData.seatSelectedIndices - Array of selected seat indices
   * @returns {Promise} { booking }
   */
  createBooking: async (bookingData) => {
    try {
      const response = await api.post("/bookings", bookingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get all bookings for current user
   * @param {number} limit - Number of results
   * @param {number} offset - Pagination offset
   * @returns {Promise} { bookings }
   */
  getUserBookings: async (limit = 50, offset = 0) => {
    try {
      const response = await api.get("/bookings", {
        params: { limit, offset },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get specific booking by ID
   * @param {number} bookingId
   * @returns {Promise} { booking }
   */
  getBooking: async (bookingId) => {
    try {
      const response = await api.get(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Cancel a booking
   * @param {number} bookingId
   * @returns {Promise} { booking }
   */
  cancelBooking: async (bookingId) => {
    try {
      const response = await api.delete(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default bookingService;

import api from "./api";

const flightService = {
  /**
   * Get all flights
   * @param {number} limit - Number of results
   * @param {number} offset - Pagination offset
   * @returns {Promise} { flights }
   */
  getAllFlights: async (limit = 50, offset = 0) => {
    try {
      const response = await api.get("/flights", {
        params: { limit, offset },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Search flights
   * @param {object} filters - Search filters
   * @param {number} filters.fromPlanetId
   * @param {number} filters.toPlanetId
   * @param {string} filters.departureDate - ISO date string
   * @param {number} filters.limit
   * @param {number} filters.offset
   * @returns {Promise} { flights }
   */
  searchFlights: async (filters) => {
    try {
      const response = await api.get("/flights/search", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get flight by ID
   * @param {number} flightId
   * @returns {Promise} { flight }
   */
  getFlightById: async (flightId) => {
    try {
      const response = await api.get(`/flights/${flightId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default flightService;

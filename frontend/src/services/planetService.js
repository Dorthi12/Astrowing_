import api from "./api";

const planetService = {
  /**
   * Get all planets
   * @param {number} limit - Number of results
   * @param {number} offset - Pagination offset
   * @returns {Promise} { planets }
   */
  getAllPlanets: async (limit = 50, offset = 0) => {
    try {
      const response = await api.get("/planets", {
        params: { limit, offset },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Search planets by name or filters
   * @param {object} filters - Search filters
   * @param {string} filters.query - Search query
   * @param {string} filters.name - Planet name
   * @param {number} filters.limit
   * @param {number} filters.offset
   * @returns {Promise} { planets }
   */
  searchPlanets: async (filters) => {
    try {
      const response = await api.get("/planets/search", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get planet by ID with details
   * @param {number} planetId
   * @returns {Promise} { planet }
   */
  getPlanetById: async (planetId) => {
    try {
      const response = await api.get(`/planets/${planetId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get reviews for a specific planet
   * @param {number} planetId
   * @param {number} limit - Number of reviews
   * @param {number} offset - Pagination offset
   * @returns {Promise} { reviews }
   */
  getPlanetReviews: async (planetId, limit = 20, offset = 0) => {
    try {
      const response = await api.get(`/planets/${planetId}/reviews`, {
        params: { limit, offset },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default planetService;

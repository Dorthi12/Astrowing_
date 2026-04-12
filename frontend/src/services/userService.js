import api from "./api";

const userService = {
  /**
   * Get current user profile
   * @returns {Promise} { user }
   */
  getProfile: async () => {
    try {
      const response = await api.get("/users/profile");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Update user profile
   * @param {object} profileData
   * @param {string} profileData.firstName
   * @param {string} profileData.lastName
   * @param {string} profileData.phone
   * @returns {Promise} { user }
   */
  updateProfile: async (profileData) => {
    try {
      const response = await api.put("/users/profile", profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Change password
   * @param {string} oldPassword
   * @param {string} newPassword
   * @returns {Promise}
   */
  changePassword: async (oldPassword, newPassword) => {
    try {
      const response = await api.post("/users/change-password", {
        oldPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get user reviews
   * @param {number} limit
   * @param {number} offset
   * @returns {Promise} { reviews }
   */
  getUserReviews: async (limit = 20, offset = 0) => {
    try {
      const response = await api.get("/users/reviews", {
        params: { limit, offset },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Create a review
   * @param {object} reviewData
   * @param {number} reviewData.planetId
   * @param {number} reviewData.rating
   * @param {string} reviewData.comment
   * @returns {Promise} { review }
   */
  createReview: async (reviewData) => {
    try {
      const response = await api.post("/reviews", reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Delete a review
   * @param {number} reviewId
   * @returns {Promise}
   */
  deleteReview: async (reviewId) => {
    try {
      const response = await api.delete(`/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default userService;

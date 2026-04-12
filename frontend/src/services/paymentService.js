import api from "./api";

const paymentService = {
  /**
   * Create a payment intent
   * @param {object} paymentData
   * @param {number} paymentData.bookingId
   * @param {number} paymentData.amount
   * @param {string} paymentData.currency
   * @returns {Promise} { clientSecret, paymentId }
   */
  createPaymentIntent: async (paymentData) => {
    try {
      const response = await api.post("/payments", paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get payment status
   * @param {number} paymentId
   * @returns {Promise} { payment }
   */
  getPaymentStatus: async (paymentId) => {
    try {
      const response = await api.get(`/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Confirm payment
   * @param {number} paymentId
   * @param {object} confirmData
   * @param {string} confirmData.paymentMethodId
   * @returns {Promise} { payment }
   */
  confirmPayment: async (paymentId, confirmData) => {
    try {
      const response = await api.post(
        `/payments/${paymentId}/confirm`,
        confirmData,
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get user's payment history
   * @param {number} limit
   * @param {number} offset
   * @returns {Promise} { payments }
   */
  getPaymentHistory: async (limit = 20, offset = 0) => {
    try {
      const response = await api.get("/payments/history", {
        params: { limit, offset },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default paymentService;

import api from "./api";

const authService = {
  /**
   * Register a new user
   * @param {string} email
   * @param {string} password
   * @param {string} firstName
   * @param {string} lastName
   * @returns {Promise} { user, tokens: { accessToken } }
   */
  register: async (email, password, firstName, lastName) => {
    try {
      console.log("[AuthService] Calling register endpoint...");
      const response = await api.post("/auth/register", {
        email,
        password,
        firstName,
        lastName,
      });
      console.log("[AuthService] Register response:", response.data);
      const { user, tokens } = response.data;

      // Store access token
      localStorage.setItem("accessToken", tokens.accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      console.log("[AuthService] Tokens stored in localStorage");

      return { user, tokens };
    } catch (error) {
      console.error("[AuthService] Register error:", error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * Login with email and password
   * @param {string} email
   * @param {string} password
   * @returns {Promise} { user, tokens: { accessToken } }
   */
  login: async (email, password) => {
    try {
      console.log("[AuthService] Calling login endpoint...");
      const response = await api.post("/auth/login", {
        email,
        password,
      });
      console.log("[AuthService] Login response:", response.data);
      const { user, tokens } = response.data;

      // Store access token (refresh token stored in httpOnly cookie automatically)
      localStorage.setItem("accessToken", tokens.accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      console.log("[AuthService] Tokens stored in localStorage");

      return { user, tokens };
    } catch (error) {
      console.error("[AuthService] Login error:", error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * Refresh access token using refresh token
   * @returns {Promise} { tokens: { accessToken } }
   */
  refreshToken: async () => {
    try {
      const response = await api.post("/auth/refresh");
      const { tokens } = response.data;

      // Update access token
      localStorage.setItem("accessToken", tokens.accessToken);

      return tokens;
    } catch (error) {
      // Refresh failed - clear auth
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      throw error.response?.data || error.message;
    }
  },

  /**
   * Logout - clear stored tokens and session
   * @returns {Promise}
   */
  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear local storage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    }
  },

  /**
   * Get stored user from localStorage
   * @returns {Object|null} user object or null
   */
  getStoredUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated: () => {
    return !!localStorage.getItem("accessToken");
  },
};

export default authService;

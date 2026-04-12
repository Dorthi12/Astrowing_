import axios from "axios";

// Create axios instance with base URL from env
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include cookies in requests
});

// Request interceptor - Add auth token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor - Handle token refresh & errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );

        const { tokens } = response.data;
        localStorage.setItem("accessToken", tokens.accessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - clear auth and redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/auth";
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    return Promise.reject(error);
  },
);

export default api;

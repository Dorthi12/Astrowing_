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
    console.log(`[API] ${config.method.toUpperCase()} ${config.url}`, {
      hasToken: !!token,
    });
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("[API] Request error:", error);
    return Promise.reject(error);
  },
);

// Response interceptor - Handle token refresh & errors
api.interceptors.response.use(
  (response) => {
    console.log(
      `[API] ✓ Response: ${response.config.method.toUpperCase()} ${response.config.url}`,
      response.status,
    );
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.error(
      `[API] ✗ Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
      error.response?.status,
      error.message,
    );

    // Handle 401 Unauthorized - try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log("[API] 401 detected, attempting token refresh...");

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );

        const { tokens } = response.data;
        localStorage.setItem("accessToken", tokens.accessToken);
        console.log("[API] Token refreshed successfully");

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - clear auth and let the app handle redirect
        console.error("[API] Token refresh failed, clearing auth");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");

        // Redirect using window location only as last resort
        if (window.location.pathname !== "/auth") {
          console.log("[API] Redirecting to /auth");
          setTimeout(() => {
            window.location.href = "/auth";
          }, 100);
        }
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    return Promise.reject(error);
  },
);

export default api;

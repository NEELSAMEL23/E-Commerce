import axios from "axios";
import { BASEURL } from "./apiPaths";

const LOGIN_ROUTE = "/auth/login";

const axiosInstance = axios.create({
  baseURL: BASEURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ✅ Add token to every request if present
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Global response error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      // ❌ If token is invalid or expired
      if (status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");

        // Only redirect if not already on login page
        if (window.location.pathname !== LOGIN_ROUTE) {
          window.location.href = LOGIN_ROUTE;
        }
      }

      if (status === 500) {
        console.error("Server error occurred. Please try again later.");
      }
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timeout. Please check your internet connection.");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

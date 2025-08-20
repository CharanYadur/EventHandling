// src/AxiosConfig.jsx
import axios from "axios";

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: "https://eventhandling-w5tp.onrender.com/", // ✅ Base URL for backend API
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // set true if using cookies/sessions
});

// Optional: Add interceptors for auth tokens, logging, errors
// axiosInstance.interceptors.request.use(
//   (config) => {
//     // Example: attach token if available
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error("API Error:", error.response?.data || error.message);
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;

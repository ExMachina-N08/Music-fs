import axios from "axios";

// Use environment variable for the API base URL, with a fallback for localhost
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken"); // Retrieve token from localStorage

    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach token in the Authorization header
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;

import axios from "axios";

// Base URL of your backend (matches PORT in backend/.env)
export const BASE_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // sends the httpOnly JWT cookie set by the backend
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;

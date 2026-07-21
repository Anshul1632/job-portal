import axios from "axios";

// Base URL of your backend (matches PORT in backend/.env)
export const BASE_URL = "http://localhost:8000/api/v1";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // sends the httpOnly JWT cookie set by the backend
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;

import axios from "axios";

const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/+$/, "");
const BASE_URL = `${BACKEND_URL}/api`;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
});

export default api;
/**
 * API Configuration - Tập trung quản lý URL backend
 */
export const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/+$/, "");
export const BASE = `${BACKEND_URL}/api`;

export default { BACKEND_URL, BASE };

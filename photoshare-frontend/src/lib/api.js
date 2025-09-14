import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:10000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  logout: () => api.post("/auth/logout"),
  getProfile: () => api.get("/auth/profile"),
};

export const eventAPI = {
  create: (eventData) => api.post("/events", eventData),
  getAll: () => api.get("/events"),
  getById: (id) => api.get(`/events/${id}`),
  update: (id, eventData) => api.put(`/events/${id}`, eventData),
  delete: (id) => api.delete(`/events/${id}`),
  getByAccessCode: (accessCode) => api.get(`/events/access/${accessCode}`),
};

// ✅ FIXED: Update photo API to match your backend routes
export const photoAPI = {
  upload: (eventId, formData) =>
    api.post(`/photos/upload/${eventId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getByEvent: (eventId) => api.get(`/photos/event/${eventId}`),
  like: (photoId) => api.post(`/photos/${photoId}/like`),
  download: (photoId) => api.get(`/photos/${photoId}/download`),
};

export default api;

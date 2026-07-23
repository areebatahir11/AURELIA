import apiClient from "@/lib/axios";
import { API_CONFIG } from "@/config/api";

export const authService = {
  async login(credentials) {
    if (API_CONFIG.useMockData) {
      return {
        data: {
          token: "mock-jwt-token",
          user: { id: "u1", name: "Areeba Tahir", email: credentials.email, role: "customer" },
        },
      };
    }
    return apiClient.post("/auth/login", credentials);
  },

  async signup(payload) {
    if (API_CONFIG.useMockData) {
      return { data: { token: "mock-jwt-token", user: { id: "u2", ...payload } } };
    }
    return apiClient.post("/auth/signup", payload);
  },

  async getCurrentUser() {
    if (API_CONFIG.useMockData) {
      return { data: { id: "u1", name: "Areeba Tahir", email: "areeba@example.com", role: "customer" } };
    }
    return apiClient.get("/auth/me");
  },
};

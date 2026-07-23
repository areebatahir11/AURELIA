import apiClient from "@/lib/axios";
import { API_CONFIG } from "@/config/api";

export const userService = {
  async updateProfile(payload) {
    if (API_CONFIG.useMockData) {
      return { data: { success: true, ...payload } };
    }
    return apiClient.patch("/users/me", payload);
  },
};

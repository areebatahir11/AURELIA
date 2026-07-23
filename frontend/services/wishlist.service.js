import apiClient from "@/lib/axios";
import { API_CONFIG } from "@/config/api";

export const wishlistService = {
  async get() {
    if (API_CONFIG.useMockData) {
      return { data: [] };
    }
    return apiClient.get("/wishlist");
  },

  async add(vehicleId) {
    if (API_CONFIG.useMockData) {
      return { data: { success: true, vehicleId } };
    }
    return apiClient.post("/wishlist", { vehicleId });
  },

  async remove(vehicleId) {
    if (API_CONFIG.useMockData) {
      return { data: { success: true, vehicleId } };
    }
    return apiClient.delete(`/wishlist/${vehicleId}`);
  },
};

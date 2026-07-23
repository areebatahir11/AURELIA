import apiClient from "@/lib/axios";
import { API_CONFIG } from "@/config/api";

export const dashboardService = {
  async getStats() {
    if (API_CONFIG.useMockData) {
      return {
        data: {
          totalVehicles: 48,
          totalOrders: 12,
          totalRevenue: 4820000,
          activeListings: 41,
        },
      };
    }
    return apiClient.get("/dashboard/stats");
  },
};

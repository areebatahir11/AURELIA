import apiClient from "@/lib/axios";
import { API_CONFIG } from "@/config/api";
import ordersData from "@/data/orders.json";

export const orderService = {
  async getAll() {
    if (API_CONFIG.useMockData) {
      return { data: ordersData };
    }
    return apiClient.get("/orders");
  },

  async create(orderPayload) {
    if (API_CONFIG.useMockData) {
      return { data: { success: true, orderId: `mock-${Date.now()}`, ...orderPayload } };
    }
    return apiClient.post("/orders", orderPayload);
  },

  async getById(orderId) {
    if (API_CONFIG.useMockData) {
      return { data: ordersData.find((order) => order.id === orderId) || null };
    }
    return apiClient.get(`/orders/${orderId}`);
  },
};

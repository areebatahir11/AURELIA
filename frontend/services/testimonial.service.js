import apiClient from "@/lib/axios";
import { API_CONFIG } from "@/config/api";
import testimonialsData from "@/data/testimonials.json";

export const testimonialService = {
  async getAll() {
    if (API_CONFIG.useMockData) {
      return { data: testimonialsData };
    }
    return apiClient.get("/testimonials");
  },
};
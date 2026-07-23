import apiClient from "@/lib/axios";
import { API_CONFIG } from "@/config/api";
import brandsData from "@/data/brands.json";

export const brandService = {
  async getAll() {
    if (API_CONFIG.useMockData) {
      return { data: brandsData };
    }
    return apiClient.get("/brands");
  },

  async getBySlug(slug) {
    if (API_CONFIG.useMockData) {
      return { data: brandsData.find((brand) => brand.slug === slug) || null };
    }
    return apiClient.get(`/brands/${slug}`);
  },
};

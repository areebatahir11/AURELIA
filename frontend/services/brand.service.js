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

  // --- Admin (always hits the real backend — mock data has no write path) ---

  async create(payload) {
    return apiClient.post("/brands", payload);
  },

  async update(brandId, payload) {
    return apiClient.patch(`/brands/${brandId}`, payload);
  },

  async remove(brandId) {
    return apiClient.delete(`/brands/${brandId}`);
  },
};
import apiClient from "@/lib/axios";
import { API_CONFIG } from "@/config/api";
import carsData from "@/data/cars.json";
import featuredCarsData from "@/data/featuredCars.json";

export const vehicleService = {
  async getAll(params = {}) {
    if (API_CONFIG.useMockData) {
      return { data: carsData };
    }
    return apiClient.get("/vehicles", { params });
  },

  async getFeatured() {
    if (API_CONFIG.useMockData) {
      return { data: featuredCarsData };
    }
    return apiClient.get("/vehicles/featured");
  },

  async getBySlug(slug) {
    if (API_CONFIG.useMockData) {
      const vehicle = carsData.find((car) => car.slug === slug);
      return { data: vehicle || null };
    }
    return apiClient.get(`/vehicles/${slug}`);
  },

  async getByBrand(brandSlug) {
    if (API_CONFIG.useMockData) {
      return { data: carsData.filter((car) => car.brandSlug === brandSlug) };
    }
    return apiClient.get(`/vehicles`, { params: { brand: brandSlug } });
  },

  async search(query) {
    if (API_CONFIG.useMockData) {
      const lower = query.toLowerCase();
      return {
        data: carsData.filter(
          (car) =>
            car.name.toLowerCase().includes(lower) || car.brand.toLowerCase().includes(lower)
        ),
      };
    }
    return apiClient.get("/vehicles/search", { params: { q: query } });
  },
};

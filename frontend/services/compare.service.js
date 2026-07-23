import apiClient from "@/lib/axios";
import { API_CONFIG } from "@/config/api";
import carsData from "@/data/cars.json";

export const compareService = {
  async getByIds(vehicleIds) {
    if (API_CONFIG.useMockData) {
      return { data: carsData.filter((car) => vehicleIds.includes(car.id)) };
    }
    return apiClient.post("/vehicles/compare", { vehicleIds });
  },
};
